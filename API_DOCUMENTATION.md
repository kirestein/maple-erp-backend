# 📚 Maple ERP Backend - Documentação da API

## 🌐 Base URL
- **Desenvolvimento**: `http://localhost:4000`
- **Produção**: `https://maple-erp-backend.onrender.com` (ou sua URL de produção)

## 🔐 Autenticação
Atualmente a API não possui autenticação implementada. Todos os endpoints são públicos.

## 📋 Headers Obrigatórios
```http
Content-Type: application/json (para requests JSON)
Content-Type: multipart/form-data (para upload de arquivos)
```

## 🚀 Endpoints Disponíveis

### 1. Health Check
Verifica o status da API e serviços conectados.

```http
GET /health-check
```

**Resposta de Sucesso (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "version": "1.0.0",
  "database": "connected",
  "cloudinary": "configured"
}
```

**Resposta de Erro (503):**
```json
{
  "status": "degraded",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "version": "1.0.0",
  "database": "error",
  "cloudinary": "error"
}
```

---

### 2. Listar Funcionários
Retorna todos os funcionários cadastrados.

```http
GET /employees
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "companyNumber": 1001,
    "companyName": "Maple Bear",
    "fullName": "João Silva",
    "email": "joao.silva@maplebear.com",
    "tagName": "João",
    "tagLastName": "Silva",
    "birthday": "1990-01-15",
    "age": "33",
    "cep": "01234-567",
    "employeeAddress": "Rua das Flores, 123",
    "employeeAddressNumber": "123",
    "employeeAddressComplement": "Apto 45",
    "employeeNeighborhood": "Centro",
    "employeeAddressCity": "São Paulo",
    "employeeAddressState": "SP",
    "phone": "(11) 1234-5678",
    "mobile": "(11) 98765-4321",
    "naturalness": "São Paulo",
    "nationality": "Brasileira",
    "fatherName": "José Silva",
    "motherName": "Maria Silva",
    "mealValue": 15.50,
    "deficiency": false,
    "deficiencyDescription": null,
    "transport": true,
    "transportType": "Ônibus",
    "transportValue": 8.50,
    "partnerName": "Ana Silva",
    "partnerCpf": "123.456.789-00",
    "partnerBirthday": "1992-03-20",
    "partnerRg": "12.345.678-9",
    "photoUrl": "https://res.cloudinary.com/dp3uq8qv2/image/upload/v1234567890/maple-employees/employee_1234567890.jpg",
    "gender": "Masculino",
    "maritalStatus": "Casado",
    "graduation": "Superior Completo",
    "skinColor": "Branco",
    "rg": "12.345.678-9",
    "rgEmitter": "SSP-SP",
    "rgEmissionDate": "2010-01-15",
    "cpf": "123.456.789-00",
    "pisPasep": "123.45678.90-1",
    "voterTitle": "1234567890",
    "voterZone": "001",
    "voterSection": "0001",
    "voterEmission": "2008-01-15",
    "militaryCertificate": "123456789",
    "ctps": "12345678901",
    "ctpsSerie": "001",
    "driversLicense": true,
    "driversLicenseNumber": "12345678901",
    "driversLicenseEmissionDate": "2015-01-15",
    "driversLicenseExpirationDate": "2025-01-15",
    "driversLicenseCategory": "B",
    "healthPlan": "Unimed",
    "healthCardNumber": "123456789012345",
    "collegeCep": "01234-567",
    "traineeAddress": "Rua da Faculdade, 456",
    "traineeAddressNumber": 456,
    "traineeAddressNeighborhood": "Universitário",
    "traineeAddressComplement": "Bloco A",
    "traineeAddressState": "SP",
    "traineeAddressCity": "São Paulo",
    "college": "USP",
    "course": "Pedagogia",
    "trainingPeriod": "Noturno",
    "lifeInsurancePolicy": "123456789",
    "ra": "2020123456",
    "jobFunctions": "Professor",
    "admissionDate": "2023-01-15",
    "periodWork": "Integral",
    "contractExpirationDate": "2024-12-31",
    "dailyHours": "8",
    "weeklyHours": "40",
    "monthlyHours": "160",
    "weeklyClasses": "20",
    "hasAccumulate": false,
    "hasAccumulateCompany": null,
    "salary": 5000.00,
    "salaryBank": "Banco do Brasil",
    "salaryAgency": "1234-5",
    "salaryAccount": "12345-6",
    "salaryAccountType": "Corrente",
    "familySalary": 2000.00,
    "parenting": "2",
    "irpf": "Isento",
    "status": "Ativo",
    "jobPosition": "Professor",
    "department": "Educação Infantil",
    "userId": "user123",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2023-01-15T10:30:00.000Z"
  }
]
```

**Resposta de Erro (500):**
```json
{
  "error": "Erro ao buscar funcionários"
}
```

---

### 3. Criar Funcionário
Cria um novo funcionário com upload de foto.

```http
POST /employees
Content-Type: multipart/form-data
```

**Parâmetros Obrigatórios:**
- `fullName` (string): Nome completo (2-100 caracteres)
- `tagName` (string): Nome para crachá (1-50 caracteres)
- `tagLastName` (string): Sobrenome para crachá (1-50 caracteres)
- `file` (arquivo): Foto do funcionário (JPG/PNG, máximo 5MB)

**Parâmetros Opcionais - Dados Básicos:**
- `jobFunctions` (string): Cargo/função (2-100 caracteres)
- `birthday` (string): Data de nascimento (formato YYYY-MM-DD)
- `companyNumber` (integer): Número da empresa
- `companyName` (string): Nome da empresa
- `email` (string): Email do funcionário
- `age` (string): Idade

**Parâmetros Opcionais - Endereço:**
- `cep` (string): CEP
- `employeeAddress` (string): Endereço
- `employeeAddressNumber` (string): Número do endereço
- `employeeAddressComplement` (string): Complemento
- `employeeNeighborhood` (string): Bairro
- `employeeAddressCity` (string): Cidade
- `employeeAddressState` (string): Estado (2 caracteres)

**Parâmetros Opcionais - Contatos:**
- `phone` (string): Telefone
- `mobile` (string): Celular

**Parâmetros Opcionais - Informações Pessoais:**
- `naturalness` (string): Naturalidade
- `nationality` (string): Nacionalidade
- `fatherName` (string): Nome do pai
- `motherName` (string): Nome da mãe
- `gender` (string): Gênero
- `maritalStatus` (string): Estado civil
- `graduation` (string): Escolaridade
- `skinColor` (string): Cor/raça

**Parâmetros Opcionais - Documentos:**
- `cpf` (string): CPF
- `rg` (string): RG
- `rgEmitter` (string): Órgão emissor do RG
- `rgEmissionDate` (string): Data de emissão do RG (YYYY-MM-DD)
- `pisPasep` (string): PIS/PASEP
- `voterTitle` (string): Título de eleitor
- `voterZone` (string): Zona eleitoral
- `voterSection` (string): Seção eleitoral
- `voterEmission` (string): Data de emissão do título (YYYY-MM-DD)
- `militaryCertificate` (string): Certificado militar
- `ctps` (string): CTPS
- `ctpsSerie` (string): Série da CTPS

**Parâmetros Opcionais - Carteira de Motorista:**
- `driversLicense` (boolean): Possui CNH
- `driversLicenseNumber` (string): Número da CNH
- `driversLicenseEmissionDate` (string): Data de emissão (YYYY-MM-DD)
- `driversLicenseExpirationDate` (string): Data de validade (YYYY-MM-DD)
- `driversLicenseCategory` (string): Categoria da CNH

**Parâmetros Opcionais - Benefícios:**
- `mealValue` (number): Valor da refeição
- `deficiency` (boolean): Possui deficiência
- `deficiencyDescription` (string): Descrição da deficiência
- `transport` (boolean): Utiliza transporte
- `transportType` (string): Tipo de transporte
- `transportValue` (number): Valor do transporte

**Parâmetros Opcionais - Informações do Cônjuge:**
- `partnerName` (string): Nome do cônjuge
- `partnerCpf` (string): CPF do cônjuge
- `partnerBirthday` (string): Data de nascimento do cônjuge (YYYY-MM-DD)
- `partnerRg` (string): RG do cônjuge

**Parâmetros Opcionais - Plano de Saúde:**
- `healthPlan` (string): Plano de saúde
- `healthCardNumber` (string): Número da carteirinha

**Parâmetros Opcionais - Informações Acadêmicas (Estagiários):**
- `collegeCep` (string): CEP da faculdade
- `traineeAddress` (string): Endereço acadêmico
- `traineeAddressNumber` (integer): Número do endereço acadêmico
- `traineeAddressNeighborhood` (string): Bairro acadêmico
- `traineeAddressComplement` (string): Complemento acadêmico
- `traineeAddressState` (string): Estado acadêmico
- `traineeAddressCity` (string): Cidade acadêmica
- `college` (string): Faculdade
- `course` (string): Curso
- `trainingPeriod` (string): Período de treinamento
- `lifeInsurancePolicy` (string): Apólice de seguro de vida
- `ra` (string): Registro acadêmico

**Parâmetros Opcionais - Informações Trabalhistas:**
- `admissionDate` (string): Data de admissão (YYYY-MM-DD)
- `periodWork` (string): Período de trabalho
- `contractExpirationDate` (string): Data de expiração do contrato (YYYY-MM-DD)
- `dailyHours` (string): Horas diárias
- `weeklyHours` (string): Horas semanais
- `monthlyHours` (string): Horas mensais
- `weeklyClasses` (string): Aulas semanais
- `hasAccumulate` (boolean): Possui acúmulo
- `hasAccumulateCompany` (string): Empresa de acúmulo

**Parâmetros Opcionais - Informações Salariais:**
- `salary` (number): Salário
- `salaryBank` (string): Banco para salário
- `salaryAgency` (string): Agência bancária
- `salaryAccount` (string): Conta bancária
- `salaryAccountType` (string): Tipo de conta
- `familySalary` (number): Salário família
- `parenting` (string): Filhos
- `irpf` (string): IRPF

**Parâmetros Opcionais - Status e Controle:**
- `status` (string): Status (Ativo, Inativo, Licença) - padrão: "Ativo"
- `jobPosition` (string): Posição no trabalho
- `department` (string): Departamento
- `userId` (string): ID do usuário

**Exemplo de Request (FormData):**
```javascript
const formData = new FormData();
formData.append('fullName', 'João Silva');
formData.append('tagName', 'João');
formData.append('tagLastName', 'Silva');
formData.append('jobFunctions', 'Professor'); // Opcional
formData.append('birthday', '1990-01-15'); // Opcional
formData.append('file', fileInput.files[0]);

