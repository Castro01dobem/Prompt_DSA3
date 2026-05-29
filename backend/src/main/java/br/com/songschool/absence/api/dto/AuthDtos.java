package br.com.songschool.absence.api.dto;

import br.com.songschool.absence.domain.Role;
import br.com.songschool.absence.domain.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class AuthDtos {
  private AuthDtos() {
  }

  public record LoginRequest(@Email String email, @NotBlank String password) {
  }

  public record RegisterRequest(
      @NotBlank String name,
      @Email String email,
      @NotBlank String password,
      @NotNull Role role) {
  }

  public record UserResponse(Long id, String name, String email, Role role) {
    public static UserResponse from(User user) {
      return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
  }

  public record LoginResponse(String token, UserResponse user) {
  }
}

