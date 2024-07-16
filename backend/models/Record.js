const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    name : {type: String, required: true},
    motto : {type: String, required: true},
    filename: {type: String, required: true},
    date: { type: Date, default: Date.now}
})

module.exports = mongoose.model('Record', recordSchema)