package br.com.songschool.absence.repository;

import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
  List<ClassGroup> findByProfessor(User professor);
}

