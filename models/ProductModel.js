const mongoose = require('../database/conn')
const { Schema } = mongoose

const User = require('./UserModel');
const Category = require('./CategoryModel')

const Product = mongoose.model(
    'Product',
    new Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        productOrigin: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        productStatus: {
            type: String,
            required: true
        },
        notActive: {
            type: Boolean,
            default: false
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