# 🔒 Melhorias de Segurança e Boas Práticas

## ⚠️ Problemas Críticos Identificados

### 1. **CRÍTICO: Credenciais Expostas no Repositório**
O arquivo `.env` está commitado no repositório, expondo:
- Credenciais do Cloudinary
- String de conexão do banco de dados
- Chaves de API

**Ação Imediata Necessária:**
```bash
# 1. Remover o arquivo .env do repositório
git rm .env
git commit -m "Remove exposed credentials"

# 2. Adicionar .env ao .gitignore (se ainda não estiver)
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"

# 3. Regenerar todas as credenciais expostas
# - Cloudinary: Regenerar API keys
# - Banco de dados: Alterar senha se possível
```

### 2. **ALTO: CORS Muito Permissivo em Desenvolvimento**
Atualmente permite qualquer origem em desenvolvimento.

**Solução:**
```javascript
// Em server.js, substituir:
if (process.env.NODE_ENV !== 'production') {
  return callback(null, true);
}

// Por:
if (process.env.NODE_ENV !== 'production') {
  const devOrigins = [
    'http://localhost:3000',
    'http://localhost:4200', // Angular dev server
    'http://localhost:5173'  // Vite
  ];
  if (devOrigins.includes(origin)) {
    return callback(null, true);
  }
}
```

### 3. **MÉDIO: Validação de Tamanho de Arquivo Redundante**
A validação de tamanho ocorre após carregar o arquivo na memória.

**Solução:**
```javascript
// Remover validação manual em employees.js (linhas 317-321)
// O @fastify/multipart já limita o tamanho
```

## 🛡️ Melhorias de Segurança Recomendadas

### 1. **Implementar Rate Limiting**
```bash
npm install @fastify/rate-limit
```

```javascript
// Em server.js
await fastify.register(require('@fastify/rate-limit'), {
  max: 100, // máximo 100 requests
  timeWindow: '1 minute' // por minuto
});
```

### 2. **Adicionar Helmet para Headers de Segurança**
```bash
npm install @fastify/helmet
```

```javascript
// Em server.js
await fastify.register(require('@fastify/helmet'), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"]
    }
  }
});
```

### 3. **Implementar Autenticação JWT**
```bash
npm install @fastify/jwt bcryptjs
```

```javascript
// Exemplo de middleware de autenticação
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET
});

fastify.addHook('preHandler', async (request, reply) => {
  // Verificar JWT em rotas protegidas
  if (request.url.startsWith('/employees') && request.method !== 'GET') {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
});
```

### 4. **Sanitização de Dados de Entrada**
```bash
npm install validator
```

```javascript
const validator = require('validator');

// Sanitizar dados antes de salvar
const sanitizedData = {
  fullName: validator.escape(fullName.trim()),
  jobFunctions: validator.escape(jobFunctions.trim()),
  email: validator.normalizeEmail(email)
};
```

### 5. **Logging de Segurança**
```javascript
// Adicionar logs de segurança
fastify.addHook('preHandler', async (request, reply) => {
  // Log tentativas de acesso suspeitas
  if (request.headers['user-agent']?.includes('bot')) {
    request.log.warn('Bot access attempt', {
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
  }
});
```

### 6. **Validação de Tipos MIME**
```javascript
// Em employees.js, melhorar validação de arquivo
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
const detectedMimeType = await import('file-type').then(ft => 
  ft.fileTypeFromBuffer(fileBuffer)
);

if (!detectedMimeType || !allowedMimeTypes.includes(detectedMimeType.mime)) {
  throw new Error('Tipo de arquivo não permitido');
}
```

## 🔧 Melhorias de Performance

### 1. **Implementar Cache Redis**
```bash
npm install @fastify/redis
```

```javascript
// Cache para consultas frequentes
fastify.register(require('@fastify/redis'), {
  host: process.env.REDIS_HOST || 'localhost'
});

// Exemplo de uso
const cachedEmployees = await fastify.redis.get('employees:all');
if (cachedEmployees) {
  return JSON.parse(cachedEmployees);
}
```

### 2. **Compressão de Respostas**
```bash
npm install @fastify/compress
```

```javascript
await fastify.register(require('@fastify/compress'), {
  global: true
});
```

### 3. **Otimização de Queries SQL**
```sql
-- Adicionar índices para melhor performance
CREATE INDEX idx_employees_full_name ON employees(full_name);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_job_functions ON employees(job_functions);
```

## 📊 Monitoramento e Observabilidade

### 1. **Métricas com Prometheus**
```bash
npm install prom-client
```

```javascript
const promClient = require('prom-client');

// Métricas customizadas
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});
```

### 2. **Health Checks Avançados**
```javascript
// Melhorar health check
fastify.get('/health-check', async (request, reply) => {
  const checks = {
    database: await checkDatabase(),
    cloudinary: await checkCloudinary(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };
  
  const isHealthy = checks.database && checks.cloudinary;
  reply.code(isHealthy ? 200 : 503).send(checks);
});
```

## 🧪 Testes e Qualidade

### 1. **Implementar Testes Automatizados**
```bash
npm install --save-dev jest supertest
```

```javascript
// tests/employees.test.js
const { build } = require('../app');

describe('Employee Routes', () => {
  let app;

  beforeAll(async () => {
    app = build({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /employees should return employees list', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/employees'
    });
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.json())).toBe(true);
  });
});
```

### 2. **Linting e Formatação**
```bash
npm install --save-dev prettier eslint-config-prettier
```

```json
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error'
  }
};
```

## 🚀 Deploy e Infraestrutura

### 1. **Variáveis de Ambiente Seguras**
```bash
# .env.example atualizado
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
JWT_SECRET=your-super-secret-jwt-key
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# External Services
REDIS_URL=redis://localhost:6379
FRONTEND_URL=https://your-frontend.com
```

### 2. **Docker para Desenvolvimento**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

USER node

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: maple_erp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

## 📋 Checklist de Implementação

### Prioridade Alta (Implementar Imediatamente)
- [ ] Remover credenciais do repositório
- [ ] Regenerar todas as chaves expostas
- [ ] Implementar rate limiting básico
- [ ] Adicionar headers de segurança com Helmet
- [ ] Restringir CORS em desenvolvimento

### Prioridade Média (Próximas 2 semanas)
- [ ] Implementar autenticação JWT
- [ ] Adicionar sanitização de dados
- [ ] Implementar testes automatizados
- [ ] Adicionar compressão de respostas
- [ ] Melhorar validação de arquivos

### Prioridade Baixa (Próximo mês)
- [ ] Implementar cache Redis
- [ ] Adicionar métricas Prometheus
- [ ] Configurar Docker
- [ ] Otimizar queries SQL
- [ ] Implementar logging avançado

## 🔍 Auditoria de Segurança

Execute regularmente:
```bash
# Verificar vulnerabilidades
npm audit

# Atualizar dependências
npm update

# Verificar código com ESLint
npm run lint

# Executar testes
npm test
```

## 📞 Contatos de Emergência

Em caso de incidente de segurança:
1. Revogar imediatamente todas as credenciais expostas
2. Verificar logs de acesso suspeito
3. Notificar a equipe de desenvolvimento
4. Documentar o incidente para análise posterior