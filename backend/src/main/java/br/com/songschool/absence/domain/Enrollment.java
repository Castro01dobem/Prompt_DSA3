package br.com.songschool.absence.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Enrollment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  private User student;

  @ManyToOne(fetch = FetchType.LAZY)
  private ClassGroup classGroup;

  protected Enrollment() {
  }

  public Enrollment(User student, ClassGroup classGroup) {
    this.student = student;
    this.classGroup = classGroup;
  }

  public Long getId() {
    return id;
  }

  public User getStudent() {
    return student;
  }

  public ClassGroup getClassGroup() {
    return classGroup;
  }
}

