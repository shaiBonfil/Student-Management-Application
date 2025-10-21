import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFilters } from '../../context/FilterContext';
import {
    getStudents,
    type Student,
    addStudent,
    updateStudent,
    type NewStudent,
} from '../../services/api';
import DataGrid from '../../components/DataGrid/DataGrid';
import type {
    DataGridColumn,
    SortConfig,
} from '../../components/DataGrid/DataGrid';
import Modal from '../../components/Modal/Modal';
import StudentForm from '../../components/StudentForm/StudentForm';
import { Toaster, toast } from '../../components/Toaster/Toaster';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import styles from './StudentsPage.module.css';

const ALL_STUDENTS_COLUMNS: readonly DataGridColumn<Student>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true },
    { key: 'firstName', header: 'First Name', sortable: true, filterable: true },
    { key: 'lastName', header: 'Last Name', sortable: true, filterable: true },
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'department', header: 'Department', sortable: true, filterable: true },
    { key: 'gpa', header: 'GPA', sortable: true, filterable: true },
];

const EXCELLENT_STUDENTS_COLUMNS: readonly DataGridColumn<Student>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true },
    { key: 'firstName', header: 'First Name', sortable: true, filterable: true },
    { key: 'lastName', header: 'Last Name', sortable: true, filterable: true },
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'department', header: 'Department', sortable: true, filterable: true },
    { key: 'gpa', header: 'GPA', sortable: true, filterable: true },
];

const StudentsPage = () => {
    const { filters, setFilters } = useFilters();
    const allStudentsFilters = filters.allStudents;
    const excellentStudentsFilters = filters.excellentStudents;

    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [excellentStudents, setExcellentStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const fetchAllStudents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getStudents({}); // Fetch all
            setAllStudents(data);
        } catch (err) {
            console.error('Failed to fetch students:', err);
            toast.error('Oops, something went wrong');
        }
        setLoading(false);
    }, []);

    const fetchExcellentStudents = useCallback(async () => {
        try {
            const excellentParams = {
                gpa_gte: '90',
                sortBy: 'gpa',
                sortDir: 'DESC',
            };
            const data = await getStudents(excellentParams);
            setExcellentStudents(data);
        } catch (err) {
            console.error('Failed to fetch excellent students:', err);
            toast.error('Oops, something went wrong');
        }
    }, []);

    useEffect(() => {
        fetchAllStudents();
        fetchExcellentStudents();
    }, [fetchAllStudents, fetchExcellentStudents]);

    const sortConfigAll = useMemo((): SortConfig<Student> | null => {
        if (!allStudentsFilters.sortBy) return null;
        return {
            key: allStudentsFilters.sortBy as keyof Student,
            direction:
                allStudentsFilters.sortDir === 'ASC' ? 'ascending' : 'descending',
        };
    }, [allStudentsFilters.sortBy, allStudentsFilters.sortDir]);

    const handleSortAll = (
        key: keyof Student,
        direction: 'ascending' | 'descending',
    ) => {
        setFilters((prev) => ({
            ...prev,
            allStudents: {
                ...prev.allStudents,
                sortBy: key.toString(),
                sortDir: direction === 'ascending' ? 'ASC' : 'DESC',
            },
        }));
    };

    const handleClearSortAll = () => {
        setFilters((prev) => ({
            ...prev,
            allStudents: {
                ...prev.allStudents,
                sortBy: 'id',
                sortDir: 'ASC',
            },
        }));
    };

    const handleFilterChangeAll = (key: keyof Student, value: string) => {
        setFilters((prev) => ({
            ...prev,
            allStudents: {
                ...prev.allStudents,
                dynamic: {
                    ...prev.allStudents.dynamic,
                    [key.toString()]: value || undefined,
                },
            },
        }));
    };
    
    const sortConfigExcellent = useMemo((): SortConfig<Student> | null => {
        if (!excellentStudentsFilters.sortBy) return null;
        return {
            key: excellentStudentsFilters.sortBy as keyof Student,
            direction:
                excellentStudentsFilters.sortDir === 'ASC' ? 'ascending' : 'descending',
        };
    }, [excellentStudentsFilters.sortBy, excellentStudentsFilters.sortDir]);

    const handleSortExcellent = (
        key: keyof Student,
        direction: 'ascending' | 'descending',
    ) => {
        setFilters((prev) => ({
            ...prev,
            excellentStudents: {
                ...prev.excellentStudents,
                sortBy: key.toString(),
                sortDir: direction === 'ascending' ? 'ASC' : 'DESC',
            },
        }));
    };

    const handleClearSortExcellent = () => {
        setFilters((prev) => ({
            ...prev,
            excellentStudents: {
                ...prev.excellentStudents,
                sortBy: 'gpa',
                sortDir: 'DESC',
            },
        }));
    };

    const handleFilterChangeExcellent = (key: keyof Student, value: string) => {
        setFilters((prev) => ({
            ...prev,
            excellentStudents: {
                ...prev.excellentStudents,
                dynamic: {
                    ...prev.excellentStudents.dynamic,
                    [key.toString()]: value || undefined,
                },
            },
        }));
    };

    const handleOpenEditModal = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: NewStudent) => {
        try {
            if (editingStudent) {
                await updateStudent(editingStudent.id, data);
                toast.success('Student updated successfully', 'light-filled');
            } else {
                await addStudent(data);
                toast.success('Student added successfully', 'light-filled');
            }
            // Refresh both lists and close modal
            fetchAllStudents();
            fetchExcellentStudents();
            setIsModalOpen(false);
            setEditingStudent(null);
        } catch (err) {
            console.error('Failed to save student:', err);
            toast.error('Could not save student', 'light-filled');
        }
    };

    return (
        <div className={styles.page}>
            <Toaster />
            <h1>Students Management</h1>

            <button onClick={handleOpenAddModal} className={styles.addButton}>
                Add New Student
            </button>

            <h2>All Students</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ErrorBoundary>
                    <DataGrid
                        columns={ALL_STUDENTS_COLUMNS}
                        data={allStudents}
                        onEdit={handleOpenEditModal}
                        filters={allStudentsFilters.dynamic}
                        onFilterChange={handleFilterChangeAll}
                        sortConfig={sortConfigAll}
                        onSort={handleSortAll}
                        onClearSort={handleClearSortAll}
                    />
                </ErrorBoundary>
            )}

            <h2>Excellent Students (GPA ≥ 90)</h2>
            <ErrorBoundary>
                <DataGrid
                    columns={EXCELLENT_STUDENTS_COLUMNS}
                    data={excellentStudents}
                    onEdit={handleOpenEditModal}
                    filters={excellentStudentsFilters.dynamic}
                    onFilterChange={handleFilterChangeExcellent}
                    sortConfig={sortConfigExcellent}
                    onSort={handleSortExcellent}
                    onClearSort={handleClearSortExcellent}
                />
            </ErrorBoundary>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStudent ? 'Edit Student' : 'Add New Student'}
            >
                <StudentForm
                    onSubmitSuccess={handleFormSubmit}
                    defaultValues={
                        editingStudent
                            ? {
                                  firstName: editingStudent.firstName,
                                  lastName: editingStudent.lastName,
                                  email: editingStudent.email,
                                  department: editingStudent.department,
                                  gpa: editingStudent.gpa,
                              }
                            : undefined
                    }
                />
            </Modal>
        </div>
    );
};

export default StudentsPage;
