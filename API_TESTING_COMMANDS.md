# API Testing Commands - Maple ERP Backend

Este documento contém todos os comandos curl para testar a API de funcionários do Maple ERP Backend.

## Pré-requisitos

- Servidor rodando em `http://localhost:4000`
- `jq` instalado para formatação JSON (opcional)

## Comandos de Teste

### 1. Verificar Status do Servidor

```bash
# Verificar se o servidor está rodando
curl -s http://localhost:4000/health
```

### 2. Listar Funcionários

```bash
# Listar todos os funcionários
curl -s http://localhost:4000/employees | jq '.'

# Contar quantos funcionários existem
curl -s http://localhost:4000/employees | jq 'length'

# Verificar quantos campos cada funcionário tem
curl -s http://localhost:4000/employees | jq '.[0] | keys | length'

# Listar todos os campos disponíveis
curl -s http://localhost:4000/employees | jq '.[0] | keys'
```

### 3. Buscar Funcionário por ID

```bash
# Buscar funcionário específico por ID
curl -s http://localhost:4000/employees/1 | jq '.'

# Verificar se funcionário existe
curl -s http://localhost:4000/employees/999 | jq '.'
```

### 4. Buscar Funcionários com Filtros

```bash
# Buscar por nome
curl -s "http://localhost:4000/employees/search?name=João" | jq '.'

# Buscar por cargo
curl -s "http://localhost:4000/employees/search?jobFunction=Professor" | jq '.'

# Buscar por status
curl -s "http://localhost:4000/employees/search?status=Ativo" | jq '.'

# Buscar com paginação
curl -s "http://localhost:4000/employees/search?limit=10&offset=0" | jq '.'

# Buscar com múltiplos filtros
curl -s "http://localhost:4000/employees/search?name=Maria&status=Ativo&limit=5" | jq '.'
```

### 5. Criar Funcionário (POST)

```bash
# Exemplo de criação de funcionário com arquivo
curl -X POST http://localhost:4000/employees \
  -F "fullName=João da Silva" \
  -F "tagName=João" \
  -F "tagLastName=Silva" \
  -F "email=joao@example.com" \
  -F "phone=11999999999" \
  -F "mobile=11888888888" \
  -F "cpf=123.456.789-00" \
  -F "birthday=1990-01-15" \
  -F "jobFunctions=Desenvolvedor" \
  -F "file=@/caminho/para/foto.jpg"

# Exemplo com mais campos
curl -X POST http://localhost:4000/employees \
  -F "fullName=Maria Santos" \
  -F "tagName=Maria" \
  -F "tagLastName=Santos" \
  -F "email=maria@example.com" \
  -F "phone=11999999999" \
  -F "mobile=11888888888" \
  -F "cpf=987.654.321-00" \
  -F "birthday=1985-05-20" \
  -F "jobFunctions=Gerente" \
  -F "cep=01234-567" \
  -F "employeeAddress=Rua das Flores, 123" \
  -F "employeeAddressNumber=123" \
  -F "employeeNeighborhood=Centro" \
  -F "employeeAddressCity=São Paulo" \
  -F "employeeAddressState=SP" \
  -F "nationality=Brasileira" \
  -F "naturalness=São Paulo" \
  -F "fatherName=José Santos" \
  -F "motherName=Ana Santos" \
  -F "gender=FEMININO" \
  -F "maritalStatus=SOLTEIRO" \
  -F "rg=12.345.678-9" \
  -F "rgEmitter=SSP" \
  -F "rgEmissionDate=2010-01-01" \
  -F "salary=5000.00" \
  -F "admissionDate=2024-01-01" \
  -F "status=ACTIVE" \
  -F "file=@/caminho/para/foto.jpg"
```

### 6. Atualizar Funcionário (PUT)

```bash
# Atualizar dados básicos
curl -X PUT http://localhost:4000/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva Updated",
    "email": "joao.updated@example.com",
    "phone": "11999999999",
    "status": "Ativo"
  }' | jq '.'

# Atualizar múltiplos campos
curl -X PUT http://localhost:4000/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva Completo",
    "email": "joao.novo@example.com",
    "jobFunctions": "Senior Developer",
    "salary": 7000.00,
    "employeeAddress": "Nova Rua, 456",
    "employeeAddressCity": "Rio de Janeiro"
  }' | jq '.'
```

### 7. Deletar Funcionário

```bash
# Deletar funcionário por ID
curl -X DELETE http://localhost:4000/employees/1 | jq '.'

# Verificar se foi deletado
curl -s http://localhost:4000/employees/1 | jq '.'
```

### 8. Gerar Crachás (PDF)

```bash
# Gerar crachá individual
curl -X GET http://localhost:4000/employees/1/badge \
  -o "cracha_funcionario_1.pdf"

# Gerar múltiplos crachás
curl -X POST http://localhost:4000/employees/badges \
  -H "Content-Type: application/json" \
  -d '{"employeeIds": [1, 2, 3]}' \
  -o "crachas_multiplos.pdf"
```

### 9. Exportar Dados

```bash
# Exportar em CSV
curl -X GET "http://localhost:4000/employees/export?format=csv" \
  -o "funcionarios.csv"

# Exportar em JSON
curl -X GET "http://localhost:4000/employees/export?format=json" \
  -o "funcionarios.json"

# Exportar apenas funcionários ativos
curl -X GET "http://localhost:4000/employees/export?format=csv&status=Ativo" \
  -o "funcionarios_ativos.csv"
```

