// :: DEPENDÊNCIAS
const express = require( 'express' );
const mongoose = require( 'mongoose' );

const app = express();

// :: MIDDLEWARE
require( './middleware/body-parser' )( app );
require( './middleware/cors' )( app );

// :: ROTAS
const router = express.Router();

app.use( '/api', router );
require( './route/usuario.route' )( router );
require( './route/404' )( router );

// :: BANCO DE DADOS
const database = process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'QA' ?
    'mongodb://alan:alan@ds035004.mongolab.com:35004/concrete-solutions' :
    'mongodb://localhost/concrete-solutions';

mongoose.connect( database );

// :: APP SERVER
const port = process.env.PORT || 8080;

app.listen( port, () => {
    if ( process.env.NODE_ENV !== 'QA' ) {
        console.log( `Servidor disponível na porta ${ port }` );
    }
} );

module.exports = app;
