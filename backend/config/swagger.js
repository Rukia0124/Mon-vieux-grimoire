// swagger.js
const swaggerAutogen = require('swagger-autogen')();
const swaggerConfig = require('./swagger-config.js'); 
const endpointsFiles = ['../routes/book.js', '../routes/user.js']; 

const outputFile = './swagger_output.json'; 

swaggerAutogen(outputFile, endpointsFiles, swaggerConfig)
  .then(() => {
    console.log('Documentation Swagger générée avec succès');
  })
  .catch((err) => {
    console.error('Erreur lors de la génération de la documentation Swagger :', err);
  });
