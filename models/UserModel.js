const mongoose = require('../database/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        fantasyName: {
            type: String,
            required: true
        },
        stateRegistration: {
            type: String,
            required: true
        },
        socialReason: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        cnpj: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        addressNumber: {
            type: String,
            required: true
        },
        uf: {
            type: String,
            required: true
        },
        cep: {
            type: String,
            required: true
        },
        county: {
            type: String,
            required: true
        },
        complement: {
            type: String,
            required: true
        },
        celNumber: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        note: {
            type: String
        },
        webSite: {
            type: String,
            required: false
        },
        facebook: {
            type: String,
            required: false
        },
        instagram: {
            type: String,
            required: false
        },
        image: {
            type: String,
            default: 'default.png'
        },
        confirmTerms: {
            type: Boolean,
            required: true
        },
        accountType: {
            type: Number,
            default: 0
        },
        approvedStatus: {
            type: String,
            default: 'pending'
        },
        enableProfile: {
            type: Boolean,
            default: false
        },
        urlProfile: {
            type: String
        }
    },
        {
            timestamps: true
        }
    )
)

module.exports = User