const chai = require('chai');
const expect = chai.expect;

var agent;

describe( 'O endpoint "/api/usuario/:id"', () => {
    before( ( done ) => {
        process.env.NODE_ENV = 'QA';

        agent = require( 'supertest' )
            .agent( require( './../app/app' ) );

        done();
    } );

    it( 'deverá retornar erro com status 401 com a mensagem "Não autorizado", caso o token não exista.', ( done ) => {
        agent
            .get( '/api/usuario/1234567' )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 401 );
                expect( response.body.mensagem ).to.equals( 'Não autorizado' );
                done();
            } );
    } );

    it( 'deverá buscar o usuário pelo user_id passado no path e comparar se o token no modelo é igual ao token passado no header',( done ) => {
        agent
            .get( '/api/usuario/56bff517381e6c4231bfbae0' )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 401 );
                expect( response.body.mensagem ).to.equals( 'Não autorizado' );
                done();
            } );
    } );

    it( 'deverá retornar um erro com status 403 e mensagem "Não autorizado", caso o token não for do usuário pesquisado', ( done ) => {
        agent
            .get( '/api/usuario/56bff517381e6c4231bfbae0' )
            .set( 'Bearer', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NmMwMGVlY2ZiYjEwZjYxMzczY2Y2ZWEiLCJleHAiOjE0NTU0MjkxMTExNDR9.UoFf7xYg11TAKdx1fhOK7A4PLdRlYz-JGE2t1kQwkFQ' )
            .end( ( error, response ) => {
                expect( response.status ).to.equals( 403 );
                expect( response.body.mensagem ).to.equals( 'Não autorizado' );
                done();
            } );
    } );

    it( 'deverá verificar se o último login foi a MENOS que 30 minutos atrás' );

    it( 'deverá retornar erro com status apropriado com mensagem "Sessão inválida", caso não seja a MENOS que 30 minutos atrás' );

    it( 'deverá retornar o usuário, caso tudo esteja ok', ( done ) => {
        agent
            .post( '/api/signin' )
            .send( { email: 'teste@teste.com', senha: 'senha-teste' } )
            .end( ( signinError, signinResponse ) => {
                expect( signinResponse.body ).to.not.be.empty;

                agent
                    .get( `/api/usuario/${ signinResponse.body.id }` )
                    .set( 'Bearer', signinResponse.body.token )
                    .end( ( usuarioError, usuarioResponse ) => {
                        expect( usuarioResponse.status ).to.equals( 200 );
                        expect( usuarioResponse.body.id ).to.not.be.empty;
                        expect( usuarioResponse.body.data_criacao ).to.not.be.empty;
                        expect( usuarioResponse.body.data_atualizacao ).to.not.be.empty;
                        expect( usuarioResponse.body.email ).to.not.be.empty;
                        expect( usuarioResponse.body.nome ).to.not.be.empty;
                        expect( usuarioResponse.body.telefones ).to.not.be.empty;
                        expect( usuarioResponse.body.ultimo_login ).to.not.be.empty;
                        done();
                    } );
            } );
    } );
} );
