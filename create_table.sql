-- Script para criar a tabela employees com todos os campos da documentação
CREATE TABLE IF NOT EXISTS employees (
  -- Campos básicos
  id SERIAL PRIMARY KEY,
  company_number INTEGER,
  company_name VARCHAR(255),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  tag_name VARCHAR(50) NOT NULL,
  tag_last_name VARCHAR(50) NOT NULL,
  birthday DATE,
  age VARCHAR(10),
  
  -- Endereço
  cep VARCHAR(10),
  employee_address VARCHAR(255),
  employee_address_number VARCHAR(20),
  employee_address_complement VARCHAR(100),
  employee_neighborhood VARCHAR(100),
  employee_address_city VARCHAR(100),
  employee_address_state VARCHAR(2),
  
  -- Contatos
  phone VARCHAR(20),
  mobile VARCHAR(20),
  
  -- Informações pessoais
  naturalness VARCHAR(100),
  nationality VARCHAR(100),
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  
  -- Benefícios
  meal_value DECIMAL(10,2),
  deficiency BOOLEAN DEFAULT FALSE,
  deficiency_description TEXT,
  transport BOOLEAN DEFAULT FALSE,
  transport_type VARCHAR(100),
  transport_value DECIMAL(10,2),
  
  -- Informações do cônjuge
  partner_name VARCHAR(255),
  partner_cpf VARCHAR(14),
  partner_birthday DATE,
  partner_rg VARCHAR(20),
  
  -- Foto
  photo_url TEXT,
  
  -- Informações pessoais adicionais
  gender VARCHAR(20),
  marital_status VARCHAR(50),
  graduation VARCHAR(100),
  skin_color VARCHAR(50),
  
  -- Documentos
  rg VARCHAR(20),
  rg_emitter VARCHAR(50),
  rg_emission_date DATE,
  cpf VARCHAR(14),
  pis_pasep VARCHAR(20),
  voter_title VARCHAR(20),
  voter_zone VARCHAR(10),
  voter_section VARCHAR(10),
  voter_emission DATE,
  military_certificate VARCHAR(50),
  ctps VARCHAR(20),
  ctps_serie VARCHAR(10),
  
  -- Carteira de motorista
  drivers_license BOOLEAN DEFAULT FALSE,
  drivers_license_number VARCHAR(20),
  drivers_license_emission_date DATE,
  drivers_license_expiration_date DATE,
  drivers_license_category VARCHAR(5),
  
  -- Plano de saúde
  health_plan VARCHAR(100),
  health_card_number VARCHAR(50),
  
  -- Informações acadêmicas (para estagiários)
  college_cep VARCHAR(10),
  trainee_address VARCHAR(255),
  trainee_address_number INTEGER,
  trainee_address_neighborhood VARCHAR(100),
  trainee_address_complement VARCHAR(100),
  trainee_address_state VARCHAR(2),
  trainee_address_city VARCHAR(100),
  college VARCHAR(255),
  course VARCHAR(255),
  training_period VARCHAR(50),
  life_insurance_policy VARCHAR(50),
  ra VARCHAR(20),
  
  -- Informações de trabalho
  job_functions VARCHAR(100),
  admission_date DATE,
  period_work VARCHAR(50),
  contract_expiration_date DATE,
  daily_hours VARCHAR(10),
  weekly_hours VARCHAR(10),
  monthly_hours VARCHAR(10),
  weekly_classes VARCHAR(10),
  has_accumulate BOOLEAN DEFAULT FALSE,
  has_accumulate_company VARCHAR(255),
  
  -- Informações salariais
  salary DECIMAL(10,2),
  salary_bank VARCHAR(100),
  salary_agency VARCHAR(20),
  salary_account VARCHAR(20),
  salary_account_type VARCHAR(50),
  family_salary DECIMAL(10,2),
  parenting VARCHAR(10),
  irpf VARCHAR(50),
  
  -- Status e controle
  status VARCHAR(20) DEFAULT 'Ativo',
  job_position VARCHAR(100),
  department VARCHAR(100),
  user_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_employees_full_name ON employees(full_name);
CREATE INDEX IF NOT EXISTS idx_employees_cpf ON employees(cpf);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_job_functions ON employees(job_functions);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at);
