// src/routes/employees.js
const cloudinary = require("../config/cloudinary");
const db = require("../config/db");
const pdfService = require("../services/pdf.service");

async function employeeRoutes(fastify) {
  fastify.log.info("Registrando plugin employeeRoutes...");

  // GET /employees - Retorna todos os funcionários do banco
  fastify.get(
    "/",
    {
      schema: {
        summary: "Lista todos os funcionários",
        response: {
          200: {
            description: "Lista de funcionários",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                companyNumber: { type: "integer" },
                companyName: { type: "string" },
                fullName: { type: "string" },
                email: { type: "string" },
                tagName: { type: "string" },
                tagLastName: { type: "string" },
                birthday: { type: "string", format: "date" },
                age: { type: "string" },
                cep: { type: "string" },
                employeeAddress: { type: "string" },
                employeeAddressNumber: { type: "string" },
                employeeAddressComplement: { type: "string" },
                employeeNeighborhood: { type: "string" },
                employeeAddressCity: { type: "string" },
                employeeAddressState: { type: "string" },
                phone: { type: "string" },
                mobile: { type: "string" },
                naturalness: { type: "string" },
                nationality: { type: "string" },
                fatherName: { type: "string" },
                motherName: { type: "string" },
                mealValue: { type: "number" },
                deficiency: { type: "boolean" },
                deficiencyDescription: { type: "string" },
                transport: { type: "boolean" },
                transportType: { type: "string" },
                transportValue: { type: "number" },
                partnerName: { type: "string" },
                partnerCpf: { type: "string" },
                partnerBirthday: { type: "string", format: "date" },
                partnerRg: { type: "string" },
                photoUrl: { type: "string" }, // agora é photoUrl
                gender: { type: "string" },
                maritalStatus: { type: "string" },
                graduation: { type: "string" },
                skinColor: { type: "string" },
                rg: { type: "string" },
                rgEmitter: { type: "string" },
                rgEmissionDate: { type: "string", format: "date" },
                cpf: { type: "string" },
                pisPasep: { type: "string" },
                voterTitle: { type: "string" },
                voterZone: { type: "string" },
                voterSection: { type: "string" },
                voterEmission: { type: "string", format: "date" },
                militaryCertificate: { type: "string" },
                ctps: { type: "string" },
                ctpsSerie: { type: "string" },
                driversLicense: { type: "boolean" },
                driversLicenseNumber: { type: "string" },
                driversLicenseEmissionDate: { type: "string", format: "date" },
                driversLicenseExpirationDate: {
                  type: "string",
                  format: "date",
                },
                driversLicenseCategory: { type: "string" },
                healthPlan: { type: "string" },
                healthCardNumber: { type: "string" },
                collegeCep: { type: "string" },
                traineeAddress: { type: "string" },
                traineeAddressNumber: { type: "integer" },
                traineeAddressNeighborhood: { type: "string" },
                traineeAddressComplement: { type: "string" },
                traineeAddressState: { type: "string" },
                traineeAddressCity: { type: "string" },
                college: { type: "string" },
                course: { type: "string" },
                trainingPeriod: { type: "string" },
                lifeInsurancePolicy: { type: "string" },
                ra: { type: "string" },
                jobFunctions: { type: "string" },
                admissionDate: { type: "string", format: "date" },
                periodWork: { type: "string" },
                contractExpirationDate: { type: "string", format: "date" },
                dailyHours: { type: "string" },
                weeklyHours: { type: "string" },
                monthlyHours: { type: "string" },
                weeklyClasses: { type: "string" },
                hasAccumulate: { type: "boolean" },
                hasAccumulateCompany: { type: "string" },
                salary: { type: "number" },
                salaryBank: { type: "string" },
                salaryAgency: { type: "string" },
                salaryAccount: { type: "string" },
                salaryAccountType: { type: "string" },
                familySalary: { type: "number" },
                parenting: { type: "string" },
                irpf: { type: "string" },
                status: { type: "string" },
                jobPosition: { type: "string" },
                department: { type: "string" },
                userId: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          },
          500: {
            description: "Erro ao buscar funcionários",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      try {
        const { rows } = await db.query(`
        SELECT
          id,
          company_number AS "companyNumber",
          company_name AS "companyName",
          full_name AS "fullName",
          email,
          tag_name AS "tagName",
          tag_last_name AS "tagLastName",
          birthday,
          age,
          cep,
          employee_address AS "employeeAddress",
          employee_address_number AS "employeeAddressNumber",
          employee_address_complement AS "employeeAddressComplement",
          employee_neighborhood AS "employeeNeighborhood",
          employee_address_city AS "employeeAddressCity",
          employee_address_state AS "employeeAddressState",
          phone,
          mobile,
          naturalness,
          nationality,
          father_name AS "fatherName",
          mother_name AS "motherName",
          meal_value AS "mealValue",
          deficiency,
          deficiency_description AS "deficiencyDescription",
          transport,
          transport_type AS "transportType",
          transport_value AS "transportValue",
          partner_name AS "partnerName",
          partner_cpf AS "partnerCpf",
          partner_birthday AS "partnerBirthday",
          partner_rg AS "partnerRg",
          gender,
          marital_status AS "maritalStatus",
          graduation,
          skin_color AS "skinColor",
          rg,
          rg_emitter AS "rgEmitter",
          rg_emission_date AS "rgEmissionDate",
          cpf,
          pis_pasep AS "pisPasep",
          voter_title AS "voterTitle",
          voter_zone AS "voterZone",
          voter_section AS "voterSection",
          voter_emission AS "voterEmission",
          military_certificate AS "militaryCertificate",
          ctps,
          ctps_serie AS "ctpsSerie",
          drivers_license AS "driversLicense",
          drivers_license_number AS "driversLicenseNumber",
          drivers_license_emission_date AS "driversLicenseEmissionDate",
          drivers_license_expiration_date AS "driversLicenseExpirationDate",
          drivers_license_category AS "driversLicenseCategory",
          health_plan AS "healthPlan",
          health_card_number AS "healthCardNumber",
          college_cep AS "collegeCep",
          trainee_address AS "traineeAddress",
          trainee_address_number AS "traineeAddressNumber",
          trainee_address_neighborhood AS "traineeAddressNeighborhood",
          trainee_address_complement AS "traineeAddressComplement",
          trainee_address_state AS "traineeAddressState",
          trainee_address_city AS "traineeAddressCity",
          college,
          course,
          training_period AS "trainingPeriod",
          life_insurance_policy AS "lifeInsurancePolicy",
          ra,
          job_functions AS "jobFunctions",
          admission_date AS "admissionDate",
          period_work AS "periodWork",
          contract_expiration_date AS "contractExpirationDate",
          daily_hours AS "dailyHours",
          weekly_hours AS "weeklyHours",
          monthly_hours AS "monthlyHours",
          weekly_classes AS "weeklyClasses",
          has_accumulate AS "hasAccumulate",
          has_accumulate_company AS "hasAccumulateCompany",
          salary,
          salary_bank AS "salaryBank",
          salary_agency AS "salaryAgency",
          salary_account AS "salaryAccount",
          salary_account_type AS "salaryAccountType",
          family_salary AS "familySalary",
          parenting,
          irpf,
          status,
          job_position AS "jobPosition",
          department,
          user_id AS "userId",
          photo_url AS "photoUrl",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM employees
      `);
        return rows;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: "Erro ao buscar funcionários" });
      }
    }
  );

  // POST /employees - Create a new employee with photo upload
  fastify.post("/", {
    schema: {
      consumes: ['multipart/form-data'],
      description: 'Create a new employee with photo upload',
      tags: ['employees'],
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            full_name: { type: 'string' },
            job_functions: { type: 'string' },
            birthday: { type: 'string', format: 'date' },
            photo_url: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    request.log.info("Recebida requisição POST /employees");
    try {
      // Validação do Content-Type melhorada
      const contentType = request.headers['content-type'];
      if (!contentType || !contentType.includes('multipart/form-data')) {
        request.log.warn(`Validação falhou: Content-Type incorreto (${contentType})`);
        reply.code(400);
        return { 
          error: "Invalid Content-Type", 
          message: "Content-Type deve ser multipart/form-data para upload de arquivos" 
        };
      }
      
      request.log.info("Processando multipart/form-data...");
      const parts = request.parts();

      // Campos obrigatórios
      let fullName, tagName, tagLastName;
      let fileBuffer, fileType;
      
      // Campos opcionais - dados básicos
      let companyNumber, companyName, email, birthday, age;
      
      // Endereço
      let cep, employeeAddress, employeeAddressNumber, employeeAddressComplement;
      let employeeNeighborhood, employeeAddressCity, employeeAddressState;
      
      // Contatos
      let phone, mobile;
      
      // Informações pessoais
      let naturalness, nationality, fatherName, motherName;
      
      // Benefícios
      let mealValue, deficiency, deficiencyDescription, transport, transportType, transportValue;
      
      // Informações do cônjuge
      let partnerName, partnerCpf, partnerBirthday, partnerRg;
      
      // Informações pessoais adicionais
      let gender, maritalStatus, graduation, skinColor;
      
      // Documentos
      let rg, rgEmitter, rgEmissionDate, cpf, pisPasep;
      let voterTitle, voterZone, voterSection, voterEmission;
      let militaryCertificate, ctps, ctpsSerie;
      
      // Carteira de motorista
      let driversLicense, driversLicenseNumber, driversLicenseEmissionDate;
      let driversLicenseExpirationDate, driversLicenseCategory;
      
      // Plano de saúde
      let healthPlan, healthCardNumber;
      
      // Informações acadêmicas
      let collegeCep, traineeAddress, traineeAddressNumber, traineeAddressNeighborhood;
      let traineeAddressComplement, traineeAddressState, traineeAddressCity;
      let college, course, trainingPeriod, lifeInsurancePolicy, ra;
      
      // Informações de trabalho
      let jobFunctions, admissionDate, periodWork, contractExpirationDate;
      let dailyHours, weeklyHours, monthlyHours, weeklyClasses;
      let hasAccumulate, hasAccumulateCompany;
      
      // Informações salariais
      let salary, salaryBank, salaryAgency, salaryAccount, salaryAccountType;
      let familySalary, parenting, irpf;
      
      // Status e controle
      let status, jobPosition, department, userId;
      
      // Processar cada parte do multipart/form-data
      try {
        for await (const part of parts) {
          request.log.info(`Processando parte: ${part.type} - ${part.fieldname}`);
          
          if (part.type === 'file') {
            // Validações adicionais para arquivo
            if (!part.filename) {
              throw new Error("Nome do arquivo não fornecido");
            }
            
            // Validar extensão do arquivo
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            const fileExtension = part.filename.toLowerCase().substring(part.filename.lastIndexOf('.'));
            if (!allowedExtensions.includes(fileExtension)) {
              throw new Error(`Extensão de arquivo não permitida: ${fileExtension}. Permitidas: ${allowedExtensions.join(', ')}`);
            }
            
            request.log.info(`Recebido arquivo: ${part.filename}, mimetype: ${part.mimetype}`);
            fileType = part.mimetype;
            
            // Ler o arquivo para um buffer usando toBuffer()
            fileBuffer = await part.toBuffer();
            
            // Validar tamanho do arquivo (máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (fileBuffer.length > maxSize) {
              throw new Error(`Arquivo muito grande: ${fileBuffer.length} bytes. Máximo permitido: ${maxSize} bytes`);
            }
            
            request.log.info(`Arquivo lido com tamanho: ${fileBuffer.length} bytes`);
          } else {
            // Processar campos de texto com validação
            const value = await part.value;
            
            // Validar se o valor não está vazio
            if (!value || value.trim() === '') {
              request.log.warn(`Campo ${part.fieldname} está vazio`);
              continue;
            }
            
            request.log.info(`Campo ${part.fieldname}: ${value}`);
            
            // Processamento de todos os campos
            switch (part.fieldname) {
              // Campos obrigatórios
              case 'fullName':
                if (value.trim().length < 2 || value.trim().length > 100) {
                  throw new Error("Nome completo deve ter entre 2 e 100 caracteres");
                }
                fullName = value.trim();
                break;
              case 'tagName':
                if (value.trim().length < 1 || value.trim().length > 50) {
                  throw new Error("Nome para crachá deve ter entre 1 e 50 caracteres");
                }
                tagName = value.trim();
                break;
              case 'tagLastName':
                if (value.trim().length < 1 || value.trim().length > 50) {
                  throw new Error("Sobrenome para crachá deve ter entre 1 e 50 caracteres");
                }
                tagLastName = value.trim();
                break;
                
              // Campos básicos
              case 'companyNumber':
                companyNumber = value ? parseInt(value) : null;
                break;
              case 'companyName':
                companyName = value.trim() || null;
                break;
              case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  throw new Error("Email inválido");
                }
                email = value.trim() || null;
                break;
              case 'birthday':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de nascimento deve estar no formato YYYY-MM-DD");
                }
                if (value && new Date(value) > new Date()) {
                  throw new Error("Data de nascimento não pode ser futura");
                }
                birthday = value || null;
                break;
              case 'age':
                age = value.trim() || null;
                break;
                
              // Endereço
              case 'cep':
                cep = value.trim() || null;
                break;
              case 'employeeAddress':
                employeeAddress = value.trim() || null;
                break;
              case 'employeeAddressNumber':
                employeeAddressNumber = value.trim() || null;
                break;
              case 'employeeAddressComplement':
                employeeAddressComplement = value.trim() || null;
                break;
              case 'employeeNeighborhood':
                employeeNeighborhood = value.trim() || null;
                break;
              case 'employeeAddressCity':
                employeeAddressCity = value.trim() || null;
                break;
              case 'employeeAddressState':
                employeeAddressState = value.trim() || null;
                break;
                
              // Contatos
              case 'phone':
                phone = value.trim() || null;
                break;
              case 'mobile':
                mobile = value.trim() || null;
                break;
                
              // Informações pessoais
              case 'naturalness':
                naturalness = value.trim() || null;
                break;
              case 'nationality':
                nationality = value.trim() || null;
                break;
              case 'fatherName':
                fatherName = value.trim() || null;
                break;
              case 'motherName':
                motherName = value.trim() || null;
                break;
                
              // Benefícios
              case 'mealValue':
                mealValue = value ? parseFloat(value) : null;
                break;
              case 'deficiency':
                deficiency = value === 'true' || value === '1';
                break;
              case 'deficiencyDescription':
                deficiencyDescription = value.trim() || null;
                break;
              case 'transport':
                transport = value === 'true' || value === '1';
                break;
              case 'transportType':
                transportType = value.trim() || null;
                break;
              case 'transportValue':
                transportValue = value ? parseFloat(value) : null;
                break;
                
              // Informações do cônjuge
              case 'partnerName':
                partnerName = value.trim() || null;
                break;
              case 'partnerCpf':
                partnerCpf = value.trim() || null;
                break;
              case 'partnerBirthday':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de nascimento do cônjuge deve estar no formato YYYY-MM-DD");
                }
                partnerBirthday = value || null;
                break;
              case 'partnerRg':
                partnerRg = value.trim() || null;
                break;
                
              // Informações pessoais adicionais
              case 'gender':
                gender = value.trim() || null;
                break;
              case 'maritalStatus':
                maritalStatus = value.trim() || null;
                break;
              case 'graduation':
                graduation = value.trim() || null;
                break;
              case 'skinColor':
                skinColor = value.trim() || null;
                break;
                
              // Documentos
              case 'rg':
                rg = value.trim() || null;
                break;
              case 'rgEmitter':
                rgEmitter = value.trim() || null;
                break;
              case 'rgEmissionDate':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de emissão do RG deve estar no formato YYYY-MM-DD");
                }
                rgEmissionDate = value || null;
                break;
              case 'cpf':
                cpf = value.trim() || null;
                break;
              case 'pisPasep':
                pisPasep = value.trim() || null;
                break;
              case 'voterTitle':
                voterTitle = value.trim() || null;
                break;
              case 'voterZone':
                voterZone = value.trim() || null;
                break;
              case 'voterSection':
                voterSection = value.trim() || null;
                break;
              case 'voterEmission':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de emissão do título deve estar no formato YYYY-MM-DD");
                }
                voterEmission = value || null;
                break;
              case 'militaryCertificate':
                militaryCertificate = value.trim() || null;
                break;
              case 'ctps':
                ctps = value.trim() || null;
                break;
              case 'ctpsSerie':
                ctpsSerie = value.trim() || null;
                break;
                
              // Carteira de motorista
              case 'driversLicense':
                driversLicense = value === 'true' || value === '1';
                break;
              case 'driversLicenseNumber':
                driversLicenseNumber = value.trim() || null;
                break;
              case 'driversLicenseEmissionDate':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de emissão da CNH deve estar no formato YYYY-MM-DD");
                }
                driversLicenseEmissionDate = value || null;
                break;
              case 'driversLicenseExpirationDate':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de validade da CNH deve estar no formato YYYY-MM-DD");
                }
                driversLicenseExpirationDate = value || null;
                break;
              case 'driversLicenseCategory':
                driversLicenseCategory = value.trim() || null;
                break;
                
              // Plano de saúde
              case 'healthPlan':
                healthPlan = value.trim() || null;
                break;
              case 'healthCardNumber':
                healthCardNumber = value.trim() || null;
                break;
                
              // Informações acadêmicas
              case 'collegeCep':
                collegeCep = value.trim() || null;
                break;
              case 'traineeAddress':
                traineeAddress = value.trim() || null;
                break;
              case 'traineeAddressNumber':
                traineeAddressNumber = value ? parseInt(value) : null;
                break;
              case 'traineeAddressNeighborhood':
                traineeAddressNeighborhood = value.trim() || null;
                break;
              case 'traineeAddressComplement':
                traineeAddressComplement = value.trim() || null;
                break;
              case 'traineeAddressState':
                traineeAddressState = value.trim() || null;
                break;
              case 'traineeAddressCity':
                traineeAddressCity = value.trim() || null;
                break;
              case 'college':
                college = value.trim() || null;
                break;
              case 'course':
                course = value.trim() || null;
                break;
              case 'trainingPeriod':
                trainingPeriod = value.trim() || null;
                break;
              case 'lifeInsurancePolicy':
                lifeInsurancePolicy = value.trim() || null;
                break;
              case 'ra':
                ra = value.trim() || null;
                break;
                
              // Informações de trabalho
              case 'jobFunctions':
                if (value.trim().length > 0 && (value.trim().length < 2 || value.trim().length > 100)) {
                  throw new Error("Cargo deve ter entre 2 e 100 caracteres");
                }
                jobFunctions = value.trim() || null;
                break;
              case 'admissionDate':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de admissão deve estar no formato YYYY-MM-DD");
                }
                admissionDate = value || null;
                break;
              case 'periodWork':
                periodWork = value.trim() || null;
                break;
              case 'contractExpirationDate':
                if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  throw new Error("Data de expiração do contrato deve estar no formato YYYY-MM-DD");
                }
                contractExpirationDate = value || null;
                break;
              case 'dailyHours':
                dailyHours = value.trim() || null;
                break;
              case 'weeklyHours':
                weeklyHours = value.trim() || null;
                break;
              case 'monthlyHours':
                monthlyHours = value.trim() || null;
                break;
              case 'weeklyClasses':
                weeklyClasses = value.trim() || null;
                break;
              case 'hasAccumulate':
                hasAccumulate = value === 'true' || value === '1';
                break;
              case 'hasAccumulateCompany':
                hasAccumulateCompany = value.trim() || null;
                break;
                
              // Informações salariais
              case 'salary':
                salary = value ? parseFloat(value) : null;
                break;
              case 'salaryBank':
                salaryBank = value.trim() || null;
                break;
              case 'salaryAgency':
                salaryAgency = value.trim() || null;
                break;
              case 'salaryAccount':
                salaryAccount = value.trim() || null;
                break;
              case 'salaryAccountType':
                salaryAccountType = value.trim() || null;
                break;
              case 'familySalary':
                familySalary = value ? parseFloat(value) : null;
                break;
              case 'parenting':
                parenting = value.trim() || null;
                break;
              case 'irpf':
                irpf = value.trim() || null;
                break;
                
              // Status e controle
              case 'status':
                status = value.trim() || 'Ativo';
                break;
              case 'jobPosition':
                jobPosition = value.trim() || null;
                break;
              case 'department':
                department = value.trim() || null;
                break;
              case 'userId':
                userId = value.trim() || null;
                break;
                
              default:
                request.log.warn(`Campo desconhecido: ${part.fieldname}`);
                break;
            }
          }
        }
      } catch (err) {
        request.log.error({ msg: "Erro ao processar multipart/form-data", error: err.message });
        reply.code(400);
        return { 
          error: "Form Processing Error", 
          message: err.message || "Erro ao processar o formulário. Verifique se todos os campos estão corretos." 
        };
      }

      request.log.info(
        `Campos extraídos: fullName=${fullName}, tagName=${tagName}, tagLastName=${tagLastName}, jobFunctions=${jobFunctions}, birthday=${birthday}`
      );

      // --- 1. Validation ---
      request.log.info("Iniciando validação...");
      if (!fullName || !tagName || !tagLastName) {
        request.log.warn("Validação falhou: Campos obrigatórios faltando.");
        reply.code(400);
        return { 
          error: "Missing Required Fields", 
          message: "Campos obrigatórios faltando: Nome completo, Nome para crachá e Sobrenome para crachá são obrigatórios." 
        };
      }
      if (!fileBuffer) {
        request.log.warn("Validação falhou: Arquivo de foto faltando.");
        reply.code(400);
        return { 
          error: "Missing File", 
          message: "Arquivo de foto obrigatório faltando." 
        };
      }

      if (!["image/jpeg", "image/png"].includes(fileType)) {
        request.log.warn(
          `Validação falhou: Formato de arquivo inválido (${fileType}).`
        );
        reply.code(400);

        return { 
          error: "Invalid File Format", 
          message: "Formato de arquivo inválido. Apenas JPEG ou PNG são permitidos." 
        };
      }
      request.log.info("Validação concluída com sucesso.");

      // --- 2. Upload to Cloudinary ---
      request.log.info(
        `Buffer já criado com tamanho: ${fileBuffer.length} bytes.`
      );

      request.log.info("Iniciando upload para Cloudinary...");
      const cloudinaryResult = await new Promise((resolve, reject) => {
        request.log.info("Criando upload_stream do Cloudinary...");
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "maple-employees",

            public_id: `employee_${Date.now()}`, // Unique identifier
            transformation: [
              { width: 500, height: 500, crop: "limit" }, // Resize if larger than 500x500
              { quality: "auto" }, // Optimize quality
              { format: "jpg" } // Convert to JPG for consistency
            ]

          },
          (error, result) => {
            if (error) {
              request.log.error({
                msg: "Erro no callback do upload_stream Cloudinary",
                error: error,
              }); // Log the full error object
              reject(error);
            } else {
              request.log.info(
                "Sucesso no callback do upload_stream Cloudinary."
              );
              resolve(result);
            }
          }
        );
        request.log.info("Enviando buffer para upload_stream.end()...");
        uploadStream.end(fileBuffer);
        request.log.info(
          "Buffer enviado para upload_stream.end(). Aguardando callback..."
        );
      });
      request.log.info("Upload para Cloudinary concluído.");

      if (!cloudinaryResult || !cloudinaryResult.secure_url) {
        request.log.error(
          "Falha no resultado do upload para o Cloudinary:",
          cloudinaryResult
        );
        throw new Error("Falha no upload para o Cloudinary");
      }

      const photoUrl = cloudinaryResult.secure_url;
      request.log.info(`URL da foto obtida: ${photoUrl}`);

      // --- 3. Save to Database ---
      request.log.info("Iniciando inserção no banco de dados...");
      const insertQuery = `
        INSERT INTO employees (
          full_name, tag_name, tag_last_name, job_functions, birthday, photo_url,
          company_number, company_name, email, age,
          cep, employee_address, employee_address_number, employee_address_complement,
          employee_neighborhood, employee_address_city, employee_address_state,
          phone, mobile, naturalness, nationality, father_name, mother_name,
          meal_value, deficiency, deficiency_description, transport, transport_type, transport_value,
          partner_name, partner_cpf, partner_birthday, partner_rg,
          gender, marital_status, graduation, skin_color,
          rg, rg_emitter, rg_emission_date, cpf, pis_pasep,
          voter_title, voter_zone, voter_section, voter_emission,
          military_certificate, ctps, ctps_serie,
          drivers_license, drivers_license_number, drivers_license_emission_date,
          drivers_license_expiration_date, drivers_license_category,
          health_plan, health_card_number,
          college_cep, trainee_address, trainee_address_number, trainee_address_neighborhood,
          trainee_address_complement, trainee_address_state, trainee_address_city,
          college, course, training_period, life_insurance_policy, ra,
          admission_date, period_work, contract_expiration_date,
          daily_hours, weekly_hours, monthly_hours, weekly_classes,
          has_accumulate, has_accumulate_company,
          salary, salary_bank, salary_agency, salary_account, salary_account_type,
          family_salary, parenting, irpf,
          status, job_position, department, user_id
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17,
          $18, $19, $20, $21, $22, $23,
          $24, $25, $26, $27, $28, $29,
          $30, $31, $32, $33,
          $34, $35, $36, $37,
          $38, $39, $40, $41, $42,
          $43, $44, $45, $46,
          $47, $48, $49,
          $50, $51, $52,
          $53, $54,
          $55, $56,
          $57, $58, $59, $60,
          $61, $62, $63,
          $64, $65, $66, $67, $68,
          $69, $70, $71,
          $72, $73, $74, $75,
          $76, $77,
          $78, $79, $80, $81, $82,
          $83, $84, $85,
          $86, $87, $88, $89
        )
        RETURNING id, full_name, tag_name, tag_last_name, job_functions, birthday, photo_url, email, phone, mobile, status, created_at;
      `;
      
      const values = [
        // Campos básicos (1-6)
        fullName, tagName, tagLastName, jobFunctions, birthday || null, photoUrl,
        // Campos básicos adicionais (7-10)
        companyNumber, companyName, email, age,
        // Endereço (11-17)
        cep, employeeAddress, employeeAddressNumber, employeeAddressComplement,
        employeeNeighborhood, employeeAddressCity, employeeAddressState,
        // Contatos (18-19)
        phone, mobile,
        // Informações pessoais (20-23)
        naturalness, nationality, fatherName, motherName,
        // Benefícios (24-29)
        mealValue, deficiency, deficiencyDescription, transport, transportType, transportValue,
        // Informações do cônjuge (30-33)
        partnerName, partnerCpf, partnerBirthday, partnerRg,
        // Informações pessoais adicionais (34-37)
        gender, maritalStatus, graduation, skinColor,
        // Documentos (38-42)
        rg, rgEmitter, rgEmissionDate, cpf, pisPasep,
        // Título de eleitor (43-46)
        voterTitle, voterZone, voterSection, voterEmission,
        // Documentos adicionais (47-49)
        militaryCertificate, ctps, ctpsSerie,
        // Carteira de motorista (50-54)
        driversLicense, driversLicenseNumber, driversLicenseEmissionDate,
        driversLicenseExpirationDate, driversLicenseCategory,
        // Plano de saúde (55-56)
        healthPlan, healthCardNumber,
        // Informações acadêmicas (57-63)
        collegeCep, traineeAddress, traineeAddressNumber, traineeAddressNeighborhood,
        traineeAddressComplement, traineeAddressState, traineeAddressCity,
        // Informações acadêmicas continuação (64-68)
        college, course, trainingPeriod, lifeInsurancePolicy, ra,
        // Informações de trabalho (69-71)
        admissionDate, periodWork, contractExpirationDate,
        // Horas de trabalho (72-75)
        dailyHours, weeklyHours, monthlyHours, weeklyClasses,
        // Acúmulo (76-77)
        hasAccumulate, hasAccumulateCompany,
        // Informações salariais (78-82)
        salary, salaryBank, salaryAgency, salaryAccount, salaryAccountType,
        // Informações salariais continuação (83-85)
        familySalary, parenting, irpf,
        // Status e controle (86-89)
        status || 'Ativo', jobPosition, department, userId
      ];

      const dbResult = await db.query(insertQuery, values);
      const newEmployee = dbResult.rows[0];
      request.log.info(
        `Funcionário inserido no banco com ID: ${newEmployee.id}`
      );

      // --- 4. Return Success Response ---
      request.log.info("Enviando resposta de sucesso (201 Created).");
      reply.code(201);
      return newEmployee;
    } catch (error) {
      request.log.error({
        msg: "Erro geral ao criar funcionário",
        error_message: error.message,
        error_code: error.code,
        error_detail: error.detail,
        error_stack: error.stack,
      }); // Log specific properties of the DB error
      
      if (error.message.includes("Cloudinary")) {
        reply.code(500);

        return { 
          error: "Upload Error", 
          message: "Erro interno ao fazer upload da imagem." 
        };
      } else if (error.code === "23505") { 
        reply.code(409); 
        return { 
          error: "Duplicate Data", 
          message: "Erro ao salvar no banco de dados: Dados duplicados.", 
          detail: error.detail 
        };
      } else if (error.code && error.code.startsWith("23")) { // Other DB constraint errors
        reply.code(400);
        return { 
          error: "Database Constraint Error", 
          message: "Erro de validação no banco de dados.", 
          detail: error.detail 

        };
      } else {
        reply.code(500);
        return { 
          error: "Internal Server Error", 
          message: "Erro interno do servidor ao processar a requisição." 
        };
      }
    }
  });

  // GET /employees/:id - Buscar funcionário por ID
  fastify.get(
    "/:id",
    {
      schema: {
        summary: "Busca funcionário por ID",
        params: {
          type: "object",
          properties: {
            id: { type: "integer", minimum: 1 }
          },
          required: ["id"]
        },
        response: {
          200: {
            description: "Funcionário encontrado",
            type: "object",
            properties: {
              id: { type: "integer" },
              fullName: { type: "string" },
              jobFunctions: { type: "string" },
              birthday: { type: "string", format: "date" },
              photoUrl: { type: "string" },
              // ... outros campos conforme necessário
            }
          },
          404: {
            description: "Funcionário não encontrado",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        request.log.info(`Buscando funcionário com ID: ${id}`);
        
        const { rows } = await db.query(
          `SELECT 
            id,
            full_name AS "fullName",
            job_functions AS "jobFunctions",
            birthday,
            photo_url AS "photoUrl",
            email,
            phone,
            mobile,
            cpf,
            rg,
            status,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
          FROM employees 
          WHERE id = $1`,
          [id]
        );
        
        if (rows.length === 0) {
          reply.code(404);
          return {
            error: "Employee Not Found",
            message: "Funcionário não encontrado"
          };
        }
        
        return rows[0];
      } catch (error) {
        request.log.error("Erro ao buscar funcionário:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro interno do servidor"
        };
      }
    }
  );

  // PUT /employees/:id - Atualizar funcionário
  fastify.put(
    "/:id",
    {
      schema: {
        summary: "Atualiza funcionário por ID",
        params: {
          type: "object",
          properties: {
            id: { type: "integer", minimum: 1 }
          },
          required: ["id"]
        },
        body: {
          type: "object",
          properties: {
            fullName: { type: "string", minLength: 2, maxLength: 100 },
            jobFunctions: { type: "string", minLength: 2, maxLength: 100 },
            birthday: { type: "string", format: "date" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            mobile: { type: "string" },
            status: { type: "string", enum: ["Ativo", "Inativo", "Licença"] }
          }
        },
        response: {
          200: {
            description: "Funcionário atualizado",
            type: "object",
            properties: {
              id: { type: "integer" },
              fullName: { type: "string" },
              jobFunctions: { type: "string" },
              updatedAt: { type: "string", format: "date-time" }
            }
          },
          404: {
            description: "Funcionário não encontrado",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const updateData = request.body;
        
        request.log.info(`Atualizando funcionário ID: ${id}`, updateData);
        
        // Verificar se funcionário existe
        const existsQuery = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
        if (existsQuery.rows.length === 0) {
          reply.code(404);
          return {
            error: "Employee Not Found",
            message: "Funcionário não encontrado"
          };
        }
        
        // Construir query de update dinamicamente para todos os campos
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;
        
        // Campos básicos
        if (updateData.fullName) {
          updateFields.push(`full_name = $${paramCount}`);
          updateValues.push(updateData.fullName);
          paramCount++;
        }
        
        if (updateData.tagName) {
          updateFields.push(`tag_name = $${paramCount}`);
          updateValues.push(updateData.tagName);
          paramCount++;
        }
        
        if (updateData.tagLastName) {
          updateFields.push(`tag_last_name = $${paramCount}`);
          updateValues.push(updateData.tagLastName);
          paramCount++;
        }
        
        if (updateData.jobFunctions) {
          updateFields.push(`job_functions = $${paramCount}`);
          updateValues.push(updateData.jobFunctions);
          paramCount++;
        }
        
        if (updateData.birthday) {
          updateFields.push(`birthday = $${paramCount}`);
          updateValues.push(updateData.birthday);
          paramCount++;
        }
        
        if (updateData.companyNumber !== undefined) {
          updateFields.push(`company_number = $${paramCount}`);
          updateValues.push(updateData.companyNumber);
          paramCount++;
        }
        
        if (updateData.companyName) {
          updateFields.push(`company_name = $${paramCount}`);
          updateValues.push(updateData.companyName);
          paramCount++;
        }
        
        if (updateData.email) {
          updateFields.push(`email = $${paramCount}`);
          updateValues.push(updateData.email);
          paramCount++;
        }
        
        if (updateData.age) {
          updateFields.push(`age = $${paramCount}`);
          updateValues.push(updateData.age);
          paramCount++;
        }
        
        // Endereço
        if (updateData.cep) {
          updateFields.push(`cep = $${paramCount}`);
          updateValues.push(updateData.cep);
          paramCount++;
        }
        
        if (updateData.employeeAddress) {
          updateFields.push(`employee_address = $${paramCount}`);
          updateValues.push(updateData.employeeAddress);
          paramCount++;
        }
        
        if (updateData.employeeAddressNumber) {
          updateFields.push(`employee_address_number = $${paramCount}`);
          updateValues.push(updateData.employeeAddressNumber);
          paramCount++;
        }
        
        if (updateData.employeeAddressComplement) {
          updateFields.push(`employee_address_complement = $${paramCount}`);
          updateValues.push(updateData.employeeAddressComplement);
          paramCount++;
        }
        
        if (updateData.employeeNeighborhood) {
          updateFields.push(`employee_neighborhood = $${paramCount}`);
          updateValues.push(updateData.employeeNeighborhood);
          paramCount++;
        }
        
        if (updateData.employeeAddressCity) {
          updateFields.push(`employee_address_city = $${paramCount}`);
          updateValues.push(updateData.employeeAddressCity);
          paramCount++;
        }
        
        if (updateData.employeeAddressState) {
          updateFields.push(`employee_address_state = $${paramCount}`);
          updateValues.push(updateData.employeeAddressState);
          paramCount++;
        }
        
        // Contatos
        if (updateData.phone) {
          updateFields.push(`phone = $${paramCount}`);
          updateValues.push(updateData.phone);
          paramCount++;
        }
        
        if (updateData.mobile) {
          updateFields.push(`mobile = $${paramCount}`);
          updateValues.push(updateData.mobile);
          paramCount++;
        }
        
        // Informações pessoais
        if (updateData.naturalness) {
          updateFields.push(`naturalness = $${paramCount}`);
          updateValues.push(updateData.naturalness);
          paramCount++;
        }
        
        if (updateData.nationality) {
          updateFields.push(`nationality = $${paramCount}`);
          updateValues.push(updateData.nationality);
          paramCount++;
        }
        
        if (updateData.fatherName) {
          updateFields.push(`father_name = $${paramCount}`);
          updateValues.push(updateData.fatherName);
          paramCount++;
        }
        
        if (updateData.motherName) {
          updateFields.push(`mother_name = $${paramCount}`);
          updateValues.push(updateData.motherName);
          paramCount++;
        }
        
        // Benefícios
        if (updateData.mealValue !== undefined) {
          updateFields.push(`meal_value = $${paramCount}`);
          updateValues.push(updateData.mealValue);
          paramCount++;
        }
        
        if (updateData.deficiency !== undefined) {
          updateFields.push(`deficiency = $${paramCount}`);
          updateValues.push(updateData.deficiency);
          paramCount++;
        }
        
        if (updateData.deficiencyDescription) {
          updateFields.push(`deficiency_description = $${paramCount}`);
          updateValues.push(updateData.deficiencyDescription);
          paramCount++;
        }
        
        if (updateData.transport !== undefined) {
          updateFields.push(`transport = $${paramCount}`);
          updateValues.push(updateData.transport);
          paramCount++;
        }
        
        if (updateData.transportType) {
          updateFields.push(`transport_type = $${paramCount}`);
          updateValues.push(updateData.transportType);
          paramCount++;
        }
        
        if (updateData.transportValue !== undefined) {
          updateFields.push(`transport_value = $${paramCount}`);
          updateValues.push(updateData.transportValue);
          paramCount++;
        }
        
        // Documentos
        if (updateData.cpf) {
          updateFields.push(`cpf = $${paramCount}`);
          updateValues.push(updateData.cpf);
          paramCount++;
        }
        
        if (updateData.rg) {
          updateFields.push(`rg = $${paramCount}`);
          updateValues.push(updateData.rg);
          paramCount++;
        }
        
        if (updateData.rgEmitter) {
          updateFields.push(`rg_emitter = $${paramCount}`);
          updateValues.push(updateData.rgEmitter);
          paramCount++;
        }
        
        if (updateData.rgEmissionDate) {
          updateFields.push(`rg_emission_date = $${paramCount}`);
          updateValues.push(updateData.rgEmissionDate);
          paramCount++;
        }
        
        // Status e controle
        if (updateData.status) {
          updateFields.push(`status = $${paramCount}`);
          updateValues.push(updateData.status);
          paramCount++;
        }
        
        if (updateData.jobPosition) {
          updateFields.push(`job_position = $${paramCount}`);
          updateValues.push(updateData.jobPosition);
          paramCount++;
        }
        
        if (updateData.department) {
          updateFields.push(`department = $${paramCount}`);
          updateValues.push(updateData.department);
          paramCount++;
        }
        
        // Informações salariais básicas
        if (updateData.salary !== undefined) {
          updateFields.push(`salary = $${paramCount}`);
          updateValues.push(updateData.salary);
          paramCount++;
        }
        
        if (updateData.salaryBank) {
          updateFields.push(`salary_bank = $${paramCount}`);
          updateValues.push(updateData.salaryBank);
          paramCount++;
        }
        
        // Datas importantes
        if (updateData.admissionDate) {
          updateFields.push(`admission_date = $${paramCount}`);
          updateValues.push(updateData.admissionDate);
          paramCount++;
        }
        
        // Adicionar updated_at
        updateFields.push(`updated_at = NOW()`);
        updateValues.push(id); // ID para WHERE clause
        
        if (updateFields.length === 1) { // Apenas updated_at
          reply.code(400);
          return {
            error: "No Fields to Update",
            message: "Nenhum campo válido fornecido para atualização"
          };
        }
        
        const updateQuery = `
          UPDATE employees 
          SET ${updateFields.join(', ')}
          WHERE id = $${paramCount}
          RETURNING id, full_name AS "fullName", job_functions AS "jobFunctions", updated_at AS "updatedAt"
        `;
        
        const { rows } = await db.query(updateQuery, updateValues);
        
        return rows[0];
      } catch (error) {
        request.log.error("Erro ao atualizar funcionário:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro interno do servidor"
        };
      }
    }
  );

  // DELETE /employees/:id - Deletar funcionário
  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Deleta funcionário por ID",
        params: {
          type: "object",
          properties: {
            id: { type: "integer", minimum: 1 }
          },
          required: ["id"]
        },
        response: {
          200: {
            description: "Funcionário deletado",
            type: "object",
            properties: {
              message: { type: "string" },
              deletedId: { type: "integer" }
            }
          },
          404: {
            description: "Funcionário não encontrado",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        request.log.info(`Deletando funcionário ID: ${id}`);
        
        const { rows } = await db.query(
          'DELETE FROM employees WHERE id = $1 RETURNING id',
          [id]
        );
        
        if (rows.length === 0) {
          reply.code(404);
          return {
            error: "Employee Not Found",
            message: "Funcionário não encontrado"
          };
        }
        
        return {
          message: "Funcionário deletado com sucesso",
          deletedId: parseInt(id)
        };
      } catch (error) {
        request.log.error("Erro ao deletar funcionário:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro interno do servidor"
        };
      }
    }
  );

  // GET /employees/search - Buscar funcionários com filtros
  fastify.get(
    "/search",
    {
      schema: {
        summary: "Busca funcionários com filtros",
        querystring: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 2 },
            jobFunction: { type: "string" },
            status: { type: "string", enum: ["Ativo", "Inativo", "Licença"] },
            limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
            offset: { type: "integer", minimum: 0, default: 0 }
          }
        },
        response: {
          200: {
            description: "Resultados da busca",
            type: "object",
            properties: {
              employees: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    fullName: { type: "string" },
                    jobFunctions: { type: "string" },
                    photoUrl: { type: "string" },
                    status: { type: "string" }
                  }
                }
              },
              total: { type: "integer" },
              limit: { type: "integer" },
              offset: { type: "integer" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { name, jobFunction, status, limit = 20, offset = 0 } = request.query;
        
        request.log.info("Buscando funcionários com filtros:", request.query);
        
        let whereConditions = [];
        let queryParams = [];
        let paramCount = 1;
        
        if (name) {
          whereConditions.push(`full_name ILIKE $${paramCount}`);
          queryParams.push(`%${name}%`);
          paramCount++;
        }
        
        if (jobFunction) {
          whereConditions.push(`job_functions ILIKE $${paramCount}`);
          queryParams.push(`%${jobFunction}%`);
          paramCount++;
        }
        
        if (status) {
          whereConditions.push(`status = $${paramCount}`);
          queryParams.push(status);
          paramCount++;
        }
        
        const whereClause = whereConditions.length > 0 
          ? `WHERE ${whereConditions.join(' AND ')}`
          : '';
        
        // Query para contar total
        const countQuery = `SELECT COUNT(*) as total FROM employees ${whereClause}`;
        const countResult = await db.query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].total);
        
        // Query para buscar funcionários
        const searchQuery = `
          SELECT 
            id,
            full_name AS "fullName",
            job_functions AS "jobFunctions",
            photo_url AS "photoUrl",
            status,
            created_at AS "createdAt"
          FROM employees 
          ${whereClause}
          ORDER BY full_name
          LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;
        
        queryParams.push(limit, offset);
        const { rows } = await db.query(searchQuery, queryParams);
        
        return {
          employees: rows,
          total,
          limit,
          offset
        };
      } catch (error) {
        request.log.error("Erro ao buscar funcionários:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro interno do servidor"
        };
      }
    }
  );

  // POST /employees/:id/badge - Gerar crachá individual
  fastify.get(
    "/:id/badge",
    {
      schema: {
        summary: "Gera crachá em PDF para um funcionário",
        params: {
          type: "object",
          properties: {
            id: { type: "integer", minimum: 1 }
          },
          required: ["id"]
        },
        response: {
          200: {
            description: "PDF do crachá gerado",
            type: "string",
            format: "binary"
          },
          404: {
            description: "Funcionário não encontrado",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        request.log.info(`Gerando crachá para funcionário ID: ${id}`);
        
        // Buscar dados do funcionário
        const { rows } = await db.query(
          `SELECT 
            id,
            full_name AS "fullName",
            job_functions AS "jobFunctions",
            photo_url AS "photoUrl"
          FROM employees 
          WHERE id = $1`,
          [id]
        );
        
        if (rows.length === 0) {
          reply.code(404);
          return {
            error: "Employee Not Found",
            message: "Funcionário não encontrado"
          };
        }
        
        const employee = rows[0];
        
        // Gerar PDF do crachá
        const pdfBuffer = await pdfService.generateBadge(employee);
        
        // Configurar headers para download do PDF
        reply
          .type('application/pdf')
          .header('Content-Disposition', `attachment; filename="cracha_${employee.fullName.replace(/\s+/g, '_')}_${id}.pdf"`)
          .header('Content-Length', pdfBuffer.length)
          .send(pdfBuffer);
          
      } catch (error) {
        request.log.error("Erro ao gerar crachá:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro interno do servidor ao gerar crachá"
        };
      }
    }
  );

  // POST /employees/badges - Gerar múltiplos crachás
  fastify.post(
    "/badges",
    {
      schema: {
        summary: "Gera crachás em PDF para múltiplos funcionários",
        body: {
          type: "object",
          properties: {
            employeeIds: {
              type: "array",
              items: { type: "integer", minimum: 1 },
              minItems: 1,
              maxItems: 50
            }
          },
          required: ["employeeIds"]
        },
        response: {
          200: {
            description: "PDF com múltiplos crachás gerado",
            type: "string",
            format: "binary"
          },
          400: {
            description: "Dados inválidos",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { employeeIds } = request.body;
        request.log.info(`Gerando crachás para funcionários:`, employeeIds);
        
        if (!employeeIds || employeeIds.length === 0) {
          reply.code(400);
          return {
            error: "Invalid Data",
            message: "Lista de IDs de funcionários é obrigatória"
          };
        }
        
        // Buscar dados dos funcionários
        const placeholders = employeeIds.map((_, index) => `${index + 1}`).join(',');
        const { rows } = await db.query(
          `SELECT 
            id,
            full_name AS "fullName",
            job_functions AS "jobFunctions",
            photo_url AS "photoUrl"
          FROM employees 
          WHERE id IN (${placeholders})
          ORDER BY full_name`,
          employeeIds
        );
        
        if (rows.length === 0) {
          reply.code(404);
          return {
            error: "No Employees Found",
            message: "Nenhum funcionário encontrado com os IDs fornecidos"
          };
        }
        
        // Gerar PDF com múltiplos crachás
        const pdfBuffer = await pdfService.generateMultipleBadges(rows);
        
        // Configurar headers para download do PDF
        const timestamp = new Date().toISOString().slice(0, 10);
        reply
          .type('application/pdf')
          .header('Content-Disposition', `attachment; filename="crachas_multiplos_${timestamp}.pdf"`)
          .header('Content-Length', pdfBuffer.length)
          .send(pdfBuffer);
          
      } catch (error) {
        request.log.error("Erro ao gerar múltiplos crachás:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro interno do servidor ao gerar crachás"
        };
      }
    }
  );

  // GET /employees/export - Exportar dados dos funcionários
  fastify.get(
    "/export",
    {
      schema: {
        summary: "Exporta dados dos funcionários em CSV",
        querystring: {
          type: "object",
          properties: {
            format: { type: "string", enum: ["csv", "json"], default: "csv" },
            status: { type: "string", enum: ["Ativo", "Inativo", "Licença"] }
          }
        },
        response: {
          200: {
            description: "Dados exportados",
            type: "string"
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { format = 'csv', status } = request.query;
        request.log.info(`Exportando funcionários - formato: ${format}, status: ${status}`);
        
        let whereClause = '';
        let queryParams = [];
        
        if (status) {
          whereClause = 'WHERE status = $1';
          queryParams.push(status);
        }
        
        const { rows } = await db.query(
          `SELECT 
            id,
            full_name,
            job_functions,
            email,
            phone,
            mobile,
            cpf,
            rg,
            status,
            birthday,
            created_at,
            updated_at
          FROM employees 
          ${whereClause}
          ORDER BY full_name`,
          queryParams
        );
        
        if (format === 'json') {
          reply
            .type('application/json')
            .header('Content-Disposition', `attachment; filename="funcionarios_${new Date().toISOString().slice(0, 10)}.json"`)
            .send(rows);
        } else {
          // Gerar CSV
          const csvHeaders = [
            'ID', 'Nome Completo', 'Cargo', 'Email', 'Telefone', 
            'Celular', 'CPF', 'RG', 'Status', 'Nascimento', 
            'Criado em', 'Atualizado em'
          ];
          
          const csvRows = rows.map(row => [
            row.id,
            `"${row.full_name || ''}"`,
            `"${row.job_functions || ''}"`,
            `"${row.email || ''}"`,
            `"${row.phone || ''}"`,
            `"${row.mobile || ''}"`,
            `"${row.cpf || ''}"`,
            `"${row.rg || ''}"`,
            `"${row.status || ''}"`,
            row.birthday || '',
            row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : '',
            row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : ''
          ]);
          
          const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.join(','))
          ].join('\n');
          
          reply
            .type('text/csv')
            .header('Content-Disposition', `attachment; filename="funcionarios_${new Date().toISOString().slice(0, 10)}.csv"`)
            .send(csvContent);
        }
        
      } catch (error) {
        request.log.error("Erro ao exportar funcionários:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro interno do servidor ao exportar dados"
        };
      }
    }
  );

  // GET /employees/schema - Endpoint de teste para verificar estrutura da tabela
  fastify.get(
    "/schema",
    {
      schema: {
        summary: "Verifica estrutura da tabela employees (apenas para debug)",
        response: {
          200: {
            description: "Estrutura da tabela",
            type: "object",
            properties: {
              columns: { type: "array" },
              sample_data: { type: "object" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        // Verificar estrutura da tabela
        const columnsQuery = `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'employees' 
          ORDER BY ordinal_position;
        `;
        
        const { rows: columns } = await db.query(columnsQuery);
        
        // Tentar buscar um registro de exemplo
        let sampleData = null;
        try {
          const sampleQuery = 'SELECT * FROM employees LIMIT 1';
          const { rows: sample } = await db.query(sampleQuery);
          sampleData = sample[0] || null;
        } catch (error) {
          request.log.warn('Erro ao buscar dados de exemplo:', error.message);
        }
        
        return {
          table_exists: columns.length > 0,
          columns: columns.map(col => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES',
            default: col.column_default
          })),
          total_columns: columns.length,
          sample_data: sampleData
        };
        
      } catch (error) {
        request.log.error("Erro ao verificar estrutura:", error);
        reply.code(500);
        return {
          error: "Internal Server Error",
          message: "Erro ao verificar estrutura da tabela"
        };
      }
    }
  );

  // POST /employees/test - Endpoint de teste para verificar processamento de campos
  fastify.post(
    "/test",
    {
      schema: {
        summary: "Testa processamento de campos (sem salvar no banco)",
        consumes: ['multipart/form-data'],
        response: {
          200: {
            description: "Campos processados com sucesso",
            type: "object",
            properties: {
              message: { type: "string" },
              fields_received: { type: "object" },
              total_fields: { type: "number" }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        // Verificar se é multipart/form-data
        if (!request.isMultipart()) {
          reply.code(400);
          return {
            error: "Invalid Content-Type",
            message: "Content-Type deve ser multipart/form-data para este teste"
          };
        }
        
        const parts = request.parts();
        const fieldsReceived = {};
        let fileReceived = false;
        
        // Processar cada parte
        for await (const part of parts) {
          if (part.type === 'file') {
            fileReceived = true;
            fieldsReceived['file'] = {
              filename: part.filename,
              mimetype: part.mimetype,
              size: (await part.toBuffer()).length
            };
          } else {
            const value = await part.value;
            fieldsReceived[part.fieldname] = value;
          }
        }
        
        return {
          message: "Campos processados com sucesso (teste)",
          file_received: fileReceived,
          fields_received: fieldsReceived,
          total_fields: Object.keys(fieldsReceived).length
        };
        
      } catch (error) {
        request.log.error("Erro no teste:", error);
        reply.code(500);
        return {
          error: "Test Error",
          message: error.message
        };
      }
    }
  );

  // GET /employees/test-fields - Endpoint de teste para validar campos
  fastify.get(
    "/test-fields",
    {
      schema: {
        summary: "Endpoint de teste para validar todos os campos disponíveis",
        tags: ["test"],
        response: {
          200: {
            description: "Lista de campos testados",
            type: "object"
          }
        }
      }
    },
    async (request, reply) => {
      try {
        request.log.info("Iniciando teste de campos...");
        
        // Verificar estrutura da tabela
        const columnsQuery = `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'employees' 
          ORDER BY ordinal_position
        `;
        request.log.info("Executando query para colunas...");
        const { rows: columns } = await db.query(columnsQuery);
        request.log.info(`Encontradas ${columns.length} colunas`);
        
        // Contar funcionários
        request.log.info("Contando funcionários...");
        const { rows: countRows } = await db.query('SELECT COUNT(*) as total FROM employees');
        const totalEmployees = countRows[0].total;
        request.log.info(`Total de funcionários: ${totalEmployees}`);
        
        // Verificar se há funcionários para testar
        let sampleEmployee = null;
        if (totalEmployees > 0) {
          request.log.info("Buscando funcionário de exemplo...");
          const { rows: sampleRows } = await db.query('SELECT * FROM employees LIMIT 1');
          sampleEmployee = sampleRows[0];
        }
        
        const result = {
          status: "success",
          database_connected: true,
          table_exists: true,
          total_columns: columns.length,
          total_employees: parseInt(totalEmployees),
          columns: columns.map(col => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES'
          })),
          sample_employee_keys: sampleEmployee ? Object.keys(sampleEmployee) : [],
          endpoints_available: {
            "GET /employees": "Lista todos os funcionários",
            "POST /employees": "Cria funcionário (89 campos aceitos)",
            "PUT /employees/:id": "Atualiza funcionário (parcial)",
            "GET /employees/:id": "Busca por ID",
            "DELETE /employees/:id": "Remove funcionário",
            "GET /employees/search": "Busca com filtros",
            "GET /employees/:id/badge": "Gera crachá PDF",
            "POST /employees/badges": "Gera múltiplos crachás",
            "GET /employees/export": "Exporta dados CSV/JSON"
          }
        };
        
        request.log.info("Retornando resultado:", result);
        return result;
      } catch (error) {
        request.log.error("Erro no teste:", error);
        reply.code(500);
        return {
          status: "error",
          message: error.message
        };
      }
    }
  );

  fastify.log.info("Plugin employeeRoutes registrado com sucesso.");
}

module.exports = employeeRoutes;
