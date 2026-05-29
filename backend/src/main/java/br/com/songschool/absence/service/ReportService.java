package br.com.songschool.absence.service;

import br.com.songschool.absence.api.dto.ReportDtos.ClassSummary;
import br.com.songschool.absence.api.dto.ReportDtos.StudentFrequency;
import br.com.songschool.absence.api.dto.ReportDtos.SummaryResponse;
import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.Role;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.repository.AttendanceRepository;
import br.com.songschool.absence.repository.ClassGroupRepository;
import br.com.songschool.absence.repository.EnrollmentRepository;
import br.com.songschool.absence.repository.LessonRepository;
import br.com.songschool.absence.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {
  private final ClassGroupRepository classes;
  private final EnrollmentRepository enrollments;
  private final LessonRepository lessons;
  private final AttendanceRepository attendances;
  private final UserRepository users;

  public ReportService(
      ClassGroupRepository classes,
      EnrollmentRepository enrollments,
      LessonRepository lessons,
      AttendanceRepository attendances,
      UserRepository users) {
    this.classes = classes;
    this.enrollments = enrollments;
    this.lessons = lessons;
    this.attendances = attendances;
    this.users = users;
  }

  @Transactional(readOnly = true)
  public SummaryResponse summary(User user) {
    List<ClassGroup> allowedClasses = user.getRole() == Role.ADMIN
        ? classes.findAll()
        : classes.findByProfessor(user);

    List<User> students = users.findByRole(Role.ALUNO);
    List<ClassSummary> summaries = allowedClasses.stream()
        .map(classGroup -> toClassSummary(classGroup, students))
        .toList();

    return new SummaryResponse(summaries);
  }

  private ClassSummary toClassSummary(ClassGroup classGroup, List<User> students) {
    long totalLessons = lessons.countByClassGroup(classGroup);
    List<StudentFrequency> frequency = students.stream()
        .filter(student -> enrollments.existsByStudentAndClassGroup(student, classGroup))
        .map(student -> {
          long presences = attendances.countByClassGroupAndStudent(classGroup, student);
          double percentage = totalLessons == 0 ? 0 : (presences * 100.0) / totalLessons;
          return new StudentFrequency(student.getName(), presences, totalLessons, percentage);
        })
        .toList();

    return new ClassSummary(
        classGroup.getId(),
        classGroup.getName(),
        enrollments.countByClassGroup(classGroup),
        totalLessons,
        frequency);
  }
}
