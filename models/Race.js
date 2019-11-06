const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const RaceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    displayOption: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('races', RaceSchema);