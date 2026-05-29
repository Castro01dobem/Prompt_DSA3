package br.com.songschool.absence.repository;

import br.com.songschool.absence.domain.Attendance;
import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.Lesson;
import br.com.songschool.absence.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
  Optional<Attendance> findByLessonAndStudent(Lesson lesson, User student);

  long countByLesson(Lesson lesson);

  @Query("select a from Attendance a where a.student = :student order by a.checkedInAt desc")
  List<Attendance> findHistoryByStudent(@Param("student") User student);

  @Query("select count(a) from Attendance a where a.lesson.classGroup = :classGroup and a.student = :student")
  long countByClassGroupAndStudent(@Param("classGroup") ClassGroup classGroup, @Param("student") User student);
}

