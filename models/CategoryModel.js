const mongoose = require('../database/conn')
const { Schema } = mongoose

const Category = mongoose.model(
    'Category',
    new Schema({
        name: {
            type: String,
            required: true
        },
        image: {
            type: String
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

module.exports = Category