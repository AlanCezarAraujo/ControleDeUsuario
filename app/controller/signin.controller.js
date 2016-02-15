const UsuarioModel = require( './../model/usuario.model' );
const jwt = require( 'jwt-simple' );
const bcrypt = require( 'bcrypt-nodejs' );
const moment = require( 'moment' );
const segredo = require( './../config/segredo' );

function signin( request, response ) {
    const email = request.body.email || '';
    const senha = request.body.senha || '';

    if ( !email || !senha ) {
        return response
            .status( 409 )
            .json( { mensagem: 'É obrigatório informar o email e a senha.' } );
    }

    UsuarioModel.findOne( { email: email }, ( error, usuario ) => {
        if ( error ) {
            return response
                .status( 500 )
                .json( { mensagem: error.message || 'Ocorreu um erro inesperado no servidor.' } );
        }

        if ( !usuario || !bcrypt.compareSync( senha, usuario.senha ) ) {
            return response
                .status( 401 )
                .json( { mensagem: 'Usuário e/ou senha inválidos' } );
        }

        const expiracaoDaSessao = moment().add( 30, 'minutes' ).valueOf();

        usuario.token = jwt.encode( {
            iss: usuario._id,
            exp: expiracaoDaSessao
        }, segredo );

        usuario.token_expiracao = expiracaoDaSessao;

        usuario.save();

        response.json( {
            'id': usuario._id,
            'data_criacao': +usuario.dataCriacao,
            'data_atualizacao': +usuario.dataAtualizacao,
            'email': usuario.email,
            'nome': usuario.nome,
            'telefones': usuario.telefones,
            'ultimo_login': +usuario.ultimoLogin,
            'token': usuario.token
        } );
    } );
}

module.exports = signin;
