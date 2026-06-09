import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchAll, fetchByProcess, _clearCache } from '../api/categoryApi.js';

function mockResponse(body) {
    return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => body,
    };
}

describe('categoryApi', () => {
    beforeEach(() => {
        _clearCache();
        vi.restoreAllMocks();
    });

    it('fetchAll requests with c=MAX_INT', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([]));
        await fetchAll();
        expect(fetchSpy.mock.calls[0][0]).toContain(`c=${Math.pow(2, 31) - 1}`);
    });

    it('fetchByProcess returns [] without calling fetch when id is missing', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch');
        const result = await fetchByProcess({ id: undefined });
        expect(result).toEqual([]);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('fetchByProcess caches by id — second call does not hit fetch', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([{ id: 'c1' }]));
        await fetchByProcess({ id: 'p1' });
        await fetchByProcess({ id: 'p1' });
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('fetchByProcess differentiates cache by id', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([]));
        await fetchByProcess({ id: 'p1' });
        await fetchByProcess({ id: 'p2' });
        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('fetchByProcess refetches after the 60s TTL expires', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([{ id: 'c1' }]));
        const realNow = Date.now();
        const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(realNow);

        await fetchByProcess({ id: 'p1' });
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        // Within the TTL — still cached.
        dateSpy.mockReturnValue(realNow + 59_000);
        await fetchByProcess({ id: 'p1' });
        expect(fetchSpy).toHaveBeenCalledTimes(1);

        // Past the TTL — refetch.
        dateSpy.mockReturnValue(realNow + 61_000);
        await fetchByProcess({ id: 'p1' });
        expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
});
