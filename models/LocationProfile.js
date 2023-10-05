const mongoose = require('mongoose');
var Line = require('./Ligne');
var Area=require('./Area')
var Profile=require('./Profile')


const Schema = mongoose.Schema;

const LocationProfileSchema  = new Schema({
    users: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    profile: {
        type: Schema.Types.ObjectId,
            ref: "Profile",
    },
    Start_Date: {
        type: Date,
        format: '%Y-%m-%d',
    },
    End_Date: {
        type: Date,
    },
    PRIMARY_COLOR: {
        type: String,
        required: true
    },
    SECONDARY_COLOR: {
        type: String,
        required: true
    },
    Area: [{
        type: Schema.Types.ObjectId,
        ref: "Area",
    }],
    Ligne: [{
        type: Schema.Types.ObjectId,
        ref: "Ligne",
    }],
    perodique: [
        {
            type: Number,
        }
    ],
    mensuel:
        {
            type: Number,
        }
    ,
    annuel:
        {
            type: Number,
        },
    updatedAt:{
        type: Date,
        default: Date.now()
    }

});
module.exports = mongoose.model('LocationProfile' , LocationProfileSchema)
