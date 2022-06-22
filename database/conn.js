const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb+srv://hulkg3x:1596325852@cluster0.ucjqx.mongodb.net/?retryWrites=true&w=majority')
    console.log("Conectou ao banco DB (Mongoose!)")
}

main().catch((err) => {
    console.log(`Error ao conectar ao mongoose: ${err}`)
})

module.exports = mongoose

// mongodb://127.0.0.1:27017/mktdb