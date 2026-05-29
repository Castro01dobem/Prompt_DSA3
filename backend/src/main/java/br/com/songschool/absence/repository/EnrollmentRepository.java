package br.com.songschool.absence.repository;

import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.Enrollment;
import br.com.songschool.absence.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
  boolean existsByStudentAndClassGroup(User student, ClassGroup classGroup);

  List<Enrollment> findByStudent(User student);

  long countByClassGroup(ClassGroup classGroup);
}

