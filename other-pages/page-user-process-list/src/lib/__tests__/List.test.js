import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import List from '../components/List.svelte';

const sampleProps = () => ({
    processes: [
        { id: 'p1', displayName: 'Procurement', version: '1.0', description: 'desc', categories: [{ id: 'c1', displayName: 'Tests' }] },
        { id: 'p2', displayName: 'Onboarding', version: '2.0', description: 'desc 2', categories: [] },
    ],
    pagination: { page: 0, size: 10, total: 2 },
    filters: { order: 'ASC' },
    toggleOrder: vi.fn(),
    onChangePage: vi.fn(),
    handleProcessStart: vi.fn(),
});

describe('List', () => {
    it('renders one row per process and shows displayName/version/description', () => {
        render(List, { props: sampleProps() });
        expect(screen.getByText('Procurement')).toBeInTheDocument();
        expect(screen.getByText('Onboarding')).toBeInTheDocument();
        expect(screen.getByText('1.0')).toBeInTheDocument();
        expect(screen.getByText('desc')).toBeInTheDocument();
    });

    it('renders the empty state when there are no processes', () => {
        const props = { ...sampleProps(), processes: [], pagination: { page: 0, size: 10, total: 0 } };
        render(List, { props });
        expect(screen.getByText('No process to display')).toBeInTheDocument();
    });

    it('calls toggleOrder when the Name header sort button is clicked', async () => {
        const props = sampleProps();
        render(List, { props });
        await fireEvent.click(screen.getByRole('button', { name: /Name/i }));
        expect(props.toggleOrder).toHaveBeenCalled();
    });

    it('calls handleProcessStart when a row is clicked', async () => {
        const props = sampleProps();
        render(List, { props });
        const row = screen.getAllByRole('button').find((el) =>
            el.tagName === 'TR' && el.getAttribute('aria-label')?.includes('Procurement')
        );
        await fireEvent.click(row);
        expect(props.handleProcessStart).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
    });

    it('activates a row via keyboard (Enter and Space)', async () => {
        const props = sampleProps();
        render(List, { props });
        const row = screen.getAllByRole('button').find((el) =>
            el.tagName === 'TR' && el.getAttribute('aria-label')?.includes('Procurement')
        );
        await fireEvent.keyDown(row, { key: 'Enter' });
        expect(props.handleProcessStart).toHaveBeenCalledTimes(1);
        await fireEvent.keyDown(row, { key: ' ' });
        expect(props.handleProcessStart).toHaveBeenCalledTimes(2);
    });

    it('renders a chevron-up glyph when order=ASC and chevron-down when DESC', () => {
        const props = sampleProps();
        const { container, rerender } = render(List, { props });
        expect(container.querySelector('.glyphicon-chevron-up')).toBeInTheDocument();
        rerender({ ...props, filters: { order: 'DESC' } });
        expect(container.querySelector('.glyphicon-chevron-down')).toBeInTheDocument();
    });
});
