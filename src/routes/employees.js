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
  fastify.post("/", async (request, reply) => {
    request.log.info("Recebida requisição POST /employees");
    try {
      // Validação do Content-Type
      if (!request.headers['content-type']?.includes('multipart/form-data')) {
        request.log.warn("Validação falhou: Content-Type incorreto");
        reply.code(400);
        return { error: "Content-Type deve ser multipart/form-data para upload de arquivos" };
      }
      
      request.log.info("Processando multipart/form-data...");
      const parts = request.parts();
      
      let fullName, jobFunctions, birthday;
      let fileBuffer;
      let fileType;
      
      // Processar cada parte do multipart/form-data
      try {
        for await (const part of parts) {
          request.log.info(`Processando parte: ${part.type} - ${part.fieldname}`);
          
          if (part.type === 'file') {
            // Processar arquivo
            request.log.info(`Recebido arquivo: ${part.filename}, mimetype: ${part.mimetype}`);
            fileType = part.mimetype;
            
            // Ler o arquivo para um buffer usando toBuffer()
            fileBuffer = await part.toBuffer();
            request.log.info(`Arquivo lido com tamanho: ${fileBuffer.length} bytes`);
          } else {
            // Processar campos de texto
            const value = await part.value;
            request.log.info(`Campo ${part.fieldname}: ${value}`);
            
            if (part.fieldname === 'fullName') {
              fullName = value;
            } else if (part.fieldname === 'jobFunctions') {
              jobFunctions = value;
            } else if (part.fieldname === 'birthday') {
              birthday = value;
            }
          }
        }
      } catch (err) {
        request.log.error({ msg: "Erro ao processar multipart/form-data", error: err });
        reply.code(400);
        return { error: "Erro ao processar o formulário. Verifique se todos os campos estão corretos." };
      }
      
      request.log.info(`Campos extraídos: fullName=${fullName}, jobFunctions=${jobFunctions}, birthday=${birthday}`);

      // --- 1. Validation --- 
      request.log.info("Iniciando validação...");
      if (!fullName || !jobFunctions) {
        request.log.warn("Validação falhou: Campos obrigatórios faltando.");
        reply.code(400);
        return { error: "Campos obrigatórios (nome, cargo) faltando." };
      }
      if (!fileBuffer) {
        request.log.warn("Validação falhou: Arquivo de foto faltando.");
        reply.code(400);
        return { error: "Arquivo de foto obrigatório faltando." };
      }

      if (!["image/jpeg", "image/png"].includes(fileType)) {
        request.log.warn(`Validação falhou: Formato de arquivo inválido (${fileType}).`);
        reply.code(400);
        return { error: "Formato de arquivo inválido. Apenas JPEG ou PNG são permitidos." };
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
        return { error: "Erro interno ao fazer upload da imagem." };
      } else if (error.code === "23505") { 
        reply.code(409); 
        return { error: "Erro ao salvar no banco de dados: Dados duplicados.", detail: error.detail };
      } else {
        reply.code(500);
        return { error: "Erro interno do servidor ao processar a requisição." };
      }
    }
  });

  fastify.log.info("Plugin employeeRoutes registrado com sucesso.");
}

module.exports = employeeRoutes;

