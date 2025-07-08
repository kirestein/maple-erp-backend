const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PDFService {
  /**
   * Gera um crachá em PDF para um funcionário
   * @param {Object} employee - Dados do funcionário
   * @param {string} employee.fullName - Nome completo
   * @param {string} employee.jobFunctions - Cargo
   * @param {string} employee.photoUrl - URL da foto
   * @param {string} employee.id - ID do funcionário
   * @returns {Promise<Buffer>} Buffer do PDF gerado
   */
  async generateBadge(employee) {
    let browser;
    
    try {
      // Configuração do Puppeteer para produção
      const puppeteerConfig = {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      };
      
      // Em desenvolvimento, pode usar o Chrome local
      if (process.env.NODE_ENV !== 'production') {
        delete puppeteerConfig.args;
      }
      
      browser = await puppeteer.launch(puppeteerConfig);
      const page = await browser.newPage();
      
      // Configurar tamanho da página para crachá (85.6mm x 53.98mm - tamanho cartão de crédito)
      await page.setViewport({
        width: 324, // 85.6mm em pixels (96 DPI)
        height: 204, // 53.98mm em pixels (96 DPI)
        deviceScaleFactor: 2 // Para melhor qualidade
      });
      
      // Ler template HTML
      const templatePath = path.join(__dirname, '../templates/badge.html');
      let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
      
      // Substituir placeholders no template
      htmlTemplate = htmlTemplate
        .replace('{{fullName}}', employee.fullName || 'Nome não informado')
        .replace('{{jobFunctions}}', employee.jobFunctions || 'Cargo não informado')
        .replace('{{photoUrl}}', employee.photoUrl || '/placeholder.jpg')
        .replace('{{employeeId}}', employee.id || '000');
      
      // Definir conteúdo HTML
      await page.setContent(htmlTemplate, {
        waitUntil: 'networkidle0'
      });
      
      // Gerar PDF
      const pdfBuffer = await page.pdf({
        width: '85.6mm',
        height: '53.98mm',
        printBackground: true,
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      });
      
      return pdfBuffer;
      
    } catch (error) {
      console.error('Erro ao gerar crachá PDF:', error);
      throw new Error('Falha na geração do crachá PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  
  /**
   * Gera múltiplos crachás em um único PDF
   * @param {Array} employees - Array de funcionários
   * @returns {Promise<Buffer>} Buffer do PDF com múltiplos crachás
   */
  async generateMultipleBadges(employees) {
    let browser;
    
    try {
      const puppeteerConfig = {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      };
      
      if (process.env.NODE_ENV !== 'production') {
        delete puppeteerConfig.args;
      }
      
      browser = await puppeteer.launch(puppeteerConfig);
      const page = await browser.newPage();
      
      // Configurar página A4
      await page.setViewport({
        width: 794, // A4 width em pixels (96 DPI)
        height: 1123, // A4 height em pixels (96 DPI)
        deviceScaleFactor: 1
      });
      
      // Criar HTML com múltiplos crachás
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .badges-container {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .badge {
              width: 85.6mm;
              height: 53.98mm;
              border: 1px solid #ccc;
              border-radius: 8px;
              padding: 8px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              page-break-inside: avoid;
            }
            .badge-photo {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
              margin-right: 8px;
              border: 2px solid white;
            }
            .badge-info {
              flex: 1;
            }
            .badge-name {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 2px;
              line-height: 1.2;
            }
            .badge-job {
              font-size: 10px;
              opacity: 0.9;
              line-height: 1.2;
            }
            .badge-id {
              font-size: 8px;
              opacity: 0.7;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="badges-container">
      `;
      
      // Adicionar cada funcionário
      employees.forEach(employee => {
        htmlContent += `
          <div class="badge">
            <img src="${employee.photoUrl || '/placeholder.jpg'}" alt="Foto" class="badge-photo">
            <div class="badge-info">
              <div class="badge-name">${employee.fullName || 'Nome não informado'}</div>
              <div class="badge-job">${employee.jobFunctions || 'Cargo não informado'}</div>
              <div class="badge-id">ID: ${employee.id || '000'}</div>
            </div>
          </div>
        `;
      });
      
      htmlContent += `
          </div>
        </body>
        </html>
      `;
      
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      return pdfBuffer;
      
    } catch (error) {
      console.error('Erro ao gerar múltiplos crachás PDF:', error);
      throw new Error('Falha na geração dos crachás PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

module.exports = new PDFService();