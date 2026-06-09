import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Pager from '../components/Pager.svelte';

describe('Pager', () => {
    it('renders nothing when there is only one page', () => {
        const { container } = render(Pager, {
            props: { page: 0, size: 10, total: 5, onChange: () => {} },
        });
        expect(container.querySelector('nav')).toBeNull();
    });

    it('renders 5 page buttons + first/prev/next/last for many pages', () => {
        render(Pager, {
            props: { page: 4, size: 10, total: 100, onChange: () => {} },
        });
        // 5 numbered + first + prev + next + last = 9 buttons
        expect(screen.getByLabelText('First page')).toBeInTheDocument();
        expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
        expect(screen.getByLabelText('Next page')).toBeInTheDocument();
        expect(screen.getByLabelText('Last page')).toBeInTheDocument();
    });

    it('marks the current page with aria-current="page"', () => {
        render(Pager, {
            props: { page: 2, size: 10, total: 100, onChange: () => {} },
        });
        const current = screen.getByLabelText('Go to page 3');
        expect(current).toHaveAttribute('aria-current', 'page');
    });

    it('calls onChange with the next 1-indexed page on click', async () => {
        const onChange = vi.fn();
        render(Pager, {
            props: { page: 0, size: 10, total: 100, onChange },
        });
        await fireEvent.click(screen.getByLabelText('Next page'));
        expect(onChange).toHaveBeenCalledWith(2);
    });

    it('disables First/Previous on page 1 and Last/Next on the last page', () => {
        render(Pager, {
            props: { page: 0, size: 10, total: 30, onChange: () => {} },
        });
        expect(screen.getByLabelText('First page')).toBeDisabled();
        expect(screen.getByLabelText('Previous page')).toBeDisabled();
        expect(screen.getByLabelText('Next page')).not.toBeDisabled();
    });
});
