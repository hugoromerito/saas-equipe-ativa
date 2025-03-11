# Next.js SaaS + RBAC

This project contain all the necessary boilerplate to setup a multi-tenant SaaS with Next.js including authentication and RBAC authorization.

## Features

### Authentication

- [ ] It should be able to authenticate using e-mail & password;
- [ ] It should be able to authenticate using Google account;
- [ ] It should be able to recover password using e-mail;
- [ ] It should be able to create an account (e-mail, name and password);

### Units

- [ ] It should be able to create a new organization;
- [ ] It should be able to get organizations to which the user belongs;
- [ ] It should be able to update an organization;
- [ ] It should be able to shutdown an organization;
- [ ] It should be able to transfer organization ownership;

### Invites

- [ ] It should be able to invite a new member (e-mail, role);
- [ ] It should be able to accept an invite;
- [ ] It should be able to revoke a pending invite;

### Members

- [ ] It should be able to get organization members;
- [ ] It should be able to update a member role;

### Demands

- [ ] It should be able to get projects within a organization;
- [ ] It should be able to crerate a new project (name, url, description);
- [ ] It should be able to update a project (name, url, description);
- [ ] It should be able to delete a project;

### Billing

- [ ] It should be able to get billing details for organization (R$20 per project / R$10 per member excluding billing role);

### Roles

- Administrator
- Manager
- Clerk
- Analyst
- Applicant
- Billing

### Permissions table

|                    | Administrator | Manager | Clerk | Analyst | Applicant | Billing | Anonymous |
| ------------------ | ------------- | ------- | ----- | ------- | --------- | ------- | --------- |
| Update unit        |
| Delete unit        |
| Invite member      |
| Revoke invite      |
| List members       |
| Transfer ownership |

## Recursos (pt-br)

### Autenticação de membros

- [ ] Deve ser capaz de autenticar usando e-mail e senha;
- [ ] Deve ser capaz de autenticar usando conta do Google;
- [ ] Deve ser capaz de recuperar senha usando e-mail;
- [ ] Deve ser capaz de criar uma conta (e-mail, nome, cpf, título, telefone, endereço e senha);

### Autenticação para solicitantes

- [ ] Deve ser capaz de autenticar usando telefone/whatsapp e código verificador;
- [ ] Deve ser capaz de criar uma conta (nome, cpf, título, telefone, endereço e observações);

### Unidades

- [ ] Deve ser capaz de criar uma nova unidade;
- [ ] Deve ser capaz de atualizar uma unidade;
- [ ] Deve ser capaz de deletar uma unidade;
- [ ] Deve ser capaz de obter unidades às quais o usuário pertence;
- [ ] Deve ser capaz de transferir a propriedade da unidade;

### Convites

- [ ] Deve ser capaz de convidar um novo membro (e-mail, função);
- [ ] Deve ser capaz de aceitar um convite;
- [ ] Deve ser capaz de revogar um convite pendente;

### Membros

- [ ] Deve ser capaz de obter membros da unidade;
- [ ] Deve ser capaz de atualizar a função de um membro;

### Demandas

- [ ] Deve ser capaz de criar uma nova demanda (nome, url, descrição);
- [ ] Deve ser capaz de atualizar uma demanda (nome, url, descrição);
- [ ] Deve ser capaz de deletar uma demanda;
- [ ] Deve ser capaz de obter todas as demandas;
- [ ] Deve ser capaz de obter demandas dentro de uma unidade;
- [ ] Deve ser capaz de obter demandas ;

### Faturamento

- [ ] Deve ser capaz de obter detalhes de faturamento para a unidade (R$20 por projeto / R$10 por membro excluindo função de faturamento);

### Funções

- Administrador
- Gestor
- Assistente
- Analista
- Solicitante
- Faturamento

### Tabela de Permissões

|                           | Administrador | Gerente | Escriturário | Analista | Solicitante | Faturamento | Anônimo |
| ------------------------- | ------------- | ------- | ------------ | -------- | ----------- | ----------- | ------- |
| Criar unidade             | ✅            | ❌      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Atualizar unidade         | ✅            | ❌      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Excluir unidade           | ✅            | ❌      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Visualizar unidades       | ✅            | ⚠️      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Convidar membro           | ✅            | ✅      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Revogar convite           | ✅            | ✅      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Listar membros            | ✅            | ⚠️      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Transferir propriedade    | ✅            | ❌      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Atualizar cargo de membro | ✅            | ❌      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Deletar membro            | ✅            | ⚠️      | ❌           | ❌       | ❌          | ❌          | ❌      |
| Criar demanda             | ✅            | ✅      | ✅           | ❌       | ❌          | ❌          | ❌      |
| Atualizar demandas        | ✅            | ⚠️      | ❌           | ✅       | ❌          | ❌          | ❌      |
| Listar demandas           | ✅            | ⚠️      | ❌           | ✅       | ⚠️          | ❌          | ❌      |
