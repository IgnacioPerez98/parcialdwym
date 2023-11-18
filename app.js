const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerSpec = require('./routes/swagger'); // Importa la configuración de Swagger

//Endpoints
const authRoute = require('./endpoints/auth.js');
const personsRoute = require('./endpoints/personas');

//Almaceno instancia de express
const app = express();
app.use(express.json());

app.use(cors({
  origin: function(origin, callback){
      return callback(null, true);
  }
}));

// Middleware para servir la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api/auth',authRoute );
app.use('/api/personas', personsRoute)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});