const Area = require('../models/Area');
const Profile = require('../models/Profile');
const Line=require ('../models/Ligne')
const Device=require ('../models/Device')
const { MongoClient } = require('mongodb');
const fs = require('fs');
const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const { spawn } = require('child_process');
exports.add = async  (req, res) => {

            const area = new Area({
                name: req.body.name,
                description: req.body.description,
                Lng: req.body.Lng,
                Lat: req.body.Lat,
                Status: "activated",
                Ligne: [],
                profiles: [],
                users: req.body.users,
            });

    area.save((err, area) => {
                if (err) res.json(err);
                else res.json(area);
            });
                  }
exports.getArea = async  (req, res)=> {
    console.log(req.params.users);
    try {
        const area = Area.find({ users: req.params.users}).populate({
            path: "Ligne",
            populate: {
                path: "Device",
            }
        }).then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
}

exports.getById = async  (req, res) => {
    try {
        const area  = await Area.findById(req.params.id).populate({
            path: "Ligne",
            populate: {
                path: "Device",
            }
        });
        res.json(area);
    } catch (err) {
        res.json({message: err});
    }
};
exports.deleteArea = async  (req, res) => {
    try {
        const area  = await Area.findById(req.params.id)
        if(area.Ligne.length>0)
        {
            res.status(409).json({ message: "You must delete all the lines related to this area first." })       

        }

    else{
    await Area.deleteOne({ _id: req.params.id }); 
    res.status(201).json({ message: "Area deleted." })       

    }
    } catch (err) {
        console.log(err)
    }
};


exports.updateArea =   async  (req, res) => {
    try {
        const updated = await Area.updateOne(
            { _id: req.params.id },
            { $set: {
                    name:req.body.name,
                    description:req.body.description,
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
exports.affecteLigneToArea =   async  (req, res) => {
    try {
        const updated = await Area.updateOne(
            { _id: req.params.id },
            { $set: {
                    Ligne:req.body.Ligne,
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


exports.updateAreaStatus =   async  (req, res) => {
    console.log(req.params.id);
    let d ='desactivated';
    let a = 'activated';
    const area  = await Area.find({_id: req.params.id}).populate({
        path: "Ligne",
        populate: {
            path: "Device",
        }
    });
    res.json(area);
    if (area[0].Status ==='activated' ||area[0].Status ==='Problem' ) {
        console.log('test');
        area[0].Status = 'desactivated';
        area[0].update();
        console.log(area[0]);
        for (let i =0 ; i<area[0].Ligne.length ; i++) {
            if(area[0].Ligne[i].Status === 'activated') {
              console.log('-----------');
                console.log(area[0].Ligne[i].name);


                area[0].Ligne[i].Status = 'desactivated';



                for(let j=0 ; j < area[0].Ligne[i].Device.length ; j++)
                {
                    console.log('-----------/////');
                    console.log(area[0].Ligne[i].Device[j].Status );

                    if(area[0].Ligne[i].Device[j].Status  === 'activated') {
                        area[0].Ligne[i].Device[j].Status = 'desactivated';
                        const largeDataSet = [];
                        console.log('Donwlink : Sensor Off');
                        //let dataToSend;
                        //device = await Device.findOne({ code: req.body.code });

                        // spawn new child process to call the python script

                        const python = spawn('python3', [
                            'routes/remote.py',
                            area[0].Ligne[i].Device[i].code,
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
                        area[0].Ligne[i].Device[j].save();
                    }
                    else {
                        area[0].Ligne[i].Device[j].Status = 'desactivated';
                        const largeDataSet = [];
                        console.log('Donwlink : Sensor Off');
                        //let dataToSend;
                        //device = await Device.findOne({ code: req.body.code });

                        // spawn new child process to call the python script

                        const python = spawn('python3', [
                            'routes/remote.py',
                            area[0].Ligne[i].Device[i].code,
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
                        console.log(area[0].Ligne[i].Device[j].Status);

                    }

                }console.log('22222-----------/////');
                console.log(area[0].Ligne[i].Device[0].Status);

                area[0].Ligne[i].save();

            }
            else {
                console.log('*************');

            }
        }
        area[0].save();

    }
    else {



        console.log('test');
        area[0].Status = 'activated';
        area[0].update();
        console.log(area[0]);
        for (let i =0 ; i<area[0].Ligne.length ; i++) {
            if(area[0].Ligne[i].Status === 'desactivated') {
                console.log('-----------');
                console.log(area[0].Ligne[i].name);


                area[0].Ligne[i].Status = 'activated';



                for(let j=0 ; j < area[0].Ligne[i].Device.length ; j++)
                {
                    console.log('-----------/////');
                    console.log(area[0].Ligne[i].Device[j].Status );

                    if(area[0].Ligne[i].Device[j].Status  === 'desactivated') {
                        area[0].Ligne[i].Device[j].Status = 'activated';
                        const largeDataSet = [];
                        console.log('Donwlink : Sensor Off');
                        //let dataToSend;
                        //device = await Device.findOne({ code: req.body.code });

                        // spawn new child process to call the python script

                        const python = spawn('python3', [
                            'routes/remote.py',
                            area[0].Ligne[i].Device[i].code,
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
                        area[0].Ligne[i].Device[j].save();
                    }
                    else {
                        area[0].Ligne[i].Device[j].Status = 'activated';
                        const largeDataSet = [];
                        console.log('Donwlink : Sensor Off');
                        //let dataToSend;
                        //device = await Device.findOne({ code: req.body.code });

                        // spawn new child process to call the python script

                        const python = spawn('python3', [
                            'routes/remote.py',
                            area[0].Ligne[i].Device[i].code,
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
                        console.log(area[0].Ligne[i].Device[j].Status);

                    }

                }console.log('22222-----------/////');
                console.log(area[0].Ligne[i].Device[0].Status);

                area[0].Ligne[i].save();

            }
            else {
                console.log('*************');

            }
        }
        area[0].save();




    }

};

// function checkDate(area,profile){
//     const b=false
//     for(let i=0;i<area.profiles.length;i++)
//     {
//             if (area.profiles[i].Start_Date>=profile.End_Date|| profile.Start_Date>=area.profiles[i].End_Date)
//             b=true;
//             else
//             b=false
//     }
//     return b;
// }

exports.affecteProfileToArea =   async  (req, res) => {
    const id=req.params.id;
    try {
      await Area.updateOne(
            {_id:id},
            {$push:{
                profiles:req.body._id,
            }},
            {new:true,useFindAndModify:false}
        );

        const area = await Area.findById(id).populate('Ligne');
        if (!area) {
          throw new Error('Area not found');
        }
    
        for (let i = 0; i < area.Ligne.length; i++) {
          area.Ligne[i].profiles.push(req.body._id);
          await area.Ligne[i].save();
        }
    
        res.json({ message: 'Profiles affected in Area and Ligne' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

};

exports.getAreaByprofile = async  (req, res)=> {
    const ProfileId = req.params.id ;
    try {
        const ligne = Area.find({Profile: ProfileId}).then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
};

exports.deleteAreaFromProfile  = async  (req, res)=> {

    try {
        const updated = await Area.updateOne(
            { _id: req.params.id },
            { $set: {
                    Profile:null,
                }},

            {new: true, useFindAndModify: false}
        );
        console.log('ok');
        res.json(updated);
        const area  = await Area.find({_id: req.params.id}).populate({
            path: "Ligne",
            populate: {
                path: "Device",
            }
        });



        for (let i =0 ; i<area[0].Ligne.length ; i++) {
            area[0].Ligne[i].Profile = null;
            for(let j=0 ; j < area[0].Ligne[i].Device.length ; j++)
            {
                area[0].Ligne[i].Device[j].Profile = null;
                area[0].Ligne[i].Device[j].save();

            }

            area[0].Ligne[i].save();
        }
        console.log(req.body._id);
        const areas  = await Area.find({Profile:req.body._id}).populate('Ligne');
        console.log(areas);
if(areas[0] == null)
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

var XLSX = require("xlsx");
exports.addexcel = async  (req, res) => {
    var workbook = XLSX.readFile("uploads/test.xlsx");
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list); // getting as Sheet1

    sheet_name_list.forEach(function (y) {
        var worksheet = workbook.Sheets[y];
        //getting the complete sheet
        // console.log(worksheet);

        var headers = {};
        var data = [];
        for (z in worksheet) {
            if (z[0] === "!") continue;
            //parse out the column, row, and value
            var col = z.substring(0, 1);
            // console.log(col);

            var row = parseInt(z.substring(1));
            // console.log(row);

            var value = worksheet[z].v;
            // console.log(value);

            //store header names
            if (row == 1) {
                headers[col] = value;
                // storing the header names
                continue;
            }

            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        console.log(data);
    });
}

exports.uploadsexcel =  async (req, res, next) => {
    console.log(req.file.originalname);
    var workbook = XLSX.readFile("uploads/" + req.file.originalname);
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list); // getting as Sheet1

    sheet_name_list.forEach(function (y) {
        var worksheet = workbook.Sheets[y];
        //getting the complete sheet
        // console.log(worksheet);

        var headers = {};
        var data = [];
        for (z in worksheet) {
            if (z[0] === "!") continue;
            //parse out the column, row, and value
            var col = z.substring(0, 1);
            // console.log(col);

            var row = parseInt(z.substring(1));
            // console.log(row);

            var value = worksheet[z].v;
            // console.log(value);

            //store header names
            if (row == 1) {
                headers[col] = value;
                // storing the header names
                continue;
            }

            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        console.log(data);
        for(let i=0 ; i<data.length; i++) {
            const area = new Area({
                name: data[i].name,
                description: data[i].description,
                Lng: data[i].Lng,
                Lat: data[i].Lat,
                Status: "activated",
                Ligne: [],
                Profile: null,
            });

            area.save();
        }

    });

};


exports.getSommeDataSite = async (req, res) => {
    const devvsite = [];
    console.log("+++++");

    console.log(req.params.id);

    const site = await Area.findById(req.params.id).populate({
        path: 'Ligne',
        populate: {
            path: 'Device'
        }
    });
console.log(site);
    for (let i = 0; i < site.Ligne.length; i++) {
        const concatsite = site.Ligne[i].Device;
        console.log(concatsite);
        devvsite.push(concatsite);
        console.log(devvsite);
    }
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
    if(devicesite !== undefined){
    for (let x = 0; x < devicesite.length; x++) {
        for (let d = 0; d < devicesite[x].data.length; d++) {
            const alsite = devicesite[x].data[d];
            alldevicessite.push(devicesite[x].data[d]);
            console.log(alldevicessite);
        }
    }
    }
    console.log(alldevicessite);

    res.json(alldevicessite);
};
exports.namesite = async (req, res) => {
    const ProfileId = req.params.id;
    try {
        const ligne = Area.findById(req.params.id).then(user =>
            res.json(ligne.name)
        );
        console.log(ligne);
    } catch (err) {
        res.json({ message: err });
    }
};
