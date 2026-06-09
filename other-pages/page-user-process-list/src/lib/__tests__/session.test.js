import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchSession } from '../api/session.js';

describe('fetchSession', () => {
    beforeEach(() => vi.restoreAllMocks());

    it('GETs ../API/system/session/unusedId', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ user_id: '4', user_name: 'walter.bates' }),
        });
        await fetchSession();
        expect(fetchSpy.mock.calls[0][0]).toBe('../API/system/session/unusedId');
    });

    it('returns the parsed JSON body', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ user_id: '4', user_name: 'walter.bates' }),
        });
        const session = await fetchSession();
        expect(session).toEqual({ user_id: '4', user_name: 'walter.bates' });
    });
});
