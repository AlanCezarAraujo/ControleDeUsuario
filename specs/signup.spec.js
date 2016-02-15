const chai = require('chai');
const expect = chai.expect;

var agent;

describe( 'O endpoint "/api/signup"', () => {
    before( ( done ) => {
        process.env.NODE_ENV = 'QA';

        agent = require( 'supertest' )
            .agent( require( './../app/app' ) );

        done();
    } );

    it( 'deverá reclamar obrigatoriedade do campo "nome".', ( done ) => {
        agent
            .post( '/api/signup' )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 400 );
                expect( response.body.mensagem ).to.equals( 'O campo nome é obrigatório' );
                done();
            } );
    } );

    it( 'deverá reclamar obrigatoriedade do campo "senha".', ( done ) => {
        agent
            .post( '/api/signup' )
            .send( { nome: 'teste' } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 400 );
                expect( response.body.mensagem ).to.equals( 'O campo senha é obrigatório' );
                done();
            } );
    } );

    it( 'deverá reclamar obrigatoriedade do campo "email".', ( done ) => {
        agent
            .post( '/api/signup' )
            .send( { nome: 'teste', senha: 'senha-teste' } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 400 );
                expect( response.body.mensagem ).to.equals( 'O campo email é obrigatório' );
                done();
            } );
    } );

    it( 'deverá receber um usuário com os seguintes campos: nome, email, senha e uma lista de objetos telefone.', ( done ) => {
        agent
            .post( '/api/signup' )
            .send( { nome: 'teste', senha: 'senha-teste', email: `teste${ Date.now()+ 10 }@teste.com` } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 200 );
                expect( response.body.id ).to.not.be.empty;
                expect( response.body.data_criacao ).to.not.be.empty;
                expect( response.body.data_atualizacao ).to.not.be.empty;
                expect( response.body.email ).to.not.be.empty;
                expect( response.body.nome ).to.not.be.empty;
                expect( response.body.telefones ).to.be.empty;
                expect( response.body.ultimo_login ).to.not.be.empty;
                expect( response.body.token ).to.not.be.empty;
                done();
            } );
    } );

    it( 'deverá permitir salvar diversos números de telefone.', ( done ) => {
        agent
            .post( '/api/signup' )
            .send( { nome: 'teste', senha: 'senha-teste', email: `teste${ Date.now()+ 10 }@teste.com`, telefones: [ { numero: '12345678', ddd: 11 }, { numero: '123456789', ddd: 22 } ] } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 200 );
                expect( response.body.id ).to.not.be.empty;
                expect( response.body.data_criacao ).to.not.be.empty;
                expect( response.body.data_atualizacao ).to.not.be.empty;
                expect( response.body.email ).to.not.be.empty;
                expect( response.body.nome ).to.not.be.empty;
                expect( response.body.telefones ).to.not.be.empty;
                expect( response.body.ultimo_login ).to.not.be.empty;
                expect( response.body.token ).to.not.be.empty;
                done();
            } );
    } );

    it( 'deverá retornar erro com a mensagem "E-mail já existente", caso o e-mail já exista.', ( done ) => {
        agent
            .post( '/api/signup' )
            .send( { nome: 'teste', senha: 'senha-teste', email: `teste@teste.com` } )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 409 );
                expect( response.body.mensagem ).to.equals( 'E-mail já existente' );
                done();
            } );
    } );
} );
