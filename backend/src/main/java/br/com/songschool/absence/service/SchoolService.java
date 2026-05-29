package br.com.songschool.absence.service;

import br.com.songschool.absence.api.dto.AttendanceDtos.AttendanceResponse;
import br.com.songschool.absence.api.dto.ClassDtos.ClassResponse;
import br.com.songschool.absence.api.dto.ClassDtos.CreateLessonRequest;
import br.com.songschool.absence.api.dto.ClassDtos.LessonResponse;
import br.com.songschool.absence.domain.Attendance;
import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.Lesson;
import br.com.songschool.absence.domain.Role;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.repository.AttendanceRepository;
import br.com.songschool.absence.repository.ClassGroupRepository;
import br.com.songschool.absence.repository.EnrollmentRepository;
import br.com.songschool.absence.repository.LessonRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SchoolService {
  private final ClassGroupRepository classes;
  private final EnrollmentRepository enrollments;
  private final LessonRepository lessons;
  private final AttendanceRepository attendances;

  public SchoolService(
      ClassGroupRepository classes,
      EnrollmentRepository enrollments,
      LessonRepository lessons,
      AttendanceRepository attendances) {
    this.classes = classes;
    this.enrollments = enrollments;
    this.lessons = lessons;
    this.attendances = attendances;
  }

  @Transactional(readOnly = true)
  public List<ClassResponse> listClasses(User user) {
    if (user.getRole() == Role.ADMIN) {
      return classes.findAll().stream().map(ClassResponse::from).toList();
    }
    if (user.getRole() == Role.PROFESSOR) {
      return classes.findByProfessor(user).stream().map(ClassResponse::from).toList();
    }
    return enrollments.findByStudent(user).stream()
        .map(enrollment -> ClassResponse.from(enrollment.getClassGroup()))
        .toList();
  }

  @Transactional
  public LessonResponse createLesson(User user, CreateLessonRequest request) {
    ClassGroup classGroup = classes.findById(request.classGroupId())
        .orElseThrow(() -> new IllegalArgumentException("Turma nao encontrada"));
    if (user.getRole() == Role.PROFESSOR && !classGroup.getProfessor().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Professor nao pertence a esta turma");
    }
    Lesson lesson = lessons.save(new Lesson(
        classGroup,
        request.title(),
        UUID.randomUUID().toString(),
        Instant.now().plusSeconds(20 * 60)));
    return LessonResponse.from(lesson, 0);
  }

  @Transactional(readOnly = true)
  public List<LessonResponse> listLessons(Long classGroupId) {
    ClassGroup classGroup = classes.findById(classGroupId)
        .orElseThrow(() -> new IllegalArgumentException("Turma nao encontrada"));
    return lessons.findTop20ByClassGroupOrderByStartsAtDesc(classGroup).stream()
        .map(lesson -> LessonResponse.from(lesson, attendances.countByLesson(lesson)))
        .toList();
  }

  @Transactional
  public AttendanceResponse checkIn(User student, String qrToken) {
    if (student.getRole() != Role.ALUNO) {
      throw new IllegalArgumentException("Apenas alunos podem fazer check-in");
    }
    Lesson lesson = lessons.findByQrToken(qrToken)
        .orElseThrow(() -> new IllegalArgumentException("QR Code invalido"));
    if (!lesson.isOpen()) {
      throw new IllegalStateException("QR Code expirado");
    }
    if (!enrollments.existsByStudentAndClassGroup(student, lesson.getClassGroup())) {
      throw new IllegalArgumentException("Aluno nao matriculado nesta turma");
    }
    Attendance attendance = attendances.findByLessonAndStudent(lesson, student)
        .orElseGet(() -> attendances.save(new Attendance(lesson, student)));
    return AttendanceResponse.from(attendance);
  }

  @Transactional(readOnly = true)
  public List<AttendanceResponse> history(User student) {
    return attendances.findHistoryByStudent(student).stream()
        .map(AttendanceResponse::from)
        .toList();
  }
}
