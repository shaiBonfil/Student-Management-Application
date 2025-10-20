import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFilters } from '../../context/FilterContext';
import {
    getStudents,
    getTopHonorStudents,
    type Student,
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
import styles from './HonorCandidatesPage.module.css';

const HONOR_COLUMNS: readonly DataGridColumn<Student>[] = [
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'department', header: 'Department', sortable: true, filterable: true },
    { key: 'gpa', header: 'GPA', sortable: true, filterable: true },
];

const HonorCandidatesPage = () => {
    const { filters, setFilters } = useFilters();
    const honorFilters = filters.honor;

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const fetchHonorStudents = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            if (honorFilters.topPerDepartment) {
                data = await getTopHonorStudents();
            } else {
                const params = {
                    gpa_gte: '90',
                };
                data = await getStudents(params);
            }
            setStudents(data);
        } catch (err) {
            console.error('Failed to fetch honor students:', err);
        }
        setLoading(false);
    }, [honorFilters.topPerDepartment]);

    useEffect(() => {
        fetchHonorStudents();
    }, [fetchHonorStudents]);

    const sortConfig = useMemo((): SortConfig<Student> | null => {
        if (!honorFilters.sortBy) return null;
        return {
            key: honorFilters.sortBy as keyof Student,
            direction:
                honorFilters.sortDir === 'ASC' ? 'ascending' : 'descending',
        };
    }, [honorFilters.sortBy, honorFilters.sortDir]);

    const handleSort = (
        key: keyof Student,
        direction: 'ascending' | 'descending',
    ) => {
        setFilters((prev) => ({
            ...prev,
            honor: {
                ...prev.honor,
                sortBy: key.toString(),
                sortDir: direction === 'ascending' ? 'ASC' : 'DESC',
            },
        }));
    };

    const handleClearSort = () => {
        setFilters((prev) => ({
            ...prev,
            honor: {
                ...prev.honor,
                sortBy: 'gpa',
                sortDir: 'DESC',
            },
        }));
    };

    const handleFilterChange = (key: keyof Student, value: string) => {
        setFilters((prev) => ({
            ...prev,
            honor: {
                ...prev.honor,
                dynamic: {
                    ...prev.honor.dynamic,
                    [key.toString()]: value || undefined,
                },
            },
        }));
    };

    const toggleTopPerDepartment = () => {
        setFilters((prev) => ({
            ...prev,
            honor: {
                ...prev.honor,
                topPerDepartment: !prev.honor.topPerDepartment,
            },
        }));
    };

    const handleOpenEditModal = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: NewStudent) => {
        try {
            if (editingStudent) {
                await updateStudent(editingStudent.id, data);
            }
            fetchHonorStudents();
            setIsModalOpen(false);
            setEditingStudent(null);
        } catch (err) {
            console.error('Failed to save student:', err);
            alert('Error: Could not save student. Check console.');
        }
    };

    return (
        <div className={styles.page}>
            <h1>Honor Candidates (GPA ≥ 90)</h1>

            <div className={styles.filterBar}>
                <button
                    onClick={toggleTopPerDepartment}
                    className={
                        honorFilters.topPerDepartment ? styles.toggleActive : ''
                    }
                >
                    {honorFilters.topPerDepartment
                        ? 'Show All Honor Candidates'
                        : 'Show Top Student per Department'}
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataGrid
                    columns={HONOR_COLUMNS}
                    data={students}
                    onEdit={handleOpenEditModal}
                    filters={honorFilters.dynamic}
                    onFilterChange={handleFilterChange}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onClearSort={handleClearSort}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='Edit Student'
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

export default HonorCandidatesPage;
