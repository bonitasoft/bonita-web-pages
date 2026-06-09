import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchStartFormMapping, hasInstantiationForm } from '../api/formApi.js';

function mockResponse(body) {
    return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => body,
    };
}

describe('formApi', () => {
    beforeEach(() => vi.restoreAllMocks());

    it('builds a URL with type=PROCESS_START and the encoded processDefinitionId', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([]));
        await fetchStartFormMapping('p1');
        const url = fetchSpy.mock.calls[0][0];
        expect(url).toContain('f=processDefinitionId%3Dp1');
        expect(url).toContain('f=type%3DPROCESS_START');
    });

    it('hasInstantiationForm returns true for target=INTERNAL', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([{ target: 'INTERNAL' }]));
        expect(await hasInstantiationForm('p1')).toBe(true);
    });

    it('hasInstantiationForm returns true for target=URL', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([{ target: 'URL' }]));
        expect(await hasInstantiationForm('p1')).toBe(true);
    });

    it('hasInstantiationForm returns false for target=NONE', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([{ target: 'NONE' }]));
        expect(await hasInstantiationForm('p1')).toBe(false);
    });

    it('hasInstantiationForm returns false when the mapping array is empty', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse([]));
        expect(await hasInstantiationForm('p1')).toBe(false);
    });
});
