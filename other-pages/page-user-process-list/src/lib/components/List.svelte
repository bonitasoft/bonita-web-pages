<script>
    import { _ } from 'svelte-i18n';
    import Pager from './Pager.svelte';

    /**
     * @type {{
     *   processes: Array<{id: string, displayName: string, version: string, description: string, categories?: Array<{id: string, displayName: string}>}>,
     *   pagination: { page: number, size: number, total: number },
     *   filters: { order: 'ASC' | 'DESC' },
     *   toggleOrder: () => void,
     *   onChangePage: (page1Indexed: number) => void,
     *   handleProcessStart: (process: object) => void
     * }}
     */
    let { processes, pagination, filters, toggleOrder, onChangePage, handleProcessStart } = $props();

    const status = $derived.by(() => {
        if (!processes || processes.length === 0) return '';
        const start = pagination.page * pagination.size;
        const end = start + processes.length;
        return `${start + 1}-${end} ${$_('of')} ${pagination.total}`;
    });

    function activate(process, event) {
        if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
        if (event.type === 'keydown') event.preventDefault();
        handleProcessStart(process);
    }
</script>

<section class="panel panel-default List" aria-labelledby="list-heading">
    <div class="panel-heading List-heading">
        <h3 id="list-heading" class="panel-title">{$_('List')}</h3>
        <p class="List-pagination-top">{status}</p>
    </div>
    <div class="panel-body">
        {#if processes && processes.length > 0}
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th class="List-name">
                            <button
                                type="button"
                                class="btn btn-link List-sort-button"
                                onclick={toggleOrder}
                                aria-pressed={filters.order === 'DESC'}
                            >
                                <span>{$_('Name')}</span>
                                <span
                                    class="glyphicon"
                                    class:glyphicon-chevron-up={filters.order === 'ASC'}
                                    class:glyphicon-chevron-down={filters.order === 'DESC'}
                                    aria-hidden="true"
                                ></span>
                            </button>
                        </th>
                        <th>{$_('Version')}</th>
                        <th class="hidden-xs">{$_('Categories')}</th>
                        <th class="hidden-xs">{$_('Description')}</th>
                        <th>{$_('Action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each processes as process (process.id)}
                        <tr
                            class="List-process start-process"
                            role="button"
                            tabindex="0"
                            title={$_('Start a new case')}
                            aria-label={$_('Start a new case for process {displayName}', { values: { displayName: process.displayName } })}
                            onclick={(e) => activate(process, e)}
                            onkeydown={(e) => activate(process, e)}
                        >
                            <td>{process.displayName}</td>
                            <td>{process.version}</td>
                            <td class="hidden-xs">
                                {#each process.categories ?? [] as category (category.id)}
                                    <span class="label label-default">{category.displayName}</span>
                                {/each}
                            </td>
                            <td class="hidden-xs">{process.description}</td>
                            <td class="process-action text-primary">
                                <span class="glyphicon glyphicon-play" aria-hidden="true"></span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div class="List-pagination-bottom">
                <p>{status}</p>
                <Pager page={pagination.page} size={pagination.size} total={pagination.total} onChange={onChangePage} />
            </div>
        {:else}
            <p class="text-muted">{$_('No process to display')}</p>
        {/if}
    </div>
</section>

<style>
    .List-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }
    .List-heading .List-pagination-top { margin: 0; }
    .List-sort-button {
        padding: 0;
        border: 0;
        font-weight: inherit;
        color: inherit;
    }
    .List-sort-button:hover { text-decoration: none; }
    .List-sort-button .glyphicon { margin-left: 6px; font-size: 12px; }
    .List-process { cursor: pointer; }
    .List-process:focus { outline: 2px solid var(--color-primary); outline-offset: -2px; }
    .List-pagination-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    .List-pagination-bottom :global(.pagination) {
        margin: 0;
    }
    /* colour delegated to Bootstrap `.text-primary` so the Bonita theme rebrands it */
    .label + .label { margin-left: 4px; }
</style>
