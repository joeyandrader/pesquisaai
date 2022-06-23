const nodemailer = require('nodemailer');

const email = "joelarocha36@gmail.com"
const password = "thlxkviqdjckuslz"

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: email,
        pass: password
    }
})


async function enviarEmail(from, to, subject, text, html) {
    transporter.sendMail({
        from: `${from} <${email}>`, //Ex: "Nome Tal <email@email.com>"
        to: to, //Enviar para qual email? ex: email@email
        subject: subject, // Aqui é o titulo da msg
        text: text, // Aqui fica o texto da mensagem
        html: html // aqui pode ir HTML
    }).then(message => {
        console.log(message)
    }).catch(error => {
        console.log('Erro ao enviar o email : ' + error)
    })
}

module.exports = { enviarEmail }
