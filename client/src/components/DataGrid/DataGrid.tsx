import { useState, useEffect, useMemo, useRef } from 'react';
import type { FC } from 'react';
import styles from './DataGrid.module.css';
import Select from '../Select/Select';
import { type SelectOption } from '../Select/Select';

export interface DataGridColumn<T> {
    key: keyof T;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
}

interface DataGridProps<T extends Record<string, any>> {
    columns: readonly DataGridColumn<T>[];
    data: T[];
    itemsPerPage?: number;
    itemsPerPageOptions?: number[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    filters: Record<string, string | undefined>;
    onFilterChange: (key: keyof T, value: string) => void;
    sortConfig: SortConfig<T> | null;
    onSort: (key: keyof T, direction: 'ascending' | 'descending') => void;
    onClearSort: () => void;
}

export interface SortConfig<T> {
    key: keyof T;
    direction: 'ascending' | 'descending';
}

// SVG ICONS
const KebabIcon: FC = () => (
    <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
    >
        <path
            d='M10 5.83331C10.4602 5.83331 10.8333 5.46022 10.8333 4.99998C10.8333 4.53974 10.4602 4.16665 10 4.16665C9.53976 4.16665 9.16667 4.53974 9.16667 4.99998C9.16667 5.46022 9.53976 5.83331 10 5.83331Z'
            stroke='#6B7280'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 9.99998C10.8333 9.53974 10.4602 9.16665 10 9.16665C9.53976 9.16665 9.16667 9.53974 9.16667 9.99998C9.16667 10.4602 9.53976 10.8333 10 10.8333Z'
            stroke='#6B7280'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M10 15.8333C10.4602 15.8333 10.8333 15.4602 10.8333 14.9999C10.8333 14.5397 10.4602 14.1666 10 14.1666C9.53976 14.1666 9.16667 14.5397 9.16667 14.9999C9.16667 15.4602 9.53976 15.8333 10 15.8333Z'
            stroke='#6B7280'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const EditIcon: FC = () => (
    <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
    >
        <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
        <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
    </svg>
);

const DeleteIcon: FC = () => (
    <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
    >
        <polyline points='3 6 5 6 21 6' />
        <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
        <line x1='10' y1='11' x2='10' y2='17' />
        <line x1='14' y1='11' x2='14' y2='17' />
    </svg>
);

// COLUMN HEADER MENU
interface ColumnHeaderMenuProps<T> {
    column: DataGridColumn<T>;
    sortConfig: SortConfig<T> | null;
    filterValue: string;
    onSort: (key: keyof T, direction: 'ascending' | 'descending') => void;
    onClearSort: () => void;
    onFilterChange: (key: keyof T, value: string) => void;
}

const ColumnHeaderMenu = <T extends Record<string, any>>({
    column,
    sortConfig,
    filterValue,
    onSort,
    onClearSort,
    onFilterChange,
}: ColumnHeaderMenuProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(column.key, e.target.value);
    };

    const handleSort = (direction: 'ascending' | 'descending') => {
        onSort(column.key, direction);
        setIsOpen(false);
    };

    const handleClearSort = () => {
        onClearSort();
        setIsOpen(false);
    };

    const handleClearFilter = () => {
        onFilterChange(column.key, '');
        setIsOpen(false);
    };

    const isSorted = sortConfig?.key === column.key;

    return (
        <div className={styles.headerMenuContainer} ref={menuRef}>
            <button
                type='button'
                className={styles.headerMenuButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`Options for column ${column.header}`}
            >
                <KebabIcon />
            </button>

            {isOpen && (
                <div
                    className={styles.headerMenu}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul className={styles.headerMenuList}>
                        {column.sortable && (
                            <>
                                <li
                                    className={styles.headerMenuItem}
                                    onClick={() => handleSort('ascending')}
                                >
                                    Sort Ascending
                                </li>
                                <li
                                    className={styles.headerMenuItem}
                                    onClick={() => handleSort('descending')}
                                >
                                    Sort Descending
                                </li>
                                {isSorted && (
                                    <li
                                        className={styles.headerMenuItem}
                                        onClick={handleClearSort}
                                    >
                                        Clear Sort
                                    </li>
                                )}
                                <li className={styles.headerMenuDivider}></li>
                            </>
                        )}
                        {column.filterable && (
                            <>
                                <li className={styles.headerMenuFilter}>
                                    <input
                                        type='text'
                                        placeholder={`Filter ${column.header}...`}
                                        value={filterValue}
                                        onChange={handleFilterChange}
                                        className={styles.headerMenuInput}
                                    />
                                </li>
                                {filterValue && (
                                    <li
                                        className={styles.headerMenuItem}
                                        onClick={handleClearFilter}
                                    >
                                        Clear Filter
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

const DataGrid = <T extends Record<string, any>>({
    columns,
    data,
    itemsPerPage = 5,
    itemsPerPageOptions = [5, 10, 20],
    onEdit,
    onDelete,
    filters,
    onFilterChange,
    sortConfig,
    onSort,
    onClearSort,
}: DataGridProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(itemsPerPage);

    const filteredData = useMemo(() => {
        const activeFilters = Object.entries(filters).filter(
            ([_, value]) => value,
        );

        if (activeFilters.length === 0) {
            return data;
        }

        return data.filter((item) => {
            return activeFilters.every(([key, filterValue]) => {
                if (!filterValue) return true;
                const itemValue = item[key as keyof T];
                return itemValue
                    .toString()
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            });
        });
    }, [data, filters]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, pageSize]);

    const pageCount = Math.ceil(sortedData.length / pageSize);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [currentPage, sortedData, pageSize]);

    const pageSizeOptions: SelectOption[] = itemsPerPageOptions.map((size) => ({
        value: size,
        label: `${size} per page`,
    }));

    const showActionsColumn = onEdit || onDelete;
    const minRows = 5;
    const emptyRows = Math.max(0, minRows - paginatedData.length);

    const getSortIndicator = (key: keyof T) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };

    return (
        <div className={styles.dataGridContainer}>
            <table className={styles.dataGridTable}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key.toString()}
                                className={styles.dataGridTh}
                            >
                                <div className={styles.headerContent}>
                                    <span>
                                        {col.header}
                                        {col.sortable &&
                                            getSortIndicator(col.key)}
                                    </span>
                                    {(col.sortable || col.filterable) && (
                                        <ColumnHeaderMenu
                                            column={col}
                                            sortConfig={sortConfig}
                                            filterValue={
                                                filters[col.key.toString()] ||
                                                ''
                                            }
                                            onSort={onSort}
                                            onClearSort={onClearSort}
                                            onFilterChange={onFilterChange}
                                        />
                                    )}
                                </div>
                            </th>
                        ))}
                        {showActionsColumn && (
                            <th className={styles.dataGridTh}>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item: T & { id?: any }, index) => (
                        <tr key={item.id || index}>
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className={styles.dataGridTd}
                                >
                                    {item[col.key]}
                                </td>
                            ))}
                            {showActionsColumn && (
                                <td className={styles.dataGridTd}>
                                    <div className={styles.actionCell}>
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                aria-label={`Edit item ${
                                                    item.id || index
                                                }`}
                                            >
                                                <EditIcon />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                aria-label={`Delete item ${
                                                    item.id || index
                                                }`}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}

                    {emptyRows > 0 &&
                        Array.from({ length: emptyRows }).map((_, index) => (
                            <tr key={`empty-${index}`}>
                                {columns.map((col) => (
                                    <td
                                        key={col.key.toString()}
                                        className={`${styles.dataGridTd} ${styles.emptyCell}`}
                                    >
                                        &nbsp;
                                    </td>
                                ))}
                                {showActionsColumn && (
                                    <td
                                        className={`${styles.dataGridTd} ${styles.emptyCell}`}
                                    ></td>
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className={styles.paginationContainer}>
                <Select
                    options={pageSizeOptions}
                    value={pageSize}
                    onChange={(value) => setPageSize(value)}
                />
                <div className={styles.paginationControls}>
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className={`${styles.paginationButton} ${
                            currentPage === 1 && styles.paginationButtonDisabled
                        }`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                        (pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`${styles.paginationButton} ${
                                    currentPage === pageNumber &&
                                    styles.paginationButtonActive
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ),
                    )}
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(pageCount, p + 1))
                        }
                        disabled={currentPage === pageCount}
                        className={`${styles.paginationButton} ${
                            currentPage === pageCount &&
                            styles.paginationButtonDisabled
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataGrid;
