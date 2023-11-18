const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API BackEnd Parcial',
            version: '1.0.0',
            description: 'API BackEnd Parcial',
        },
        contact: {
            name: "Ignacio Pérez",
            url: "Desarrollo Web y Mobile"
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your Bearer token in the format "Bearer {token}"',
                }
            },
        },
    },
    apis: [
        './endpoints/*.js',
    ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;