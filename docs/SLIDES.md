# Roteiro de Slides

## 1. Titulo

Absence Manager - Sistema de presenca por QR Code para a SongSchool.

## 2. Problema

O controle manual de presenca consome tempo do professor, gera erros e dificulta a consulta de frequencia por aluno e turma.

## 3. Objetivo

Criar um MVP que permita gerar QR Code em aula, registrar presenca pelo celular e consultar relatorios no painel web.

## 4. Publico-alvo

- Professores da SongSchool.
- Alunos com celular.
- Administracao da escola.

## 5. Arquitetura

```text
React Web -> Spring Boot API -> SQL Server
Expo App  -> Spring Boot API -> SQL Server
```

## 6. Tecnologias

- Spring Boot
- SQL Server
- JWT
- ReactJS + Vite
- React Native + Expo

## 7. Fluxo da Demo

1. Professor faz login.
2. Professor gera QR Code.
3. Aluno faz login no app.
4. Aluno escaneia QR Code.
5. Sistema confirma presenca.
6. Professor visualiza relatorio.

## 8. Regras de Negocio

- Apenas professor/admin gera aula.
- Apenas aluno faz check-in.
- QR Code expira em 20 minutos.
- Aluno precisa estar matriculado na turma.
- Presenca duplicada nao cria novo registro.

## 9. Resultados

O MVP entrega o fluxo principal completo e pode ser usado como base para melhorias futuras.

## 10. Melhorias Futuras

- Recuperacao de senha.
- Cadastro completo de turmas pelo painel.
- Exportacao PDF/Excel.
- Notificacoes para alunos ausentes.

