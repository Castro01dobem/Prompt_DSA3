# Roteiro de Demonstracao

## Preparacao

1. Rodar o backend.
2. Rodar o painel web.
3. Abrir o app no Expo Go.
4. Confirmar que o app aponta para a URL publica/local da API.

## Passo a passo

1. Entrar no web como professor:
   - email: `prof@songschool.com`
   - senha: `123456`
2. Selecionar a turma `Violao - Turma A`.
3. Clicar em `Gerar QR Code`.
4. Entrar no app como aluno:
   - email: `aluno@songschool.com`
   - senha: `123456`
5. Tocar em `Ler QR Code`.
6. Escanear o QR Code exibido no web.
7. Conferir a mensagem de presenca confirmada.
8. Atualizar o relatorio no web.

## O que explicar na apresentacao

- O QR Code nao guarda dados pessoais, apenas um token temporario.
- O backend valida se o aluno esta matriculado na turma.
- O JWT identifica o usuario e sua role.
- O sistema evita presenca duplicada para a mesma aula.

