const express = require('express');
const router = express.Router();
const Kafka = require('no-kafka');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
//const lib = require('./FactoryRoute');
const { spawn } = require('child_process');
const Device = require('./../models/Device');
const Profile = require('./../models/Profile');
const Ligne = require('./../models/Ligne');
var cron = require('node-cron');
var shell = require('shelljs');
const Area = require('../models/Area');

// update the asigned profile of a given area  a area b profileId
const updateCollections = async (a,b)=>{
    for(let i=0 ; i<a.length ; i++){
        const area  = await Area.find({_id: a[i]}).populate("ProfileCron").populate({
            path: "Ligne",
            populate: {
                path: "Device",
            }
        });
        const updated = await Area.updateOne(
            {_id: area[0]._id},
            {
                $set: {
                    Profile: b,
                }
            },

            {new: true, useFindAndModify: false}
        );
        for(let j =0 ; j<area[0].Ligne.length ; j++) {
            area[0].Ligne[j].Profile = b;
            for(let x=0 ; x < area[0].Ligne[j].Device.length ; x++) {
                area[0].Ligne[j].Device[x].Profile = b;

                area[0].Ligne[j].Device[x].save();
            }
            area[0].Ligne[j].save();
        }
    }
}
// update the asigned profile of a given ligne  a ligne b profileId

const updateCollections2 = async (a,b)=>{
    for(let i=0 ; i<a.length ; i++){
        const ligne  = await Ligne.find({_id: a[i]}).populate("Device");
        const updated = await Ligne.updateOne(
            {_id: ligne[0]._id},
            {
                $set: {
                    Profile: b,
                }
            },

            {new: true, useFindAndModify: false}
        );
        for(let j =0 ; j<ligne[0].Device.length ; j++) {
            ligne[0].Device[j].Profile = b;
            ligne[0].Device[j].save();
        }
    }
}

// a area b profile
const updateProfileparProfileCron = async (a,b)=>{
    console.log(a);

    for(let i=0 ; i<a.length ; i++){
        console.log(a[i])
        const area  = await Area.find({_id: a[i]}).populate("ProfileCron").populate({
            path: "Ligne",
            populate: {
                path: "Device",
            }
        });
        const profilecron = area[0].ProfileCron;
        console.log('profilecron');
        console.log(profilecron);
        date = new Date( );
        if(area[0].ProfileCron !== null){
            if(area[0].ProfileCron.End_Date > date) {
                const updated = await Area.updateOne(
                    {_id: area[0]._id},
                    {
                        $set: {
                            Profile: profilecron._id,
                        }
                    },

                    {new: true, useFindAndModify: false}
                );
                for(let j =0 ; j<area[0].Ligne.length ; j++) {
                    area[0].Ligne[j].Profile = profilecron._id;
                    for(let x=0 ; x < area[0].Ligne[j].Device.length ; x++) {
                        area[0].Ligne[j].Device[x].Profile = profilecron._id;

                        area[0].Ligne[j].Device[x].save();
                    }
                }

            }
            else {
                const updated = await Area.updateOne(
                    {_id: area[0]._id},
                    {
                        $set: {
                            Profile: null,
                            ProfileCron: null,
                        }
                    },

                    {new: true, useFindAndModify: false}
                );
                for(let j =0 ; j<area[0].Ligne.length ; j++) {
                    area[0].Ligne[j].Profile = null;
                    for(let x=0 ; x < area[0].Ligne[j].Device.length ; x++) {
                        area[0].Ligne[j].Device[x].Profile = null;

                        area[0].Ligne[j].Device[x].save();
                    }
                    area[0].Ligne[j].save();
                }
                const updated2 = await Profile.updateOne(
                    { _id: b},
                    { $set: {
                            Start_Date: null,
                            Area: [],
                            Ligne: [],
                            perodique: [],
                            mensuel: null,
                            annuel: null,
                            End_Date: null,
                            Status: 'desactivated',
                        }},

                    {new: true, useFindAndModify: false}
                );
            }
        }
    }

}
// a ligne  b profile
const updateProfileparProfileCron2 = async (a,b)=>{
    for(let i=0 ; i<a.length ; i++){
        const ligne  = await Ligne.find({_id: a[i]}).populate("ProfileCron").populate("Device");
        const profilecron = ligne[0].ProfileCron;
        console.log('profilecron');
        console.log(profilecron);
        date = new Date( );
        if(ligne[0].ProfileCron !== null){
            if(ligne[0].ProfileCron.End_Date > date) {
                const updated = await Ligne.updateOne(
                    {_id: ligne[0]._id},
                    {
                        $set: {
                            Profile: profilecron._id,
                        }
                    },

                    {new: true, useFindAndModify: false}
                );
                for(let j =0 ; j<ligne[0].Device.length ; j++) {
                    ligne[0].Device[j].Profile = profilecron._id;
                    ligne[0].Device[j].save();
                }

            }
            else {
                const updated = await Ligne.updateOne(
                    {_id: ligne[0]._id},
                    {
                        $set: {
                            Profile: null,
                            ProfileCron: null,
                        }
                    },

                    {new: true, useFindAndModify: false}
                );
                for(let j =0 ; j<ligne[0].Device.length ; j++) {
                    ligne[0].Device[j].Profile = null;
                    ligne[0].Device[j].save();
                }
                const updated2 = await Profile.updateOne(
                    { _id: b},
                    { $set: {
                            Start_Date: null,
                            Area: [],
                            Ligne: [],
                            perodique: [],
                            mensuel: null,
                            annuel: null,
                            End_Date: null,
                            Status: 'desactivated',
                        }},

                    {new: true, useFindAndModify: false}
                );
            }
        }
    }
}


