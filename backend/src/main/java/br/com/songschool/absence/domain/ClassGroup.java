package br.com.songschool.absence.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class ClassGroup {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  private User professor;

  protected ClassGroup() {
  }

  public ClassGroup(String name, User professor) {
    this.name = name;
    this.professor = professor;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public User getProfessor() {
    return professor;
  }
}

