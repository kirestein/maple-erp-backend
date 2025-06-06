async function healthRoutes(fastify, options) {
  fastify.get("/health-check", async (request, reply) => {
    // Simple health check endpoint
    // In the future, could check DB connection status etc.
    return { status: "ok", timestamp: new Date().toISOString() };
  });
}

module.exports = healthRoutes;

