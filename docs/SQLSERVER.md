# SQL Server

## Banco recomendado para desenvolvimento

```sql
CREATE DATABASE absence_manager;
GO
```

## Variaveis do backend

```powershell
$env:DB_URL="jdbc:sqlserver://localhost:1433;databaseName=absence_manager;encrypt=true;trustServerCertificate=true"
$env:DB_USER="sa"
$env:DB_PASSWORD="SuaSenha"
$env:JWT_SECRET="troque-esta-chave-em-producao-songschool"
```

O projeto usa `spring.jpa.hibernate.ddl-auto=update` para o MVP. Isso cria/atualiza as tabelas automaticamente na primeira execucao.

Para entrega final, uma melhoria simples e segura e trocar para migrations com Flyway, mas isso pode ficar fora do MVP se o prazo apertar.