### 10. Endpoints de Debug/Teste

```bash
# Verificar estrutura da tabela
curl -s http://localhost:4000/employees/schema | jq '.'

# Verificar total de colunas
curl -s http://localhost:4000/employees/schema | jq '.total_columns'

# Listar nomes das colunas
curl -s http://localhost:4000/employees/schema | jq '.columns[].name'

# Teste de processamento de campos (sem salvar)
curl -X POST http://localhost:4000/employees/test \
  -F "fullName=Teste" \
  -F "email=teste@example.com" \
  -F "file=@/caminho/para/foto.jpg" | jq '.'

# Endpoint de validação de campos
curl -s http://localhost:4000/employees/test-fields | jq '.'
```

### 11. Comandos de Análise

```bash
# Verificar tipos de dados dos campos
curl -s http://localhost:4000/employees/schema | jq '.columns[] | {name: .name, type: .type}'

# Verificar campos obrigatórios vs opcionais
curl -s http://localhost:4000/employees/schema | jq '.columns[] | {name: .name, nullable: .nullable}'

# Verificar valores padrão
curl -s http://localhost:4000/employees/schema | jq '.columns[] | select(.default != null) | {name: .name, default: .default}'

# Contar funcionários por status (se tiver dados)
curl -s http://localhost:4000/employees | jq 'group_by(.status) | map({status: .[0].status, count: length})'
```

## Lista de Campos Disponíveis

Baseado na estrutura atual da tabela, estes são todos os campos disponíveis para criação/atualização:

### Campos Básicos
- `fullName` (obrigatório)
- `tagName` (obrigatório)
- `tagLastName` (obrigatório)
- `companyNumber`
- `companyName`
- `email`
- `birthday`
- `age`

### Endereço
- `cep`
- `employeeAddress`
- `employeeAddressNumber`
- `employeeAddressComplement`
- `employeeNeighborhood`
- `employeeAddressCity`
- `employeeAddressState`

### Contatos
- `phone`
- `mobile`

### Informações Pessoais
- `naturalness`
- `nationality`
- `fatherName`
- `motherName`
- `gender`
- `maritalStatus`
- `graduation`
- `skinColor`

### Benefícios
- `mealValue`
- `deficiency`
- `deficiencyDescription`
- `transport`
- `transportType`
- `transportValue`

### Informações do Cônjuge
- `partnerName`
- `partnerCpf`
- `partnerBirthday`
- `partnerRg`

### Documentos
- `rg`
- `rgEmitter`
- `rgEmissionDate`
- `cpf`
- `pisPasep`
- `voterTitle`
- `voterZone`
- `voterSection`
- `voterEmission`
- `militaryCertificate`
- `ctps`
- `ctpsSerie`

### Carteira de Motorista
- `driversLicense`
- `driversLicenseNumber`
- `driversLicenseEmissionDate`
- `driversLicenseExpirationDate`
- `driversLicenseCategory`

### Plano de Saúde
- `healthPlan`
- `healthCardNumber`

### Informações Acadêmicas
- `collegeCep`
- `traineeAddress`
- `traineeAddressNumber`
- `traineeAddressNeighborhood`
- `traineeAddressComplement`
- `traineeAddressState`
- `traineeAddressCity`
- `college`
- `course`
- `trainingPeriod`
- `lifeInsurancePolicy`
- `ra`

### Informações de Trabalho
- `jobFunctions`
- `admissionDate`
- `periodWork`
- `contractExpirationDate`
- `dailyHours`
- `weeklyHours`
- `monthlyHours`
- `weeklyClasses`
- `hasAccumulate`
- `hasAccumulateCompany`

### Informações Salariais
- `salary`
- `salaryBank`
- `salaryAgency`
- `salaryAccount`
- `salaryAccountType`
- `familySalary`
- `parenting`
- `irpf`

### Status e Controle
- `status`
- `jobPosition`
- `department`
- `userId`

### Campos Automáticos (Somente Leitura)
- `id`
- `photoUrl` (gerado pelo upload)
- `createdAt`
- `updatedAt`

## Notas Importantes

1. **Arquivo obrigatório**: O POST sempre requer um arquivo de foto (`-F "file=@/caminho/para/foto.jpg"`)
2. **Formatos de data**: Use formato `YYYY-MM-DD` (ex: `2024-01-15`)
3. **Valores booleanos**: Use `true`/`false` ou `1`/`0`
4. **Valores numéricos**: Use formato decimal com ponto (ex: `5000.00`)
5. **Campos enum**: Alguns campos têm valores específicos definidos no banco
6. **Validações**: Email, CPF e outros campos têm validações específicas

## Exemplos de Resposta

### Sucesso (201 Created)
```json
{
  "id": 1,
  "full_name": "João da Silva",
  "tag_name": "João",
  "tag_last_name": "Silva",
  "job_functions": "Desenvolvedor",
  "birthday": "1990-01-15",
  "photo_url": "https://res.cloudinary.com/...",
  "email": "joao@example.com",
  "phone": "11999999999",
  "mobile": "11888888888",
  "status": "ACTIVE",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### Erro (400 Bad Request)
```json
{
  "error": "Missing Required Fields",
  "message": "Campos obrigatórios faltando: Nome completo, Nome para crachá e Sobrenome para crachá são obrigatórios."
}
```
