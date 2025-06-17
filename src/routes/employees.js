// src/routes/employees.js
const cloudinary = require("../config/cloudinary");
const db = require("../config/db");

async function employeeRoutes(fastify, options) {
  fastify.log.info("Registrando plugin employeeRoutes...");

  // GET /employees - Test route
  fastify.get("/", async (request, reply) => {
    fastify.log.info("Recebida requisição GET /employees (teste)");
    return { message: "GET /employees works!" }; // Keep the GET for testing plugin registration
  });

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
      
      request.log.info(`Campos extraídos: fullName=${fullName}, jobFunctions=${jobFunctions}, birthday=${birthday}`);

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
        request.log.warn(`Validação falhou: Formato de arquivo inválido (${fileType}).`);
        reply.code(400);
        return { 
          error: "Invalid File Format", 
          message: "Formato de arquivo inválido. Apenas JPEG ou PNG são permitidos." 
        };
      }
      request.log.info("Validação concluída com sucesso.");

      // --- 2. Upload to Cloudinary --- 
      request.log.info(`Buffer já criado com tamanho: ${fileBuffer.length} bytes.`);

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
              request.log.error({ msg: "Erro no callback do upload_stream Cloudinary", error: error }); // Log the full error object
              reject(error);
            } else {
              request.log.info("Sucesso no callback do upload_stream Cloudinary.");
              resolve(result);
            }
          }
        );
        request.log.info("Enviando buffer para upload_stream.end()...");
        uploadStream.end(fileBuffer);
        request.log.info("Buffer enviado para upload_stream.end(). Aguardando callback...");
      });
      request.log.info("Upload para Cloudinary concluído.");

      if (!cloudinaryResult || !cloudinaryResult.secure_url) {
        request.log.error("Falha no resultado do upload para o Cloudinary:", cloudinaryResult);
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
      request.log.info(`Funcionário inserido no banco com ID: ${newEmployee.id}`);

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
        error_stack: error.stack 
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

