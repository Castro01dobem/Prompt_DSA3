package br.com.songschool.absence.api.dto;

import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.Lesson;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public final class ClassDtos {
  private ClassDtos() {
  }

  public record ClassResponse(Long id, String name, Long professorId, String professorName) {
    public static ClassResponse from(ClassGroup classGroup) {
      return new ClassResponse(
          classGroup.getId(),
          classGroup.getName(),
          classGroup.getProfessor().getId(),
          classGroup.getProfessor().getName());
    }
  }

  public record CreateLessonRequest(@NotNull Long classGroupId, @NotBlank String title) {
  }

  public record LessonResponse(
      Long id,
      Long classGroupId,
      String classGroupName,
      String title,
      Instant startsAt,
      Instant expiresAt,
      String qrToken,
      boolean active,
      long attendanceCount) {
    public static LessonResponse from(Lesson lesson, long attendanceCount) {
      return new LessonResponse(
          lesson.getId(),
          lesson.getClassGroup().getId(),
          lesson.getClassGroup().getName(),
          lesson.getTitle(),
          lesson.getStartsAt(),
          lesson.getExpiresAt(),
          lesson.getQrToken(),
          lesson.isOpen(),
          attendanceCount);
    }
  }
}

