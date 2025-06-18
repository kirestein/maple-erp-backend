// src/routes/employees.js
const cloudinary = require("../config/cloudinary");
const db = require("../config/db");

async function employeeRoutes(fastify, options) {
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
          photo_url AS "photoUrl",
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

      let fullName, jobFunctions, birthday;
      let fileBuffer;
      let fileType;

      let fileName;
      
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
            fileName = part.filename;
            
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
            
            if (part.fieldname === 'fullName') {
              // Validar nome (mínimo 2 caracteres, máximo 100)
              if (value.trim().length < 2 || value.trim().length > 100) {
                throw new Error("Nome deve ter entre 2 e 100 caracteres");
              }
              fullName = value.trim();
            } else if (part.fieldname === 'jobFunctions') {
              // Validar cargo (mínimo 2 caracteres, máximo 100)
              if (value.trim().length < 2 || value.trim().length > 100) {
                throw new Error("Cargo deve ter entre 2 e 100 caracteres");
              }
              jobFunctions = value.trim();
            } else if (part.fieldname === 'birthday') {
              // Validar formato de data (YYYY-MM-DD)
              const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
              if (value && !dateRegex.test(value)) {
                throw new Error("Data de nascimento deve estar no formato YYYY-MM-DD");
              }
              // Validar se a data não é futura
              if (value && new Date(value) > new Date()) {
                throw new Error("Data de nascimento não pode ser futura");
              }
              birthday = value;
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
        `Campos extraídos: fullName=${fullName}, jobFunctions=${jobFunctions}, birthday=${birthday}`
      );

      // --- 1. Validation ---
      request.log.info("Iniciando validação...");
      if (!fullName || !jobFunctions) {
        request.log.warn("Validação falhou: Campos obrigatórios faltando.");
        reply.code(400);
        return { 
          error: "Missing Required Fields", 
          message: "Campos obrigatórios (nome, cargo) faltando." 
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
        INSERT INTO employees (full_name, job_functions, birthday, photo_url)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name, job_functions, birthday, photo_url, created_at;
      `;
      const values = [fullName, jobFunctions, birthday || null, photoUrl]; // Use adjusted variable names

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

  fastify.log.info("Plugin employeeRoutes registrado com sucesso.");
}

module.exports = employeeRoutes;
