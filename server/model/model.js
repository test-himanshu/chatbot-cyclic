const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    PSID: Number,
    Message: String
})

const Messagedb = mongoose.model('msgdb', schema);
module.exports = Messagedb;