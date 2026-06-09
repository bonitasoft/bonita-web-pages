import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import ConfirmModal from '../components/ConfirmModal.svelte';

describe('ConfirmModal', () => {
    it('renders nothing when show=false', () => {
        const { container } = render(ConfirmModal, {
            props: { show: false, message: 'Confirm?', onConfirm: () => {}, onClose: () => {} },
        });
        expect(container.querySelector('[role="dialog"]')).toBeNull();
    });

    it('renders the modal with role="dialog" and aria-modal="true" when show=true', () => {
        render(ConfirmModal, {
            props: { show: true, message: 'Confirm?', onConfirm: () => {}, onClose: () => {} },
        });
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-modal-title');
    });

    it('calls onConfirm when Start is clicked', async () => {
        const onConfirm = vi.fn();
        render(ConfirmModal, {
            props: { show: true, message: 'Confirm?', onConfirm, onClose: () => {} },
        });
        await fireEvent.click(screen.getByRole('button', { name: 'Start' }));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('calls onClose when Cancel is clicked', async () => {
        const onClose = vi.fn();
        render(ConfirmModal, {
            props: { show: true, message: 'Confirm?', onConfirm: () => {}, onClose },
        });
        await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onClose).toHaveBeenCalled();
    });

    it('focuses the Start button when opened', async () => {
        render(ConfirmModal, {
            props: { show: true, message: 'Confirm?', onConfirm: () => {}, onClose: () => {} },
        });
        await waitFor(() => {
            expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Start' }));
        });
    });

    it('calls onClose when Escape is pressed', async () => {
        const onClose = vi.fn();
        render(ConfirmModal, {
            props: { show: true, message: 'Confirm?', onConfirm: () => {}, onClose },
        });
        await fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });
});
