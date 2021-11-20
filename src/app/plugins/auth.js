const jwt = require('jsonwebtoken');

const secret = "secret";

const userProfiles = {
  admin: ["admin","user"],
  user: ["user"],
};

const buildTokenData = (username, userProfile) => ({
  data: {
    username,
    roles: userProfiles[userProfile],
  },
});

module.exports = ({ expireAccessToken, expireRefreshToken }) =>
  async (fastify, options) => {

    fastify.post('/login', async (request) => {

      const { username, profile } = request.body;
      const tokenData = buildTokenData(username, profile);
    
      return {
        accessToken: jwt.sign(
          tokenData, secret, { expiresIn: expireAccessToken }),
        refreshToken: jwt.sign(
          tokenData, secret, { expiresIn: expireRefreshToken }),
      };
    });
    
    fastify.get('/refresh', async (request, reply) => {

      const refreshToken = request.headers.authorization.slice(7);

      const tokenData = await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, secret, function(err, decoded) {
          if (err) {
            reject(err);
          } else {
            resolve(decoded.data);
          }
        });
      });

      const tokenData = { data: decoded.data };
    
      return {
        accessToken: jwt.sign(
          tokenData, secret, { expiresIn: expireAccessToken }),
        refreshToken: jwt.sign(
          tokenData, secret, { expiresIn: expireRefreshToken }),
      };  
      
    });

  };
