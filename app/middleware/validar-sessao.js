const UsuarioModel = require( './../model/usuario.model' );
const jwt = require( 'jwt-simple' );
const segredo = require( './../config/segredo' );

/**
 * Valida o token enviado pelo client.
 * Se o token for válido, a requisição deverá ser tratada, em caso contrário,
 * deverá ser rejeitada.
 * @access private
 * @param {object}      request     Requisição enviada pelo client
 * @param {object}      resposta    Resposta da requisição
 * @param {function}    next        Função que dará continuidade ao fluxo de execução
 */
function validarToken( request, response, next ) {
    const token = request.headers.bearer;

    try {
        const tokenDecodificado = jwt.decode( token, segredo );

        if ( tokenDecodificado.ext <= Date.now() ) {
            return response
                .status( 400 )
                .json( { mensagem: 'Sessão inválida' } );
        }

        if ( request.params.id !== tokenDecodificado.iss ) {
            return response
                .status( 403 )
                .json( { mensagem: 'Não autorizado' } );
        }

        UsuarioModel.findOne( { _id: tokenDecodificado.iss }, ( error, usuario ) => {
            if ( error ) {
                return response
                    .status( 500 )
                    .json( { mensagem: 'Ocorreu um erro inesperado no servidor' } );
            }

            request.usuario = usuario;

            return next();
        } );
    } catch ( error ) {
        return response
            .status( 401 )
            .json( { mensagem: 'Não autorizado' } );
    }
}

/**
 * Autentica a sessão.
 * @access public
 * @param {object}      request     Requisição enviada pelo client
 * @param {object}      resposta    Resposta da requisição
 * @param {function}    next        Função que dará continuidade ao fluxo de execução
 */
function validarSessao( request, response, next ) {
    const token = request.headers.bearer;

    if ( !token ) {
        return response
            .status( 401 )
            .json( { mensagem: 'Não autorizado' } );
    }

    validarToken( request, response, next );
}

module.exports = validarSessao;
