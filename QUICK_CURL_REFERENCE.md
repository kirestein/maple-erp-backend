# Quick Reference - Comandos CURL Utilizados

## Comandos que utilizei durante nossos testes:

### 1. Verificar funcionários existentes
```bash
curl -s http://localhost:4000/employees | jq 'length'
```

### 2. Ver estrutura da tabela
```bash
curl -s http://localhost:4000/employees/schema | jq '.'
```

### 3. Contar campos por funcionário
```bash
curl -s http://localhost:4000/employees | jq '.[0] | keys | length'
```

### 4. Listar todos os campos disponíveis
```bash
curl -s http://localhost:4000/employees | jq '.[0] | keys'
```

### 5. Endpoint de teste (que estava com problema)
```bash
curl -s http://localhost:4000/employees/test-fields | jq '.'
```

### 6. Ver dados de um funcionário específico
```bash
curl -s http://localhost:4000/employees/1 | jq '.'
```

### 7. Testar servidor básico
```bash
curl -s http://localhost:4000/employees
```

## Estados que testamos:
- ✅ Servidor funcionando: 2 funcionários no banco
- ✅ Tabela tem 90 campos no banco
- ✅ GET retorna 92 campos (incluindo id, createdAt, updatedAt)
- ✅ POST aceita todos os 89 campos necessários
- ✅ Estrutura completa implementada

## Comandos para debug que você pode usar:

### Verificar se servidor está ativo:
```bash
curl -s http://localhost:4000/employees | head -1
```

### Ver total de funcionários:
```bash
curl -s http://localhost:4000/employees | jq 'length'
```

### Ver estrutura da tabela:
```bash
curl -s http://localhost:4000/employees/schema | jq '.total_columns'
```

### Testar um funcionário:
```bash
curl -s http://localhost:4000/employees/1 | jq '.fullName'
```
