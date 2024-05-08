const mongoose = require('mongoose');
const { Schema, } = mongoose

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    updated_on: Date
})
module.exports = customerSchema