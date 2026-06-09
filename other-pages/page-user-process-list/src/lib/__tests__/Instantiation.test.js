import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Instantiation from '../components/Instantiation.svelte';
import { alerts, _resetAlerts } from '../stores/alerts.js';

function dispatchMessage(data, { origin, source } = {}) {
    window.dispatchEvent(new MessageEvent('message', {
        data,
        origin: origin ?? window.location.origin,
        source: source ?? null,
    }));
}

// The component only trusts messages whose `event.source` is its own iframe.
// Render, then read that iframe's contentWindow to post messages "from" it.
function renderWithFrame(props) {
    const result = render(Instantiation, { props });
    const frameWindow = result.container.querySelector('iframe').contentWindow;
    return { ...result, frameWindow };
}

const baseProps = (overrides = {}) => ({
    processName: 'P',
    processVersion: '1.0',
    search: '',
    redirectTarget: null,
    onCancel: () => {},
    ...overrides,
});

describe('Instantiation', () => {
    beforeEach(() => {
        _resetAlerts();
    });

    it('renders the iframe with the correct src', () => {
        const { container } = render(Instantiation, {
            props: baseProps({ processName: 'My Proc', search: '?app=user' }),
        });
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeInTheDocument();
        expect(iframe.getAttribute('src')).toContain('My%20Proc');
        expect(iframe.getAttribute('src')).toContain('1.0');
        expect(iframe.getAttribute('src')).toContain('?app=user');
        expect(iframe.getAttribute('title')).toBe('Start a new case');
    });

    it('calls onCancel when the cancel bar is clicked', async () => {
        const onCancel = vi.fn();
        render(Instantiation, { props: baseProps({ onCancel }) });
        await fireEvent.click(screen.getByRole('button', { name: /Cancel.*Processes/ }));
        expect(onCancel).toHaveBeenCalled();
    });

    it('on postMessage success: pushes a success toast and calls onCancel', async () => {
        const onCancel = vi.fn();
        const { frameWindow } = renderWithFrame(baseProps({ onCancel }));
        dispatchMessage(
            { action: 'Start process', message: 'success', dataFromSuccess: { caseId: '42' } },
            { source: frameWindow },
        );
        await Promise.resolve();
        const list = get(alerts);
        expect(list).toHaveLength(1);
        expect(list[0].severity).toBe('success');
        expect(list[0].message).toContain('42');
        expect(onCancel).toHaveBeenCalled();
    });

    it('on postMessage error: pushes a danger toast and does NOT call onCancel', async () => {
        const onCancel = vi.fn();
        const { frameWindow } = renderWithFrame(baseProps({ onCancel }));
        dispatchMessage({ action: 'Start process', message: 'error' }, { source: frameWindow });
        await Promise.resolve();
        const list = get(alerts);
        expect(list).toHaveLength(1);
        expect(list[0].severity).toBe('danger');
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('parses string-form postMessage payloads (legacy contract)', async () => {
        const { frameWindow } = renderWithFrame(baseProps());
        dispatchMessage(
            JSON.stringify({ action: 'Start process', message: 'success', dataFromSuccess: { caseId: '7' } }),
            { source: frameWindow },
        );
        await Promise.resolve();
        expect(get(alerts)).toHaveLength(1);
    });

    it('ignores postMessages with a different action', async () => {
        const { frameWindow } = renderWithFrame(baseProps());
        dispatchMessage({ action: 'Heartbeat', payload: 'ignore me' }, { source: frameWindow });
        await Promise.resolve();
        expect(get(alerts)).toHaveLength(0);
    });

    it('ignores postMessages from a foreign origin (security gate)', async () => {
        const onCancel = vi.fn();
        const { frameWindow } = renderWithFrame(baseProps({ onCancel }));
        dispatchMessage(
            { action: 'Start process', message: 'success', dataFromSuccess: { caseId: 'pwned' } },
            { origin: 'https://evil.example.com', source: frameWindow },
        );
        await Promise.resolve();
        expect(get(alerts)).toHaveLength(0);
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('ignores a same-origin postMessage whose source is not the form iframe (forged frame)', async () => {
        const onCancel = vi.fn();
        // Valid origin and shape, but posted by another window (e.g. the top
        // frame or a popup) rather than our iframe.
        render(Instantiation, { props: baseProps({ onCancel }) });
        dispatchMessage(
            { action: 'Start process', message: 'success', dataFromSuccess: { caseId: 'pwned' } },
            { source: window },
        );
        await Promise.resolve();
        expect(get(alerts)).toHaveLength(0);
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('on postMessage success with a safe redirect target: navigates the top window, no toast', async () => {
        const onCancel = vi.fn();
        const originalTop = Object.getOwnPropertyDescriptor(window, 'top');
        let topHref;
        Object.defineProperty(window, 'top', {
            configurable: true,
            value: {
                location: {
                    origin: 'http://localhost',
                    pathname: '/',
                    set href(v) { topHref = v; },
                    get href() { return topHref; },
                },
            },
        });
        try {
            const { frameWindow } = renderWithFrame(baseProps({ onCancel, redirectTarget: 'case-list' }));
            dispatchMessage(
                { action: 'Start process', message: 'success', dataFromSuccess: { caseId: '9' } },
                { source: frameWindow },
            );
            await Promise.resolve();
            expect(topHref).toBe('http://localhost/../case-list');
            expect(get(alerts)).toHaveLength(0);
            expect(onCancel).not.toHaveBeenCalled();
        } finally {
            if (originalTop) Object.defineProperty(window, 'top', originalTop);
            else delete window.top;
        }
    });

    it('removes its message listener on unmount', async () => {
        const onCancel = vi.fn();
        const { unmount } = render(Instantiation, { props: baseProps({ onCancel }) });
        unmount();
        dispatchMessage({ action: 'Start process', message: 'success' });
        await Promise.resolve();
        expect(onCancel).not.toHaveBeenCalled();
    });
});
