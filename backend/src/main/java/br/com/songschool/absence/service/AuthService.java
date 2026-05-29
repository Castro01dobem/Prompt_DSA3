package br.com.songschool.absence.service;

import br.com.songschool.absence.api.dto.AuthDtos.LoginRequest;
import br.com.songschool.absence.api.dto.AuthDtos.LoginResponse;
import br.com.songschool.absence.api.dto.AuthDtos.RegisterRequest;
import br.com.songschool.absence.api.dto.AuthDtos.UserResponse;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.repository.UserRepository;
import br.com.songschool.absence.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwtService;

  public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwtService) {
    this.users = users;
    this.encoder = encoder;
    this.jwtService = jwtService;
  }

  public LoginResponse login(LoginRequest request) {
    User user = users.findByEmail(request.email())
        .orElseThrow(() -> new IllegalArgumentException("Email ou senha invalidos"));
    if (!encoder.matches(request.password(), user.getPasswordHash())) {
      throw new IllegalArgumentException("Email ou senha invalidos");
    }
    return new LoginResponse(jwtService.generate(user), UserResponse.from(user));
  }

  public UserResponse register(RegisterRequest request) {
    if (users.existsByEmail(request.email())) {
      throw new IllegalStateException("Email ja cadastrado");
    }
    User user = users.save(new User(
        request.name(),
        request.email(),
        encoder.encode(request.password()),
        request.role()));
    return UserResponse.from(user);
  }
}

