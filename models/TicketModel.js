const mongoose = require('../database/conn')
const { Schema } = mongoose

const categoryTicket = require('./CategoryTicketModel');
const User = require('./UserModel');

const Ticket = mongoose.model(
    'Ticket',
    new Schema({
        ticketId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'open'
        },
        categoryId: [{ type: Schema.Types.ObjectId, ref: 'CategoryTicket' }],
        userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
        {
            timestamps: true
        }
    )
)

module.exports = Ticket