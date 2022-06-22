const localStrategy = require('passport-local').Strategy
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

//Model user
require('../models/UserModel')
const User = mongoose.model('User');

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                done(null, false, { message: "Conta invalida!" })
                return
            }

            if (user.approvedStatus === "pending") {
                done(null, false, { message: "Não é possivel logar!" })
                return
            }

            if (user.approvedStatus === "refused") {
                done(null, false, { message: "Conta bloqueada!" })
                return
            }

            bcrypt.compare(password, user.password, (erro, checkPassword) => {
                if (checkPassword) {
                    done(null, user);
                    console.log(`Usuario ${user.cnpj} logou`)
                    return
                } else {
                    return done(null, false, { message: "Senha invalida" });
                }
            });
        })

    }))




    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then(res => {
            if (res) {
                done(null, res)
            } else {
                return done(null, false, { message: "Usuario não encontrado" })
            }
        })
    })
}