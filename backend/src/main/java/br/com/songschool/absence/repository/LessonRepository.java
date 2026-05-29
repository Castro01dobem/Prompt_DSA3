package br.com.songschool.absence.repository;

import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.Lesson;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
  Optional<Lesson> findByQrToken(String qrToken);

  List<Lesson> findTop20ByClassGroupOrderByStartsAtDesc(ClassGroup classGroup);

  long countByClassGroup(ClassGroup classGroup);
}

