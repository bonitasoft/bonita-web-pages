import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Alerts from '../components/Alerts.svelte';
import { alerts, _resetAlerts } from '../stores/alerts.js';

describe('Alerts component', () => {
    beforeEach(() => {
        _resetAlerts();
        vi.useRealTimers();
    });

    it('renders nothing when the store is empty', () => {
        const { container } = render(Alerts);
        expect(container.querySelector('.Alerts')).toBeNull();
    });

    it('renders one .alert per store entry with the right severity class', async () => {
        alerts.success('Hello', Infinity);
        alerts.error('Boom', Infinity);
        const { container } = render(Alerts);
        const alertElements = container.querySelectorAll('[role="alert"]');
        expect(alertElements).toHaveLength(2);
        expect(alertElements[0]).toHaveClass('alert-success');
        expect(alertElements[1]).toHaveClass('alert-danger');
    });

    it('clicking the dismiss button removes the toast from the store', async () => {
        alerts.success('Hello', Infinity);
        const { container } = render(Alerts);
        const dismissBtn = screen.getByRole('button', { name: 'Dismiss notification' });
        await fireEvent.click(dismissBtn);
        expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0);
    });

    it('uses aria-live="polite" so screen readers announce new toasts', () => {
        alerts.info('Hi', Infinity);
        const { container } = render(Alerts);
        const region = container.querySelector('.Alerts');
        expect(region).toHaveAttribute('aria-live', 'polite');
    });
});
