# Absence Manager - SongSchool

MVP de controle de presenca por QR Code para o TCC da SongSchool.

## Stack

- Backend: Spring Boot + Java + SQL Server + JWT
- Web: React + Vite
- Mobile: React Native + Expo

## Estrutura

```text
backend/   API REST, autenticacao, regras de presenca
web/       painel web para professor e administrador
mobile/    aplicativo Expo para aluno escanear QR Code
docs/      contrato da API, arquitetura e material do TCC
```

## Fluxo principal do MVP

```text
Professor faz login
-> inicia uma aula
-> web exibe QR Code com token
-> aluno faz login no app
-> aluno escaneia o QR Code
-> app envia check-in para a API
-> backend registra presenca
-> professor/admin acompanham relatorios
```

## Usuarios de demonstracao

| Papel | Email | Senha |
| --- | --- | --- |
| ADMIN | admin@songschool.com | 123456 |
| PROFESSOR | prof@songschool.com | 123456 |
| ALUNO | aluno@songschool.com | 123456 |

## Como rodar

### Backend

1. Crie um banco SQL Server chamado `absence_manager`.
2. Ajuste as variaveis se necessario:

```powershell
$env:DB_URL="jdbc:sqlserver://localhost:1433;databaseName=absence_manager;encrypt=true;trustServerCertificate=true"
$env:DB_USER="sa"
$env:DB_PASSWORD="SuaSenha"
$env:JWT_SECRET="troque-esta-chave-em-producao"
```

3. Rode:

```powershell
cd backend
mvn spring-boot:run
```

### Web

```powershell
cd web
npm install
npm run dev
```

### Mobile

```powershell
cd mobile
npm install
npx expo start
```

No celular com Expo Go, informe a URL da API no app. Em Codespaces/Replit, use a URL publica do backend.

## Status do MVP

- Autenticacao JWT com roles
- Cadastro simples de usuarios
- Turmas, aulas e presencas
- Geracao de token para QR Code
- Check-in do aluno
- Dashboard web
- Scanner mobile com Expo Camera
- Documentacao inicial
