import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Filters from '../components/Filters.svelte';

const baseCategories = {
    0: { id: '0', displayName: 'All categories', name: 'all' },
    101: { id: '101', displayName: 'Tests', name: 'tests' },
};

describe('Filters', () => {
    it('renders the search input + submit button with distinct accessible names', () => {
        render(Filters, {
            props: {
                filters: { categoryId: '0', search: '' },
                categories: baseCategories,
                onChange: () => {},
            },
        });
        expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit search' })).toBeInTheDocument();
    });

    it('calls onChange with new search value on submit', async () => {
        const onChange = vi.fn();
        const { container } = render(Filters, {
            props: {
                filters: { categoryId: '0', search: '' },
                categories: baseCategories,
                onChange,
            },
        });
        const input = screen.getByRole('searchbox', { name: 'Search' });
        await fireEvent.input(input, { target: { value: 'hello' } });
        const form = container.querySelector('form[role="search"]');
        await fireEvent.submit(form);
        expect(onChange).toHaveBeenCalledWith({ search: 'hello' });
    });

    it('opens the category dropdown on click and selects a category', async () => {
        const onChange = vi.fn();
        render(Filters, {
            props: {
                filters: { categoryId: '0', search: '' },
                categories: baseCategories,
                onChange,
            },
        });
        const trigger = screen.getByRole('button', { name: /All categories/i });
        await fireEvent.click(trigger);
        const item = await screen.findByRole('menuitem', { name: 'Tests' });
        await fireEvent.click(item);
        expect(onChange).toHaveBeenCalledWith({ categoryId: '101' });
    });

    it('disables the dropdown when only one category is available', () => {
        render(Filters, {
            props: {
                filters: { categoryId: '0', search: '' },
                categories: { 0: baseCategories[0] },
                onChange: () => {},
            },
        });
        const trigger = screen.getByRole('button', { name: /All categories/i });
        expect(trigger).toBeDisabled();
    });

    it('clears search and calls onChange with empty value', async () => {
        const onChange = vi.fn();
        render(Filters, {
            props: {
                filters: { categoryId: '0', search: 'foo' },
                categories: baseCategories,
                onChange,
            },
        });
        const clear = screen.getByRole('button', { name: 'Clear search' });
        await fireEvent.click(clear);
        expect(onChange).toHaveBeenCalledWith({ search: '' });
    });
});
