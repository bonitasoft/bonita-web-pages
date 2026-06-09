import { describe, it, expect } from 'vitest';
import { parseContentRange, formatPageNumberForBonitaAPI } from '../api/pagination.js';

describe('parseContentRange', () => {
    // Bonita's Content-Range is "<page>-<size>/<total>" — NOT byte offsets.
    // Captured live: p=0&c=10 vs 20 items returns "0-10/20"; p=1&c=10 returns "1-10/20".
    it('parses page-0 response as { page: 0, size, total }', () => {
        expect(parseContentRange('0-10/20')).toEqual({ page: 0, size: 10, total: 20 });
    });

    it('parses non-zero page response keeping the page index from match[1]', () => {
        expect(parseContentRange('1-10/20')).toEqual({ page: 1, size: 10, total: 20 });
        expect(parseContentRange('2-10/55')).toEqual({ page: 2, size: 10, total: 55 });
    });

    it('returns null for empty or malformed headers', () => {
        expect(parseContentRange(null)).toBeNull();
        expect(parseContentRange('')).toBeNull();
        expect(parseContentRange('garbage')).toBeNull();
    });

    it('handles size=0 (empty result set)', () => {
        expect(parseContentRange('0-0/0')).toEqual({ page: 0, size: 0, total: 0 });
    });
});

describe('formatPageNumberForBonitaAPI', () => {
    it('converts 1-indexed UI page to 0-indexed Bonita page', () => {
        expect(formatPageNumberForBonitaAPI(1)).toBe(0);
        expect(formatPageNumberForBonitaAPI(2)).toBe(1);
        expect(formatPageNumberForBonitaAPI(5)).toBe(4);
    });

    it('treats 0 as 0 (defensive)', () => {
        expect(formatPageNumberForBonitaAPI(0)).toBe(0);
    });
});
