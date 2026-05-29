package br.com.songschool.absence.api;

import br.com.songschool.absence.api.dto.AuthDtos.LoginRequest;
import br.com.songschool.absence.api.dto.AuthDtos.LoginResponse;
import br.com.songschool.absence.api.dto.AuthDtos.RegisterRequest;
import br.com.songschool.absence.api.dto.AuthDtos.UserResponse;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @PostMapping("/register")
  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @GetMapping("/me")
  public UserResponse me(@AuthenticationPrincipal User user) {
    return UserResponse.from(user);
  }
}

