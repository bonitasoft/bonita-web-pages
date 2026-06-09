<script>
    import { onMount, tick } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { alerts } from '../stores/alerts.js';
    import { buildRedirectUrl, getUrlContext } from '../utils/url.js';

    /**
     * @type {{
     *   processName: string,
     *   processVersion: string,
     *   search: string,
     *   redirectTarget: string | null,
     *   onCancel: () => void,
     * }}
     *
     * `redirectTarget` is set by the parent based on whether this view was
     * launched from a deep-link URL (`?redirect=...`) or from a manual click
     * in the list (no redirect). The form's postMessage success handler honors
     * it instead of re-reading `window.top.location.search`, which prevents a
     * stale `redirect=` from a previous session leaking into a manual click.
     */
    let { processName, processVersion, search, redirectTarget, onCancel } = $props();

    let cancelBtn = $state();
    let iframeEl = $state();

    const iframeSrc = $derived(
        `${getUrlContext()}/portal/resource/process/${encodeURIComponent(processName)}/${encodeURIComponent(processVersion)}/content/${search ?? ''}`
    );

    onMount(() => {
        // Move keyboard focus to the cancel button when the overlay opens, so
        // a keyboard-only user can dismiss with Enter/Space without having to
        // tab through the iframe contents.
        tick().then(() => cancelBtn?.focus());

        const handleMessage = (event) => {
            // Security: only trust messages from our own origin. The form iframe
            // is same-origin in production; without this gate any embedded page
            // or extension content script could forge "Start process" success
            // and trigger an `alerts.success` + `onCancel` (and a redirect).
            if (event.origin !== window.location.origin) return;
            // Defence in depth on top of the origin gate: only trust messages
            // posted by our own form iframe, not from any other same-origin
            // frame, popup or opener that could forge a "Start process" success.
            if (event.source !== iframeEl?.contentWindow) return;

            const raw = event.data;
            let msg;
            try {
                msg = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch {
                return;
            }
            if (!msg || msg.action !== 'Start process') return;

            if (msg.message === 'success') {
                if (redirectTarget) {
                    try {
                        const url = buildRedirectUrl(redirectTarget);
                        if (url) {
                            window.top.location.href = url;
                            return;
                        }
                        // Invalid/unsafe redirect target — fall through to in-page success.
                    } catch {
                        // fall through to in-page success
                    }
                }
                const caseId = msg.dataFromSuccess?.caseId ?? '';
                alerts.success(
                    caseId
                        ? $_('The case {caseId} has been started successfully.', { values: { caseId } })
                        : $_('Start a new case')
                );
                onCancel();
            } else {
                alerts.error($_('Error while starting the case.'));
            }
        };
        window.addEventListener('message', handleMessage, false);
        return () => window.removeEventListener('message', handleMessage);
    });
</script>

<div class="Instantiation">
    <button
        bind:this={cancelBtn}
        type="button"
        class="btn btn-primary cancel-bar"
        title={$_('Cancel')}
        aria-label="{$_('Cancel')} — {$_('Processes')}"
        onclick={onCancel}
    >
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    </button>

    <iframe bind:this={iframeEl} src={iframeSrc} title={$_('Start a new case')}></iframe>
</div>

<style>
    .Instantiation {
        display: flex;
        /* Inherits viewport-sized box from the parent .instantiation-overlay
           (position: fixed; inset: 0 in App.svelte). 100% is more robust than
           100vh — works even if the overlay's containing block changes. */
        height: 100%;
    }
    /* Colour comes from Bootstrap .btn-primary (rebranded by the Bonita theme);
       only the geometry of the full-height bar is custom here. */
    .cancel-bar {
        flex: 0 0 40px;
        padding: 0;
        border: 0;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    iframe {
        flex: 1;
        border: 0;
        width: 100%;
        height: 100%;
    }
</style>
