const mongoose = require('../database/conn')
const { Schema } = mongoose

const CategoryTicket = mongoose.model(
    'CategoryTicket',
    new Schema({
        name: {
            type: String,
            required: true
        },
        slugify: {
            type: String,
            required: true
        }
    },
        {
            timestamps: true
        }
    )
)

module.exports = CategoryTicket