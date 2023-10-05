const Profile = require('../models/Profile');
const Area = require('../models/Area');
const Device = require('../models/Device');
const Ligne = require('../models/Ligne');
const LocationProfile = require('../models/LocationProfile');
exports.add = async  (req, res) => {

    const profile = new Profile({
        name: req.body.name,
        color: req.body.color,
        modeAuto: req.body.modeAuto,
        positionDetails:req.body.positionDetails,
        Time: req.body.Time,
        Lampe_LVL: req.body.Lampe_LVL,
        //Start_Date: null,
        //End_Date: null,
        //PRIMARY_COLOR: 'red',
        //SECONDARY_COLOR: 'red',
        //Status: 'desactivated',
        users: req.body.users,
});

    profile.save((err, profile) => {
        if (err) res.json(err);
        else res.json(profile);
    });
}

exports.deleteProfile = async  (req, res) => {
    lp= await  LocationProfile.find({profile:req.params.id})
    if(lp.length>0){
    res.status(409).json({ message: "This profile is already assigned, You can't delete it" })       
    }
    else
    try {
        await Profile.deleteOne({ _id: req.params.id });
        res.status(201).json({ message: "Line deleted." })       

    } catch (err) {
    console.log(err)
    }
};
exports.getProfiles=async (req,res)=>{
    try{
     const profiles = await Profile.find()
     res.json({ profiles }); 

    }
    catch(err)
    {
        res.json({message: err});

    }
}
exports.getProfile = async  (req, res)=> {
    try {
        const profile = Profile.find({ users: req.params.users}).populate('Area').populate('Ligne').then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
};
exports.updateProfile =   async  (req, res) => {
    try {
        const updated = await Profile.updateOne(
            { _id: req.params.id },
            { $set: {
                    name:req.body.name,
                    color:req.body.color,
                    modeAuto: req.body.modeAuto,
                    positionDetails:req.body.positionDetails,
                    Time:req.body.Time,
                    Lampe_LVL:req.body.Lampe_LVL,
                    updatedAt:new Date()
                }},

            {new: true, useFindAndModify: false}
        );
        res.json(updated);
    } catch (err) {
        console.log(err);

        res.json({message: err});
    }
};



// exports.updateAsseignProfile =   async  (req, res) => {
//     try {
//         console.log(req.body.Start_Date,"start date");
//         console.log(req.body.End_Date,"end date");
//         console.log(req.body.Area,"areeeeeeeeeeeeeeeeeeeeeeeeeeea");
//         const updated = await Profile.updateOne(
//             { _id: req.params.id },
//             { $set: {
//                     PRIMARY_COLOR:req.body.PRIMARY_COLOR,
//                     SECONDARY_COLOR:req.body.SECONDARY_COLOR,
//                     Start_Date:req.body.Start_Date,
//                     End_Date:req.body.End_Date,
//                     Status: 'Activated',
//                     Area: req.body.Area,
//                     Ligne: req.body.Ligne,
//                     perodique: req.body.perodique,
//                     mensuel: req.body.mensuel,
//                     annuel: req.body.annuel,
//                 }},

//             {new: true, useFindAndModify: false}
//         );
//         console.log('ok');
//         res.json(updated);
//     } catch (err) {
//         console.log(err);

//         res.json({message: err});
//     }
// };


// exports.CancelAsseignProfile =   async  (req, res) => {
//     try {
//         const updated = await Profile.updateOne(
//             { _id: req.params.id },
//             { $set: {
//                     Start_Date: null,
//                     Area: [],
//                     Ligne: [],
//                     perodique: [],
//                     mensuel: null,
//                     annuel: null,
//                     End_Date: null,
//                     Status: 'desactivated',
//                 }},

//             {new: true, useFindAndModify: false}
//         );
//         const ProfileId = req.params.id ;
//         const area  = await Area.find({Profile: req.params.id}).populate({
//             path: "Ligne",
//             populate: {
//                 path: "Device",
//             }
//         });
//         if(area.length>0)
//         {
//          for(let i =0 ; i<area.length ; i++){
//              area[i].Profile = null;
//              area[i].save();
//              if(area[i].Ligne.length > 0) {
//                  for (let j=0 ; j<area[i].Ligne.length;j++){
//                      area[i].Ligne[j].Profile = null ;
//                      area[i].Ligne[j].save();
//                  }
//              }
//          }
//         }
//         const ligne  = await Ligne.find({Profile: req.params.id});
// if(ligne.length>0){
//     for(let i =0 ; i<ligne.length ; i++) {
//         console.log(ligne[i].Device.length);
//         ligne[i].Profile =null;
//         for(let j =0 ; j<ligne[i].Device.length ; j++ ) {
//             const updated = await Device.updateOne(
//                 { _id:  ligne[i].Device[j]._id },
//                 { $set: {
//                         Profile: null,
//                     }},

//                 {new: true, useFindAndModify: false}
//             );
//         }
//         ligne[i].save();
//     }
//     }
//         res.json(updated);
//     } catch (err) {
//         console.log(err);

//         res.json({message: err});
//     }
// };

// exports.updateProfileOnEdit =   async  (req, res) => {
//     try {
//         console.log(req.params.id);

//         const updated = await Profile.updateOne(
//             { _id: req.params.id },
//             { $set: {
//                     name:req.body.name,
//                     End_Date:req.body.End_Date,
//                 }},

//             {new: true, useFindAndModify: false}
//         );
//         console.log('ok');
//         res.json(updated);
//     } catch (err) {
//         console.log(err);

//         res.json({message: err});
//     }
// };

