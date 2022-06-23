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
        },
        visibility: {
            type: Boolean,
            default: 1
        }
    },
        {
            timestamps: true
        }
    )
)

module.exports = CategoryTicket