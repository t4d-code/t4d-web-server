import { resolve } from 'path';
import { Low, JSONFile } from 'lowdb';
import fastify from 'fastify';

import auth from './plugins/auth.js';
import api from './plugins/api.js';

export default async ({
  port,
  expireAccessToken,
  expireRefreshToken,
  databaseFileName,
}) => {

  const app = fastify({ logger: true });

  try {

    console.log(databaseFileName);

    const file = resolve(process.cwd(), databaseFileName)
    const adapter = new JSONFile(file)
    const database = new Low(adapter)

    await database.read()

    app.register(auth({ expireAccessToken, expireRefreshToken }));
    app.register(api({ pluralModelName: 'colors', database }));
    app.register(api({ pluralModelName: 'cars', database }));
    
    await app.listen(port);
  
  } catch (err) {

    app.log.error(err);
    process.exit(1);

  }
};

