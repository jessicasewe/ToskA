const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const User = mongoose.model('User', UserSchema);

module.exports = User;