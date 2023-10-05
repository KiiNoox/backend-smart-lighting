var express = require('express');
var router = express.Router();
const DeviceService = require('../services/Device');
const Device = require('../models/Device');
const { spawn } = require('child_process');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/AddDevice', DeviceService.add);
router.post('/AddGlobal', DeviceService.device);
router.get('/GetDevice/:users', DeviceService.getDevice);
router.get('/:id', DeviceService.getById);
router.get('/getDevicesWithoutData/:users',DeviceService.getDevicesWithoutData)
router.delete('/:id', DeviceService.deleteDevice);
router.put('/:id', DeviceService.updateDevice);
router.put('/updateDeviceStatus/:id', DeviceService.updateDeviceStatus);
router.get('/namedevice/:id', DeviceService.namedevice);
router.get('/GetByIdLigne/:id', DeviceService.getDeviceByLigne);
router.get('/getlightData/:id', DeviceService.getlightData);
router.post('/onoff/:SensorId/:status', async (req , res)=>{
    console.log(req.params.status)
    console.log(req.params.SensorId)
    const spawn = require('child_process').spawn;
    const ls = spawn('python3', ['routes/remote.py',req.params.SensorId, req.params.status]);

    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    console.log('update');
    console.log(req.body.id);
    console.log(req.body.etats);
});


router.post('/SensorOff', /*verifyToken, */ async (req, res) => {
    console.log(req.body.code)
    console.log('req.body.code')
        try {
            const largeDataSet = [];
            console.log('Donwlink : Sensor Off');
            //let dataToSend;
            device = await Device.findOne({ identifiant: req.body.code });

            // spawn new child process to call the python script

            const python = spawn('python3', [
                'routes/remote.py',
                req.body.code,
                req.body.event
            ]);
            // collect data from script
            python.stdout.on('data', function(data) {
                console.log('Pipe data from python script ...');
                largeDataSet.push(data);
                //dataToSend = data.toString();
            });
            // in close event we are sure that stream from child process is closed
            python.on('close', code => {
                // console.log( child process close all stdio with code ${code});
                // send data to browser
                //    console.log(dataToSend: ${dataToSend});
                res.json(largeDataSet.join(''));
            });
        } catch (err) {
            res.json({ message: err.message });
        }
    }
);
module.exports = router;
