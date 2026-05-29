# Arquitetura

```text
Aluno no app Expo
  -> login JWT
  -> scanner QR Code
  -> POST /attendance/check-in

Professor no web
  -> login JWT
  -> inicia aula
  -> recebe qrToken
  -> exibe QR Code
  -> acompanha presencas

Admin no web
  -> gerencia usuarios
  -> acompanha relatorios

Spring Boot API
  -> Spring Security + JWT
  -> Regras de aula e presenca
  -> SQL Server
```

## Entidades principais

```text
User
- id
- name
- email
- passwordHash
- role

ClassGroup
- id
- name
- professor

Enrollment
- id
- student
- classGroup

Lesson
- id
- classGroup
- title
- startsAt
- qrToken
- expiresAt
- active

Attendance
- id
- lesson
- student
- checkedInAt
```

## Decisoes para o MVP

- QR Code contem apenas um token opaco, nao dados sensiveis.
- Token expira em 20 minutos.
- O aluno so registra presenca se estiver matriculado na turma.
- Presenca duplicada retorna o registro existente.
- O backend gera dados iniciais para facilitar a demonstracao.

