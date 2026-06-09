<script>
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { fetchProcesses } from '../api/processApi.js';
    import { fetchAll as fetchAllCategories } from '../api/categoryApi.js';
    import { formatPageNumberForBonitaAPI } from '../api/pagination.js';
    import { alerts } from '../stores/alerts.js';
    import Filters from './Filters.svelte';
    import List from './List.svelte';

    /** @type {{ session: { user_id: string }, handleProcessStart: (process: object) => void }} */
    let { session, handleProcessStart } = $props();

    let processes = $state([]);
    let pagination = $state({ page: 0, size: 10, total: 0 });
    let filters = $state({ categoryId: '0', search: '', order: 'ASC' });

    const categoriesById = $state({
        0: { id: '0', name: 'all', displayName: '' },
    });

    // Re-localize the synthetic "All categories" entry when the locale resolves.
    $effect(() => {
        categoriesById['0'].displayName = $_('AllCategories');
    });

    // Request-id guard: when the user changes filters/sort/page rapidly, an
    // earlier load's two-pass populated promise can resolve AFTER a newer
    // unpopulated promise, clobbering the fresh state with stale data.
    // Each call captures its id; only the latest may commit to component state.
    let lastRequestId = 0;

    async function loadProcesses(page, nextFilters = filters) {
        const reqId = ++lastRequestId;
        try {
            const { unpopulated, populated } = await fetchProcesses(
                { page, size: pagination.size },
                { search: nextFilters.search, order: nextFilters.order, categoryId: nextFilters.categoryId, userId: session?.user_id }
            );
            // The `populated` promise is hot-started inside fetchProcesses (Promise.all
            // of N category lookups). Attach a no-op handler now so the stale-request
            // early returns below don't leave it as an unhandled rejection if any
            // category fetch fails after we abort. The inner try/catch still receives
            // and handles the rejection on the non-stale path.
            populated.catch(() => {});
            if (reqId !== lastRequestId) return;

            const first = await unpopulated;
            if (reqId !== lastRequestId) return;
            processes = first.processes;
            if (first.pagination) pagination = first.pagination;

            // The populated pass issues N parallel category lookups; if any
            // rejects, Promise.all rejects the whole pass. The unpopulated rows
            // are already on screen, so we keep them and just log — no need to
            // surface a second toast on top of the empty-categories columns.
            try {
                const second = await populated;
                if (reqId !== lastRequestId) return;
                processes = second.processes;
            } catch (err) {
                console.warn('Failed to populate categories per process', err);
            }
        } catch (err) {
            if (reqId !== lastRequestId) return;
            console.error('Failed to load processes', err);
            alerts.error($_('error.loadProcesses'));
        }
    }

    async function loadCategories() {
        try {
            const list = await fetchAllCategories();
            for (const c of list) {
                categoriesById[c.id] = c;
            }
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    }

    function updateFilters(delta) {
        filters = { ...filters, ...delta };
        loadProcesses(0, filters);
    }

    function toggleOrder() {
        filters = { ...filters, order: filters.order === 'ASC' ? 'DESC' : 'ASC' };
        loadProcesses(0, filters);
    }

    function onChangePage(uiPage) {
        loadProcesses(formatPageNumberForBonitaAPI(uiPage), filters);
    }

    onMount(() => {
        loadCategories();
        loadProcesses(0, filters);
    });
</script>

<div class="Main container">
    <h1>{$_('Processes')}</h1>

    <Filters {filters} categories={categoriesById} onChange={updateFilters} />

    <List
        {processes}
        {pagination}
        {filters}
        {toggleOrder}
        {onChangePage}
        {handleProcessStart}
    />
</div>
