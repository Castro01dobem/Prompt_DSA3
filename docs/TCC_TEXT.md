# Texto Tecnico Base

O Absence Manager e um sistema desenvolvido para auxiliar a SongSchool no controle de presenca de alunos em aulas presenciais. A proposta surgiu da necessidade de reduzir o tempo gasto com chamadas manuais e facilitar o acompanhamento da frequencia por professores e administradores.

O sistema foi estruturado em tres partes principais: uma API REST desenvolvida em Spring Boot, um painel web desenvolvido com ReactJS e Vite, e um aplicativo mobile desenvolvido com React Native e Expo. A API centraliza as regras de negocio, autenticacao por JWT, controle de roles e persistencia dos dados em SQL Server.

No fluxo principal, o professor acessa o painel web, seleciona uma turma e inicia uma aula. Nesse momento, o backend gera um token temporario e unico, que e exibido como QR Code no painel. O aluno acessa o aplicativo mobile, realiza login e utiliza a camera do celular para ler o QR Code. Em seguida, o aplicativo envia o token lido para a API, que valida a autenticidade, o prazo de expiracao, a matricula do aluno e registra a presenca.

A escolha do QR Code como mecanismo de registro foi feita por ser uma tecnologia simples, acessivel e compativel com celulares comuns. A utilizacao do Expo facilita os testes durante o desenvolvimento, pois permite executar o aplicativo em dispositivos reais sem necessidade de configuracoes complexas de build nativo.

Como resultado, o MVP entrega as funcionalidades essenciais: autenticacao, geracao de QR Code, leitura pelo aplicativo, registro automatico de presenca e consulta de relatorios. Essa base atende ao objetivo do trabalho e permite futuras evolucoes, como exportacao de relatorios, notificacoes e gerenciamento completo de turmas.

