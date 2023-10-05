const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const licenseSchema  = new Schema({
    code: {
        type: String,
        require: true,
    },
    date_debut: {
        type: Date,
        required: true,
    },
    date_fin: {
        type: Date,
        required: true
    },
    Zone: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    Status: {
        type: Boolean,
        default: true
    },
    Valide: {
        type: Boolean,
        default: true
    },
    limite: {
        type: Boolean,
        default: true
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: "users",
        default : null,
    },
    device: {
        type: Number,
        required: true
    },
})
//d
module.exports = mongoose.model('license' , licenseSchema);
