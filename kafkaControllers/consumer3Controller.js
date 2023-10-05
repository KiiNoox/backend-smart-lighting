const express = require('express');
const router = express.Router();
const Kafka = require('no-kafka');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
//const lib = require('./FactoryRoute');
const { spawn } = require('child_process');
const Device = require('./../models/Device');
const LocationProfile=require('../models/LocationProfile')
const ligne=require('../models/Ligne');
const area=require('../models/Area')
var cron = require('node-cron');
var shell = require('shelljs');
const schedule = require('node-schedule');
const users = require('../models/users');
const Area = require('../models/Area');
const Profile=require('../models/Profile')
const License=require('../models/License')


function onoff(a,b) {
    console.log(a + 'aaaaaaaaaaaaaaaaaazzzz');
    const largeDataSet = [];
    console.log('Donwlink : Sensor Off');
    //let dataToSend;
    //device = await Device.findOne({ code: req.body.code });
    // spawn new child process to call the python script
    try {
        const largeDataSet = [];
        console.log('Donwlink : Sensor Off');
        // spawn new child process to call the python script

        const python = spawn('python3', [
            'routes/remote.py',
            b,
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
            //res.json(largeDataSet.join(''));
        });
    } catch (err) {
        res.json({ message: err.message });
    }
}
function luminosite (l , b) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    const largeDataSet = [];
    console.log('Donwlink : Sensor Off');
    //let dataToSend;
    //device = await Device.findOne({ code: req.body.code });
    // spawn new child process to call the python script

    const python = spawn('python3', [
        'routes/remoteLampeLvl.py',
        b,
        l
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
}

cron.schedule('15 14 * * *', async () => {
    console.log("in")
    const datenow = new Date();
    const lignes = await  ligne.find().populate("profiles").populate("Device").populate("currentProfile");
    for(let i=0;i<lignes.length;i++){
        console.log("in 1")
        for(let j=0;j<lignes[i].profiles.length;j++){
            console.log("in 2")

            let datematch=false;
            if (datenow.toISOString().slice(0, 10)>lignes[i].profiles[j].Start_Date.toISOString().slice(0, 10)&& datenow.toISOString().slice(0, 10)<lignes[i].profiles[j].End_Date.toISOString().slice(0, 10)){
                console.log("here 1")

            if(lignes[i].currentProfile===null ||lignes[i].currentProfile != lignes[i].profiles[j])
            {    console.log("here 2")
            console.log("lignes[i].currentProfile.profile"+lignes[i].profiles[j].profile)
                await ligne.updateOne(
                { _id: lignes[i]._id },
             { $set: { currentProfile: lignes[i].profiles[j] } },
             {new: true, useFindAndModify: false}
              );}      
              await Device.updateMany(
                { Ligne: lignes[i]._id },
                { $set: { Profile: lignes[i].profiles[j].profile } },
                { new: true, useFindAndModify: false }
              );       
                break;
            }
            else if  (j==lignes[i].profiles.length-1 && !datematch && lignes[i].currentProfile!=null) {
                console.log("here 3 ")
                await ligne.updateOne(
                    { _id: lignes[i]._id },
                 { $set: { currentProfile: null} },
                 {new: true, useFindAndModify: false}
                  );
                  await Device.updateMany(
                    { Ligne: lignes[i]._id },
                    { $set: { Profile: null } },
                    { new: true, useFindAndModify: false }
                  );  
            }  

        }
    } 
    

});

cron.schedule('11 13 * * *', async () => {

    const devices = await  Device.find().populate("users").sort("users");;
    var brokenDevices=[]
    let currentDate= new Date ();
    for(let i=0;i<devices.length;i++){
      if(devices[i].data){
      const lastDate = new Date(devices[i].data[devices[i].data.length-1].time);
      const diffInMs = currentDate.getTime()-lastDate.getTime();
      let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      diffInDays = Math.abs(diffInDays);
      console.log(diffInDays,"dayyyyyyyyyyys")
        await Device.updateOne(
            { _id:devices[i]._id },
            { $set: { connectivityAlert: diffInDays > 2 ? 1 : 0 } }
            );
    }  
    if(devices[i].connectivityAlert===true)
    {
        brokenDevices.push(devices[i].name)
       
    }

    if((i==devices.length-1 ||devices[i+1].users!=devices[i].users) && brokenDevices.length>0)
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mechergui.ba@gmail.com',
            pass: 'hbdafvqoccuhutga'
        }

    });
    var mailOptions = {
        from: 'Luxbord',
        to: devices[i].users.email,
        subject: 'Connectivity alert',
        text: 'please check the device : '+brokenDevices
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {

            console.log(error);
        } else {

            console.log('Email sent: ' + info.response);
        }
    });
    brokenDevices=  []

}

});

