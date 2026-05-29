package br.com.songschool.absence.api;

import br.com.songschool.absence.api.dto.ReportDtos.SummaryResponse;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.service.ReportService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportController {
  private final ReportService reportService;

  public ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping("/summary")
  @PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
  public SummaryResponse summary(@AuthenticationPrincipal User user) {
    return reportService.summary(user);
  }
}

