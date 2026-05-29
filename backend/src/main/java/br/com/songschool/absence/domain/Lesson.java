package br.com.songschool.absence.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.Instant;

@Entity
public class Lesson {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  private ClassGroup classGroup;

  private String title;
  private Instant startsAt;

  @Column(nullable = false, unique = true)
  private String qrToken;

  private Instant expiresAt;
  private boolean active;

  protected Lesson() {
  }

  public Lesson(ClassGroup classGroup, String title, String qrToken, Instant expiresAt) {
    this.classGroup = classGroup;
    this.title = title;
    this.qrToken = qrToken;
    this.startsAt = Instant.now();
    this.expiresAt = expiresAt;
    this.active = true;
  }

  public Long getId() {
    return id;
  }

  public ClassGroup getClassGroup() {
    return classGroup;
  }

  public String getTitle() {
    return title;
  }

  public Instant getStartsAt() {
    return startsAt;
  }

  public String getQrToken() {
    return qrToken;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public boolean isActive() {
    return active;
  }

  public boolean isOpen() {
    return active && Instant.now().isBefore(expiresAt);
  }
}

