const chai = require('chai');
const expect = chai.expect;

var agent;

describe( 'O endpoint "/api/signin"', () => {
    before( ( done ) => {
        process.env.NODE_ENV = 'QA';

        agent = require( 'supertest' )
            .agent( require( './../app/app' ) );

        done();
    } );

    it( 'deverá aceitar um objeto com e-mail e senha', ( done ) => {
        agent
            .post( '/api/signin' )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 409 );
                expect( response.body.mensagem ).to.equals( 'É obrigatório informar o email e a senha.' );
                done();
            } );
    } );

    it( 'deverá retornar erro com status apropriado mais a mensagem "Usuário e/ou senha inválidos", caso o e-mail não exista.', ( done ) => {
        agent
            .post( '/api/signin' )
            .send( { email: 'emailquenaoexiste@email.com', senha: 'senha' } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 401 );
                expect( response.body.mensagem ).to.equals( 'Usuário e/ou senha inválidos' );
                done();
            } );
    } );

    it( 'deverá retornar o status 401 com a mensagem "Usuário e/ou senha inválidos", caso o e-mail exista mas a senha não bata.', ( done ) => {
        agent
            .post( '/api/signin' )
            .send( { email: 'teste@teste.com', senha: 'senha-errada' } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 401 );
                expect( response.body.mensagem ).to.equals( 'Usuário e/ou senha inválidos' );
                done();
            } );
    } );

    it( 'deverá retornar igual ao endpoint de signup, caso o e-mail exista e a senha seja a mesma que a senha persistida.', ( done ) => {
        agent
            .post( '/api/signin' )
            .send( { email: 'teste@teste.com', senha: 'senha-teste' } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 200 );
                expect( response.body.email ).to.equals( 'teste@teste.com' );
                expect( response.body.id ).to.not.be.empty;
                expect( response.body.data_criacao ).to.not.be.empty;
                expect( response.body.data_atualizacao ).to.not.be.empty;
                expect( response.body.nome ).to.not.be.empty;
                expect( response.body.ultimo_login ).to.not.be.empty;
                expect( response.body.token ).to.not.be.empty;
                expect( response.body.telefones ).to.not.be.empty;
                done();
            } );
    } );
} );
