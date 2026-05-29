package br.com.songschool.absence.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"lesson_id", "student_id"}))
public class Attendance {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  private Lesson lesson;

  @ManyToOne(fetch = FetchType.LAZY)
  private User student;

  private Instant checkedInAt;

  protected Attendance() {
  }

  public Attendance(Lesson lesson, User student) {
    this.lesson = lesson;
    this.student = student;
    this.checkedInAt = Instant.now();
  }

  public Long getId() {
    return id;
  }

  public Lesson getLesson() {
    return lesson;
  }

  public User getStudent() {
    return student;
  }

  public Instant getCheckedInAt() {
    return checkedInAt;
  }
}

