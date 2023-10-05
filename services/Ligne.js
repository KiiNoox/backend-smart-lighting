const Ligne = require('../models/Ligne');
const Area = require('../models/Area');
const Device=require('../models/Device')
const { spawn } = require('child_process');

exports.addLigne = async  (req, res) => {

    const ligne = new Ligne({
        name: req.body.name,
        description: req.body.description,
        Area: req.body.Area,
        Lng: req.body.Lng,
        Lat: req.body.Lat,
        Status: "activated",
        Device: [],
        Profile: null,
        users: req.body.users,
    });
    const area  = await Area.find({_id: req.body.Area});
    area[0].Ligne.push(ligne) ;
    area[0].save();
    ligne.save((err, ligne) => {
        if (err) res.json(err);
        else res.json(ligne);
    });
}

exports.getLigne = async  (req, res)=> {
    try {
        const ligne = Ligne.find({ users: req.params.users}).populate("Area").populate("Device").then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
}
exports.getLines=async(req,res)=>{
    try{
        const ligne = Ligne.find({ users: req.params.users}).populate("Area").populate("Device").then(user => res.json(user));
        res.json(ligne);
    }
    catch(ree)
    {
        res.json({message: err});

    }
}

exports.getById = async  (req, res) => {
    try {
        const ligne  = await Ligne.findById(req.params.id).populate("Device");
        res.json(ligne);
    } catch (err) {
        res.json({message: err});
    }
};
exports.getLigneByArea = async  (req, res)=> {
    const AreaId = req.params.id ;
    try {
        const ligne = Ligne.find({Area: AreaId}).then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
};
exports.getLigneByProfile = async  (req, res)=> {
    const ProfileId = req.params.id ;
    try {
        const ligne = Ligne.find({Profile: ProfileId}).then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
};
exports.deleteLigne = async  (req, res) => {
    try {

        const id=req.params.id;
        const line  = await Ligne.findById(id);
        if(line.Device.length>0){
            res.status(409).json({ message: "You must delete all the devices related to this line first first." })       
         }
         else
        {
        await Ligne.deleteOne({ _id: id });
        await Area.updateOne(
            { Ligne: id },
            { $pull: { Ligne: id } }
          );
          res.status(201).json({ message: "Line deleted." })       

        }
    
    } catch (err) {
        console.log(err)
    }
};



exports.updateLigne =   async  (req, res) => {
    try {
        const updated = await Ligne.updateOne(
            { _id: req.params.id },
            { $set: {
                    name:req.body.name,
                    description:req.body.description,
                    Area:req.body.Area,
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
exports.affecteDeviceToLigne =   async  (req, res) => {
    try {
        const updated = await Ligne.updateOne(
            { _id: req.params.id },
            { $set: { 
                    Device:req.body.Device,
                }},

            {new: true, useFindAndModify: false}
        );
        res.json(updated);
    } 
    catch (err) {
        console.log(err);

        res.json({message: err});
    }
};

exports.updateLigneStatusByidDevice =   async  (req, res) => {
    try {
        const updated = await Ligne.updateOne(
            { Device: req.params.id },
            { $set: {
                    Status:'Problem',
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

exports.updateLigneStatusByidDeviceA = async (req, res) => {
    console.log(req.params.id);
    
    try {
        const ligne = await Ligne.find({ Device: req.params.id }).populate('Device');
        
        if (ligne[0].Device.some(device => device.Status === 'desactivated')) {
            console.log('desactivated');
            return res.json('desactivated');
        } else {
            ligne[0].Status = 'activated';
            await ligne[0].save();
            console.log('activated');
            return res.json('activated');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.updateLigneStatus3 =   async  (req, res) => {
    console.log(req.params.id);
    let test =0 ;
    let testProblem =0 ;

    const ligne  = await Ligne.find({_id: req.params.id}).populate('Device');
    if (ligne[0].Status ==='activated' ||ligne[0].Status ==='Problem' ) {
        console.log('test');
        ligne[0].Status = 'desactivated';
let d ='desactivated';
        for (let i =0 ; i<ligne[0].Device.length ; i++) {
            if(ligne[0].Device[i].Status === 'activated') {
                console.log(ligne[0].Device[i].Status);
                ligne[0].Device[i].Status = 'desactivated';
                    const largeDataSet = [];
                    console.log('Donwlink : Sensor Off');
                    //let dataToSend;
                    //device = await Device.findOne({ code: req.body.code });

                    // spawn new child process to call the python script

                    const python = spawn('python3', [
                        'routes/remote.py',
                        ligne[0].Device[i].code,
                        d
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
                        // res.json(largeDataSet.join(''));
                    });
                ligne[0].Device[i].save();
            }
            else {
                ligne[0].Device[i].Status = 'desactivated';
                    const largeDataSet = [];
                    console.log('Donwlink : Sensor Off');
                    //let dataToSend;
                    //device = await Device.findOne({ code: req.body.code });

                    // spawn new child process to call the python script

                    const python = spawn('python3', [
                        'routes/remote.py',
                        ligne[0].Device[i].code,
                        d
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
                      //  res.json(largeDataSet.join(''));
                    });
                ligne[0].save();
                res.json('activated');
            }

        }
        ligne[0].save();
        const area  = await Area.find({Ligne: req.params.id}).populate({
            path: "Ligne",
            populate: {
                path: "Device",
            }
        });
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(area);
        for (let j =0 ; j<area[0].Ligne.length ; j++) {
            if(area[0].Ligne[j].Status === 'activated') {
                test = 1;
                  return res.json('Ligne Activated Exist');
            }
            if(area[0].Ligne[j].Status === 'Problem') {
                testProblem = 1;
            }

        }
        if(test ===0) {
            area[0].Status = 'desactivated';
            area[0].save();
        }
        if(testProblem === 1) {
            area[0].Status = 'Problem';
            area[0].save();
        }
    }
    else {
        console.log('test2');

        ligne[0].Status = 'activated';
        for (let i =0 ; i<ligne[0].Device.length ; i++) {
            if(ligne[0].Device[i].Status === 'desactivated') {
                let a = 'activated';
                ligne[0].Device[i].Status = 'activated';
                console.log(ligne[0].Device[i].Status);
                    const largeDataSet = [];
                    console.log('Donwlink : Sensor Off');
                    //let dataToSend;
                    //device = await Device.findOne({ code: req.body.code });

                    // spawn new child process to call the python script

                    const python = spawn('python3', [
                        'routes/remote.py',
                        ligne[0].Device[i].code,
                        a
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
                       // res.json(largeDataSet.join(''));
                    });
                ligne[0].Device[i].save();
            }
            else {
                ligne[0].save();
                return  res.json('activated');
            }

        }
        ligne[0].save();
        const area  = await Area.find({Ligne: req.params.id}).populate({
            path: "Ligne",
            populate: {
                path: "Device",
            }
        });
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(area);
        for (let j =0 ; j<area[0].Ligne.length ; j++) {
            if(area[0].Ligne[j].Status === 'activated') {
                area[0].Status = 'activated';
                area[0].save();

            }
            else {
                res.json('Ligne Activated Exist');
            }
        }
    }

};













exports.affecteProfileToLigne =   async  (req, res) => {
    try {
           const id=req.params.id;
            await Ligne.updateOne(
                {_id:id},
                {$push:{
                    profiles:req.body._id,
                }},
                {new:true,useFindAndModify:false}
            );
    res.json({ message: 'Profiles affected to Ligne' });


    } catch (err) {
        console.log(err);

        res.json({message: err});
    }
};




exports.removeLigneFromProfile =   async  (req, res) => {
    try {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(req.params.id);
        const updated = await Ligne.updateOne(
            {_id: req.params.id},
            {
                $set: {
                    Profile: null,
                }
            },

            {new: true, useFindAndModify: false}
        );
        console.log('ok');
        res.json(updated);

        const ligne  = await Ligne.find({_id: req.params.id}).populate("Device");
        if(ligne[0].Device.length > 0)
        {
            for (let i =0 ; i<ligne[0].Device.length ; i++) {
                ligne[0].Device[i].Profile = null;
                ligne[0].Device[i].save();
            }
        }
        const areas  = await Area.find({Profile:req.body._id}).populate('Ligne');
        const lignes  = await Ligne.find({Profile:req.body._id}).populate('Device');

        if(areas[0] == null && lignes[0] == null)
        {
            const updated = await Profile.updateOne(
                { _id: req.body._id },
                { $set: {
                        Start_Date: null,
                        End_Date: null,
                        Status: 'desactivated',
                    }},

                {new: true, useFindAndModify: false}
            );
        }


    } catch (err) {
        console.log(err);

        res.json({message: err});
    }

}
exports.getligneData = async (req, res) => {
    try {
        s = await Ligne.find({ type: req.body.type });
        console.log(s);
        res.status(200).json(s);
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};


exports.getSommeDataline = async (req, res) => {
    let time;
    const devvsite = [];
        s = await Ligne.find({ _id: req.params.id }).populate("Device");
                    const concatsite = s[0].Device;
                    console.log(concatsite);
                    devvsite.push(concatsite);
                    console.log(devvsite);
                const devsite = devvsite;
                console.log(devsite);
                const alltestsite = [];
                let testttsite;
                for (let j = 0; j < devsite.length; j++) {
                    for (let b = 0; b < devsite[j].length; b++) {
                        console.log(devsite[j].length);
                        const testsite = devsite[j][b];

                        alltestsite.push(testsite);
                        console.log(alltestsite);
                    }
                    testttsite = alltestsite;
                }
                const devicesite = testttsite;
                console.log(devicesite);
                const alldevicessite = [];
                for (let x = 0; x < devicesite.length; x++) {
                    for (let d = 0; d < devicesite[x].data.length; d++) {
                        const alsite = devicesite[x].data[d];
                        alldevicessite.push(devicesite[x].data[d]);
                        console.log(alldevicessite);
                    }
                }
                console.log(alldevicessite);

                res.json(alldevicessite);
            }
exports.nameline = async (req, res) => {
    const ProfileId = req.params.id;
    try {
        const ligne = Ligne.findById(req.params.id).then(user =>
            res.json(user.name)
        );
        console.log(ligne);
    } catch (err) {
        res.json({ message: err });
    }
};




