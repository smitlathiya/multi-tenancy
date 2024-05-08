const mongoose = require('mongoose');
const { Schema } = mongoose
const { v1 } = require('uuid')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    name: {
        first_name: String,
        last_name: String
    },
    email: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    tenant_id: String,
    created_on: {
        type: Date,
        default: Date.now
    },
    updated_on: Date
})
userSchema.virtual('password')
    .set(function (password) {
        this._password = password

        this.salt = v1()
        //encrypt Password()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');

        } catch (error) {
            return ""
        }
    }
}

module.exports = userSchema