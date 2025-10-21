-- Create the students table (this will be handled by ddl-auto=update, but is good to have)
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255) NOT NULL,
    gpa NUMERIC(5, 2) NOT NULL CHECK (gpa >= 0 AND gpa <= 100)
);

-- Insert sample data, ignoring conflicts
INSERT INTO students (id, first_name, last_name, email, department, gpa) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', 'Computer Science', 88.5),
(2, 'Jane', 'Smith', 'jane.smith@example.com', 'Physics', 92.0),
(3, 'Alice', 'Johnson', 'alice.j@example.com', 'Computer Science', 95.0),
(4, 'Bob', 'Brown', 'bob.b@example.com', 'Mathematics', 76.0),
(5, 'Charlie', 'Davis', 'charlie.d@example.com', 'Physics', 89.0),
(6, 'Eve', 'Miller', 'eve.m@example.com', 'Computer Science', 99.0)
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence generator so new students start after the highest existing ID
-- This prevents errors when you add a new student via the API
SELECT setval(pg_get_serial_sequence('students', 'id'), (SELECT MAX(id) FROM students));