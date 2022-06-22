const mongoose = require('../database/conn')
const { Schema } = mongoose

const User = require('./UserModel');
const Category = require('./CategoryModel')

const Service = mongoose.model(
    'Service',
    new Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        notActive: {
            type: Boolean,
            default: false
        },
        approvedStatus: {
            type: String,
            default: 'pending'
        },
        userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        categoryId: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
    },
        {
            timestamps: true
        }
    )
)

module.exports = Service