import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type NewStudent } from '../../services/api';
import styles from './StudentForm.module.css';

interface StudentFormProps {
    // Pass a function to call after successful submission
    onSubmitSuccess: (student: NewStudent) => void;
    // Pass existing student data for editing
    defaultValues?: NewStudent;
}

const StudentForm: React.FC<StudentFormProps> = ({
    onSubmitSuccess,
    defaultValues,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewStudent>({
        defaultValues: defaultValues,
    });

    const onSubmit: SubmitHandler<NewStudent> = (data) => {
        const studentData = { ...data, gpa: Number(data.gpa) };
        onSubmitSuccess(studentData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* First Name */}
            <div className={styles.formRow}>
                <label htmlFor='firstName'>First Name</label>
                <input
                    {...register('firstName', {
                        required: 'First name is required',
                    })}
                />
                {errors.firstName && (
                    <span className={styles.error}>
                        {errors.firstName.message}
                    </span>
                )}
            </div>

            {/* Last Name */}
            <div className={styles.formRow}>
                <label htmlFor='lastName'>Last Name</label>
                <input
                    {...register('lastName', {
                        required: 'Last name is required',
                    })}
                />
                {errors.lastName && (
                    <span className={styles.error}>
                        {errors.lastName.message}
                    </span>
                )}
            </div>

            {/* Email */}
            <div className={styles.formRow}>
                <label htmlFor='email'>Email</label>
                <input
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address',
                        },
                    })}
                />
                {errors.email && (
                    <span className={styles.error}>
                        {errors.email.message}
                    </span>
                )}
            </div>

            {/* Department */}
            <div className={styles.formRow}>
                <label htmlFor='department'>Department</label>
                <input
                    {...register('department', {
                        required: 'Department is required',
                    })}
                />
                {errors.department && (
                    <span className={styles.error}>
                        {errors.department.message}
                    </span>
                )}
            </div>

            {/* GPA */}
            <div className={styles.formRow}>
                <label htmlFor='gpa'>GPA</label>
                <input
                    type='number'
                    step='0.1'
                    {...register('gpa', {
                        required: 'GPA is required',
                        min: {
                            value: 0,
                            message: 'GPA must be between 0 and 100',
                        },
                        max: {
                            value: 100,
                            message: 'GPA must be between 0 and 100',
                        },
                    })}
                />
                {errors.gpa && (
                    <span className={styles.error}>
                        {errors.gpa.message}
                    </span>
                )}
            </div>

            <button type='submit'>Submit</button>
        </form>
    );
};

export default StudentForm;
