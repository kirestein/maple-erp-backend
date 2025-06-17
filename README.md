# Maple ERP Backend

Sistema de ERP para Maple Bear - Backend API desenvolvido com Fastify.

## 🚀 Funcionalidades

- ✅ Cadastro de funcionários com upload de foto
- ✅ Integração com Cloudinary para armazenamento de imagens
- ✅ Banco de dados PostgreSQL (Neon)
- ✅ Validações robustas de entrada
- ✅ CORS configurado adequadamente
- ✅ Health check com verificação de serviços
- ✅ Logs detalhados para debugging
- ✅ CI/CD com GitHub Actions

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL (ou conta no Neon)
- Conta no Cloudinary
- Git

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/kirestein/maple-erp-backend.git
cd maple-erp-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=4000
NODE_ENV=development
HOST=0.0.0.0

# Frontend (para CORS em produção)
FRONTEND_URL=https://your-frontend-domain.com
```

4. Execute o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 API Endpoints

### Health Check
```http
GET /health-check
```

Retorna o status dos serviços (banco de dados, Cloudinary, etc.).

### Funcionários

#### Criar funcionário
```http
POST /employees
Content-Type: multipart/form-data

fullName: string (obrigatório, 2-100 caracteres)
jobFunctions: string (obrigatório, 2-100 caracteres)  
birthday: string (opcional, formato YYYY-MM-DD)
file: arquivo (obrigatório, JPG/PNG, máximo 5MB)
```

**Resposta de sucesso (201):**
```json
{
  "id": 1,
  "full_name": "João Silva",
  "job_functions": "Desenvolvedor",
  "birthday": "1990-01-15",
  "photo_url": "https://res.cloudinary.com/...",
  "created_at": "2025-06-06T21:06:59.234Z"
}
```

## 🔧 Configuração CORS

O CORS está configurado para permitir:

**Desenvolvimento:**
- `http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`
- `http://127.0.0.1:3000`, `http://127.0.0.1:3001`, `http://127.0.0.1:5173`
- Qualquer origem (para testes)

**Produção:**
- Apenas o domínio configurado em `FRONTEND_URL`

**Métodos permitidos:** GET, POST, PUT, DELETE, OPTIONS  
**Headers permitidos:** Content-Type, Authorization, X-Requested-With  
**Credentials:** Habilitado

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar linter
npm run lint
```

## 📦 Deploy

### Render (Recomendado)

1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente no painel do Render
3. O deploy será automático a cada push na branch `main`

### Outras plataformas

O projeto inclui configuração para:
- Railway (`railway.json`)
- Render (`render.yaml`)
- Docker (Dockerfile)

## 🔍 Debugging

Os logs são detalhados e incluem:
- Requisições recebidas
- Processamento de multipart/form-data
- Uploads para Cloudinary
- Operações no banco de dados
- Erros com stack trace

Para visualizar logs em tempo real:
```bash
npm run dev
```

## 🛡️ Segurança

- Validação rigorosa de entrada
- Sanitização de dados
- Limitação de tamanho de arquivo (5MB)
- Validação de tipos de arquivo (apenas JPG/PNG)
- CORS configurado adequadamente
- Headers de segurança

## 🤝 Contribuição

1. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
2. Faça commit das mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

### Convenção de Commits

Este projeto segue a [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` alterações na documentação
- `style:` formatação, sem alteração de código
- `refactor:` refatoração de código
- `test:` adição ou correção de testes
- `chore:` atualizações de build, configurações, etc

## 📄 Licença

Este projeto está sob a licença ISC.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Consulte a documentação da API
3. Abra uma issue no GitHub

