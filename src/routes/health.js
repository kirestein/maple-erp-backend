// src/routes/health.js
async function healthRoutes(fastify) {
  fastify.log.info("Registrando plugin healthRoutes...");

  // GET /health-check - Health check endpoint
  fastify.get("/health-check", {
    schema: {
      description: 'Health check endpoint',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            uptime: { type: 'number' },
            environment: { type: 'string' },
            version: { type: 'string' },
            database: { type: 'string' },
            cloudinary: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    request.log.info("Recebida requisição GET /health-check");
    
    // Check database connection
    let databaseStatus = 'disconnected';
    try {
      const db = require("../config/db");
      await db.query('SELECT 1');
      databaseStatus = 'connected';
    } catch (error) {
      request.log.error('Database health check failed:', error.message);
      databaseStatus = 'error';
    }
    
    // Check Cloudinary configuration
    let cloudinaryStatus = 'not_configured';
    try {
      const cloudinary = require("../config/cloudinary");
      if (cloudinary.config().cloud_name) {
        cloudinaryStatus = 'configured';
      }
    } catch (error) {
      request.log.error('Cloudinary health check failed:', error.message);
      cloudinaryStatus = 'error';
    }
    
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: databaseStatus,
      cloudinary: cloudinaryStatus
    };
    
    // Set appropriate status code based on service health
    if (databaseStatus === 'error' || cloudinaryStatus === 'error') {
      reply.code(503); // Service Unavailable
      healthData.status = 'degraded';
    }
    
    return healthData;
  });

  fastify.log.info("Plugin healthRoutes registrado com sucesso.");
}

module.exports = healthRoutes;

