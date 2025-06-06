require("dotenv").config();

const fastify = require("fastify")({
  logger: true, // Enable basic logging
});

// Register essential plugins
fastify.register(require("@fastify/cors"), {
  // Configure CORS options if needed, defaults are often permissive for development
  origin: "*", // Allow all origins for now, restrict in production
});

fastify.register(require("@fastify/multipart"), {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for file uploads (adjust as needed)
  },
});

// Placeholder for routes - we will add them later
fastify.register(require("./src/routes/health"));
fastify.register(require("./src/routes/employees"), { prefix: "/employees" });

// Basic error handler (optional, Fastify has defaults)
fastify.setErrorHandler(function (error, request, reply) {
  fastify.log.error(error);
  // Send error response
  reply.status(error.statusCode || 500).send({ 
    error: error.name || "Internal Server Error", 
    message: error.message 
  });
});

// Run the server!
const start = async () => {
  try {
    const port = process.env.PORT || 4000;
    await fastify.listen({ port: port, host: "0.0.0.0" }); // Listen on all available network interfaces
    fastify.log.info(`Servidor ouvindo na porta ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

