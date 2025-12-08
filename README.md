# API de Gerenciamento de Notas

Sistema de gerenciamento de notas de estudantes desenvolvido com Node.js, Express, MongoDB e boas práticas de Clean Code e SOLID.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Yup** - Validação de schemas
- **Docker** - Containerização
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação

### Método 1: Com Docker Compose (Recomendado) 🐳

Este é o método mais simples - toda a aplicação (API + MongoDB) será executada em containers Docker.

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd api-gerenciamento-de-notas

# 2. Inicie toda a aplicação com um único comando
docker-compose up -d

# 3. Verifique se está rodando
docker-compose ps
```

✨ **Pronto!** A API estará disponível em `http://localhost:3000`

**Comandos úteis:**
```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs apenas da API
docker-compose logs -f api

# Ver logs apenas do MongoDB
docker-compose logs -f mongodb

# Parar toda a aplicação
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v

# Reconstruir após mudanças no código
docker-compose up -d --build

# Reiniciar apenas a API
docker-compose restart api
```
## 📚 Endpoints da API

### Status da API
```http
GET /api
```
Retorna informações sobre a API e seus endpoints disponíveis.

### Health Check
```http
GET /health
```
Verifica o status da aplicação e da conexão com o banco de dados.

### Listar todos os estudantes
```http
GET /api/notas
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "total": 2,
  "data": [
    {
      "nome": "João Silva",
      "nota1": 8.5,
      "nota2": 9.0,
      "nota3": 7.5,
      "media": 8.3
    }
  ]
}
```

### Inserir novo estudante
```http
POST /api/notas/inserir
```

**Body:**
```json
{
  "nome": "Maria Santos",
  "nota1": 9.5,
  "nota2": 8.0,
  "nota3": 9.0
}
```

**Validações:**
- Nome: obrigatório, 3-100 caracteres, apenas letras
- Notas: obrigatórias, números entre 0 e 10, máximo 1 casa decimal

### Atualizar estudante
```http
PUT /api/editar/:nome
```

**Body:**
```json
{
  "nota1": 9.0,
  "nota2": 8.5,
  "nota3": 9.5
}
```

### Buscar estudante por nome
```http
GET /api/notas/:nome
```

### Excluir estudante
```http
DELETE /api/excluir/:nome
```

## 🏗️ Estrutura do Projeto

```
api-gerenciamento-de-notas/
├── src/
│   ├── DAO/
│   │   └── EstudanteDAO.js          # Data Access Object
│   ├── database/
│   │   └── connection.js            # Gerenciamento de conexão
│   ├── models/
│   │   ├── Estudante.js             # Schema Mongoose
│   │   └── validations/
│   │       └── estudanteValidation.js  # Schemas Yup
│   └── routes/
│       └── routes.js                # Rotas da API
├── public/                          # Arquivos estáticos
├── views/                           # Views (se aplicável)
├── .env                             # Variáveis de ambiente
├── .env.example                     # Exemplo de configuração
├── docker-compose.yml               # Configuração Docker
├── index.js                         # Entrada da aplicação
└── package.json                     # Dependências
```

## 🎯 Princípios Aplicados

### Clean Code
- Nomes descritivos e significativos
- Funções pequenas e com responsabilidade única
- Comentários apenas quando necessário
- Código autoexplicativo

### SOLID

**Single Responsibility Principle (SRP)**
- Cada classe/módulo tem uma única responsabilidade
- EstudanteDAO: apenas operações de banco de dados
- Validações isoladas em arquivo separado

**Open/Closed Principle (OCP)**
- Código aberto para extensão, fechado para modificação
- Schemas de validação extensíveis

**Dependency Inversion Principle (DIP)**
- Dependência de abstrações (Mongoose models, Yup schemas)
- Não depende de implementações concretas

## 🐳 Docker

### Comandos úteis

```bash
# Iniciar MongoDB
docker-compose up -d

# Ver logs do MongoDB
docker-compose logs -f mongodb

# Parar MongoDB
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v

# Verificar status dos containers
docker-compose ps
```

### Acessar MongoDB via terminal

```bash
docker exec -it gerenciamento-notas-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

## 🔒 Validações com Yup

O projeto utiliza Yup para validações robustas:

- **Nome**: string, obrigatório, 3-100 caracteres, apenas letras
- **Notas**: número, obrigatório, 0-10, máximo 1 casa decimal
- Validações customizadas para regras de negócio
- Mensagens de erro personalizadas

## 📝 Notas Técnicas

### Cálculo da Média
A média é calculada automaticamente antes de salvar/atualizar:
```javascript
media = (nota1 + nota2 + nota3) / 3
```
Sempre arredondada para 1 casa decimal (ex: 8.3, 9.0, 7.5)

### Conexão Automática
O sistema gerencia automaticamente a conexão com MongoDB:
- Reconexão automática em caso de falha
- Health checks
- Desconexão graciosa ao encerrar

## ✨ Autores

Desenvolvido para o projeto de Gerenciamento de Notas.
