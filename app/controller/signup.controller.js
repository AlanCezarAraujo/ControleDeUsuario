const UsuarioModel = require( './../model/usuario.model' );
const signin = require( './signin.controller' );
const bcrypt = require( 'bcrypt-nodejs' );
const salt = bcrypt.genSaltSync( 10 );

function validarUsuario( requestBody ) {
    if ( !requestBody.nome ) {
        return 'O campo nome é obrigatório';
    }

    if ( !requestBody.senha ) {
        return 'O campo senha é obrigatório';
    }

    if ( !requestBody.email ) {
        return 'O campo email é obrigatório';
    }
}

function salvarUsuario( usuario, request, response ) {
    usuario.save( ( error ) => {
        if ( error ) {
            var mensagemDeErro = error.code === 11e3 ? 'E-mail já existente' : error.message;

            response.status( 409 );
            response.send( { mensagem: mensagemDeErro } );
            return;
        }

        signin( request, response );
    } );
}

function cadastrarUsuario( request, response ) {
    const agora = Date.now();
    const usuario = new UsuarioModel( {
        dataCriacao: agora,
        dataAtualizacao: agora,
        ultimoLogin: agora,
        nome: request.body.nome,
        senha: bcrypt.hashSync( request.body.senha ),
        email: request.body.email,
        telefones: request.body.telefones
    } );

    salvarUsuario( usuario, request, response );
}

function signup( request, response ) {
    const erroDeValidacao = validarUsuario( request.body );

    if ( erroDeValidacao ) {
        response.status( 400 );
        response.send( { mensagem: erroDeValidacao } );
        return;
    }

    cadastrarUsuario( request, response );
}

module.exports = signup;
