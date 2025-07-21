require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
  try {
    console.log('Testando conexão com o banco...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Verificar se a tabela employees existe
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'employees'
      );
    `);
    
    console.log('Tabela employees existe:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Se existe, mostrar estrutura
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'employees' 
        ORDER BY ordinal_position;
      `);
      console.log('Estrutura da tabela employees:');
      structure.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Contar registros
      const count = await client.query('SELECT COUNT(*) FROM employees');
      console.log(`Total de registros: ${count.rows[0].count}`);
    } else {
      console.log('❌ Tabela employees não existe. Precisa ser criada.');
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('Código do erro:', error.code);
    process.exit(1);
  }
}

testConnection();
