const express = require( 'express' );
const mongoose = require( 'mongoose' );

const app = express();

const port = process.env.PORT || 8080;

const router = express.Router();

require( './middleware/body-parser' )( app );
require( './middleware/cors' )( app );

app.use( '/api', router );

require( './route/usuario.route' )( router );

mongoose.connect( 'mongodb://alan:alan@ds035004.mongolab.com:35004/concrete-solutions' );

app.listen( port, () => {
    if ( process.env.NODE_ENV !== 'QA' ) {
        console.log( `Servidor disponível na porta ${ port }` );
    }
} );

module.exports = app;