fetch('http://localhost:4000/employees', {
  method: 'POST',
  body: formData
})
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "full_name": "João Silva",
  "job_functions": "Professor",
  "birthday": "1990-01-15",
  "photo_url": "https://res.cloudinary.com/dp3uq8qv2/image/upload/v1234567890/maple-employees/employee_1234567890.jpg",
  "created_at": "2023-01-15T10:30:00.000Z"
}
```

**Respostas de Erro:**

**400 - Campos obrigatórios faltando:**
```json
{
  "error": "Missing Required Fields",
  "message": "Campos obrigatórios faltando: Nome completo, Nome para crachá e Sobrenome para crachá são obrigatórios."
}
```

**400 - Arquivo faltando:**
```json
{
  "error": "Missing File",
  "message": "Arquivo de foto obrigatório faltando."
}
```

**400 - Formato de arquivo inválido:**
```json
{
  "error": "Invalid File Format",
  "message": "Formato de arquivo inválido. Apenas JPEG ou PNG são permitidos."
}
```

**400 - Content-Type incorreto:**
```json
{
  "error": "Invalid Content-Type",
  "message": "Content-Type deve ser multipart/form-data para upload de arquivos"
}
```

**500 - Erro de upload:**
```json
{
  "error": "Upload Error",
  "message": "Erro interno ao fazer upload da imagem."
}
```

---

### 4. Template do Crachá
Retorna o template de imagem do crachá.

```http
GET /template-cracha
```

**Resposta de Sucesso (200):**
- Content-Type: `image/png`
- Retorna a imagem binária do template

**Resposta de Erro (404):**
```json
{
  "error": "Template do crachá não encontrado"
}
```

---

## 🔧 Configuração CORS

A API está configurada para aceitar requisições das seguintes origens:

**Desenvolvimento:**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:4200` (Angular dev server)
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:4200` (Angular dev server)
- `http://127.0.0.1:5173`

