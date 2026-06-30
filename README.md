# Absence Manager

Sistema de controle de presenca por QR Code para a escola ficticia SongSchool.

O projeto e um MVP de TCC do curso Tecnico em Informatica. A solucao possui API REST em Spring Boot, painel web em React/Vite e aplicativo mobile em React Native/Expo.

## Estrutura

```text
backend/  API Spring Boot com JWT, JPA/Hibernate e SQL Server
web/      Painel web React/Vite para ADMIN e PROFESSOR
mobile/   App Expo para ALUNO escanear QR Code
docs/     Documentacao tecnica, API, demo, slides e texto base do TCC
```

## Fluxo principal

```text
Admin gerencia usuarios e turmas
Professor inicia aula no painel web
Backend gera qrToken temporario
Web exibe QR Code
Aluno escaneia no app Expo
Backend valida JWT, matricula, expiracao e registra presenca
Dashboards e relatorios exibem frequencia
```

## Usuarios de demonstracao

Os dados iniciais sao criados pelo `DataSeeder` quando o banco ainda nao possui `admin@songschool.com`.

```text
ADMIN      admin@songschool.com  / 123456
PROFESSOR  prof@songschool.com   / 123456
ALUNO      aluno@songschool.com  / 123456
```

## Backend

```powershell
cd backend
mvn spring-boot:run
```

Base local da API:

```text
http://localhost:8080/api
```

O backend usa SQL Server em `application.properties`:

```text
jdbc:sqlserver://localhost:1433;databaseName=AbsenceManager;encrypt=true;trustServerCertificate=true
```

## Web

```powershell
cd web
npm install
npm run dev
```

Painel local:

```text
http://localhost:5173
```

## Mobile

```powershell
cd mobile
npm install
npm run start
```

No celular, ajuste a URL da API na tela de login se o backend nao estiver acessivel como `localhost`.

## Documentacao

- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/SQLSERVER.md`
- `docs/DEMO.md`
- `docs/SPRINTS.md`
- `docs/SLIDES.md`
- `docs/TCC_TEXT.md`
