const express = require('express');
const router = express.Router();
const Kafka = require('no-kafka');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
//const lib = require('./FactoryRoute');
const { spawn } = require('child_process');
const Device = require('./../models/Device');
const mongoose = require('mongoose');
const users = require('./../models/users');

function sendmailalert(x , y) {
    var token ;
//    console.log('------------------------------------');
 
    users.findOne({email: x}, (err, users) => {

    //    console.log(users);
        token = jwt.sign({users}, 'secret', {expiresIn: '1d'});
  //      console.log(token);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'mechergui.ba@gmail.com',
                pass: 'hbdafvqoccuhutga'
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        var mailOptions = {
            from: 'Luxbord',
            to: x,
            subject: 'Alert Device',
            text: 'That was easy!',
            html: '<h3>you have problem in device </h3><br>' + y,
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json("user");

           //     console.log(error);
            } else {
                res.json("user2");

             //   console.log('Email sent: ' + info.response);
            }
        });
    })
}
function decrypt(data, time) {

    // console.log(data);
    // console.log('time :', Date(time));
    if (data.length === 44) {
        a=0;
        v=(parseInt(data.substring(10,14),16) *0.1);
        c =(parseInt(data.substring(14,22) , 16)*0.001);
        p=(parseInt(data.substring(22,30) , 16) * 0.1);
        e=(parseInt(data.substring(30,38) , 16) * 0.01);
        etat=(parseInt(data.substring(38,40) , 16));
        luminosites=(parseInt(data.substring(40,42) , 16));
        timeGMT = new Date();
        timeGMT.setHours(timeGMT.getHours() + 1);
        if(v>=210 && c<0.020 && luminosites>= 10 && etat ===1){
               a =1;
        }
        //return({temperature : temp , humidite : hum , batterie : volt , humiditéSol : 0 , time : Date.parse(time)});
        return({voltage : v , current : c , Power : p ,electricconsumptions : e , etats : etat ,alert: a, luminosite:luminosites, time : timeGMT.toISOString().replace(/T/, ' ').replace(/\..+/, '')});
    }
}

async function verify_kafka_data_message(x) {

    var y = JSON.parse(x);
   // console.log('Sensor Id :',y.DevEUI_uplink.DevEUI );
   // console.log('Sensor data :',y.DevEUI_uplink.payload_hex);
   
   // decrypt
   
   //console.log('y :', Object.keys(y).length);
    if (Object.keys(y).length === 1) {
      //  console.log('ok', 'data accepted');
        device = await Device.findOne({identifiant: y.DevEUI_uplink.DevEUI});
        // delete y.SensorIdentifier;
       // console.log('Sensor Id :',y.DevEUI_uplink.DevEUI);
        //console.log('Sensor data :',y.DevEUI_uplink.payload_hex);

        // y.time = Date.now();
        if (device) {
         //   console.log('Sensor name:',device.name);
           // console.log('data', y.DevEUI_uplink.payload_hex);
            // Sens.data.push(decrypt(y.DevEUI_uplink.payload_hex,y.DevEUI_uplink.Time));
            let x = decrypt(y.DevEUI_uplink.payload_hex,y.DevEUI_uplink.Time);
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

            console.log(x);
            device.voltage = x.voltage;
            device.current = x.current;
            device.Power = x.Power;
            device.luminosite = x.luminosite;
            device.electricconsumptions = x.electricconsumptions;
            device.powerfactor = x.Power/(x.voltage*x.current);
            device.alert = x.alert;
            if(x.alert ===1) {
                usersa = await Device.findOne({identifiant: y.DevEUI_uplink.DevEUI}).then(user=>{let userid = user.users;
				
				 userss = users.findOne({_id: userid}).then(usera=>{sendmailalert(usera.email , y.DevEUI_uplink.DevEUI)});
				
				}) ;
                
				
               
				
				
                  console.log("rania") ;
				   
                 
                
            }
            if(x.etats === 1) {
                device.Status = "activated";
            } else if (x.etats === 0) {
                device.Status = "desactivated";
            }



			//console.log("device data : ", device.data[device.data.length-1].E_save_last);
			x.E_save_last = 0
			if(device.data.length > 0){
				if(device.data[device.data.length-1].E_save_last != undefined){
					x.E_save_last = device.data[device.data.length-1].E_save_last
					console.log("here");
				}
				else x.E_save_last = 0
				
				if(x.electricconsumptions<0.8){
					x.E_save_last = device.data[device.data.length-1].electricconsumptions-0.7
				}
			}
						x.electricconsumptions = x.E_save_last + x.electricconsumptions

            device.data.push(x);
            await device.save();
            // AlertClients(decrypt(y.DevEUI_uplink.payload_hex,y.DevEUI_uplink.Time), Sens);
            // checkRules(Sens.Rules,Sens._id,decrypt(y.DevEUI_uplink.payload_hex,y.DevEUI_uplink.Time));
            return;
        }
        else {
         //   console.log(device , ' not my Sensor');
            return ;
        }
    }
    console.log('error', 'not valid data');
}



var consumer = new Kafka.SimpleConsumer({
    connectionString: 'kafka.ieee.com:400',
    clientId: 'test'
});



var dataHandler = function (messageSet, topic, partition) {
    messageSet.forEach(function (m) {
    //    console.log("test")
     //   console.log(m.message.value.toString('utf8'));
        const obj = JSON.parse(m.message.value.toString('utf8'));
        verify_kafka_data_message (m.message.value.toString('utf8'));
    // console.log(obj) ;
        // return io.emit('message', {y: m.message.value.toString('utf8')});
    });
};

consumer.init().then(function () {
// Subscribe partitons 0 and 1 in a topic:
    var v1= consumer.subscribe('AS.SkyIndustriesTest.v1', dataHandler);
    var arr=[];
    arr.push([v1]);
//    console.log("val:"+arr);
    return arr;
});

module.exports = router;
