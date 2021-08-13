import { config } from "../../config";

const { version } = require('../../../package.json');


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'nodejs-authentication system API documentation',
      version,
      license: {
        name: 'MIT',
        url: 'https://github.com/djibril6/nodejs-authentication/LICENSE',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
};

export default swaggerDefinition;