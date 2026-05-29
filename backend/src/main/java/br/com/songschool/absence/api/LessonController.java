package br.com.songschool.absence.api;

import br.com.songschool.absence.api.dto.ClassDtos.CreateLessonRequest;
import br.com.songschool.absence.api.dto.ClassDtos.LessonResponse;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.service.SchoolService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lessons")
public class LessonController {
  private final SchoolService schoolService;

  public LessonController(SchoolService schoolService) {
    this.schoolService = schoolService;
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
  public LessonResponse create(@AuthenticationPrincipal User user, @Valid @RequestBody CreateLessonRequest request) {
    return schoolService.createLesson(user, request);
  }

  @GetMapping("/class/{classGroupId}")
  @PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
  public List<LessonResponse> byClass(@PathVariable Long classGroupId) {
    return schoolService.listLessons(classGroupId);
  }
}

