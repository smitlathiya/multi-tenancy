const mongoose = require('mongoose');
const { Schema, } = mongoose

const tenantSchema = new Schema({
    tenant_id: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    updated_on: Date
})
module.exports = tenantSchema