
import jwt from 'jsonwebtoken';

import { secret } from '../constants.js';


const checkAuthorization = async (request, reply) => {
  if (!request.headers.authorization) {
    reply.code(401).send("bearer token is required");
    return reply;
  }

  const bearerToken = request.headers.authorization.slice(7);

  try {
    jwt.verify(bearerToken, secret)
  } catch(exc) {
    console.log(exc);
    reply.code(401).send("login is required");
    return reply;
  }
};

const applyAuthorization = (handler) => ({
  preHandler: checkAuthorization,
  handler
}) 

export default ({ pluralModelName, database }) =>
  async (fastify, options) => {

    const apiCollectionPath = `/api/${pluralModelName}`

    const apiElementPath = `/api/${pluralModelName}/:elementId`

    fastify.get(
      apiCollectionPath,
      applyAuthorization(async () => {
        return database.data[pluralModelName];
      }));
      

    fastify.get(
      apiElementPath,
      applyAuthorization(async (request, reply) => {

        const elementId = parseInt(request.params.elementId, 10);

        if (isNaN(elementId)) {
          reply.code(400).send(`${pluralModelName} id must be a number`);
          return;
        }

        const elements = database.data[pluralModelName];

        const item = elements.find(e => e.id === elementId)

        if (!item) {
          reply.code(404).send(`${pluralModelName} with id ${elementId} not found`);
          return;
        }

        return item;
      }));


    fastify.post(
      apiCollectionPath,
      applyAuthorization(async (request, reply) => {

        const elementId = Math.max(
          ...database.data[pluralModelName].map(element => element.id), 0) + 1;

        const newElement = {
          id: elementId,
          ...request.body
        };

        database.data[pluralModelName].push(newElement);

        await database.write();

        return newElement;
      }));


    fastify.put(
      apiElementPath,
      applyAuthorization(async (request, reply) => {

        const elementId = parseInt(request.params.elementId, 10);

        if (isNaN(elementId)) {
          reply.code(400).send(`${pluralModelName} id must be a number`);
          return;
        }

        const elements = database.data[pluralModelName];

        const elementIndex = elements.findIndex(e => e.id === elementId);

        if (elementIndex === -1) {
          reply.code(404).send(`${pluralModelName} with id ${elementId} not found`);
          return;
        }

        elements[elementIndex] = {
          ...request.body,
          id: elementId,
        };

        await database.write();

        reply.code(204);
      }));


    fastify.delete(
      apiElementPath,
      applyAuthorization(async (request, reply) => {

        const elementId = parseInt(request.params.elementId, 10);

        if (isNaN(elementId)) {
          reply.code(400).send(`${pluralModelName} id must be a number`);
          return;
        }

        const elements = database.data[pluralModelName];

        const elementIndex = elements.findIndex(e => e.id === elementId);

        if (elementIndex === -1) {
          reply.code(404).send(`${pluralModelName} with id ${elementId} not found`);
          return;
        }

        elements.splice(elementIndex, 1);

        await database.write();

        reply.code(204);
      }));    

  };
