/**
 * Sempre que for solicitado uma rota inexistente, será retornado um objeto JSON
 * com a seguinte mensagem: O recurso solicitado não existe ou está indisponível.
 */
function notFoundErrorHandler( request, response ) {
    response.status( 404 );
    response.send( { mensagem: 'O recurso solicitado não existe ou está indisponível.' } );
}

module.exports = ( router ) => {
    router.route( '*' )
        .get( notFoundErrorHandler )
        .post( notFoundErrorHandler )
        .put( notFoundErrorHandler )
        .delete( notFoundErrorHandler )
        .patch( notFoundErrorHandler );
};
