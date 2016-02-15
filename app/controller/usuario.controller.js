function usuarioController( request, response ) {
    const usuario = request.usuario && request.usuario._doc;

    if ( !usuario ) {
        return response
            .status( 404 )
            .json( { mensagem: 'Usuário não encontrado' } );
    }

    response.json( {
        'id': usuario._id,
        'data_criacao': +usuario.dataCriacao,
        'data_atualizacao': +usuario.dataAtualizacao,
        'email': usuario.email,
        'nome': usuario.nome,
        'telefones': usuario.telefones,
        'ultimo_login': +usuario.ultimoLogin
    } );
}

module.exports = usuarioController;
