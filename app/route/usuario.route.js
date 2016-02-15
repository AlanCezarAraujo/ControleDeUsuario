const signupController = require( './../controller/signup.controller' );
const signinController = require( './../controller/signin.controller' );
const usuarioController = require( './../controller/usuario.controller' );
const validarSessao = require( './../middleware/validar-sessao' );

module.exports = ( router ) => {
    router.route( '/signup' )
        .post( signupController );

    router.route( '/signin' )
        .post( signinController );

    router.route( '/usuario/:id' )
        .get( validarSessao, usuarioController );
};
