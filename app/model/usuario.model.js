const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt-nodejs' );

const UsuarioSchema = new mongoose.Schema( {
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    dataCriacao: Date,
    dataAtualizacao: Date,
    ultimoLogin: Date,
    telefones: {
        type: [ {
            numero: {
                type: String,
                match: /^\d{8,9}$/,
                required: true
            },
            ddd: {
                type: String,
                match: /^\d{2}$/,
                required: true
            }
        } ],
        default: []
    },
    token: {
        type: String,
        default: undefined
    },
    tokenExpiracao: {
        type: Date,
        default: null
    }
} );

module.exports = mongoose.model( 'Usuario', UsuarioSchema );
