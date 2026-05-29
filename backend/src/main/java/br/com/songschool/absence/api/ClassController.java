package br.com.songschool.absence.api;

import br.com.songschool.absence.api.dto.ClassDtos.ClassResponse;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.service.SchoolService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/classes")
public class ClassController {
  private final SchoolService schoolService;

  public ClassController(SchoolService schoolService) {
    this.schoolService = schoolService;
  }

  @GetMapping
  public List<ClassResponse> list(@AuthenticationPrincipal User user) {
    return schoolService.listClasses(user);
  }
}

