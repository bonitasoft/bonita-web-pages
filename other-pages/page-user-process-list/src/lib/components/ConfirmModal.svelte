<script>
    import { tick } from 'svelte';
    import { _ } from 'svelte-i18n';

    /** @type {{ show: boolean, title?: string, message: string, onConfirm: () => void, onClose: () => void }} */
    let { show, title, message, onConfirm, onClose } = $props();

    let startBtn = $state();
    let cancelBtn = $state();

    // Scope keyboard handling and focus to the period when the modal is open:
    // the keydown listener attaches when `show` becomes true and detaches when
    // it becomes false (or the component unmounts). Avoids the previous pattern
    // of a permanent keystroke handler that just bailed when `show=false`.
    $effect(() => {
        if (!show) return;
        // Move focus to the primary action so Enter triggers it immediately.
        tick().then(() => startBtn?.focus());

        const handleKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'Tab') {
                // Trap focus between Start and Cancel
                if (e.shiftKey && document.activeElement === startBtn) {
                    e.preventDefault();
                    cancelBtn?.focus();
                } else if (!e.shiftKey && document.activeElement === cancelBtn) {
                    e.preventDefault();
                    startBtn?.focus();
                }
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });
</script>

{#if show}
    <div class="modal-backdrop fade in"></div>
    <div
        class="modal fade in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        style="display: block;"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button
                        type="button"
                        class="close"
                        aria-label={$_('aria.dismissNotification')}
                        onclick={onClose}
                    >&times;</button>
                    <h4 id="confirm-modal-title" class="modal-title">{title ?? message}</h4>
                </div>
                {#if title}
                    <div class="modal-body">
                        <p>{message}</p>
                    </div>
                {/if}
                <div class="modal-footer">
                    <button
                        bind:this={startBtn}
                        type="button"
                        class="btn btn-primary btn-start"
                        onclick={onConfirm}
                    >{$_('Start')}</button>
                    <button
                        bind:this={cancelBtn}
                        type="button"
                        class="btn btn-default btn-cancel"
                        onclick={onClose}
                    >{$_('Cancel')}</button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop.in {
        opacity: 0.5;
    }
    .modal.in {
        display: block;
    }
</style>