**Produção:**
- URLs configuradas na variável de ambiente `FRONTEND_URL`
- `https://mbjerp.netlify.app`
- `https://maple-erp-frontend.netlify.app`

**Métodos permitidos:** GET, POST, PUT, DELETE, OPTIONS
**Headers permitidos:** Content-Type, Authorization, X-Requested-With
**Credentials:** Habilitado

---

## 🚨 Códigos de Status HTTP

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos ou faltando |
| 403 | Forbidden | Erro de CORS |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Dados duplicados |
| 500 | Internal Server Error | Erro interno do servidor |
| 503 | Service Unavailable | Serviços indisponíveis |

---

## 🔍 Exemplos de Uso no Angular

### 1. Service para Health Check
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private baseUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  checkHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health-check`);
  }
}
```

### 2. Service para Funcionários
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  fullName: string;
  jobFunctions: string;
  birthday?: string;
  photoUrl?: string;
  // ... outros campos
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:4000/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  createEmployee(employeeData: FormData): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employeeData);
  }
}
```

### 3. Componente para Upload de Funcionário
```typescript
import { Component } from '@angular/core';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee-form',
  template: `
    <form (ngSubmit)="onSubmit()" #employeeForm="ngForm">
      <input 
        type="text" 
        name="fullName" 
        [(ngModel)]="employee.fullName" 
        required 
        placeholder="Nome Completo">
      
      <input 
        type="text" 
        name="jobFunctions" 
        [(ngModel)]="employee.jobFunctions" 
        required 
        placeholder="Cargo">
      
      <input 
        type="date" 
        name="birthday" 
        [(ngModel)]="employee.birthday" 
        placeholder="Data de Nascimento">
      
      <input 
        type="file" 
        (change)="onFileSelected($event)" 
        accept="image/jpeg,image/png" 
        required>
      
      <button type="submit" [disabled]="!employeeForm.form.valid || !selectedFile">
        Criar Funcionário
      </button>
    </form>
  `
})
export class EmployeeFormComponent {
  employee = {
    fullName: '',
    jobFunctions: '',
    birthday: ''
  };
  selectedFile: File | null = null;

