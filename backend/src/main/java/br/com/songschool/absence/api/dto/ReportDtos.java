package br.com.songschool.absence.api.dto;

import java.util.List;

public final class ReportDtos {
  private ReportDtos() {
  }

  public record StudentFrequency(String studentName, long presences, long totalLessons, double percentage) {
  }

  public record ClassSummary(Long classGroupId, String classGroupName, long students, long lessons, List<StudentFrequency> studentsFrequency) {
  }

  public record SummaryResponse(List<ClassSummary> classes) {
  }
}

