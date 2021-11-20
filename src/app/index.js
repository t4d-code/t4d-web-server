const fastify = require('fastify')({ logger: true })
const jwt = require('jsonwebtoken');

const secret = "secret";

const userProfiles = {
  admin: ["admin","user"],
  user: ["user"],
};

const EXP_20_MINS = 60 * 20;
const EXP_ONE_DAY = 60 * 60 * 24;

const buildTokenData = (username, userProfile) => {

  return { data: {
    username,
    roles: userProfiles[userProfile],
  } };

}

fastify.post('/login', async (request) => {

  const { username, profile } = request.body;
  const tokenData = buildTokenData(username, profile);

  return {
    accessToken: jwt.sign(
      tokenData, secret, { expiresIn: EXP_20_MINS }),
    refreshToken: jwt.sign(
      tokenData, secret, { expiresIn: EXP_ONE_DAY }),
  };
});

fastify.get('/refresh', async (request, reply) => {

  const refreshToken = request.headers.authorization.slice(7);

  var decoded = jwt.verify(refreshToken, secret);

  const tokenData = { data: decoded.data };

  return {
    accessToken: jwt.sign(
      tokenData, secret, { expiresIn: EXP_20_MINS }),
    refreshToken: jwt.sign(
      tokenData, secret, { expiresIn: EXP_ONE_DAY }),
  };  
  
});




// Run the server!
module.exports.start = async (port) => {
  try {
    await fastify.listen(port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

