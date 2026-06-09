import { writable } from 'svelte/store';

/**
 * Toast/alert store — port of the React `AlertService`.
 *
 * The store value is an array of `{ id, message, severity }` entries ordered
 * by insertion. Auto-close is handled internally via `setTimeout`; pass
 * `delayMs: Infinity` for persistent toasts.
 */

const { subscribe, update } = writable([]);
const timers = new Map();

function newId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `alert-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function push(message, severity, delayMs) {
    const id = newId();
    update((list) => [...list, { id, message, severity }]);
    if (delayMs !== Infinity) {
        const timer = setTimeout(() => close(id), delayMs);
        timers.set(id, timer);
    }
    return id;
}

export function close(id) {
    const timer = timers.get(id);
    if (timer) {
        clearTimeout(timer);
        timers.delete(id);
    }
    update((list) => list.filter((a) => a.id !== id));
}

export const alerts = {
    subscribe,
    success: (message, delayMs = 3000) => push(message, 'success', delayMs),
    warning: (message, delayMs = 5000) => push(message, 'warning', delayMs),
    error: (message, delayMs = 5000) => push(message, 'danger', delayMs),
    info: (message, delayMs = 3000) => push(message, 'info', delayMs),
    close,
};

// Test seam: clear all alerts and pending timers between tests.
export function _resetAlerts() {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    update(() => []);
}
