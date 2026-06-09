import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get, post, put, del } from '../api/client.js';

const ORIGINAL_COOKIE = document.cookie;

function setCookie(value) {
    document.cookie = value;
}

function clearCookies() {
    document.cookie.split(';').forEach((c) => {
        const eq = c.indexOf('=');
        const name = eq > -1 ? c.substring(0, eq).trim() : c.trim();
        if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
}

describe('client.js HTTP wrappers', () => {
    beforeEach(() => {
        clearCookies();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        clearCookies();
        if (ORIGINAL_COOKIE) document.cookie = ORIGINAL_COOKIE;
    });

    it('GET sends Accept and Content-Type JSON headers', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 });
        await get('/foo');
        const init = fetchSpy.mock.calls[0][1];
        expect(init.method).toBe('GET');
        expect(init.credentials).toBe('same-origin');
        expect(init.headers.Accept).toBe('application/json');
    });

    it('forwards X-Bonita-API-Token cookie as a header when present', async () => {
        setCookie('X-Bonita-API-Token=test-token-abc');
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 });
        await get('/foo');
        const init = fetchSpy.mock.calls[0][1];
        expect(init.headers['X-Bonita-API-Token']).toBe('test-token-abc');
    });

    it('omits X-Bonita-API-Token header when the cookie is absent', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 });
        await get('/foo');
        const init = fetchSpy.mock.calls[0][1];
        expect(init.headers['X-Bonita-API-Token']).toBeUndefined();
    });

    it('POST without a body omits the body field (no JSON.stringify(undefined))', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 });
        await post('/foo');
        const init = fetchSpy.mock.calls[0][1];
        expect(init.method).toBe('POST');
        expect(init.body).toBeUndefined();
    });

    it('POST with a body serializes it as JSON', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 });
        await post('/foo', { hello: 'world' });
        const init = fetchSpy.mock.calls[0][1];
        expect(init.body).toBe(JSON.stringify({ hello: 'world' }));
    });

    it('PUT serializes the body as JSON', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 });
        await put('/foo', { x: 1 });
        const init = fetchSpy.mock.calls[0][1];
        expect(init.method).toBe('PUT');
        expect(init.body).toBe(JSON.stringify({ x: 1 }));
    });

    it('DELETE has no body', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200 });
        await del('/foo');
        const init = fetchSpy.mock.calls[0][1];
        expect(init.method).toBe('DELETE');
        expect(init.body).toBeUndefined();
    });

    it('throws on a non-ok response that is not 401/503', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Server Error',
        });
        await expect(get('/foo')).rejects.toThrow(/500/);
    });

    it('attaches status and response onto thrown errors', async () => {
        const response = { ok: false, status: 403, statusText: 'Forbidden' };
        vi.spyOn(global, 'fetch').mockResolvedValue(response);
        await expect(get('/foo')).rejects.toMatchObject({ status: 403, response });
    });

    it('throws on 401/503 in standalone mode (window.parent === window) instead of looping reload', async () => {
        // jsdom default: window.parent === window. The code path that calls
        // window.parent.location.reload() must be skipped (it would loop in
        // standalone dev), and the response must throw normally.
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
        });
        await expect(get('/foo')).rejects.toMatchObject({ status: 401 });
    });
});
