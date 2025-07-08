// src/services/employee.service.js
const db = require("../config/db");
const cloudinary = require("../config/cloudinary");

class EmployeeService {
  /**
   * Busca todos os funcionários
   * @returns {Promise<Array>} Lista de funcionários
   */
  async getAllEmployees() {
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
      ORDER BY full_name
    `);
    return rows;
  }

  /**
   * Busca funcionário por ID
   * @param {number} id - ID do funcionário
   * @returns {Promise<Object|null>} Dados do funcionário ou null se não encontrado
   */
  async getEmployeeById(id) {
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
    return rows[0] || null;
  }

  /**
   * Cria um novo funcionário
   * @param {Object} employeeData - Dados do funcionário
   * @param {Buffer} fileBuffer - Buffer da imagem
   * @param {string} fileType - Tipo MIME da imagem
   * @returns {Promise<Object>} Funcionário criado
   */
  async createEmployee(employeeData, fileBuffer, fileType) {
    const { fullName, tagName, tagLastName, jobFunctions, birthday } = employeeData;

    // Validações
    if (!fullName || !tagName || !tagLastName) {
      throw new Error("Campos obrigatórios faltando: Nome completo, Nome para crachá e Sobrenome para crachá são obrigatórios.");
    }

    if (!fileBuffer) {
      throw new Error("Arquivo de foto obrigatório faltando.");
    }

    if (!["image/jpeg", "image/png"].includes(fileType)) {
      throw new Error("Formato de arquivo inválido. Apenas JPEG ou PNG são permitidos.");
    }

    // Upload para Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "maple-employees",
          public_id: `employee_${Date.now()}`,
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto" },
            { format: "jpg" }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      throw new Error("Falha no upload para o Cloudinary");
    }

    const photoUrl = cloudinaryResult.secure_url;

    // Salvar no banco
    const insertQuery = `
      INSERT INTO employees (full_name, tag_name, tag_last_name, job_functions, birthday, photo_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, full_name, tag_name, tag_last_name, job_functions, birthday, photo_url, created_at;
    `;
    const values = [fullName, tagName, tagLastName, jobFunctions || null, birthday || null, photoUrl];

    const { rows } = await db.query(insertQuery, values);
    return rows[0];
  }

  /**
   * Atualiza um funcionário
   * @param {number} id - ID do funcionário
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>} Funcionário atualizado
   */
  async updateEmployee(id, updateData) {
    // Verificar se funcionário existe
    const existsQuery = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (existsQuery.rows.length === 0) {
      throw new Error("Funcionário não encontrado");
    }

    // Construir query de update dinamicamente
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    const allowedFields = ['fullName', 'jobFunctions', 'birthday', 'email', 'phone', 'mobile', 'status'];
    const fieldMapping = {
      fullName: 'full_name',
      jobFunctions: 'job_functions',
      birthday: 'birthday',
      email: 'email',
      phone: 'phone',
      mobile: 'mobile',
      status: 'status'
    };

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${fieldMapping[key]} = $${paramCount}`);
        updateValues.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error("Nenhum campo válido fornecido para atualização");
    }

    // Adicionar updated_at
    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id); // ID para WHERE clause

    const updateQuery = `
      UPDATE employees 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, full_name AS "fullName", job_functions AS "jobFunctions", updated_at AS "updatedAt"
    `;

    const { rows } = await db.query(updateQuery, updateValues);
    return rows[0];
  }

  /**
   * Deleta um funcionário
   * @param {number} id - ID do funcionário
   * @returns {Promise<Object>} Resultado da deleção
   */
  async deleteEmployee(id) {
    const { rows } = await db.query(
      'DELETE FROM employees WHERE id = $1 RETURNING id',
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Funcionário não encontrado");
    }

    return {
      message: "Funcionário deletado com sucesso",
      deletedId: parseInt(id)
    };
  }

  /**
   * Busca funcionários com filtros
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Resultado da busca com paginação
   */
  async searchEmployees(filters) {
    const { name, jobFunction, status, limit = 20, offset = 0 } = filters;

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
  }

  /**
   * Busca funcionários para geração de crachás
   * @param {Array} employeeIds - Array de IDs dos funcionários
   * @returns {Promise<Array>} Lista de funcionários para crachás
   */
  async getEmployeesForBadges(employeeIds) {
    const placeholders = employeeIds.map((_, index) => `$${index + 1}`).join(',');
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
    return rows;
  }

  /**
   * Busca funcionários para exportação
   * @param {string} status - Status para filtrar (opcional)
   * @returns {Promise<Array>} Lista de funcionários para exportação
   */
  async getEmployeesForExport(status) {
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
    return rows;
  }
}

module.exports = new EmployeeService();