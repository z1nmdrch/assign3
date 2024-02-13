const mongoose = require('mongoose');

const breedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    input: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

const Breed = mongoose.model('Breed', breedSchema); 

module.exports = Breed;
