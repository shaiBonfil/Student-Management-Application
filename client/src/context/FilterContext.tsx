import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DynamicFilters {
    [key: string]: string | undefined;
}

interface AllStudentFilters {
    dynamic: DynamicFilters;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
}

interface ExcellentStudentFilters {
    dynamic: DynamicFilters;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
}

interface HonorFilters {
    dynamic: DynamicFilters;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
    topPerDepartment: boolean;
}

interface AppFilterState {
    allStudents: AllStudentFilters;
    excellentStudents: ExcellentStudentFilters;
    honor: HonorFilters;
}

const defaultFilters: AppFilterState = {
    allStudents: {
        dynamic: {},
        sortBy: 'id',
        sortDir: 'ASC',
    },
    excellentStudents: {
        dynamic: {},
        sortBy: 'gpa',
        sortDir: 'DESC',
    },
    honor: {
        dynamic: {},
        sortBy: 'gpa',
        sortDir: 'DESC',
        topPerDepartment: false,
    },
};

interface FilterContextType {
    filters: AppFilterState;
    setFilters: React.Dispatch<React.SetStateAction<AppFilterState>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFilters] = useLocalStorage(
        'studentAppFilters',
        defaultFilters,
    );

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};
