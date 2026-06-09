import { get } from './client.js';

const MAX_INT = Math.pow(2, 31) - 1;

/**
 * Per-process category cache with a short TTL.
 *
 * The categories of a process are looked up on every populated-pass of the
 * list (one HTTP call per row, in parallel). Caching helps the common
 * exploratory pattern: sort toggles, category filter changes, and pagination
 * back to a previously-seen page all hit the same process ids and benefit
 * from the cache. The TTL bounds staleness: if an admin renames a category
 * mid-session, the new name surfaces on the next interaction past the TTL
 * without a full page reload.
 *
 * 60s is long enough to cover a typical sort-and-filter exploration burst
 * and short enough that admin renames become visible quickly.
 */
const TTL_MS = 60_000;
const cache = new Map(); // id -> { categories, fetchedAt }

export async function fetchAll() {
    const response = await get(`../API/bpm/category?p=0&c=${MAX_INT}`);
    return response.json();
}

export async function fetchByProcess({ id }) {
    if (!id) return [];
    const entry = cache.get(id);
    if (entry && Date.now() - entry.fetchedAt < TTL_MS) {
        return entry.categories;
    }
    const response = await get(`../API/bpm/category?p=0&c=${MAX_INT}&f=id=${encodeURIComponent(id)}`);
    const categories = await response.json();
    cache.set(id, { categories, fetchedAt: Date.now() });
    return categories;
}

// Test seam: clear cache between unit tests.
export function _clearCache() {
    cache.clear();
}
