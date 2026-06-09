import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';

vi.mock('../api/processApi.js', () => ({
    fetchProcessByNameAndVersion: vi.fn(),
    instantiateProcess: vi.fn(),
}));
vi.mock('../api/formApi.js', () => ({
    hasInstantiationForm: vi.fn(),
}));

import {
    instantiationState,
    handleProcessStart,
    confirmInstantiation,
    cancelInstantiation,
    dismissConfirm,
    checkDeepLink,
    _resetInstantiation,
} from '../stores/instantiation.svelte.js';
import { hasInstantiationForm } from '../api/formApi.js';
import { fetchProcessByNameAndVersion, instantiateProcess } from '../api/processApi.js';
import { alerts, _resetAlerts } from '../stores/alerts.js';

describe('instantiation store', () => {
    beforeEach(() => {
        _resetInstantiation();
        _resetAlerts();
        vi.clearAllMocks();
    });

    describe('handleProcessStart', () => {
        it('opens the iframe view when the process has a form', async () => {
            hasInstantiationForm.mockResolvedValue(true);
            await handleProcessStart({ id: 'p1', name: 'P', version: '1.0' });
            expect(instantiationState.view).toBe('instantiation');
            expect(instantiationState.params).toMatchObject({
                processName: 'P',
                processVersion: '1.0',
            });
            expect(instantiationState.params.search).toContain('id=p1');
            expect(instantiationState.params.search).toContain('autoInstantiate=false');
        });

        it('opens the confirm modal when the process has no form', async () => {
            hasInstantiationForm.mockResolvedValue(false);
            await handleProcessStart({ id: 'p1', name: 'P', version: '1.0', displayName: 'Process' });
            expect(instantiationState.view).toBe('list');
            expect(instantiationState.confirmShown).toBe(true);
            expect(instantiationState.processToConfirm).toMatchObject({ id: 'p1' });
        });

        it('always clears redirectTargetOnSuccess (manual click never honors a stale redirect)', async () => {
            instantiationState.redirectTargetOnSuccess = '/somewhere';
            hasInstantiationForm.mockResolvedValue(true);
            await handleProcessStart({ id: 'p1', name: 'P', version: '1.0' });
            expect(instantiationState.redirectTargetOnSuccess).toBeNull();
        });
    });

    describe('confirmInstantiation', () => {
        it('is a no-op when no process is set', async () => {
            await confirmInstantiation();
            expect(instantiateProcess).not.toHaveBeenCalled();
        });

        it('on success: pushes a success toast with the case id and clears modal state', async () => {
            instantiationState.processToConfirm = { id: 'p1' };
            instantiationState.confirmShown = true;
            instantiateProcess.mockResolvedValue({ caseId: '42' });
            await confirmInstantiation();
            expect(instantiationState.confirmShown).toBe(false);
            expect(instantiationState.processToConfirm).toBeNull();
            const list = get(alerts);
            expect(list).toHaveLength(1);
            expect(list[0].severity).toBe('success');
            expect(list[0].message).toContain('42');
        });

        it('on failure: pushes an error toast (was silently swallowed in React legacy)', async () => {
            instantiationState.processToConfirm = { id: 'p1' };
            instantiationState.confirmShown = true;
            instantiateProcess.mockRejectedValue(new Error('500 Server Error'));
            await confirmInstantiation();
            const list = get(alerts);
            expect(list).toHaveLength(1);
            expect(list[0].severity).toBe('danger');
        });

        it('clears redirectTargetOnSuccess in the finally block (success or failure)', async () => {
            instantiationState.processToConfirm = { id: 'p1' };
            instantiationState.redirectTargetOnSuccess = '/x';
            instantiateProcess.mockRejectedValue(new Error('boom'));
            await confirmInstantiation();
            expect(instantiationState.redirectTargetOnSuccess).toBeNull();
        });
    });

    // Asserts the redirect-on-success navigation itself — the one "must-preserve"
    // behaviour that previously had no coverage. window.top.location.href is
    // stubbed so we can capture the navigation target instead of triggering a
    // jsdom navigation.
    describe('confirmInstantiation redirect-on-success (navigation)', () => {
        let originalTop;
        let topHref;
        beforeEach(() => {
            topHref = undefined;
            originalTop = Object.getOwnPropertyDescriptor(window, 'top');
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
        });
        afterEach(() => {
            if (originalTop) Object.defineProperty(window, 'top', originalTop);
            else delete window.top;
        });

        it('navigates the top window to a safe deep-link redirect target, with no success toast', async () => {
            instantiationState.processToConfirm = { id: 'p1' };
            instantiationState.confirmShown = true;
            instantiationState.redirectTargetOnSuccess = 'case-list';
            instantiateProcess.mockResolvedValue({ caseId: 'c1' });

            await confirmInstantiation();

            expect(topHref).toBe('http://localhost/../case-list');
            expect(get(alerts)).toHaveLength(0);
        });

        it('does NOT navigate and shows a success toast when no redirect target is set (manual no-form path)', async () => {
            instantiationState.processToConfirm = { id: 'p1' };
            instantiationState.confirmShown = true;
            instantiationState.redirectTargetOnSuccess = null;
            instantiateProcess.mockResolvedValue({ caseId: 'c1' });

            await confirmInstantiation();

            expect(topHref).toBeUndefined();
            const list = get(alerts);
            expect(list).toHaveLength(1);
            expect(list[0].severity).toBe('success');
            expect(list[0].message).toContain('c1');
        });

        it('rejects an unsafe redirect target and falls through to the success toast', async () => {
            instantiationState.processToConfirm = { id: 'p1' };
            instantiationState.confirmShown = true;
            instantiationState.redirectTargetOnSuccess = 'https://evil.example.com';
            instantiateProcess.mockResolvedValue({ caseId: 'c1' });

            await confirmInstantiation();

            expect(topHref).toBeUndefined();
            const list = get(alerts);
            expect(list).toHaveLength(1);
            expect(list[0].severity).toBe('success');
        });
    });

    describe('cancelInstantiation', () => {
        it('resets view, params, and redirectTargetOnSuccess', () => {
            instantiationState.view = 'instantiation';
            instantiationState.params = { processName: 'P', processVersion: '1.0', search: '' };
            instantiationState.redirectTargetOnSuccess = '/x';
            cancelInstantiation();
            expect(instantiationState.view).toBe('list');
            expect(instantiationState.params).toBeNull();
            expect(instantiationState.redirectTargetOnSuccess).toBeNull();
        });
    });

    describe('dismissConfirm', () => {
        it('resets confirmShown, processToConfirm, and redirectTargetOnSuccess', () => {
            instantiationState.confirmShown = true;
            instantiationState.processToConfirm = { id: 'p1' };
            instantiationState.redirectTargetOnSuccess = '/x';
            dismissConfirm();
            expect(instantiationState.confirmShown).toBe(false);
            expect(instantiationState.processToConfirm).toBeNull();
            expect(instantiationState.redirectTargetOnSuccess).toBeNull();
        });
    });

    describe('checkDeepLink', () => {
        // Restore the test URL between cases so locations leaked from one
        // test don't bleed into the next.
        beforeEach(() => {
            window.history.replaceState({}, '', '/');
        });

        it('is a no-op when the URL has no deep-link params (jsdom default search)', async () => {
            await checkDeepLink();
            expect(fetchProcessByNameAndVersion).not.toHaveBeenCalled();
            expect(instantiationState.view).toBe('list');
        });

        it('happy path: fetches process, captures redirect, clears deep-link params, opens iframe', async () => {
            window.history.replaceState({}, '', '/?processName=Foo&processVersion=1.0&redirect=case-list');
            fetchProcessByNameAndVersion.mockResolvedValue({ id: 'p1', name: 'Foo', version: '1.0' });
            hasInstantiationForm.mockResolvedValue(true);

            await checkDeepLink();

            expect(fetchProcessByNameAndVersion).toHaveBeenCalledWith('Foo', '1.0');
            // Redirect captured BEFORE clearDeepLinkParamsFromTop() runs — a
            // future widening of clearDeepLinkParamsFromTop that strips redirect
            // would break this assertion if the order is flipped.
            expect(instantiationState.redirectTargetOnSuccess).toBe('case-list');
            expect(instantiationState.view).toBe('instantiation');
            expect(instantiationState.params).toMatchObject({
                processName: 'Foo',
                processVersion: '1.0',
            });
            // Top-level deep-link params have been removed from the URL.
            expect(window.location.search).not.toContain('processName');
            expect(window.location.search).not.toContain('processVersion');
        });

        it('on not-found: clears the URL params and shows a warning toast', async () => {
            window.history.replaceState({}, '', '/?processName=Missing&processVersion=2.0');
            fetchProcessByNameAndVersion.mockResolvedValue(undefined);

            await checkDeepLink();

            expect(hasInstantiationForm).not.toHaveBeenCalled();
            expect(instantiationState.view).toBe('list');
            expect(instantiationState.redirectTargetOnSuccess).toBeNull();
            // Top-level deep-link params have been removed so a refresh
            // doesn't silently retry the same failing lookup.
            expect(window.location.search).not.toContain('processName');
            expect(window.location.search).not.toContain('processVersion');
            // A warning toast surfaces why the auto-launch did nothing.
            const list = get(alerts);
            expect(list).toHaveLength(1);
            expect(list[0].severity).toBe('warning');
            expect(list[0].message).toContain('Missing');
            expect(list[0].message).toContain('2.0');
        });
    });
});
