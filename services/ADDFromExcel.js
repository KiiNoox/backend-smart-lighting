const express = require('express');

const router = express.Router();
const fs = require('fs');
const multer = require('multer');

const csv = require('csvtojson');
const payloadChecker = require('payload-validator');
const Device = require('../models/Device');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
global.__basedir = __dirname;
// -> Multer Upload Storage

function importCsvData2MongoDB(filePath) {
    csv()
        .fromFile(filePath)
        .then(jsonObj => {
            console.log(jsonObj);
        });
}
global.__basedir = __dirname;

// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__basedir}/uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const expectedPayload = {
    Lng: '',
    Lat: '',
    name: '',
    description: '',
    Status: ''
};

router.post('/upload', upload.single('uploadfile'), (req, res, next) => {
    importCsvData2MongoDB(`${__basedir}/uploads/${req.file.filename}`);
    res.json({
        msg: 'File uploaded/import successfully!',
        file: req.file
    });
});

