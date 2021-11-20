const auth = require('./plugins/auth');

module.exports = async ({
  port, expireAccessToken, expireRefreshToken,
}) => {
  try {

    const fastify = require('fastify')({ logger: true });

    fastify.register(auth({ expireAccessToken, expireRefreshToken }));
    
    await fastify.listen(port);
  
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

