import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchProcesses, fetchProcessByNameAndVersion, instantiateProcess } from '../api/processApi.js';
import { _clearCache } from '../api/categoryApi.js';

function mockResponse(body, headers = {}) {
    return {
        ok: true,
        status: 200,
        headers: { get: (k) => headers[k.toLowerCase()] ?? headers[k] ?? null },
        json: async () => body,
    };
}

describe('processApi.fetchProcesses', () => {
    beforeEach(() => {
        _clearCache();
        vi.restoreAllMocks();
    });

    it('builds the URL with p, c, s, o, and multiple f= filter params', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
            if (url.startsWith('../API/bpm/process?')) {
                return mockResponse([], { 'Content-Range': '0-10/0' });
            }
            return mockResponse([], { 'Content-Range': '0-2147483647/0' });
        });

        await fetchProcesses({ page: 0, size: 10 }, { search: 'foo bar', order: 'DESC', categoryId: '101', userId: '4' });

        const url = fetchSpy.mock.calls[0][0];
        expect(url).toContain('p=0');
        expect(url).toContain('c=10');
        expect(url).toContain('s=foo+bar');
        expect(url).toContain('o=displayName+DESC');
        expect(url).toContain('f=activationState=ENABLED');
        expect(url).toContain('f=categoryId=101');
        expect(url).toContain('f=user_id=4');
    });

    it('omits categoryId filter when value is "0" (the synthetic All entry)', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([], { 'Content-Range': '0-10/0' }));
        await fetchProcesses({ page: 0, size: 10 }, { search: '', order: 'ASC', categoryId: '0', userId: '4' });
        const url = fetchSpy.mock.calls[0][0];
        expect(url).not.toContain('f=categoryId');
    });

    it('returns unpopulated promise immediately with empty categories, then populated promise with category data', async () => {
        const processes = [
            { id: 'p1', displayName: 'P1', name: 'P1', version: '1.0', description: '' },
            { id: 'p2', displayName: 'P2', name: 'P2', version: '1.0', description: '' },
        ];
        vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
            if (url.startsWith('../API/bpm/process?')) {
                return mockResponse(processes, { 'Content-Range': '0-10/2' });
            }
            if (url.includes('f=id=p1')) {
                return mockResponse([{ id: 'c1', displayName: 'Cat A' }], {});
            }
            if (url.includes('f=id=p2')) {
                return mockResponse([{ id: 'c2', displayName: 'Cat B' }], {});
            }
            return mockResponse([], {});
        });

        const result = await fetchProcesses({ page: 0, size: 10 }, { search: '', order: 'ASC', userId: '4' });

        const first = await result.unpopulated;
        expect(first.processes).toHaveLength(2);
        expect(first.processes[0].categories).toEqual([]);
        expect(first.pagination).toEqual({ page: 0, size: 10, total: 2 });

        const second = await result.populated;
        expect(second.processes[0].categories[0].displayName).toBe('Cat A');
        expect(second.processes[1].categories[0].displayName).toBe('Cat B');
    });
});

describe('processApi.fetchProcessByNameAndVersion', () => {
    beforeEach(() => vi.restoreAllMocks());

    it('URL-encodes name and version path segments', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([{ id: 'x', name: 'My Proc' }], {}));
        await fetchProcessByNameAndVersion('My Proc', '1.0');
        const url = fetchSpy.mock.calls[0][0];
        expect(url).toContain('f=name%3DMy%20Proc');
        expect(url).toContain('f=version%3D1.0');
    });

    it('returns the first item from the response array', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([{ id: 'x' }], {}));
        const result = await fetchProcessByNameAndVersion('foo', '1.0');
        expect(result).toEqual({ id: 'x' });
    });

    it('returns undefined on error', async () => {
        vi.spyOn(global, 'fetch').mockRejectedValue(new Error('boom'));
        const result = await fetchProcessByNameAndVersion('foo', '1.0');
        expect(result).toBeUndefined();
    });
});

describe('processApi.instantiateProcess', () => {
    beforeEach(() => vi.restoreAllMocks());

    it('POSTs to /bpm/process/:id/instantiation and returns the body on success', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse({ caseId: '42' }, {}));
        const result = await instantiateProcess('p1');
        expect(fetchSpy.mock.calls[0][0]).toBe('../API/bpm/process/p1/instantiation');
        expect(fetchSpy.mock.calls[0][1].method).toBe('POST');
        expect(result.caseId).toBe('42');
    });

    it('throws when the response body lacks a caseId — surfaces error for toast', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse({}, {}));
        await expect(instantiateProcess('p1')).rejects.toThrow(/caseId/);
    });

    it('throws on HTTP error', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: async () => ({}),
        });
        await expect(instantiateProcess('p1')).rejects.toThrow(/500/);
    });
});
