const mongoose = require('mongoose');

const GlobalSensor = mongoose.model(
    'GlobalSensor',
    (SensorSchema = new mongoose.Schema({
        code: String,

        type: String
    }))
);

module.exports = GlobalSensor;
