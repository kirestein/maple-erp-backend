require("dotenv").config();
const db = require("./src/config/db");
const cloudinary = require("cloudinary").v2;

async function validateConnections() {
  let dbOk = false;
  let cloudinaryOk = false;

  // Log Cloudinary variables being used
  console.log("--- Verificando variáveis de ambiente Cloudinary ---");
  console.log(`CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY}`);
  console.log(`CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '****** (presente)' : 'NÃO ENCONTRADO'}`); // Don't log the secret itself
  console.log("---------------------------------------------------");

  // Validate DB Connection
  try {
    const timeResult = await db.query("SELECT NOW()");
    console.log("✅ Conexão com o banco de dados Neon estabelecida com sucesso! Hora do servidor:", timeResult.rows[0].now);
    dbOk = true;
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados Neon:", error.message);
  }

  // Re-configure Cloudinary explicitly here for debugging, using the loaded env vars
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    console.log("Cloudinary SDK configurado.");

    // Validate Cloudinary Connection using ping
    const cloudinaryPing = await cloudinary.api.ping();
    console.log("Resposta do ping Cloudinary:", cloudinaryPing); // Log the full ping response
    if (cloudinaryPing.status === "ok") {
      console.log("✅ Conexão com o Cloudinary estabelecida com sucesso!");
      cloudinaryOk = true;
    } else {
      console.error("❌ Erro na resposta do ping do Cloudinary (status não é 'ok'):", cloudinaryPing);
    }
  } catch (error) {
    console.error("❌ Erro ao configurar ou conectar ao Cloudinary:", error);
    // Log the specific error object for more details
  }

  // Close the DB pool gracefully
  try {
    await db.pool.end();
    console.log("Pool de conexões do banco fechado.");
  } catch (error) {
    console.error("Erro ao fechar pool do banco:", error.message);
  }

  if (dbOk && cloudinaryOk) {
    console.log("\n🚀 Todas as conexões foram validadas com sucesso!");
  } else {
    console.log("\n⚠️ Falha na validação de uma ou mais conexões. Verifique os logs acima.");
  }
}

validateConnections();

