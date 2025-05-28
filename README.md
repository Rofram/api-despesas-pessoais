# API de Despesas Pessoais

API RESTful desenvolvida com NestJS, Prisma ORM e PostgreSQL para gerenciamento de despesas pessoais.

## 🚀 Tecnologias Utilizadas

- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript
- Class Validator
- Class Transformer
- Swagger (Documentação)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd api-despesa-pessoais
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações do banco de dados.

4. Inicie os containers Docker (PostgreSQL e Redis):
```bash
npm run start:docker
# ou
yarn start:docker
```

5. Execute as migrações do Prisma:
```bash
npx prisma migrate deploy
```

6. Popule o banco de dados com dados iniciais:
```bash
npm run db:seed
# ou
yarn db:seed
```

7. Inicie o servidor:
```bash
npm run start:dev
# ou
yarn start:dev
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI em:
```
http://localhost:3000/docs
```

## 🛠️ Endpoints

### Despesas (Expenses)

- `GET /expenses` - Lista todas as despesas
  - Query params: `month`, `year`, `category`
- `GET /expenses/:id` - Obtém uma despesa específica
- `POST /expenses` - Cria uma nova despesa
- `PUT /expenses/:id` - Atualiza uma despesa existente
- `DELETE /expenses/:id` - Remove uma despesa

### Modelo de Dados

```typescript
interface Expense {
  id: string;        // UUID
  title: string;     // Título da despesa
  amount: number;    // Valor da despesa
  category: string;  // Categoria
  date: Date;        // Data da despesa
  createdAt: Date;   // Data de criação
  updatedAt: Date;   // Data de atualização
}
```

## 🔐 Autenticação

A API utiliza autenticação JWT. Para acessar os endpoints protegidos, inclua o token no header:

```
Authorization: Bearer seu-token-jwt
```

## 🧪 Testes

Para executar os testes:

```bash
npm run test
# ou
yarn test
```

## 📦 Estrutura do Projeto

```
 src
├──  common
│  ├──  adapters
│  ├──  decorators
│  ├──  entities
│  ├──  errors
│  ├──  filters
│  ├──  guards
│  ├──  interceptors
│  ├──  pipes
│  └──  strategy
├──  configs
├──  constants
├──  database
│  └──  prisma
├──  factories
├──  interfaces
├──  modules
│  ├──  auth
│  ├──  expensive
│  │  ├──  dto
│  │  ├──  entities
│  └──  user
│     ├──  dto
│     ├──  entities
│     ├──  interfaces
│     ├──  repositories
└──  utils
```

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Diferenciais Implementados

- ✅ Autenticação com JWT
- ✅ Documentação com Swagger
- ✅ Cache com Redis
- ✅ Validação de dados com class-validator
- ✅ Tratamento de erros personalizado
- ✅ Filtros por data e categoria
