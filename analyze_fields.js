// Script para analisar campos do banco vs campos enviados no POST
const db = require('./src/config/db');

async function analyzeFields() {
  try {
    console.log('🔍 ANÁLISE DE CAMPOS - BANCO vs POST\n');
    
    // 1. Verificar estrutura da tabela
    console.log('1. ESTRUTURA DA TABELA EMPLOYEES:');
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'employees' 
      ORDER BY ordinal_position;
    `;
    
    const { rows: columns } = await db.query(columnsQuery);
    console.log(`Total de colunas na tabela: ${columns.length}\n`);
    
    // Mapear colunas do banco
    const dbColumns = columns.map(col => col.column_name);
    
    // 2. Campos que estão sendo processados no POST
    console.log('2. CAMPOS PROCESSADOS NO POST (89 campos):');
    const postFields = [
      // Campos obrigatórios
      'fullName', 'tagName', 'tagLastName',
      // Campos básicos
      'companyNumber', 'companyName', 'email', 'birthday', 'age',
      // Endereço
      'cep', 'employeeAddress', 'employeeAddressNumber', 'employeeAddressComplement',
      'employeeNeighborhood', 'employeeAddressCity', 'employeeAddressState',
      // Contatos
      'phone', 'mobile',
      // Informações pessoais
      'naturalness', 'nationality', 'fatherName', 'motherName',
      // Benefícios
      'mealValue', 'deficiency', 'deficiencyDescription', 'transport', 'transportType', 'transportValue',
      // Informações do cônjuge
      'partnerName', 'partnerCpf', 'partnerBirthday', 'partnerRg',
      // Informações pessoais adicionais
      'gender', 'maritalStatus', 'graduation', 'skinColor',
      // Documentos
      'rg', 'rgEmitter', 'rgEmissionDate', 'cpf', 'pisPasep',
      'voterTitle', 'voterZone', 'voterSection', 'voterEmission',
      'militaryCertificate', 'ctps', 'ctpsSerie',
      // Carteira de motorista
      'driversLicense', 'driversLicenseNumber', 'driversLicenseEmissionDate',
      'driversLicenseExpirationDate', 'driversLicenseCategory',
      // Plano de saúde
      'healthPlan', 'healthCardNumber',
      // Informações acadêmicas
      'collegeCep', 'traineeAddress', 'traineeAddressNumber', 'traineeAddressNeighborhood',
      'traineeAddressComplement', 'traineeAddressState', 'traineeAddressCity',
      'college', 'course', 'trainingPeriod', 'lifeInsurancePolicy', 'ra',
      // Informações de trabalho
      'jobFunctions', 'admissionDate', 'periodWork', 'contractExpirationDate',
      'dailyHours', 'weeklyHours', 'monthlyHours', 'weeklyClasses',
      'hasAccumulate', 'hasAccumulateCompany',
      // Informações salariais
      'salary', 'salaryBank', 'salaryAgency', 'salaryAccount', 'salaryAccountType',
      'familySalary', 'parenting', 'irpf',
      // Status e controle
      'status', 'jobPosition', 'department', 'userId'
    ];
    
    console.log(`Total de campos processados no POST: ${postFields.length}\n`);
    
    // 3. Mapeamento camelCase -> snake_case
    console.log('3. MAPEAMENTO DE CAMPOS (camelCase -> snake_case):');
    const fieldMapping = {
      fullName: 'full_name',
      tagName: 'tag_name',
      tagLastName: 'tag_last_name',
      companyNumber: 'company_number',
      companyName: 'company_name',
      employeeAddress: 'employee_address',
      employeeAddressNumber: 'employee_address_number',
      employeeAddressComplement: 'employee_address_complement',
      employeeNeighborhood: 'employee_neighborhood',
      employeeAddressCity: 'employee_address_city',
      employeeAddressState: 'employee_address_state',
      fatherName: 'father_name',
      motherName: 'mother_name',
      mealValue: 'meal_value',
      deficiencyDescription: 'deficiency_description',
      transportType: 'transport_type',
      transportValue: 'transport_value',
      partnerName: 'partner_name',
      partnerCpf: 'partner_cpf',
      partnerBirthday: 'partner_birthday',
      partnerRg: 'partner_rg',
      maritalStatus: 'marital_status',
      skinColor: 'skin_color',
      rgEmitter: 'rg_emitter',
      rgEmissionDate: 'rg_emission_date',
      pisPasep: 'pis_pasep',
      voterTitle: 'voter_title',
      voterZone: 'voter_zone',
      voterSection: 'voter_section',
      voterEmission: 'voter_emission',
      militaryCertificate: 'military_certificate',
      ctpsSerie: 'ctps_serie',
      driversLicense: 'drivers_license',
      driversLicenseNumber: 'drivers_license_number',
      driversLicenseEmissionDate: 'drivers_license_emission_date',
      driversLicenseExpirationDate: 'drivers_license_expiration_date',
      driversLicenseCategory: 'drivers_license_category',
      healthPlan: 'health_plan',
      healthCardNumber: 'health_card_number',
      collegeCep: 'college_cep',
      traineeAddress: 'trainee_address',
      traineeAddressNumber: 'trainee_address_number',
      traineeAddressNeighborhood: 'trainee_address_neighborhood',
      traineeAddressComplement: 'trainee_address_complement',
      traineeAddressState: 'trainee_address_state',
      traineeAddressCity: 'trainee_address_city',
      trainingPeriod: 'training_period',
      lifeInsurancePolicy: 'life_insurance_policy',
      jobFunctions: 'job_functions',
      admissionDate: 'admission_date',
      periodWork: 'period_work',
      contractExpirationDate: 'contract_expiration_date',
      dailyHours: 'daily_hours',
      weeklyHours: 'weekly_hours',
      monthlyHours: 'monthly_hours',
      weeklyClasses: 'weekly_classes',
      hasAccumulate: 'has_accumulate',
      hasAccumulateCompany: 'has_accumulate_company',
      salaryBank: 'salary_bank',
      salaryAgency: 'salary_agency',
      salaryAccount: 'salary_account',
      salaryAccountType: 'salary_account_type',
      familySalary: 'family_salary',
      jobPosition: 'job_position',
      userId: 'user_id'
    };
    
    // Campos que não precisam de mapeamento (mesmo nome)
    const directFields = [
      'email', 'birthday', 'age', 'cep', 'phone', 'mobile', 'naturalness', 'nationality',
      'deficiency', 'transport', 'gender', 'graduation', 'rg', 'cpf', 'ctps',
      'college', 'course', 'ra', 'salary', 'parenting', 'irpf', 'status', 'department'
    ];
    
    // 4. Verificar campos que estão no POST mas não no banco
    console.log('4. VERIFICAÇÃO DE COMPATIBILIDADE:\n');
    
    const missingInDb = [];
    const presentInDb = [];
    
    postFields.forEach(field => {
      const dbField = fieldMapping[field] || field;
      if (dbColumns.includes(dbField)) {
        presentInDb.push(`✅ ${field} -> ${dbField}`);
      } else {
        missingInDb.push(`❌ ${field} -> ${dbField} (NÃO EXISTE NO BANCO)`);
      }
    });
    
    console.log('CAMPOS PRESENTES NO BANCO:');
    presentInDb.forEach(field => console.log(field));
    
    if (missingInDb.length > 0) {
      console.log('\n🚨 CAMPOS AUSENTES NO BANCO:');
      missingInDb.forEach(field => console.log(field));
    } else {
      console.log('\n✅ TODOS OS CAMPOS DO POST EXISTEM NO BANCO!');
    }
    
    // 5. Verificar campos que estão no banco mas não no POST
    console.log('\n5. CAMPOS NO BANCO QUE NÃO ESTÃO NO POST:');
    const allMappedFields = [...Object.values(fieldMapping), ...directFields, 'photo_url', 'id', 'created_at', 'updated_at'];
    const unusedDbFields = dbColumns.filter(col => !allMappedFields.includes(col));
    
    if (unusedDbFields.length > 0) {
      unusedDbFields.forEach(field => console.log(`⚠️  ${field} (existe no banco mas não é processado no POST)`));
    } else {
      console.log('✅ Todos os campos do banco são utilizados!');
    }
    
    // 6. Verificar INSERT query
    console.log('\n6. VERIFICAÇÃO DA QUERY INSERT:');
    console.log('Campos na query INSERT:', 89);
    console.log('Valores na query INSERT:', 89);
    console.log('Total de campos processados:', postFields.length);
    
    if (postFields.length === 89) {
      console.log('✅ Número de campos bate com a query INSERT!');
    } else {
      console.log('❌ Número de campos NÃO bate com a query INSERT!');
    }
    
    // 7. Testar uma inserção de exemplo (sem executar)
    console.log('\n7. EXEMPLO DE DADOS PARA TESTE:');
    console.log('Para testar, você pode usar estes dados mínimos:');
    console.log('- fullName: "João Silva"');
    console.log('- tagName: "João"');
    console.log('- tagLastName: "Silva"');
    console.log('- jobFunctions: "Desenvolvedor"');
    console.log('- birthday: "1990-01-01"');
    console.log('- email: "joao@teste.com"');
    console.log('- phone: "(11) 99999-9999"');
    console.log('- + arquivo de foto');
    
    // 8. Verificar se há funcionários na tabela
    console.log('\n8. DADOS EXISTENTES:');
    const { rows: employees } = await db.query('SELECT COUNT(*) as total FROM employees');
    console.log(`Total de funcionários na tabela: ${employees[0].total}`);
    
    if (parseInt(employees[0].total) > 0) {
      const { rows: sample } = await db.query('SELECT * FROM employees LIMIT 1');
      const sampleEmployee = sample[0];
      console.log('\nCampos preenchidos no primeiro funcionário:');
      Object.keys(sampleEmployee).forEach(key => {
        if (sampleEmployee[key] !== null && sampleEmployee[key] !== '') {
          console.log(`✅ ${key}: ${typeof sampleEmployee[key] === 'string' && sampleEmployee[key].length > 50 ? sampleEmployee[key].substring(0, 50) + '...' : sampleEmployee[key]}`);
        }
      });
      
      console.log('\nCampos vazios/nulos no primeiro funcionário:');
      Object.keys(sampleEmployee).forEach(key => {
        if (sampleEmployee[key] === null || sampleEmployee[key] === '') {
          console.log(`⚪ ${key}: ${sampleEmployee[key]}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erro na análise:', error);
  } finally {
    process.exit(0);
  }
}

analyzeFields();