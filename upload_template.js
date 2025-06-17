require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const templatePath = path.join(__dirname, 'template_cracha.png');

// Função para fazer upload do template
async function uploadTemplate() {
  try {
    console.log('Iniciando upload do template de crachá...');
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(templatePath)) {
      console.error('Arquivo de template não encontrado:', templatePath);
      return;
    }
    
    // Upload para o Cloudinary na pasta maple-templates
    const result = await cloudinary.uploader.upload(templatePath, {
      folder: 'maple-templates',
      public_id: 'cracha-template',
      overwrite: true
    });
    
    console.log('Upload concluído com sucesso!');
    console.log('URL do template:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
    return result;
  } catch (error) {
    console.error('Erro ao fazer upload do template:', error);
  }
}

// Executar o upload
uploadTemplate();
