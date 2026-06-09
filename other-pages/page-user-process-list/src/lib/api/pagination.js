/**
 * Parse Bonita's Content-Range header.
 *
 * Bonita uses a non-standard format: `<page>-<size>/<total>` (echoes the
 * requested `p` and `c` query params, plus the unfiltered total). It is NOT
 * the RFC-7233 byte-range format `<start>-<end>/<total>`.
 *
 * Verified against the running Bonita: a request `p=1&c=10` against 20 items
 * returns `content-range: 1-10/20` — meaning page=1, size=10, total=20.
 */
export function parseContentRange(headerValue) {
    if (!headerValue) return null;
    const match = /(\d+)-(\d+)\/(\d+)/.exec(headerValue);
    if (!match) return null;
    return {
        page: parseInt(match[1], 10),
        size: parseInt(match[2], 10),
        total: parseInt(match[3], 10),
    };
}

// react-js-pagination is 1-indexed; Bonita's API is 0-indexed.
export function formatPageNumberForBonitaAPI(uiPage) {
    return uiPage > 0 ? uiPage - 1 : 0;
}
