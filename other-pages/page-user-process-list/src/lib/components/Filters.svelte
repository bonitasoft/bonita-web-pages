<script>
    import { _ } from 'svelte-i18n';

    /** @type {{ filters: { categoryId: string, search: string }, categories: Record<string, { id: string, displayName: string }>, onChange: (delta: { categoryId?: string, search?: string }) => void }} */
    let { filters, categories, onChange } = $props();

    // Local search state: only seeded from `filters.search` once at mount.
    // Subsequent prop changes intentionally don't sync — the user types freely
    // and the parent gets the value via onChange on submit/clear.
    // svelte-ignore state_referenced_locally
    let search = $state(filters.search ?? '');
    let dropdownOpen = $state(false);
    let searchInputEl;

    const categoryList = $derived(Object.values(categories ?? {}));
    const selectedCategory = $derived(categories?.[filters.categoryId] ?? categoryList[0]);
    const dropdownDisabled = $derived(categoryList.length < 2);

    function selectCategory(categoryId) {
        dropdownOpen = false;
        onChange({ categoryId });
    }

    function submitSearch(event) {
        event?.preventDefault();
        onChange({ search });
    }

    function clearSearch() {
        search = '';
        searchInputEl?.focus();
        onChange({ search: '' });
    }

    function toggleDropdown() {
        if (!dropdownDisabled) dropdownOpen = !dropdownOpen;
    }

    function closeOnOutside(event) {
        if (!event.target.closest('.Filters-category')) dropdownOpen = false;
    }
</script>

<svelte:window onclick={closeOnOutside} />

<section class="panel panel-default Filters" aria-labelledby="filters-heading">
    <div class="panel-heading">
        <h3 id="filters-heading" class="panel-title">{$_('Filters')}</h3>
    </div>
    <div class="panel-body Filters-body">
        <div class="dropdown Filters-category" class:open={dropdownOpen}>
            <button
                type="button"
                id="Filters-category"
                class="btn btn-primary dropdown-toggle"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-labelledby="filters-heading Filters-category-label"
                disabled={dropdownDisabled}
                onclick={toggleDropdown}
            >
                <span id="Filters-category-label">{selectedCategory?.displayName ?? ''}</span>
                <span class="caret" aria-hidden="true"></span>
            </button>
            {#if dropdownOpen}
                <ul class="dropdown-menu" role="menu" aria-labelledby="Filters-category">
                    {#each categoryList as category (category.id)}
                        <li role="presentation" class="Filters-category-item" class:active={filters.categoryId === category.id}>
                            <button
                                type="button"
                                role="menuitem"
                                class="Filters-category-menuitem"
                                onclick={() => selectCategory(category.id)}
                            >
                                {category.displayName}
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <form role="search" class="Filters-search" onsubmit={submitSearch}>
            <div class="form-group has-feedback">
                <label class="sr-only" for="searchInput">{$_('Search')}</label>
                <input
                    bind:this={searchInputEl}
                    bind:value={search}
                    id="searchInput"
                    type="search"
                    class="form-control"
                    placeholder="{$_('Search')}…"
                    aria-describedby="searchInputHelp"
                />
                {#if search}
                    <button
                        type="button"
                        class="Filters-search-clear"
                        aria-label={$_('aria.clearSearch')}
                        onclick={clearSearch}
                    >
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                {/if}
                <button
                    type="submit"
                    class="btn btn-primary Filters-search-submit"
                    aria-label={$_('aria.submitSearch')}
                >
                    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                </button>
                <p id="searchInputHelp" class="help-block hidden-xs">{$_('On process name or version')}</p>
            </div>
        </form>
    </div>
</section>

<style>
    .Filters-body {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 16px;
        flex-wrap: wrap;
    }
    /* Below the Bootstrap "sm" breakpoint, stack the dropdown and the search
       input vertically so both share the same left edge and the search input
       isn't isolated on its own row. Both stretch to fill the panel width. */
    @media (max-width: 767px) {
        .Filters-body {
            flex-direction: column;
            align-items: stretch;
        }
        .Filters-category,
        .Filters-category .dropdown-toggle,
        .Filters-category .dropdown-menu {
            width: 100%;
            max-width: none;
        }
    }
    .Filters-category { position: relative; }
    .Filters-category .dropdown-toggle {
        /* Stable width so the button doesn't shrink when a shorter category
           is selected. Wide enough for "Toutes les catégories" + the caret. */
        min-width: 220px;
        text-align: left;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }
    .Filters-category .dropdown-toggle > span:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .Filters-category .dropdown-menu {
        min-width: 220px;
    }
    .Filters-search {
        flex: 1;
        min-width: 240px;
    }
    .Filters-search .form-group { position: relative; margin-bottom: 0; }
    .Filters-search input.form-control {
        padding-right: 64px;
    }
    .Filters-search-clear {
        position: absolute;
        right: 36px;
        top: 6px;
        background: transparent;
        border: 0;
        color: var(--color-text-muted);
        padding: 4px 6px;
    }
    .Filters-search-submit {
        position: absolute;
        right: 0;
        top: 0;
    }
    .Filters-search .help-block {
        font-size: 12px;
        margin-top: 4px;
        margin-bottom: 0;
    }
    .Filters-category-menuitem {
        display: block;
        width: 100%;
        padding: 3px 20px;
        text-align: left;
        background: transparent;
        border: 0;
        color: var(--color-menuitem-text);
    }
    .Filters-category-menuitem:hover { background: var(--color-menuitem-hover); cursor: pointer; }
    /* Selected category: a theme-agnostic neutral highlight (Bootstrap has no
       themeable bg utility in v3, and a hardcoded brand bg can't be rebranded).
       Bold + tinted background marks the selection without an off-theme colour. */
    .Filters-category-item.active .Filters-category-menuitem {
        background: var(--color-menuitem-hover);
        font-weight: 600;
    }
</style>