  constructor(private employeeService: EmployeeService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('fullName', this.employee.fullName);
    formData.append('jobFunctions', this.employee.jobFunctions);
    if (this.employee.birthday) {
      formData.append('birthday', this.employee.birthday);
    }
    formData.append('file', this.selectedFile);

    this.employeeService.createEmployee(formData).subscribe({
      next: (response) => {
        console.log('Funcionário criado:', response);
        // Resetar formulário ou navegar para outra página
      },
      error: (error) => {
        console.error('Erro ao criar funcionário:', error);
        // Mostrar mensagem de erro para o usuário
      }
    });
  }
}
```

### 4. Interceptor para Tratamento de Erros
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erro desconhecido';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        console.error('Erro HTTP:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
```

---

## 📝 Notas Importantes

1. **Upload de Arquivos**: Use sempre `FormData` para enviar arquivos
2. **Validações**: A API faz validações rigorosas nos dados de entrada
3. **CORS**: Certifique-se de que sua aplicação Angular está rodando em uma das URLs permitidas
4. **Tamanho de Arquivo**: Máximo de 5MB para fotos
5. **Formatos Aceitos**: Apenas JPG e PNG
6. **Logs**: A API gera logs detalhados para debugging

---

---

### 5. Buscar Funcionário por ID
Retorna os dados de um funcionário específico.

```http
GET /employees/:id
```

