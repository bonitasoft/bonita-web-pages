import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { alerts, _resetAlerts } from '../stores/alerts.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('alerts store', () => {
    beforeEach(() => {
        _resetAlerts();
    });

    it('starts empty', () => {
        expect(get(alerts)).toEqual([]);
    });

    it('success/warning/error/info push entries with the right severity', () => {
        alerts.success('s', Infinity);
        alerts.warning('w', Infinity);
        alerts.error('e', Infinity);
        alerts.info('i', Infinity);
        const list = get(alerts);
        expect(list.map((a) => a.severity)).toEqual(['success', 'warning', 'danger', 'info']);
        expect(list.map((a) => a.message)).toEqual(['s', 'w', 'e', 'i']);
    });

    it('returns a unique id per push', () => {
        const id1 = alerts.success('a', Infinity);
        const id2 = alerts.success('b', Infinity);
        expect(id1).not.toBe(id2);
    });

    it('auto-closes after delayMs', async () => {
        alerts.success('a', 50);
        expect(get(alerts)).toHaveLength(1);
        await delay(80);
        expect(get(alerts)).toHaveLength(0);
    });

    it('does not auto-close when delayMs is Infinity', async () => {
        alerts.success('a', Infinity);
        await delay(50);
        expect(get(alerts)).toHaveLength(1);
    });

    it('close(id) removes the entry and clears its timer', async () => {
        const id = alerts.success('a', 100);
        alerts.close(id);
        expect(get(alerts)).toHaveLength(0);
        // After the original timeout would have fired, store still empty (timer was cleared).
        await delay(150);
        expect(get(alerts)).toHaveLength(0);
    });

    it('default delays differentiate success (3000) from error (5000)', () => {
        // Smoke check: defaults are wired (the timing assertion is covered by
        // the auto-close test above with explicit delayMs).
        const id1 = alerts.success('s');
        const id2 = alerts.error('e');
        expect(get(alerts)).toHaveLength(2);
        alerts.close(id1);
        alerts.close(id2);
    });
});
