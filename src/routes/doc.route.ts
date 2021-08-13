import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './docs/swaggerDefinition';

const docRoute = express.Router();

const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['src/routes/docs/*.yml', 'src/routes/*.ts'],
});

docRoute.use('/', swaggerUi.serve);
docRoute.get('/', swaggerUi.setup(specs, { explorer: true }))

export default docRoute;
