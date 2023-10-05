
 run `npm install`
    run `npm start` 
nohup npm start  </dev/null &>/dev/null &

// 
	
	 api add  license url méthode psot  : http://localhost:3006/api/License/ADDLicense
{
    "company": "ieee",
     "device":  "1000",
    "date_fin": "2022/12/12"
}

	si license ilimite
  {
    "company": "",
     "device":  "",
    "date_fin": "999999"
}
	 
	 Body -> raw ->	 json
	
	
	
api add  device  url méthode post  : http://localhost:3006/api/Device/AddGlobal
	  
	 
	 Body -> raw ->	 json
	
	{
    "code": "FFFFFF1000019E13",
    "type": "luminaire"
    }
	


node default port  is 3000 to change  go bin/www.env and change port 

TO CONFIG DB /home/bamec/IoT/Luxbord/Backend/config
 confir email : /home/bamec/IoT/Luxbord/Backend/services/ user.js

/home/bamec/IoT/Luxbord/Backend/kafkaControllers and /home/bamec/IoT/Luxbord/Backend/routes

and go  consumer3Controller.js and  device.js and change    const python = spawn('python', ['python/downlink.py',req.body.code,req.body.event, adress]); to

   const python = spawn('python3', ['python/downlink.py',req.body.code,req.body.event, adress]);

For downlikn you must change time  downlikn you must change time : GMT +? : /home/bamec/IoT/Luxbord/Backend/routes /remoteLampeLvl.py : dimming

/home/bamec/IoT/Luxbord/Backend/routes /remote.py on / off

 date new : /home/bamec/IoT/Luxbord/Backend/kafkaControllers  consumer3Controller.js  

chnage dimmmng   /home/bamec/IoT/Luxbord/Backend/routes/  remoteLampeLvl.py


cron.schedule('*/10 * * * * ', () => {  :  /home/bamec/IoT/Luxbord/Backend/kafkaControllers  consumer3Controller.js  




