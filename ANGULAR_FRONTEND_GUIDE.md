# Guia para Desenvolvedor Frontend - Angular Service

Este documento contém instruções para implementar o service do Angular para consumir a API de funcionários do Maple ERP Backend.

## 📋 Índice

1. [Estrutura do Service](#estrutura-do-service)
2. [Interfaces TypeScript](#interfaces-typescript)
3. [Service Principal](#service-principal)
4. [Exemplos de Uso nos Componentes](#exemplos-de-uso-nos-componentes)
5. [Interceptors para Formulários](#interceptors-para-formulários)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Validações no Frontend](#validações-no-frontend)

## 🏗️ Estrutura do Service

### 1. Interfaces TypeScript

Crie o arquivo `src/app/models/employee.interface.ts`:

```typescript
// employee.interface.ts
export interface Employee {
  id?: number;
  
  // Campos básicos
  fullName: string;
  tagName: string;
  tagLastName: string;
  companyNumber?: number;
  companyName?: string;
  email?: string;
  birthday?: string;
  age?: string;
  photoUrl?: string;
  
  // Endereço
  cep?: string;
  employeeAddress?: string;
  employeeAddressNumber?: string;
  employeeAddressComplement?: string;
  employeeNeighborhood?: string;
  employeeAddressCity?: string;
  employeeAddressState?: string;
  
  // Contatos
  phone?: string;
  mobile?: string;
  
  // Informações pessoais
  naturalness?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  gender?: EmployeeGender;
  maritalStatus?: EmployeeMaritalStatus;
  graduation?: EmployeeGraduation;
  skinColor?: EmployeeSkinColor;
  
  // Benefícios
  mealValue?: number;
  deficiency?: boolean;
  deficiencyDescription?: string;
  transport?: boolean;
  transportType?: string;
  transportValue?: number;
  
  // Informações do cônjuge
  partnerName?: string;
  partnerCpf?: string;
  partnerBirthday?: string;
  partnerRg?: string;
  
  // Documentos
  rg?: string;
  rgEmitter?: string;
  rgEmissionDate?: string;
  cpf?: string;
  pisPasep?: string;
  voterTitle?: string;
  voterZone?: string;
  voterSection?: string;
  voterEmission?: string;
  militaryCertificate?: string;
  ctps?: string;
  ctpsSerie?: string;
  
  // Carteira de motorista
  driversLicense?: boolean;
  driversLicenseNumber?: string;
  driversLicenseEmissionDate?: string;
  driversLicenseExpirationDate?: string;
  driversLicenseCategory?: DriversLicenseCategory;
  
  // Plano de saúde
  healthPlan?: string;
  healthCardNumber?: string;
  
  // Informações acadêmicas
  collegeCep?: string;
  traineeAddress?: string;
  traineeAddressNumber?: number;
  traineeAddressNeighborhood?: string;
  traineeAddressComplement?: string;
  traineeAddressState?: string;
  traineeAddressCity?: string;
  college?: string;
  course?: string;
  trainingPeriod?: string;
  lifeInsurancePolicy?: string;
  ra?: string;
  
  // Informações de trabalho
  jobFunctions?: string;
  admissionDate?: string;
  periodWork?: string;
  contractExpirationDate?: string;
  dailyHours?: string;
  weeklyHours?: string;
  monthlyHours?: string;
  weeklyClasses?: string;
  hasAccumulate?: boolean;
  hasAccumulateCompany?: string;
  
  // Informações salariais
  salary?: number;
  salaryBank?: string;
  salaryAgency?: string;
  salaryAccount?: string;
  salaryAccountType?: string;
  familySalary?: number;
  parenting?: string;
  irpf?: string;
  
  // Status e controle
  status?: EmployeeContractStatus;
  jobPosition?: EmployeeCargo;
  department?: Department;
  userId?: string;
  
  // Campos automáticos
  createdAt?: string;
  updatedAt?: string;
}

// Enums baseados no banco de dados
export enum EmployeeGender {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO'
}

export enum EmployeeMaritalStatus {
  SOLTEIRO = 'SOLTEIRO',
  CASADO = 'CASADO',
  DIVORCIADO = 'DIVORCIADO',
  VIUVO = 'VIUVO',
  UNIAO_ESTAVEL = 'UNIAO_ESTAVEL'
}

export enum EmployeeContractStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum EmployeeGraduation {
  FUNDAMENTAL_INCOMPLETO = 'FUNDAMENTAL_INCOMPLETO',
  FUNDAMENTAL_COMPLETO = 'FUNDAMENTAL_COMPLETO',
  MEDIO_INCOMPLETO = 'MEDIO_INCOMPLETO',
  MEDIO_COMPLETO = 'MEDIO_COMPLETO',
  SUPERIOR_INCOMPLETO = 'SUPERIOR_INCOMPLETO',
  SUPERIOR_COMPLETO = 'SUPERIOR_COMPLETO',
  POS_GRADUACAO = 'POS_GRADUACAO',
  MESTRADO = 'MESTRADO',
  DOUTORADO = 'DOUTORADO'
}

export enum EmployeeSkinColor {
  BRANCA = 'BRANCA',
  PRETA = 'PRETA',
  PARDA = 'PARDA',
  AMARELA = 'AMARELA',
  INDIGENA = 'INDIGENA'
}

export enum DriversLicenseCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  AB = 'AB',
  AC = 'AC',
  AD = 'AD',
  AE = 'AE'
}

export enum EmployeeCargo {
  PROFESSOR = 'PROFESSOR',
  COORDENADOR = 'COORDENADOR',
  DIRETOR = 'DIRETOR',
  ASSISTENTE = 'ASSISTENTE',
  SECRETARIO = 'SECRETARIO',
  AUXILIAR = 'AUXILIAR',
  ESTAGIARIO = 'ESTAGIARIO'
}

export enum Department {
  EDUCACAO_INFANTIL = 'EDUCACAO_INFANTIL',
  ENSINO_FUNDAMENTAL = 'ENSINO_FUNDAMENTAL',
  ENSINO_MEDIO = 'ENSINO_MEDIO',
  ADMINISTRACAO = 'ADMINISTRACAO',
  MANUTENCAO = 'MANUTENCAO',
  LIMPEZA = 'LIMPEZA',
  SEGURANCA = 'SEGURANCA'
}

// Interfaces para respostas da API
export interface EmployeeSearchResponse {
  employees: Employee[];
  total: number;
  limit: number;
  offset: number;
}

export interface EmployeeSearchParams {
  name?: string;
  jobFunction?: string;
  status?: EmployeeContractStatus;
  limit?: number;
  offset?: number;
}

export interface ApiError {
  error: string;
  message: string;
  detail?: string;
}
```

### 2. Service Principal

Crie o arquivo `src/app/services/employee.service.ts`:

```typescript
// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee, EmployeeSearchResponse, EmployeeSearchParams, ApiError } from '../models/employee.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // 1. LISTAR TODOS OS FUNCIONÁRIOS
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 2. BUSCAR FUNCIONÁRIO POR ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 3. CRIAR FUNCIONÁRIO (COM ARQUIVO)
  createEmployee(employeeData: Partial<Employee>, photo: File): Observable<Employee> {
    const formData = new FormData();
    
    // Adicionar foto
    formData.append('file', photo);
    
    // Adicionar campos obrigatórios
    if (employeeData.fullName) formData.append('fullName', employeeData.fullName);
    if (employeeData.tagName) formData.append('tagName', employeeData.tagName);
    if (employeeData.tagLastName) formData.append('tagLastName', employeeData.tagLastName);
    
    // Adicionar todos os outros campos opcionais
    Object.keys(employeeData).forEach(key => {
      const value = (employeeData as any)[key];
      if (value !== null && value !== undefined && key !== 'fullName' && key !== 'tagName' && key !== 'tagLastName') {
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else if (typeof value === 'string' && value.trim() !== '') {
          formData.append(key, value);
        }
      }
    });

    return this.http.post<Employee>(this.apiUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 4. ATUALIZAR FUNCIONÁRIO
  updateEmployee(id: number, employeeData: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employeeData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 5. DELETAR FUNCIONÁRIO
  deleteEmployee(id: number): Observable<{message: string, deletedId: number}> {
    return this.http.delete<{message: string, deletedId: number}>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 6. BUSCAR COM FILTROS
  searchEmployees(params: EmployeeSearchParams): Observable<EmployeeSearchResponse> {
    let httpParams = new HttpParams();
    
    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.jobFunction) httpParams = httpParams.set('jobFunction', params.jobFunction);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offset) httpParams = httpParams.set('offset', params.offset.toString());

    return this.http.get<EmployeeSearchResponse>(`${this.apiUrl}/search`, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  // 7. GERAR CRACHÁ INDIVIDUAL
  generateBadge(employeeId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${employeeId}/badge`, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // 8. GERAR MÚLTIPLOS CRACHÁS
  generateMultipleBadges(employeeIds: number[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/badges`, { employeeIds }, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // 9. EXPORTAR DADOS
  exportEmployees(format: 'csv' | 'json' = 'csv', status?: string): Observable<Blob> {
    let httpParams = new HttpParams().set('format', format);
    if (status) httpParams = httpParams.set('status', status);

    return this.http.get(`${this.apiUrl}/export`, { 
      params: httpParams, 
      responseType: 'blob' 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // 10. MÉTODOS DE DEBUG (REMOVER EM PRODUÇÃO)
  getTableSchema(): Observable<any> {
    return this.http.get(`${this.apiUrl}/schema`)
      .pipe(
        catchError(this.handleError)
      );
  }

  testFields(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test-fields`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // TRATAMENTO DE ERROS
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      const apiError = error.error as ApiError;
      if (apiError && apiError.message) {
        errorMessage = apiError.message;
      } else {
        errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
      }
    }
    
    console.error('Erro na API:', error);
    return throwError(() => new Error(errorMessage));
  }

  // MÉTODOS AUXILIARES
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // VALIDAÇÕES LOCAIS
  validateEmployee(employee: Partial<Employee>): string[] {
    const errors: string[] = [];
    
    if (!employee.fullName || employee.fullName.trim().length < 2) {
      errors.push('Nome completo é obrigatório e deve ter pelo menos 2 caracteres');
    }
    
    if (!employee.tagName || employee.tagName.trim().length < 1) {
      errors.push('Nome para crachá é obrigatório');
    }
    
    if (!employee.tagLastName || employee.tagLastName.trim().length < 1) {
      errors.push('Sobrenome para crachá é obrigatório');
    }
    
    if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      errors.push('Email inválido');
    }
    
    if (employee.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(employee.birthday)) {
      errors.push('Data de nascimento deve estar no formato YYYY-MM-DD');
    }
    
    if (employee.birthday && new Date(employee.birthday) > new Date()) {
      errors.push('Data de nascimento não pode ser futura');
    }
    
    return errors;
  }
}
```

### 3. Environment Configuration

Configure o arquivo `src/environments/environment.ts`:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com'
};
```

## 🔧 Exemplos de Uso nos Componentes

### 1. Componente de Listagem

```typescript
// employee-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Employee, EmployeeSearchParams } from '../models/employee.interface';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error: string | null = null;

  // Filtros
  searchParams: EmployeeSearchParams = {
    limit: 20,
    offset: 0
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;
    
    this.employeeService.searchEmployees(this.searchParams)
      .subscribe({
        next: (response) => {
          this.employees = response.employees;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }

  onSearch(searchTerm: string): void {
    this.searchParams.name = searchTerm;
    this.searchParams.offset = 0;
    this.loadEmployees();
  }

  onDeleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.employeeService.deleteEmployee(id)
        .subscribe({
          next: () => {
            this.loadEmployees(); // Recarregar lista
          },
          error: (error) => {
            this.error = error.message;
          }
        });
    }
  }

  onGenerateBadge(employeeId: number): void {
    this.employeeService.generateBadge(employeeId)
      .subscribe({
        next: (blob) => {
          this.employeeService.downloadFile(blob, `cracha_funcionario_${employeeId}.pdf`);
        },
        error: (error) => {
          this.error = error.message;
        }
      });
  }

  onExportCSV(): void {
    this.employeeService.exportEmployees('csv')
      .subscribe({
        next: (blob) => {
          const timestamp = new Date().toISOString().slice(0, 10);
          this.employeeService.downloadFile(blob, `funcionarios_${timestamp}.csv`);
        },
        error: (error) => {
          this.error = error.message;
        }
      });
  }
}
```

### 2. Componente de Criação/Edição

```typescript
// employee-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.interface';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Input() isEdit = false;
  @Output() onSave = new EventEmitter<Employee>();
  @Output() onCancel = new EventEmitter<void>();

  employeeForm: FormGroup;
  selectedFile: File | null = null;
  loading = false;
  error: string | null = null;
  validationErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.employee && this.isEdit) {
      this.employeeForm.patchValue(this.employee);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Campos obrigatórios
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      tagName: ['', Validators.required],
      tagLastName: ['', Validators.required],
      
      // Campos básicos
      companyNumber: [''],
      companyName: [''],
      email: ['', Validators.email],
      birthday: [''],
      age: [''],
      
      // Endereço
      cep: [''],
      employeeAddress: [''],
      employeeAddressNumber: [''],
      employeeAddressComplement: [''],
      employeeNeighborhood: [''],
      employeeAddressCity: [''],
      employeeAddressState: [''],
      
      // Contatos
      phone: [''],
      mobile: [''],
      
      // Informações pessoais
      naturalness: [''],
      nationality: [''],
      fatherName: [''],
      motherName: [''],
      gender: [''],
      maritalStatus: [''],
      graduation: [''],
      skinColor: [''],
      
      // Documentos
      rg: [''],
      rgEmitter: [''],
      rgEmissionDate: [''],
      cpf: [''],
      pisPasep: [''],
      
      // Informações de trabalho
      jobFunctions: [''],
      admissionDate: [''],
      salary: [''],
      status: ['ACTIVE'],
      jobPosition: [''],
      department: [''],
      
      // ... adicione outros campos conforme necessário
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.error = 'Apenas arquivos JPEG ou PNG são permitidos';
        return;
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Arquivo deve ter no máximo 5MB';
        return;
      }
      
      this.selectedFile = file;
      this.error = null;
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData = this.employeeForm.value;
    
    // Validações locais
    this.validationErrors = this.employeeService.validateEmployee(formData);
    if (this.validationErrors.length > 0) {
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEdit && this.employee?.id) {
      // Atualizar funcionário existente
      this.employeeService.updateEmployee(this.employee.id, formData)
        .subscribe({
          next: (updatedEmployee) => {
            this.onSave.emit(updatedEmployee);
            this.loading = false;
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
          }
        });
    } else {
      // Criar novo funcionário
      if (!this.selectedFile) {
        this.error = 'Foto é obrigatória para novos funcionários';
        this.loading = false;
        return;
      }

      this.employeeService.createEmployee(formData, this.selectedFile)
        .subscribe({
          next: (newEmployee) => {
            this.onSave.emit(newEmployee);
            this.loading = false;
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
          }
        });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      this.employeeForm.get(key)?.markAsTouched();
    });
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
```

## 🔒 Interceptors e Configurações

### 1. HTTP Interceptor para Logs

```typescript
// http-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`HTTP Request: ${req.method} ${req.url}`);
    
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event.type === 4) { // HttpEventType.Response
            console.log(`HTTP Response: ${req.method} ${req.url}`, event);
          }
        },
        error: (error) => {
          console.error(`HTTP Error: ${req.method} ${req.url}`, error);
        }
      })
    );
  }
}
```

### 2. Module Configuration

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EmployeeService } from './services/employee.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    // seus componentes
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    // outros modules
  ],
  providers: [
    EmployeeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## ⚠️ Pontos Importantes

### 1. **Campos Obrigatórios**
- `fullName`, `tagName`, `tagLastName` são sempre obrigatórios
- `file` (foto) é obrigatório apenas na criação

### 2. **Formatos de Data**
- Use sempre formato `YYYY-MM-DD` para datas
- Exemplo: `2024-01-15`

### 3. **Valores Booleanos**
- O backend espera `true`/`false` como string no FormData
- No Angular, converta: `value.toString()`

### 4. **Campos Numéricos**
- Sempre envie como string no FormData
- Exemplo: `salary: '5000.50'`

### 5. **Enums**
- Use os enums definidos nas interfaces
- Valide no frontend antes de enviar

### 6. **Upload de Arquivos**
- Apenas JPEG ou PNG
- Máximo 5MB
- Use FormData para envio

### 7. **Tratamento de Erros**
- Sempre implemente tratamento de erro
- Exiba mensagens amigáveis ao usuário
- Use console.error para debug

## 🚀 Comandos para Testar

```bash
# Testar se a API está funcionando
curl -s http://localhost:4000/employees | jq 'length'

# Ver estrutura dos dados
curl -s http://localhost:4000/employees | jq '.[0] | keys'

# Testar criação (via Postman ou Insomnia)
# Use FormData com os campos necessários
```

Este guia fornece uma base sólida para implementar o service do Angular e consumir corretamente a API de funcionários. Adapte conforme suas necessidades específicas!
