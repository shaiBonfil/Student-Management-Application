package com.homeassignment.homeassignment.controller;

import com.homeassignment.homeassignment.model.Student;
import com.homeassignment.homeassignment.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/students") // Base path for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService studentService;

    /**
     * GET /api/v1/students
     * This is the main endpoint for getting all students with filtering and sorting.
     * - @RequestParam Map<String, String> allParams: Captures all URL query params
     * (e.g., ?firstName=John&department=CS&gpa_gte=90)
     * - @RequestParam(defaultValue = "id") String sortBy: The column to sort by.
     * - @RequestParam(defaultValue = "ASC") String sortDir: The direction to sort (ASC or DESC).
     */
    @GetMapping
    public List<Student> getAllStudents(
            @RequestParam(required = false) Map<String, String> allParams,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);

        Specification<Student> spec = StudentService.createSpecification(allParams);

        return studentService.getStudents(spec, sort);
    }

    /**
     * GET /api/v1/students/honor-candidates/top-by-department
     * This endpoint handles the specific "top student" requirement.
     */
    @GetMapping("/honor-candidates/top-by-department")
    public List<Student> getTopHonorStudents() {
        return studentService.getTopHonorStudentsByDepartment();
    }

    /**
     * POST /api/v1/students
     * Adds a new student to the database.
     * - @Valid: Triggers the validation rules in Student model.
     * - @RequestBody: Takes the JSON from the request and converts it to a Student object.
     */
    @PostMapping
    public Student addStudent(@Valid @RequestBody Student student) {
        return studentService.addStudent(student);
    }

    /**
     * PUT /api/v1/students/{id}
     * Updates an existing student.
     * - @PathVariable: Gets the 'id' from the URL.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        return ResponseEntity.ok(updatedStudent);
    }
}
