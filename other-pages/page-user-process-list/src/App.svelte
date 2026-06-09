<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { _ } from 'svelte-i18n';
    import { fetchSession } from './lib/api/session.js';
    import {
        instantiationState,
        handleProcessStart,
        confirmInstantiation,
        cancelInstantiation,
        dismissConfirm,
        checkDeepLink,
    } from './lib/stores/instantiation.svelte.js';
    import ProcessList from './lib/components/ProcessList.svelte';
    import Alerts from './lib/components/Alerts.svelte';
    import ConfirmModal from './lib/components/ConfirmModal.svelte';
    import Instantiation from './lib/components/Instantiation.svelte';

    let session = $state(null);
    let error = $state(null);

    const needsLogin = $derived(error?.status === 401);
    const embedded = typeof window !== 'undefined' && window.parent !== window;
    const confirmMessage = $derived(
        instantiationState.processToConfirm
            ? $_('Start a new case for process {displayName}', {
                  values: { displayName: instantiationState.processToConfirm.displayName },
              })
            : ''
    );

    function loadSession() {
        error = null;
        fetchSession()
            .then((s) => (session = s))
            .catch((err) => (error = err));
    }

    onMount(async () => {
        loadSession();
        await checkDeepLink();
    });
</script>

<Alerts />

{#if needsLogin && !embedded && import.meta.env.DEV}
    <!-- DEV only: the dynamic import is also tree-shaken out of the production
         bundle by the env gate, so end users who hit a 401 outside the iframe
         (e.g. direct URL during session expiry) fall through to the standard
         error alert below - never to a dev login form. -->
    {#await import('./lib/components/DevLogin.svelte') then { default: DevLogin }}
        <DevLogin onLogin={loadSession} />
    {/await}
{:else if error}
    <div class="container error-container">
        <div class="alert alert-danger">
            <span class="glyphicon glyphicon-exclamation-sign"></span>
            {$_('error.session')}
        </div>
    </div>
{:else if session}
    <ProcessList {session} {handleProcessStart} />

    {#if instantiationState.view === 'instantiation' && instantiationState.params}
        <div
            class="instantiation-overlay"
            transition:fly={{ x: '100%', duration: 300, easing: cubicOut }}
        >
            <Instantiation
                processName={instantiationState.params.processName}
                processVersion={instantiationState.params.processVersion}
                search={instantiationState.params.search}
                redirectTarget={instantiationState.redirectTargetOnSuccess}
                onCancel={cancelInstantiation}
            />
        </div>
    {/if}

    <ConfirmModal
        show={instantiationState.confirmShown}
        message={confirmMessage}
        onConfirm={confirmInstantiation}
        onClose={dismissConfirm}
    />
{/if}

<style>
    .error-container { margin-top: 40px; }
    /* Slide-from-right: overlay the iframe view on top of the list, anchored
       to the embedding viewport so it covers the page content + Bonita app
       chrome ends where this <div> starts. */
    .instantiation-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: #fff;
        will-change: transform;
    }
</style>
