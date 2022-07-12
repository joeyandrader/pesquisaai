const mongoose = require('../database/conn')
const { Schema } = mongoose

const Ticket = require('./TicketModel');
const User = require('./UserModel');

const AnswerTicket = mongoose.model(
    'AnswerTicket',
    new Schema({
        name: {
            type: String
        },
        body: {
            type: String,
            required: true
        },
        ticketId: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
        userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
        {
            timestamps: true
        }
    )
)

module.exports = AnswerTicket