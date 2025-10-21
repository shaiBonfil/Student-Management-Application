package com.homeassignment.homeassignment.service;

import com.homeassignment.homeassignment.model.Student;
import com.homeassignment.homeassignment.repository.IStudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class StudentService {

    @Autowired
    private IStudentRepository studentRepository;

    public List<Student> getStudents(Specification<Student> spec, Sort sort) {
        return studentRepository.findAll(spec, sort);
    }

    public List<Student> getTopHonorStudentsByDepartment() {
        return studentRepository.findTopHonorStudentsByDepartment();
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setDepartment(studentDetails.getDepartment());
        student.setGpa(studentDetails.getGpa());

        return studentRepository.save(student);
    }

    public static Specification<Student> createSpecification(Map<String, String> filters) {
        return (root, query, criteriaBuilder) -> {

            // This creates a list of predicates (like "firstName LIKE %john%", "gpa >= 90")
            return criteriaBuilder.and(
                    filters.entrySet().stream()
                            .map(entry -> {
                                String key = entry.getKey();
                                String value = entry.getValue();
                                if (value == null || value.isEmpty()) {
                                    return null;
                                }

                                // This switch maps URL params to database columns
                                return switch (key) {
                                    case "id" -> criteriaBuilder.equal(root.get("id"), Long.parseLong(value));
                                    // Use 'like' for partial string matching
                                    case "firstName" -> criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), "%" + value.toLowerCase() + "%");
                                    case "lastName" -> criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), "%" + value.toLowerCase() + "%");
                                    case "email" -> criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + value.toLowerCase() + "%");
                                    case "department" -> criteriaBuilder.like(criteriaBuilder.lower(root.get("department")), "%" + value.toLowerCase() + "%");
                                    case "gpa_gte" -> criteriaBuilder.greaterThanOrEqualTo(root.get("gpa"), Double.parseDouble(value));
                                    case "gpa_lte" -> criteriaBuilder.lessThanOrEqualTo(root.get("gpa"), Double.parseDouble(value));
                                    case "gpa" -> criteriaBuilder.equal(root.get("gpa"), Double.parseDouble(value));
                                    default -> null;
                                };
                            })
                            .filter(Objects::nonNull)
                            .toArray(jakarta.persistence.criteria.Predicate[]::new)
            );
        };
    }
}