cron.schedule('*/15 * * * * *', async () => {

    const user = await  users.find()
    let nbrLines,nbrDevices,nbrAreas,consoTotale,nbrAlerte=0,nbrAlerteConnectivite=0,deviceAllowed,devicePermitted=0,nbrProfiles,nbrAssignedProfiles;
    for(let i=0;i<user.length;i++){
        const lines= await ligne.find({users:user[i]._id})
        const areas= await Area.find({users:user[i]._id})
        const profiles= await Profile.find({users:user[i]._id})
        const locationProfile = await LocationProfile.find({users:user[i]._id})
        const devices=await Device.find({users:user[i]._id})
        const license=await License.find({users:user[i]._id})
        console.log(license[0].device,"deeeeeeeeeeeeeeeeeeeeeeeev")
        for (let j=0;j<license.length;j++){
            devicePermitted+=license[j].device
        }
        nbrLines=lines.length
        nbrAreas=areas.length
        nbrDevices=devices.length
        nbrProfiles=profiles.length
        nbrAssignedProfiles=locationProfile.length
        deviceAllowed=devicePermitted-nbrDevices
        let tensionMin=devices[0].data[0].voltage,tensionMax=devices[0].data[0].voltage
        for(let j=0;j<devices.length;j++)
        {
            if(devices[j].alert==1){
                nbrAlerte++;
            }
            if(devices[j].connectivityAlert==1){
                nbrAlerteConnectivite++;
            }
            if(devices[j].data.length>0){
                for(let k=0;k<devices[j].data.length;k++){
                    if(devices[j].data[k].voltage<tensionMin){
                        tensionMin=devices[j].data[k].voltage;
                    }
                    if(tensionMax<devices[j].data[k].voltage){
                        tensionMax=devices[j].data[k].voltage;
                    }
                }
            }

        }

  
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '@gmail.com',
            pass: ''
        }

    });
    var mailOptions = {
        from: 'Luxbord',
        to: '	clubtrafficexchange@earthxqe.com',
        subject: '[Monthly Report]',
        text: 'This is the report of the month of:',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
        
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    background-color: #f9f9f9;
                }
        
                h1 {
                    color: #333;
                    text-align: center;
                }
        
                p {
                    text-align: justify;
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
        
                table, th, td {
                    border: 1px solid #ddd;
                }
        
                th, td {
                    padding: 8px;
                    text-align: left;
                }
        
                th {
                    background-color: #333;
                    color: white;
                }
        
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Monthly Report</h1>
                <p>Hello ${user[i].username}, in this report, you will find all the data related to your Luxboard account for the last month.</p>
        
                <table>
                    <tr>
                        <th>Data</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Permitted Devices</td>
                        <td>${devicePermitted}</td>
                    </tr>
                    <tr>
                        <td>Allowed Devices</td>
                        <td>${deviceAllowed}</td>
                    </tr>
                    <tr>
                        <td>Number of Areas</td>
                        <td>${nbrAreas}</td>
                    </tr>
                    <tr>
                        <td>Number of Lines</td>
                        <td>${nbrLines}</td>
                    </tr>
                    <tr>
                        <td>Number of Devices</td>
                        <td>${nbrDevices}</td>
                    </tr>
                    <tr>
                        <td>Number of Alerts</td>
                        <td>${nbrAlerte}</td>
                    </tr>
                    <tr>
                        <td>Number of Connectivity Alerts</td>
                        <td>${nbrAlerteConnectivite}</td>
                    </tr>
                </table>
        
                <p>Total Consumption: [Total Consumption Value]</p>
                <p>Min Voltage: ${tensionMin}</p>
                <p>Max Voltage: ${tensionMax}</p>
        
                <p>This monthly report serves as a valuable tool to help you gain insights into your Luxboard account's performance over the past month. 
                It provides a comprehensive overview of key metrics, allowing you to make informed decisions and optimizations. 
                By reviewing this report, you can track device usage, monitor alerts, assess energy consumption, and more.
                Use the data and insights presented here to streamline your operations, improve efficiency, and ensure that your Luxboard account continues to meet your needs effectively.</p>
        
                <div class="footer">
                    <a href="https://ieee.com/"><p>ieee</p></a>
                    <p>Contact: +216 72 000 100</p>
                    <p>Email: ieee@ieee.org</p>
                </div>
            </div>
        </body>
        </html>
        `,
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {

            console.log(error);
        } else {

            console.log('Email sent: ' + info.response);
        }
    });
    console.log("dobbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
        console.log(nbrAreas,nbrLines,nbrDevices,nbrAlerte,nbrAlerteConnectivite)
        console.log(deviceAllowed,devicePermitted)
        console.log(tensionMax,tensionMin)
}

});
  




module.exports = router;
 