**Parâmetros:**
- `id` (integer): ID do funcionário

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "fullName": "João Silva",
  "jobFunctions": "Professor",
  "birthday": "1990-01-15",
  "photoUrl": "https://res.cloudinary.com/...",
  "email": "joao@maplebear.com",
  "phone": "(11) 1234-5678",
  "mobile": "(11) 98765-4321",
  "cpf": "123.456.789-00",
  "rg": "12.345.678-9",
  "status": "Ativo",
  "createdAt": "2023-01-15T10:30:00.000Z",
  "updatedAt": "2023-01-15T10:30:00.000Z"
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Employee Not Found",
  "message": "Funcionário não encontrado"
}
```

---

### 6. Atualizar Funcionário
Atualiza os dados de um funcionário existente.

```http
PUT /employees/:id
Content-Type: application/json
```

**Parâmetros:**
- `id` (integer): ID do funcionário

**Body (todos opcionais):**
```json
{
  "fullName": "João Silva Santos",
  "jobFunctions": "Professor Sênior",
  "birthday": "1990-01-15",
  "email": "joao.santos@maplebear.com",
  "phone": "(11) 1234-5678",
  "mobile": "(11) 98765-4321",
  "status": "Ativo"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "fullName": "João Silva Santos",
  "jobFunctions": "Professor Sênior",
  "updatedAt": "2023-01-15T11:30:00.000Z"
}
```

---

### 7. Deletar Funcionário
Remove um funcionário do sistema.

```http
DELETE /employees/:id
```

**Parâmetros:**
- `id` (integer): ID do funcionário

**Resposta de Sucesso (200):**
```json
{
  "message": "Funcionário deletado com sucesso",
  "deletedId": 1
}
```

---

### 8. Buscar Funcionários com Filtros
Busca funcionários com filtros e paginação.

```http
GET /employees/search?name=João&jobFunction=Professor&status=Ativo&limit=10&offset=0
```

**Query Parameters (todos opcionais):**
- `name` (string): Nome para busca (busca parcial)
- `jobFunction` (string): Cargo para busca (busca parcial)
- `status` (string): Status (Ativo, Inativo, Licença)
- `limit` (integer): Limite de resultados (1-100, padrão: 20)
- `offset` (integer): Offset para paginação (padrão: 0)

**Resposta de Sucesso (200):**
```json
{
  "employees": [
    {
      "id": 1,
      "fullName": "João Silva",
      "jobFunctions": "Professor",
      "photoUrl": "https://res.cloudinary.com/...",
      "status": "Ativo",
      "createdAt": "2023-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

---

### 9. Gerar Crachá Individual
Gera um crachá em PDF para um funcionário específico.

```http
GET /employees/:id/badge
```

**Parâmetros:**
- `id` (integer): ID do funcionário

**Resposta de Sucesso (200):**
- Content-Type: `application/pdf`
- Retorna o arquivo PDF do crachá para download
- Nome do arquivo: `cracha_Nome_Funcionario_ID.pdf`

---

### 10. Gerar Múltiplos Crachás
Gera crachás em PDF para múltiplos funcionários em um único arquivo.

```http
POST /employees/badges
Content-Type: application/json
```

**Body:**
```json
{
  "employeeIds": [1, 2, 3, 4, 5]
}
```

**Resposta de Sucesso (200):**
- Content-Type: `application/pdf`
- Retorna o arquivo PDF com múltiplos crachás
- Nome do arquivo: `crachas_multiplos_YYYY-MM-DD.pdf`

**Resposta de Erro (400):**
```json
{
  "error": "Invalid Data",
  "message": "Lista de IDs de funcionários é obrigatória"
}
```

---

### 11. Exportar Dados dos Funcionários
Exporta dados dos funcionários em CSV ou JSON.

```http
GET /employees/export?format=csv&status=Ativo
```

**Query Parameters:**
- `format` (string): Formato de exportação (csv, json) - padrão: csv
- `status` (string): Filtrar por status (opcional)

**Resposta de Sucesso (200) - CSV:**
- Content-Type: `text/csv`
- Nome do arquivo: `funcionarios_YYYY-MM-DD.csv`

**Resposta de Sucesso (200) - JSON:**
- Content-Type: `application/json`
- Nome do arquivo: `funcionarios_YYYY-MM-DD.json`