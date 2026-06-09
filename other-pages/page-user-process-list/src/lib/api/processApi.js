import { get, post } from './client.js';
import { fetchByProcess } from './categoryApi.js';
import { parseContentRange } from './pagination.js';

function buildProcessesUrl({ page = 0, size = 10 }, { search = '', order = 'ASC', categoryId, userId }) {
    const params = new URLSearchParams();
    params.set('p', String(page));
    params.set('c', String(size));
    params.set('s', search);
    params.set('o', `displayName ${order}`);

    const filters = ['activationState=ENABLED'];
    if (categoryId && categoryId !== '0') filters.push(`categoryId=${categoryId}`);
    if (userId && userId !== '0') filters.push(`user_id=${userId}`);

    // Bonita expects multiple `f=` query parameters, one per filter, where the
    // filter expression itself contains a literal `=` (e.g. `f=activationState=ENABLED`).
    // We percent-encode the whole filter to escape special characters in values,
    // then un-encode the `=` so Bonita receives the `key=value` separator literally.
    // Safe for the current fixed filter set (`activationState`, `categoryId`,
    // `user_id`) whose left-hand keys never contain `=`. If a value ever needs to
    // contain a literal `=`, this would corrupt the filter and a different
    // separator strategy would be required.
    let qs = params.toString();
    for (const f of filters) {
        qs += `&f=${encodeURIComponent(f).replace(/%3D/g, '=')}`;
    }
    return `../API/bpm/process?${qs}`;
}

/**
 * Two-pass list load — matches the React contract:
 * - `unpopulated` resolves immediately with empty `categories` arrays,
 *   so the table can render names/versions/descriptions without waiting for
 *   N category lookups.
 * - `populated` resolves after fetching categories per process; the consumer
 *   re-renders with the same row keys (process.id) so DOM is preserved.
 */
export async function fetchProcesses(pagination, filters = {}) {
    const url = buildProcessesUrl(pagination, filters);
    const response = await get(url);
    const processes = await response.json();
    const paginationInfo = parseContentRange(response.headers.get('Content-Range'));

    return {
        unpopulated: Promise.resolve({
            processes: processes.map((p) => ({ ...p, categories: [] })),
            pagination: paginationInfo,
        }),
        populated: Promise.all(
            processes.map((p) => fetchByProcess({ id: p.id }).then((categories) => ({ ...p, categories })))
        ).then((populatedProcesses) => ({ processes: populatedProcesses })),
    };
}

export async function fetchProcessByNameAndVersion(name, version) {
    try {
        const url = `../API/bpm/process?c=1&p=0&f=name%3D${encodeURIComponent(name)}&f=version%3D${encodeURIComponent(version)}`;
        const response = await get(url);
        const list = await response.json();
        return list[0];
    } catch {
        return undefined;
    }
}

/**
 * Throws on failure (HTTP error or no caseId in body) so callers can show an error toast.
 * The React version silently swallowed errors — we now surface them per the migration plan.
 */
export async function instantiateProcess(processId) {
    const response = await post(`../API/bpm/process/${encodeURIComponent(processId)}/instantiation`);
    const body = await response.json();
    if (!body || !body.caseId) {
        const err = new Error('Instantiation response did not contain a caseId');
        err.response = body;
        throw err;
    }
    return body;
}
