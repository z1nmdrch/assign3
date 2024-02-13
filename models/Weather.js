const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    city: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    feelsLike: {
        type: Number,
        required: true
    },
    retrievalTime: {
        type: Date,
        required: true
    },
    weatherIcon: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coordinates: {
        type: String,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    pressure: {
        type: Number,
        required: true
    },
    windSpeed: {
        type: Number,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    rainVolume: {
        type: String,
        default: "N/A"
    },
    country: {
        type: String,
        required: true
    }
});

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

module.exports = WeatherData;