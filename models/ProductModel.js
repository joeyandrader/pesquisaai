const mongoose = require('../database/conn')
const { Schema } = mongoose

const User = require('./UserModel');
const Category = require('./CategoryModel')

const Product = mongoose.model(
    'Product',
    new Schema({
        type: {
            type: String
        },
        name: {
            type: String
        },
        description: {
            type: String
        },
        brand: {
            type: String
        },
        image: {
            type: String
        },
        productStatus: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        },
        approvedStatus: {
            type: String,
            default: 'pending'
        },
        views: {
            type: Number,
            default: 0
        },
        userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        categoryId: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
    },
        {
            timestamps: true
        }
    )
)

module.exports = Product