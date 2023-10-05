const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeviceSchema  = new Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        required: true,
    },
    identifiant: {
        type: String,
        required: true,
    },
    Area: {
        type: Schema.Types.ObjectId,
        ref: "Area",
        required: true,
    },
    Ligne: {
        type: Schema.Types.ObjectId,
        ref: "Ligne",
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    Lng: {
        type: Number,
        required: true
    },
    Lat: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
    },
    Profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    code: {
        type: String,
    },
    voltage: {
        type: String,
    },
    current: {
        type: String,
    },
    electricconsumptions: {
        type: String,
    },
    powerfactor: {
        type: String,
    },
    Power: {
        type: String,
    },
    luminosite: {
        type: String,
        default: 100,
    },
    alert:{
        type: Number,
        default: 0,
    },
    connectivityAlert:{
        type: Boolean,
        default: false,
    },
    data: [],
    Consomation: [],

    Countersdata: [],
    type: { type: String },
    ConsomationTripahse: [],
    PositiveTripahse: [],
    ReverserTipahse: [],
    ActivePowerTipahse: [],
    Voltage_CurrentrTipahse: []

})
module.exports = mongoose.model('Device' , DeviceSchema)
