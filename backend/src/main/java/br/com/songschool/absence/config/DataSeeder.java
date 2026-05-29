package br.com.songschool.absence.config;

import br.com.songschool.absence.domain.ClassGroup;
import br.com.songschool.absence.domain.Enrollment;
import br.com.songschool.absence.domain.Role;
import br.com.songschool.absence.domain.User;
import br.com.songschool.absence.repository.ClassGroupRepository;
import br.com.songschool.absence.repository.EnrollmentRepository;
import br.com.songschool.absence.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
  @Bean
  CommandLineRunner seed(
      UserRepository users,
      ClassGroupRepository classes,
      EnrollmentRepository enrollments,
      PasswordEncoder encoder) {
    return args -> {
      if (users.existsByEmail("admin@songschool.com")) {
        return;
      }

      User admin = users.save(new User("Admin Demo", "admin@songschool.com", encoder.encode("123456"), Role.ADMIN));
      User professor = users.save(new User("Professor Demo", "prof@songschool.com", encoder.encode("123456"), Role.PROFESSOR));
      User student = users.save(new User("Aluno Demo", "aluno@songschool.com", encoder.encode("123456"), Role.ALUNO));

      ClassGroup guitar = classes.save(new ClassGroup("Violao - Turma A", professor));
      enrollments.save(new Enrollment(student, guitar));
    };
  }
}

