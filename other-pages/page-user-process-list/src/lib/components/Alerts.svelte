<script>
    import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { _ } from 'svelte-i18n';
    import { alerts } from '../stores/alerts.js';

    const ICONS = {
        success: 'ok-circle',
        danger: 'ban-circle',
        warning: 'exclamation-sign',
        info: 'info-sign',
    };
</script>

{#if $alerts.length > 0}
    <div class="Alerts" aria-live="polite" aria-atomic="false">
        {#each $alerts as alert (alert.id)}
            <div
                class="Alert alert alert-{alert.severity}"
                role="alert"
                transition:fly={{ y: '-100%', duration: 300, easing: cubicOut }}
            >
                <span class="glyphicon glyphicon-{ICONS[alert.severity] ?? 'info-sign'}" aria-hidden="true"></span>
                <span class="Alert-message">{alert.message}</span>
                <button
                    type="button"
                    class="close"
                    aria-label={$_('aria.dismissNotification')}
                    onclick={() => alerts.close(alert.id)}
                >&times;</button>
            </div>
        {/each}
    </div>
{/if}

<style>
    .Alerts {
        position: fixed;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1060;
        display: flex;
        flex-direction: column;
        gap: 8px;
        /* Cap at 600px on wider screens, shrink to viewport-minus-padding
           on narrow ones so the toast never forces horizontal scroll. */
        width: min(600px, calc(100vw - 32px));
    }
    .Alert {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        margin: 0;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    }
    .Alert-message { flex: 1; }
    .Alert :global(.close) { opacity: 0.7; margin-left: 8px; }
</style>
