import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/students';

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    gpa: number;
}

// Omit 'id' when creating a new student
export type NewStudent = Omit<Student, 'id'>;

/**
 * Gets students with filtering and sorting.
 * 'params' will be converted to query string: ?sortBy=gpa&gpa_gte=90
 */
export const getStudents = async (params: Record<string, any>) => {
    const response = await axios.get<Student[]>(API_BASE_URL, { params });
    return response.data;
};

export const getTopHonorStudents = async () => {
    const response = await axios.get<Student[]>(
        `${API_BASE_URL}/honor-candidates/top-by-department`,
    );
    return response.data;
};

export const addStudent = async (student: NewStudent) => {
    const response = await axios.post<Student>(API_BASE_URL, student);
    return response.data;
};

export const updateStudent = async (id: number, student: NewStudent) => {
    const response = await axios.put<Student>(`${API_BASE_URL}/${id}`, student);
    return response.data;
};
