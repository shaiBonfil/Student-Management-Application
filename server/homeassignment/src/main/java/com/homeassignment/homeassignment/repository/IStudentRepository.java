package com.homeassignment.homeassignment.repository;

import com.homeassignment.homeassignment.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IStudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    /**
     * This query finds the top honor student (GPA >= 90) from each department.
     * It works by:
     * 1. Filtering for students with GPA >= 90.
     * 2. Partitioning them by 'department' and ordering by 'gpa' in descending order.
     * 3. Assigning a row number (rn) to each.
     * 4. Selecting only the rows where the row number is 1 (the top student).
     */
    @Query(value = "SELECT s.* FROM " +
            "(SELECT *, ROW_NUMBER() OVER(PARTITION BY department ORDER BY gpa DESC) as rn " +
            "FROM students WHERE gpa >= 90) s " +
            "WHERE s.rn = 1", nativeQuery = true)
    List<Student> findTopHonorStudentsByDepartment();
}
