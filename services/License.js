const License = require('../models/License');
const licenseKey = require('license-key-gen');
const express = require('express');


let expiredIn;
const ONE_DAY = 24 * 60 * 60 * 1000;
const router = express.Router();

let licen;
exports.ActivatedLicence = async (req, res) => {
    console.log(req.body.code);
        const licen = await License.find({code: req.params.code});
    if(licen[0].Status === true) {
        licen[0].Status = false ;
        licen[0].save();
        res.json("Welcom To LuxBoard");
    } else {
        res.json("this Key is used");
    }

}










exports.addlicence = async (req, res) => {

    const userInfo = {
        company: req.body.company,
    };
    const licenseData = {
        info: userInfo,
        prodCode: 'LEN100120',
        appVersion: '1.5',
        osType: 'WIN10'
    };

    try {
        this.licen = licenseKey.createLicense(licenseData);
        const lic = this.licen;
        console.log(lic);
    } catch (err) {
        console.log(err);
    }
    console.log('++++++++++++++++');
    console.log(this.licen.license);
    const site = new License({
        code: this.licen.license,
        date_debut: Date.now(),
        date_fin: req.body.date_fin,
        company: req.body.company,
        device: req.body.device,
        Zone: 'Licence'
    });

    try {
        License.findOne({ code: this.licen.license }, async function(
            err,
            foundObject
        ) {
            if (foundObject) {
                res.json({ status: 'err', message: 'licence already exists' });
            } else {
                site
                    .save()
                    .then(item => {
                        res.json({
                            status: 'success',
                            mesage: 'licence :' + item.code ,
                        });
                    })
                    .catch(err => {
                        res.status(400).send('unable to save to database');
                    });
            }
        });
    } catch (e) {
        console.log('error site Data', e);
    }
};

exports.getLicence = async (req, res) => {
    const userInfo = {
        company: req.body.company,
    };
    const licenseData = {
        info: userInfo,
        prodCode: 'LEN100120',
        appVersion: '1.5',
        osType: 'WIN10'
    };
    var license = licenseKey.validateLicense(licenseData, "T27T4-Y7SWF-4ZYDU-883AD-C7E55-F6E4F");
    console.log(license);
};
















exports.addLicense = async  (req, res) => {

    const license = new License({
        code: req.body.code,
        date_debut: req.body.date_debut,
        date_fin: req.body.date_fin,
        Zone: req.body.Zone,
        device: req.body.device,
    });
    license.save((err, license) => {
        if (err) res.json(err);
        else res.json(license);
    });
}

exports.getBydatefin = async  (req, res) => {
    var a = false;
    try {
        const license  = await License.find({ _id: req.params.id});
        console.log(license);
        const start = new Date();
        const start2 = license[0].date_fin;
        console.log(start);
        console.log(start2);
        if(start2.getFullYear() === 1970)
        {
            const updated = await License.updateOne(
                { _id: req.params.id },
                { $set: {
                        limite:false,
                    }},

                {new: true, useFindAndModify: false}
            );
            a = true;
            res.json(a);
        }
        else {
        if(start > start2){
            console.log('false');
            license[0].Valide = false;
            license[0].save();
            res.json(a);
        } else if(start <= start2){
            console.log('true');
            a = true;
            res.json(a);
        }
        }
    } catch (err) {
        res.json({message: err});
    }
};
exports.getByZoneActivated = async  (req, res) => {
    try {
        const license  = await License.find(req.params.Zone);
        const start = new Date();
        const start2 = license[0].date_debut;
        if(start >= start2){
            return true;
        } else if(start < start2){
            return false;
        }
    } catch (err) {
        res.json({message: err});
    }
};
