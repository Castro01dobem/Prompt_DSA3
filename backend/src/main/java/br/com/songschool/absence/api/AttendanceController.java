package br.com.songschool.absence.api;

import br.com.songschool.absence.api.dto.AttendanceDtos.AttendanceResponse;
import br.com.songschool.absence.api.dto.AttendanceDtos.CheckInRequest;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.service.SchoolService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {
  private final SchoolService schoolService;

  public AttendanceController(SchoolService schoolService) {
    this.schoolService = schoolService;
  }

  @PostMapping("/check-in")
  @PreAuthorize("hasRole('ALUNO')")
  public AttendanceResponse checkIn(@AuthenticationPrincipal User user, @Valid @RequestBody CheckInRequest request) {
    return schoolService.checkIn(user, request.qrToken());
  }

  @GetMapping("/me")
  @PreAuthorize("hasRole('ALUNO')")
  public List<AttendanceResponse> history(@AuthenticationPrincipal User user) {
    return schoolService.history(user);
  }
}

