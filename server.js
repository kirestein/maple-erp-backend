require("dotenv").config();

const fastify = require("fastify")({
  logger: true, // Enable basic logging
});

// Register CORS with improved configuration
fastify.register(require("@fastify/cors"), {
  // Configure CORS options for better security and flexibility
  origin: (origin, callback) => {
    // Allow requests from localhost for development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
      // Production frontend URLs
      'https://mbjerp.netlify.app',
      'https://maple-erp-frontend.netlify.app'
    ];
    
    // In production, add your frontend domain from environment variable
    if (process.env.NODE_ENV === 'production') {
      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }
    }
    
    // Allow requests without origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all origins for testing
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
});

fastify.register(require("@fastify/multipart"), {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for file uploads (adjust as needed)
    files: 1, // Limit to 1 file per request
    fields: 10 // Limit number of fields
  },
  attachFieldsToBody: false // Keep current behavior
});

// Add request validation middleware
fastify.addHook('preHandler', async (request, reply) => {
  // Log all incoming requests for debugging
  request.log.info({
    method: request.method,
    url: request.url,
    headers: request.headers,
    userAgent: request.headers['user-agent']
  }, 'Incoming request');
});

// Placeholder for routes - we will add them later
fastify.register(require("./src/routes/health"));
fastify.register(require("./src/routes/employees"), { prefix: "/employees" });

// Endpoint para servir template do crachá
fastify.get('/template-cracha', async (request, reply) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    request.log.info('Servindo template do crachá');
    
    const imagePath = path.join(__dirname, 'template_cracha.png');
    
    // Verificar se arquivo existe
    if (!fs.existsSync(imagePath)) {
      request.log.error('Template do crachá não encontrado:', imagePath);
      reply.code(404);
      return { error: 'Template do crachá não encontrado' };
    }
    
    const imageBuffer = fs.readFileSync(imagePath);
    
    reply
      .type('image/png')
      .header('Cache-Control', 'public, max-age=86400') // Cache por 1 dia
      .header('Access-Control-Allow-Origin', '*') // Permitir acesso de qualquer origem para imagens
      .send(imageBuffer);
      
  } catch (error) {
    request.log.error('Erro ao servir template do crachá:', error);
    reply.code(500);
    return { error: 'Erro interno do servidor' };
  }
});

// Enhanced error handler
fastify.setErrorHandler(function (error, request, reply) {
  // Log error with more context
  request.log.error({
    error: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    method: request.method,
    url: request.url
  }, 'Request error');
  
  // Handle CORS errors specifically
  if (error.message.includes('CORS')) {
    reply.status(403).send({ 
      error: "CORS Error", 
      message: "Origin not allowed by CORS policy" 
    });
    return;
  }
  
  // Handle validation errors
  if (error.validation) {
    reply.status(400).send({
      error: "Validation Error",
      message: "Request validation failed",
      details: error.validation
    });
    return;
  }
  
  // Send error response with appropriate status code
  const statusCode = error.statusCode || 500;
  const errorName = error.name || "Internal Server Error";
  const errorMessage = statusCode === 500 ? "Internal Server Error" : error.message;
  
  reply.status(statusCode).send({ 
    error: errorName, 
    message: errorMessage 
  });
});

// Add graceful shutdown
process.on('SIGINT', async () => {
  try {
    await fastify.close();
    console.log('Server closed gracefully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

// Run the server!
const start = async () => {
  try {
    const port = process.env.PORT || 4000;
    const host = process.env.HOST || "0.0.0.0";
    
    await fastify.listen({ port: port, host: host });
    fastify.log.info(`Servidor ouvindo na porta ${port} (host: ${host})`);
    fastify.log.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

