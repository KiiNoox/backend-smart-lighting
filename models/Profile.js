const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema  = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
    modeAuto: {
        type: Boolean,
    },
    Time: [{
        type: String,
    }],
    positionDetails: [{
        type: String,
    }],
    users: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    Lampe_LVL: [{
        type: Number,
        required: true
    }],
    // Start_Date: {
    //     type: Date,
    //     format: '%Y-%m-%d',
    // },
    // End_Date: {
    //     type: Date,
    // },
    // PRIMARY_COLOR: {
    //     type: String,
    //     required: true
    // },
    // SECONDARY_COLOR: {
    //     type: String,
    //     required: true
    // },
    // Status: {
    //     type: String,
    //     required: true
    // },
    // Area: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "Area",
    // }],
    // Ligne: [{
    //     type: Schema.Types.ObjectId,
    //     ref: "Ligne",
    // }],
    // perodique: [
    //     {
    //         type: Number,
    //     }
    // ],
    // mensuel:
    //     {
    //         type: Number,
    //     }
    // ,
    // annuel:
    //     {
    //         type: Number,
    //     },
    updatedAt:{
        type: Date,
        default: new Date(),
    }

});
module.exports = mongoose.model('Profile' , ProfileSchema)
