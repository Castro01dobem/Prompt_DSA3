# Contrato da API

Base local: `http://localhost:8080/api`

## Autenticacao

### POST `/auth/login`

```json
{
  "email": "prof@songschool.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "token": "jwt",
  "user": {
    "id": 2,
    "name": "Professor Demo",
    "email": "prof@songschool.com",
    "role": "PROFESSOR"
  }
}
```

### POST `/auth/register`

Apenas ADMIN.

```json
{
  "name": "Novo Aluno",
  "email": "novo@songschool.com",
  "password": "123456",
  "role": "ALUNO"
}
```

## Aulas e QR Code

### GET `/classes`

Lista turmas do usuario autenticado.

### POST `/lessons`

PROFESSOR ou ADMIN.

```json
{
  "classGroupId": 1,
  "title": "Aula de violao"
}
```

Resposta contem `qrToken`, que deve virar QR Code na web.

### POST `/attendance/check-in`

ALUNO.

```json
{
  "qrToken": "token-lido-no-qr-code"
}
```

## Relatorios

### GET `/reports/summary`

PROFESSOR ou ADMIN.

Retorna totais por turma e frequencia por aluno.

