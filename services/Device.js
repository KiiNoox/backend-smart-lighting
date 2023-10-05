const Device = require('../models/Device');
const Ligne = require('../models/Ligne');
const GlobalSensor = require('../models/GlobalSensor');



exports.add = async  (req, res) => {
    GlobalSensor.findOne({ code: req.body.identifiant }, async function(
        err,
        foundObject
    ) {
        if (err) {
            res.json({ status: 'err', message: 'Error' });
        } else if (!foundObject) {
            res.json({ status: 'err', message: 'Object not found' });
        }
    }).then(item => {
        if (item == null) {
            res.json({ status: 'err', message: 'Object already added' });
        } else {
            Device.findOne(
                { code: item.code, Ligne: req.body.Ligne, Site: req.body.Site },
                async function(err, ObjectFoundinDevice) {
                    if (err) {
                        res.json({status: 'err', message: 'Object not found'});
                    } else if (ObjectFoundinDevice == null) {
                        const device = new Device({
                            name: req.body.name,
                            description: req.body.description,
                            identifiant: req.body.identifiant,
                            Area: req.body.Area,
                            Ligne: req.body.Ligne,
                            Lng: req.body.Lng,
                            Lat: req.body.Lat,
                            Status: "activated",
                            users: req.body.users,
                            Profile: null
                        });
                        const ligne = await Ligne.find({_id: req.body.Ligne});
                        ligne[0].Device.push(device);
                        ligne[0].save();
                        device.save((err, device) => {
                            if (err) res.json(err);
                            else res.json(device);
                        });
                    }}
                );
        }
    });
};
exports.getDevice = async  (req, res)=> {
    try {
         Device.find({ users: req.params.users}).populate("Area").populate("Ligne").then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
}

exports.getDevicesWithoutData = async (req, res) => {
    try {
        const devices = await Device.find({ users: req.params.users }, { data: 0 });

        if (devices) {
            res.json(devices);
        } else {
            res.status(404).json({ message: "Devices not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


exports.getById = async  (req, res) => {
    try {
        const device  = await Device.findById(req.params.id);
        res.json(device);
    } catch (err) {
        res.json({message: err});
    }
};

exports.getDeviceByLigne = async  (req, res)=> {
    const LigneId = req.params.id ;
    try {
        const device = Device.find({Ligne: LigneId}).then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
}
exports.deleteDevice = async (req, res) => {
    try {
      const id = req.params.id;
      await Device.deleteOne({ _id: id });
      await Ligne.updateOne(
        { Device: id },
        { $pull: { Device: id } }
      );

  
      res.json({ message: 'Device deleted' });
    } catch (err) {
      res.json({ message: err });
      return;
    }
  };
exports.updateDevice =   async  (req, res) => {
    try {
        const updated = await Device.updateOne(
            { _id: req.params.id },
            { $set: {
                    name:req.body.name,
                    description:req.body.description,
                    Area:req.body.Area,
                    Ligne:req.body.Ligne,
                    Lng:req.body.Lng,
                    Lat:req.body.Lat,
                }},

            {new: true, useFindAndModify: false}
        );
        console.log('ok');
        res.json(updated);
    } catch (err) {
        console.log(err);

        res.json({message: err});
    }
};

exports.updateDeviceStatus =   async  (req, res) => {
    try {
        console.log("eeeee");
        const updated = await Device.updateOne(
            { _id: req.params.id },
            { $set: {
                    Status:req.body.Status,
                }},

            {new: true, useFindAndModify: false}
        );
        console.log('ok');
        res.json(updated);
    } catch (err) {
        console.log(err);

        res.json({message: err});
    }
};

exports.getlightData = async (req, res) => {
    try {
        s = await Device.findOne({ _id: req.params.id });
 

        res.status(200).json(s);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};
exports.namedevice = async (req, res) => {
    const ProfileId = req.params.id;
    try {
        const ligne = Device.findById(req.params.id).then(user =>
            res.json(ligne.name)
        );
        console.log(ligne);
    } catch (err) {
        res.json({ message: err });
    }
};


exports.device = async (req, res) => {
    const globalSensor = new GlobalSensor({
        code: req.body.code,
        type: req.body.type
    });
    try {
        Device.findOne({ code: req.body.code }, async function(err, foundObject) {
            if (foundObject) {
                res.json({ status: 'err', message: 'Device already added' });
            } else {
                globalSensor
                    .save()
                    .then(item => {
                        res.send('item saved to database');
                    })
                    .catch(err => {
                        res.status(400).send('unable to save to database');
                    });
            }
        });
    } catch (e) {
        console.log('error AddSensor Data', e);
    }
};
