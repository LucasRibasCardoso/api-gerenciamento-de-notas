# Sistema de Gerenciamento de Notas

Sistema completo de gerenciamento de notas de estudantes com **Frontend** e **Backend** separados, desenvolvido com Node.js, Express, MongoDB, Handlebars e boas práticas de Clean Code e SOLID.

## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Yup** - Validação de schemas
- **Docker** - Containerização
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Handlebars** - Template engine
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação e Execução

### Método Rápido (Recomendado) ⚡

Execute toda a aplicação com um único comando:

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd api-gerenciamento-de-notas

# 2. Inicie tudo com um comando
./start.sh
```

Para parar a aplicação:
```bash
./stop.sh
```

### Método Manual

#### Passo 1: Iniciar o Backend (API + MongoDB) 🐳

```bash
cd backend
docker-compose up -d
```

✨ A API estará disponível em `http://localhost:3000`

#### Passo 2: Iniciar o Frontend 🌐

```bash
cd fronted
npm install
node index.js
```

✨ O Frontend estará disponível em `http://localhost:4000`

## 🌐 Acessando a Aplicação

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:4000 | Interface web para usuários |
| Backend API | http://localhost:3000/api | API REST |
| Health Check | http://localhost:3000/health | Status da API e banco |

## 📁 Estrutura do Projeto

```
api-gerenciamento-de-notas/
├── backend/                         # API REST
│   ├── src/
│   │   ├── DAO/
│   │   │   └── EstudanteDAO.js      # Data Access Object
│   │   ├── database/
│   │   │   └── connection.js        # Gerenciamento de conexão
│   │   ├── models/
│   │   │   ├── Estudante.js         # Schema Mongoose
│   │   │   └── validations/
│   │   │       └── estudanteValidation.js
│   │   └── routes/
│   │       └── routes.js            # Rotas da API
│   ├── docker-compose.yml           # Docker (API + MongoDB)
│   ├── Dockerfile
│   ├── index.js                     # Entrada da API
│   └── package.json
│
├── fronted/                         # Interface Web
│   ├── public/
│   │   ├── css/                     # Estilos
│   │   └── icons/                   # Ícones
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars      # Layout principal
│   │   ├── index.handlebars         # Página inicial
│   │   ├── cadastro.handlebars      # Cadastrar estudante
│   │   ├── listagem.handlebars      # Listar estudantes
│   │   └── editar.handlebars        # Editar estudante
│   ├── .env                         # Configurações
│   ├── index.js                     # Entrada do frontend
│   └── package.json
│
└── README.md
```

## ⚙️ Configuração

### Variáveis de Ambiente - Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/gerenciamento_notas?authSource=admin
```

### Variáveis de Ambiente - Frontend (`fronted/.env`)
```env
BACKEND_URL=http://localhost:3000
PORT=4000
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

## 🐳 Comandos Docker

```bash
# Iniciar backend (API + MongoDB)
cd backend
docker-compose up -d

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

# Verificar status dos containers
docker-compose ps
```

### Acessar MongoDB via terminal
```bash
docker exec -it gerenciamento-notas-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
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

## 🔒 Validações com Yup

O projeto utiliza Yup para validações robustas:

- **Nome**: string, obrigatório, 3-100 caracteres, apenas letras
- **Notas**: número, obrigatório, 0-10, máximo 1 casa decimal
- Validações customizadas para regras de negócio
- Mensagens de erro personalizadas

## 📝 Notas Técnicas

### Arquitetura
- **Backend** (porta 3000): API REST com MongoDB
- **Frontend** (porta 4000): Interface web que consome a API via fetch
- Comunicação via HTTP/JSON
- CORS habilitado para permitir requisições cross-origin

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
