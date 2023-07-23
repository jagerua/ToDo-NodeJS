const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    roles: [{
        type: String,
        ref: 'Role'
    }]
}, {collection: 'users'});

module.exports = mongoose.model('Users', Users);