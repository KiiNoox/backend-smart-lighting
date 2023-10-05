const mongoose = require('mongoose');
var ligne = require('./Ligne');
const uniqueArrayPlugin = require("mongoose-unique-array");

const Schema = mongoose.Schema;

const AreaSchema  = new Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        required: true,
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
    Ligne: [{
        type: Schema.Types.ObjectId,
        ref: "Ligne",
        default : [],
    }],
    users: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    profiles: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "LocationProfile",
          default: [],
        }]
      },

});
AreaSchema.plugin(uniqueArrayPlugin);


  



module.exports = mongoose.model('Area' , AreaSchema);
