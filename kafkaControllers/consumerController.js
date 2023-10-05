const express = require('express');
const Kafka = require('no-kafka');

const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

//const lib = require('./FactoryRoute');

const { spawn } = require('child_process');

const router = express.Router();

const app = express();

const port = 3001;
const Device = require('./../models/Device');
const Ligne = require('./../models/Ligne');
/*
async function UpdateCountersLine(val, code) {
    line = await Ligne.findOne({ code: code });
    delete val.code;
    val.time = Date.now();
    if (val.DataIdentification === '0000FF00') {
        console.log('consomation');
        line.ConsomationTripahse.push(val);
    } else if (val.DataIdentification === '0001FF00') {
        console.log('positive');
        line.PositiveTripahse.push(val);
    } else if (val.DataIdentification === '0002FF00') {
        console.log('reverse');
        line.ReverserTipahse.push(val);
    } else if (val.DataIdentification === '04601201') {
        //   console.log('resverse');
        line.Voltage_CurrentrTipahse.push(val);
    } else {
        //  console.log('actif power');
        line.ActivePowerTipahse.push(val);
    }
    line.Countersdata.push(val); // delete
    await line.save();
    // updateClients_Soket(val, Sens);
}

async function UpdateCounters(val, code) {
    Sens = await Device.findOne({ identifiant: code });
    delete val.code;
    val.time = Date.now();
    if (val.DataIdentification === '0000FF00') {
        console.log('consomation');
        Sens.ConsomationTripahse.push(val);
    } else if (val.DataIdentification === '0001FF00') {
        console.log('positive');
        Sens.PositiveTripahse.push(val);
    } else if (val.DataIdentification === '0002FF00') {
        console.log('reverse');
        console.log(val);
        Sens.ReverserTipahse.push(val);
    } else if (val.DataIdentification === '04601201') {
        //   console.log('resverse');
        Sens.Voltage_CurrentrTipahse.push(val);
    } else {
        //  console.log('actif power');
        Sens.ActivePowerTipahse.push(val);
    }
    Sens.Countersdata.push(val); // delete
    await Sens.save();
    // updateClients_Soket(val, Sens);
}
async function compteurCrypt(Crypteddata, DevEUI) {
    /*   console.log('data compteur ', Crypteddata);
       console.log('dev ui', DevEUI);
   */
/*
    let dataToSend = null;
    const python = await spawn('python', [
        'routes/decrypt.py',
        Crypteddata,
        'python'
    ]);
    python.stdout.on('data', function(data) {
        dataToSend = data.toString();
        console.log(`dataTosendFromOnStart: ${dataToSend}`);
    });
    python.on('close', code => {
        //console.log(`child process close all stdio with code ${code}`);
        //mono countersdata 384
        //tri positivractive 483
        //console.log("dataTosendFromOnClose: "+dataToSend)
        if (dataToSend != null) {
            if (!JSON.parse(dataToSend)) {
                //   console.log("dataToSend"+dataToSend)
                return;
            }

            const datatram = JSON.parse(dataToSend);
            console.log(datatram);
            UpdateCounters(datatram, DevEUI);
            UpdateCountersLine(datatram, DevEUI);
            // console.log(obj.Address);
        }
    });
}

async function checkk(obj) {
    try {
        const ligne = await Ligne.findOne({ code: obj.DevEUI_uplink.DevEUI });
        if (ligne === null) {
            console.log('Unkown device !');
        } else {
            //console.log(obj)
            console.log('device', ligne.type);
            if (ligne.type === 'mono' || ligne.type === 'triphase') {
                // console.log(obj.DevEUI_uplink.DevEUI);
                compteurCrypt(obj.DevEUI_uplink.payload_hex, obj.DevEUI_uplink.DevEUI);
            }
        }
    } catch (e) {
        // console.log(e);
    }
}
async function check(obj) {
    try {
        const device = await Device.findOne({ code: obj.DevEUI_uplink.DevEUI });
        if (device === null) {
            console.log('Unkown device !');
        } else {
            //console.log(obj)
            console.log('device', device.type);
            if (device.type === 'mono' || device.type === 'triphase') {
                // console.log(obj.DevEUI_uplink.DevEUI);
                compteurCrypt(obj.DevEUI_uplink.payload_hex, obj.DevEUI_uplink.DevEUI);
            }
        }
    } catch (e) {
        // console.log(e);
    }
}
try {
    console.log('Trying to connect to Kafka Server .....');

    app.listen(port, function() {
        console.log(`Server running on localhost:${port}`);
        const consumer = new Kafka.SimpleConsumer({
            connectionString: '193.95.76.211:9092',
            clientId: 'no-kafka-client'
        });

        const dataHandler = function(messageSet, topic, partition) {
            messageSet.forEach(function(m) {
                console.log(
                    topic,
                    partition,
                    m.offset,
                    m.message.value.toString('utf8')
                );
                const obj = JSON.parse(m.message.value);
                // console.log(obj);
                check(obj);
                checkk(obj);
            });
        };
        return consumer.init().then(function() {
            // Subscribe partitons 0 and 1 in a topic:
            const v1 = consumer.subscribe('AS.SkyIndustriesTest.v1', dataHandler);
            const arr = [];
            arr.push([v1]);
            console.log(`val:${arr}`);
            return arr;
        });
    });

    Device.find(async function(err, foundObject) {
        // console.log(`All sensors kept from kafka server: ${foundObject}`);
    });
} catch (e) {
    console.log(e);
}

router.post('/AddDeviceData', async (req, res) => {
    try {
        Sens = await Device.findOne({ code: req.body.code });
        delete req.body.code;
        req.body.time = Date.now();
        Sens.Countersdata.push(req.body);
        // console.log(Sens.data);
        await Sens.save();
        return res.status(200).json({ status: 'ok', message: 'updated' });
    } catch (e) {
        console.log('error AddSensor Data', e);
    }
});
router.post('/AddLigneData', async (req, res) => {
    try {
        line = await Ligne.findOne({ code: req.body.code });
        delete req.body.code;
        req.body.time = Date.now();
        line.Countersdata.push(req.body);
        // console.log(Sens.data);
        await line.save();
        return res.status(200).json({ status: 'ok', message: 'updated' });
    } catch (e) {
        console.log('error AddSensor Data', e);
    }
});*/
module.exports = router;
