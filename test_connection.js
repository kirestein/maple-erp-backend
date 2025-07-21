require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Testando conexão com o banco de dados...');
console.log('📍 URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('⏳ Conectando...');
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida!');
    
    console.log('⏳ Testando query...');
    const result = await client.query('SELECT NOW(), current_database(), current_user');
    console.log('✅ Query executada com sucesso!');
    console.log('📊 Resultado:', result.rows[0]);
    
    console.log('⏳ Verificando se tabela employees existe...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'employees'
      );
    `);
    console.log('📋 Tabela employees existe?', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      const columnCheck = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'employees'
        ORDER BY ordinal_position;
      `);
      console.log('📋 Colunas da tabela employees:');
      columnCheck.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('📋 Detalhes:', {
      code: error.code,
      severity: error.severity,
      detail: error.detail
    });
    process.exit(1);
  }
}

testConnection();