// cron.schedule('* * * * * *',async (req, res) => {

//     const datenow = new Date();
//     // console.log(datenow.getDay());
//     const profile = Profile.find({}).then(user => {
//         for(let i = 0 ; i<user.length ; i++) {
//             // console.log(user[i])
//             if(user[i].mensuel === 1){
//                 const journow = datenow.getDate();
//                 const monthnow = datenow.getMonth();
//                 const startjournow = user[i].Start_Date.getDate();
//                 const startmonthnow = user[i].Start_Date.getMonth();
//                 const endjournow = user[i].End_Date.getDate();
//                 const endmonthnow = user[i].End_Date.getMonth();
//                 const daten = '2000' + "-" + monthnow + "-" + journow;
//                 const detenn = '2000' + "-" + startmonthnow + "-" + startjournow;
//                 const detennn =  '2000' + "-" + endmonthnow + "-" + endjournow;
//                 const date1 = new Date(daten);
//                 const date_debut = new Date(detenn);
//                 const date_fin = new Date(detennn);
//                 console.log(daten);
//                 console.log(detenn);
//                 var diffDays = parseInt((date1 - date_debut) / (1000 * 60 * 60 * 24));
//                 if(diffDays >= 30 && date_fin >= date1) {
//                     if(user[i].Ligne[0] === undefined) {
//                         updateCollections(user[i].Area , user[i]._id);
//                     }
//                     if(user[i].Area[0] === undefined) {
//                         updateCollections2(user[i].Ligne , user[i]._id);
//                     }
//                 }
//                 else if(diffDays >= 30 && date_fin < date1) {
//                     if(user[i].Ligne[0] === undefined) {
//                         updateProfileparProfileCron(user[i].Area , user[i]._id);
//                     }
//                     if(user[i].Area[0] === undefined) {
//                         updateProfileparProfileCron2(user[i].Ligne , user[i]._id);
//                     }
//                 }
//             }
//             if(user[i].annuel === 1){

//                 const journow = datenow.getDate();
//                 const monthnow = datenow.getMonth();
//                 const startjournow = user[i].Start_Date.getDate();
//                 const startmonthnow = user[i].Start_Date.getMonth();
//                 const startyearnow = user[i].Start_Date.getFullYear() + 1;
//                 const endjournow = user[i].End_Date.getDate();
//                 const endmonthnow = user[i].End_Date.getMonth();
//                 const endyearnow = user[i].Start_Date.getFullYear() + 1;
//                console.log(startyearnow);
//                console.log('startyearnow');

//                 const daten = '2000' + "-" + monthnow + "-" + journow;
//                 const detenn = '2000' + "-" + startmonthnow + "-" + startjournow;
//                 const detennn =  '2000' + "-" + endmonthnow + "-" + endjournow;
//                 console.log(daten);
//                 const date1 = new Date(daten);
//                 const date_debut = new Date(detenn);
//                 const date_fin = new Date(detennn);
//                 console.log('daten');
//                 console.log(date1);
//                 if(date_debut <= date1 &&    date_fin >= date1 )
//                 {
//                     console.log('aaaaaaaaaaaaaaaaaaaabdet');
//                     const detenn2 = startyearnow + "-" + startmonthnow + "-" + startjournow;
//                     const detennn2 =  endyearnow + "-" + endmonthnow + "-" + endjournow;
//                     const date_debut = new Date(detenn2);
//                     const date_fin = new Date(detennn2);
//                     console.log(date_debut);
//                     console.log(user[i]._id );
//                     console.log(user[i].Area[0] );
//                     if(user[i].Ligne[0] === undefined) {
//                         updateCollections(user[i].Area , user[i]._id);
//                     }
//                     if(user[i].Area[0] === undefined) {
//                         updateCollections2(user[i].Ligne , user[i]._id);
//                     }
//                 }
//                 else if( date_fin < date1 ) {
//                     console.log('aaaaaaaaaaaaaaaaaaaa');
//                     const detenn2 = startyearnow + "-" + startmonthnow + "-" + startjournow;
//                     const detennn2 =  endyearnow + "-" + endmonthnow + "-" + endjournow;
//                     const date_debut = new Date(detenn2);
//                     const date_fin = new Date(detennn2);
//                     console.log(date_debut);
//                     console.log(user[i]._id );
//                     console.log(user[i].Ligne[0] );
//                     // updateCollections(user[i].Area[0] , user[i]._id);
//                     if(user[i].Ligne[0] === undefined) {
//                         updateProfileparProfileCron(user[i].Area , user[i]._id);
//                     }
//                     if(user[i].Area[0] === undefined) {
//                         updateProfileparProfileCron2(user[i].Ligne , user[i]._id);
//                     }
//                 }
//             }
//             if(user[i].perodique.length > 0){

//                 let x =0;
//               for(let j=0 ; j< user[i].perodique.length ;j++){
//                   if(user[i].perodique[j] === datenow.getDay()){
//                       console.log('bdet');
//                       x=1;
//                       if(user[i].Ligne[0] === undefined) {
//                           updateCollections(user[i].Area , user[i]._id);
//                       }
//                       if(user[i].Area[0] === undefined) {
//                           updateCollections2(user[i].Ligne , user[i]._id);
//                       }

//                   }
//               }
//                 if(x === 0) {
//                     if(user[i].Ligne[0] === undefined) {
//                         updateProfileparProfileCron(user[i].Area , user[i]._id);
//                     }
//                     if(user[i].Area[0] === undefined) {
//                         updateProfileparProfileCron2(user[i].Ligne , user[i]._id);
//                     }
//                 }
//             }
//         }
//     });
// });


module.exports = router;
