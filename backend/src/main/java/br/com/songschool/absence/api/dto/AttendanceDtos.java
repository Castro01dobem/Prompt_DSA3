package br.com.songschool.absence.api.dto;

import br.com.songschool.absence.domain.Attendance;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public final class AttendanceDtos {
  private AttendanceDtos() {
  }

  public record CheckInRequest(@NotBlank String qrToken) {
  }

  public record AttendanceResponse(
      Long id,
      String studentName,
      String classGroupName,
      String lessonTitle,
      Instant checkedInAt) {
    public static AttendanceResponse from(Attendance attendance) {
      return new AttendanceResponse(
          attendance.getId(),
          attendance.getStudent().getName(),
          attendance.getLesson().getClassGroup().getName(),
          attendance.getLesson().getTitle(),
          attendance.getCheckedInAt());
    }
  }
}

