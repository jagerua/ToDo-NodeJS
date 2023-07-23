const mongoose = require('mongoose');

const userToken = new mongoose.Schema({
email: {
    type: String,
    unique: true,
    require: true
},
token: {
    type: String,
    unique: true,
}
});

module.exports = mongoose.model('userToken', userToken);