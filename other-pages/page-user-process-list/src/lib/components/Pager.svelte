<script>
    import { _ } from 'svelte-i18n';

    /** @type {{ page: number, size: number, total: number, onChange: (page1Indexed: number) => void }} */
    let { page, size, total, onChange } = $props();

    const lastPage = $derived(size > 0 ? Math.max(1, Math.ceil(total / size)) : 1);
    const currentPage = $derived(page + 1); // 1-indexed for display

    // Show up to 5 page numbers centered on the current page.
    const visiblePages = $derived.by(() => {
        const range = 5;
        const half = Math.floor(range / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(lastPage, start + range - 1);
        start = Math.max(1, end - range + 1);
        const out = [];
        for (let i = start; i <= end; i++) out.push(i);
        return out;
    });

    function go(p) {
        if (p < 1 || p > lastPage || p === currentPage) return;
        onChange(p);
    }
</script>

{#if total > 0 && lastPage > 1}
    <nav aria-label={$_('aria.pageNavigation')}>
        <div class="btn-group Pager" role="group">
            <button type="button" class="btn btn-default" aria-label={$_('aria.firstPage')} disabled={currentPage === 1} onclick={() => go(1)}>«</button>
            <button type="button" class="btn btn-default" aria-label={$_('aria.previousPage')} disabled={currentPage === 1} onclick={() => go(currentPage - 1)}>‹</button>
            {#each visiblePages as p (p)}
                <button
                    type="button"
                    class="btn {p === currentPage ? 'btn-primary' : 'btn-default'}"
                    aria-current={p === currentPage ? 'page' : undefined}
                    aria-label={$_('aria.gotoPage', { values: { page: p } })}
                    onclick={() => go(p)}
                >{p}</button>
            {/each}
            <button type="button" class="btn btn-default" aria-label={$_('aria.nextPage')} disabled={currentPage === lastPage} onclick={() => go(currentPage + 1)}>›</button>
            <button type="button" class="btn btn-default" aria-label={$_('aria.lastPage')} disabled={currentPage === lastPage} onclick={() => go(lastPage)}>»</button>
        </div>
    </nav>
{/if}

<style>
    /* Colours come from Bootstrap .btn-default / .btn-primary (active page),
       which the Bonita theme rebrands — no hardcoded primary here. */

    /* Below ~480px the 9-button row gets tight; hide first/last buttons.
       prev/next/numbers still let users navigate. */
    @media (max-width: 479px) {
        .Pager > .btn:first-child,
        .Pager > .btn:last-child {
            display: none;
        }
    }
</style>
