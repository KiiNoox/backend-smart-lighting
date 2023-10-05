const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LigneSchema  = new Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        required: true,
    },
    Area: {
        type: Schema.Types.ObjectId,
        ref: "Area",
        required: true,
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
    Device: [{
        type: Schema.Types.ObjectId,
        ref: "Device",
    }],
    currentProfile: {
        type: Schema.Types.ObjectId,
        ref: "LocationProfile",
        default : null,
    },
    profiles: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "LocationProfile",
          default: [],
        }]
      },
    data: [],
    Consomation: [],

    Countersdata: [],
    type: {
        type: String,
        default: 'triphase'
    },
    ConsomationTripahse: [],
    PositiveTripahse: [],
    ReverserTipahse: [],
    ActivePowerTipahse: [],
    Voltage_CurrentrTipahse: [],
    code: {
        type: String,
        default: '004A77012404D36E'
    }
});
//LigneSchema.plugin(uniqueArrayPlugin);


module.exports = mongoose.model('Ligne' , LigneSchema)
