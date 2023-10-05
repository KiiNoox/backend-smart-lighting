const Profile = require('../models/Profile');
const Area = require('../models/Area');
//const Device = require('../models/Device');
const Ligne = require('../models/Ligne');
const LocationProfile=require('../models/LocationProfile')

exports.deleteAssignedProfile = async (req, res) => {
  try {
    const locationProfile = await LocationProfile.findById(req.params.id);

    if (!locationProfile) {
      return res.status(404).json("Assigned profile not found");
    }

    for (var i=0;i<locationProfile.Area.length;i++)
    {
     await Area.updateOne(
        { _id: locationProfile.Area[i]._id},
        { $pull: {
                profiles:locationProfile._id,
      }},

        {new: true, useFindAndModify: false}
    );
     let area = await Area.findById({ _id: locationProfile.Area[i]._id }).populate("Ligne");

     if(area)
   { for (var j = 0; j < area.Ligne.length; j++) {
      await Ligne.updateOne(
        { _id: area.Ligne[j]._id },
        {
          $pull: { profiles: locationProfile._id }
        },
        { new: true, useFindAndModify: false }
      );
    }
    }
  
  }  
    for (var i=0;i<locationProfile.Ligne.length;i++)
    {
     await Ligne.updateOne(
        { _id: locationProfile.Ligne[i]._id},
        { $pull: {
                profiles:locationProfile._id,
      }},

        {new: true, useFindAndModify: false}
    ); 
  }
   await LocationProfile.deleteOne({ _id: req.params.id });

    res.json("Assigned profile deleted successfully");
  } catch (err) {
    console.log("the error is ",err)
    res.status(500).json({ message: err });
  }
}

exports.getOneAssignedProfile = async (req, res) => {
  try {
    const assignedProfile = await LocationProfile.findById(req.params.id).populate('profile').populate('Area');;
    if (assignedProfile) {
      return res.status(200).json(assignedProfile);
    } else {
      return res.status(404).json("Assigned profile not found");
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};


exports.getRelatedAreas = async (req, res) => {
  const locationProfileId = req.params.id;
  try {
    const locationProfile = await LocationProfile
      .findOne({ _id: locationProfileId })
      .populate('Area'); 

    if (!locationProfile) {
      return res.status(404).json({ message: 'Location profile not found' });
    }

    const relatedAreas = locationProfile.Area;

    res.status(200).json(relatedAreas);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRelatedLines = async (req, res) => {
  const locationProfileId = req.params.id;
  try {
    const locationProfile = await LocationProfile
      .findOne({ _id: locationProfileId })
      .populate('Ligne'); 

    if (!locationProfile) {
      return res.status(404).json({ message: 'Location profile not found' });
    }

    const relatedLignes = locationProfile.Ligne;

    res.status(200).json(relatedLignes);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};


exports.getAllAssignedProfiles=async (req,res)=>{
    try{
     const assignedProfiles = await LocationProfile.find()
     res.json({ assignedProfiles }); 

    }
    catch(err)
    {
        res.json({message: err});

    }
}
exports.getAssignedProfilesByUser = async  (req, res)=> {
    try {
      LocationProfile.find({ users: req.params.users}).populate('profile').populate('Area').populate('Ligne').then(user => res.json(user));
    } catch (err) {
        res.json({message: err});
    }
};



exports.AssignProfile =   async  (req, res) => {    
  let NewStartDate=req.body.Start_Date;
  let NewEndDate=req.body.End_Date;
  let Areas=req.body.Area;
  let Lines=req.body.Ligne;
  let lignesBelongsToAreas=[]
  if(Areas.length>0)
  {
  for (let i=0; i<Areas.length;i++){
    let area = await Area.findById({ _id: Areas[i]._id }).populate("Ligne")
    for(let j=0;j<area.Ligne.length;j++)
    {lignesBelongsToAreas.push(area.Ligne[j]._id)
    }}
  }
  for (let i=0; i<Areas.length;i++)
  {
    let area = await Area.findById({ _id: Areas[i]._id }).populate({
      path: "profiles",
    }).populate({
      path: "Ligne",
      populate: {
        path: "profiles",
      }
    });
     
    for(let j=0;j<area.profiles.length;j++)
    {    
    if(!(NewStartDate>area.profiles[j].End_Date.toISOString().slice(0, 10) || NewEndDate<area.profiles[j].Start_Date.toISOString().slice(0, 10)) ){
        return res.status(400).json({ message: "There is a profile active in this date for the area " + area.name });
      }
    }  
    for(let j=0;j<area.Ligne.length;j++)
     { 

  for(let k=0;k<area.Ligne[j].profiles.length;k++)
    {    
    if(!(NewStartDate>area.Ligne[j].profiles[k].End_Date.toISOString().slice(0, 10) || NewEndDate<area.Ligne[j].profiles[k].Start_Date.toISOString().slice(0, 10)) ){
        return res.status(400).json({ message: "There is a profile active in this date for the line " + area.Ligne[j].name });
      }
     } 
  }

}
for (let i=0; i<Lines.length;i++)
{
  let line = await Ligne.findById({ _id: Lines[i]._id }).populate("profiles")
   
  for(let j=0;j<line.profiles.length;j++)
  {  
  if(!(NewStartDate>line.profiles[j].End_Date.toISOString().slice(0, 10) || NewEndDate<line.profiles[j].Start_Date.toISOString().slice(0, 10)) )
    {
      return res.status(400).json({ message: "There is a profile active in this date for the line " + line.name });
    }
  }  
}
  
  try {
 
        const AssignedProfile = new LocationProfile(
           {
                    profile:req.body.Profile,
                    users:req.body.users,
                    PRIMARY_COLOR:req.body.PRIMARY_COLOR,
                    SECONDARY_COLOR:req.body.SECONDARY_COLOR,
                    Start_Date:req.body.Start_Date,
                    End_Date:req.body.End_Date,
                    Area: req.body.Area,
                    Ligne: lignesBelongsToAreas.length === 0 ? req.body.Ligne : lignesBelongsToAreas,
                    perodique: req.body.perodique,
                    mensuel: req.body.mensuel,
                    annuel: req.body.annuel,
                });
                AssignedProfile.save( AssignedProfile);
            for (var i=0;i<req.body.Area.length;i++)
            {
              await Area.updateOne(
                { _id: req.body.Area[i]._id},
                { $addToSet: {
                        profiles:AssignedProfile,
              }},

                {new: true, useFindAndModify: false}
            );

            let area = await Area.findById({ _id: req.body.Area[i]._id }).populate("Ligne");

            for (var j = 0; j < area.Ligne.length; j++) {
              await Ligne.updateOne(
                { _id: area.Ligne[j]._id },
                {
                  $addToSet: { profiles: AssignedProfile }
                },
                { new: true, useFindAndModify: false }
              );
            }
            }


            for (var i=0;i<req.body.Ligne.length;i++)

            {
              await Ligne.updateOne(
                { _id: req.body.Ligne[i]._id},
                { $addToSet: {
                        profiles:AssignedProfile,
              }},

                {new: true, useFindAndModify: false}
            );
            }
        res.json("Profile  Assigned ");
    } catch (err) {
        console.log(err);

        res.json({message: err});
    }
  };


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

//-------------------------------------------------------------------------------------------





   exports.updateProfile =   async  (req, res) => {
    let NewStartDate=req.body.Start_Date;
    let NewEndDate=req.body.End_Date;
      req.body.Area.map(a => {a._id,
        console.log(a.name,"1111111111111111111111111111111111")})   
        console.log(req.body.state,"state")
        console.log(req.body.Area,"arrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")

      req.body.Ligne.forEach(element => {      
        console.log(element.name,"line")
        
      });
      
      let Lines=req.body.Ligne;
      let Areas=req.body.Area;
      let lignesBelongsToAreas=[]
      console.log(Areas.length,"Areaaaaaaaaaaaas")
      console.log(Lines.length,"Linesssssssssssssssssssssss")

      if(Areas.length>0)
      {
      for (let i=0; i<Areas.length;i++){
        let area = await Area.findById({ _id: Areas[i]._id }).populate("Ligne")
        for(let j=0;j<area.Ligne.length;j++)
        {lignesBelongsToAreas.push(area.Ligne[j]._id)
        }}
      }
    for (let i=0; i<Areas.length;i++)
      {
        let area = await Area.findById({ _id: Areas[i]._id }).populate({
          path: "profiles",
        }).populate({
          path: "Ligne",
          populate: {
            path: "profiles",
          }
        });
         
        for(let j=0;j<area.profiles.length;j++)
        { 
          if(area.profiles[j]._id==req.params.id){
            console.log("passssssssssssssssss")
            j++;
          }
        if((area.profiles[j]) &&!(NewStartDate>area.profiles[j].End_Date.toISOString().slice(0, 10) || NewEndDate<area.profiles[j].Start_Date.toISOString().slice(0, 10)) ){
          console.log(NewStartDate,"new date")
          console.log(area.profiles[j].End_Date.toISOString().slice(0, 10),"old end date")
          console.log(NewEndDate,"NewEndDate")
          console.log(area.profiles[j].Start_Date.toISOString().slice(0, 10),"old start date")
          console.log(NewStartDate>area.profiles[j].End_Date.toISOString().slice(0, 10),"condition1")
          console.log(NewEndDate<area.profiles[j].Start_Date.toISOString().slice(0, 10),"condition2")
            return res.status(400).json({ message: "There is a profile active in this date for the area " + area.name });
          }
        }  

        
        for(let j=0;j<area.Ligne.length;j++)
         { 
         for(let k=0;k<area.Ligne[j].profiles.length;k++)
        { if(area.Ligne[j].profiles[k]._id==req.params.id){
          console.log("passssssssssssssssss2",j,k)
          k++;
        }
        if((area.Ligne[j].profiles[k])&& !(NewStartDate>area.Ligne[j].profiles[k].End_Date.toISOString().slice(0, 10) || NewEndDate<area.Ligne[j].profiles[k].Start_Date.toISOString().slice(0, 10)) ){
          console.log(NewStartDate,"new date")
          console.log(area.Ligne[j].profiles[k].End_Date.toISOString().slice(0, 10),"old end date")
          console.log(NewEndDate,"NewEndDate")
          console.log(area.Ligne[j].profiles[k].Start_Date.toISOString().slice(0, 10),"old start date")
          console.log(NewStartDate>area.Ligne[j].profiles[k].End_Date.toISOString().slice(0, 10),"condition1")
          console.log(NewEndDate<area.Ligne[j].profiles[k].Start_Date.toISOString().slice(0, 10),"condition2") 
          
          return res.status(400).json({ message: "There is a profile active in this date for the line ***** " + area.Ligne[j].name });
          }
         }
      }
    
    }
    for (let i=0; i<Lines.length;i++)
    {
      let line = await Ligne.findById({ _id: Lines[i]._id }).populate("profiles")
       
      for(let j=0;j<line.profiles.length;j++)
      { if(line.profiles[j]._id==req.params.id){
        console.log("passssssssssssssssss3",j)
        j++;
      }
      {  
      if((line.profiles[j])&& !(NewStartDate>line.profiles[j].End_Date.toISOString().slice(0, 10) || NewEndDate<line.profiles[j].Start_Date.toISOString().slice(0, 10)) )
        {
          return res.status(400).json({ message: "There is a profile active in this date for the line ----------- " + line.name });
        }
      }  
    }     
  }
    try {
          if(req.body.state==="add area")
         {
          const updated = await LocationProfile.findByIdAndUpdate(
                { _id: req.params.id },
                { $set: {
                        Start_Date:req.body.Start_Date,
                        End_Date:req.body.End_Date,
                    },
                  $addToSet:{
                    Area: req.body.Area,
                    Ligne: lignesBelongsToAreas,
                  }},

                {new: true, useFindAndModify: false}
            );
            if(!updated){
              res.status(404).json({ message: err });
            }
            res.json(updated);
        }
        else  if (req.body.state==="remove area")
         {
         const idArray = req.body.Area.map(area => area._id.toString());
         const updated = await LocationProfile.findByIdAndUpdate(
           { _id: req.params.id },
           {
             $set: {
              Start_Date:req.body.Start_Date,
              End_Date:req.body.End_Date,
             },
             $pull:{
              Area: {
                $in: idArray 
               } ,
              Ligne: {
               $in: lignesBelongsToAreas 
              }             }
           },
           { new: true, useFindAndModify: false }
         );

      
      
      if(!updated){
        res.status(404).json({ message: err });
      }
      res.json(updated);
  
         }
         else if(req.body.state==="add line")
         {
          const updated = await LocationProfile.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: {
                    Start_Date:req.body.Start_Date,
                    End_Date:req.body.End_Date,
                    Ligne: req.body.Ligne,
                }},

            {new: true, useFindAndModify: false}
        );
        if(!updated){
          res.status(404).json({ message: err });
        }
        res.json(updated);
         }
         else if (req.body.state==="remove line")
         {
          const updated = await LocationProfile.findByIdAndUpdate(
            { _id: req.params.id },
            {
              $set: {
               Start_Date:req.body.Start_Date,
               End_Date:req.body.End_Date,
              },
              $pull:{
               Ligne: {
                $in: req.body.Ligne 
               }             }
            },
            { new: true, useFindAndModify: false }
          );
 
       
       
       if(!updated){
         res.status(404).json({ message: err });
       }
       res.json(updated);
         }
         else if(req.body.state==="updating date"){
          console.log("----------------------------ONLY DATE----------------------------------")
          const updated = await LocationProfile.findByIdAndUpdate(
            { _id: req.params.id },
            {
              $set: {
               Start_Date:req.body.Start_Date,
               End_Date:req.body.End_Date,
              }},
            { new: true, useFindAndModify: false }
          );
       if(!updated){
         res.status(404).json({ message: err });
       }
       res.json(updated);
         }
        } 
        catch (err) {
            console.log(err);

            res.status(200).json("done")
          }
    };



    // exports.updateProfile = async (req, res) => {
    //   console.log(req.body.Area);
    //   const idArray = req.body.Area.map(area => area._id.toString());
    //   const updated = await LocationProfile.findByIdAndUpdate(
    //     { _id: req.params.id },
    //     {
    //       $set: {
    //         Area: idArray
    //       }
    //     },
    //     { new: true, useFindAndModify: false }
    //   );
    
    //   console.log("c'est bn");
    
    //   if (!updated) {
    //     res.status(404).json({ message: err });
    //   }
    //   res.json(updated);
    // };
    




exports.addProfileToArea= async(req,res)=>{
const idArea=req.body._id;
const locationProfileToAdd=req.body.locationPofileToUpdate

    try{
    await Area.updateOne(
      { _id: idArea},
      { $addToSet: {
              profiles:locationProfileToAdd,
    }},

      {new: true, useFindAndModify: false}
  );
  
  let area = await Area.findById({ _id: idArea }).populate("Ligne");

  for (var j = 0; j < area.Ligne.length; j++) {
    await Ligne.updateOne(
      { _id: area.Ligne[j]._id },
      {
        $addToSet: { profiles: locationProfileToAdd }
      },
      { new: true, useFindAndModify: false }
    );
  }
  res.status(200).json("done")
  }

  catch(err){
    console.log(err)
  }

}

exports.addProfileToLigne= async(req,res)=>{
  const idLigne=req.body._id;
  const locationProfileToAdd=req.body.locationPofileToUpdate
  
      try{
      await Ligne.updateOne(
        { _id: idLigne},
        { $addToSet: {
                profiles:locationProfileToAdd,
      }},
  
        {new: true, useFindAndModify: false}
    );
    
    res.status(200).json("done")
    }
  
    catch(err){
      console.log(err)
    }
  
  }

  exports.removeProfileFromArea= async(req,res)=>{
    const idArea=req.body._id;
    const locationProfileToRemove=req.body.locationPofileToUpdate
    
        try{
        await Area.updateOne(
          { _id: idArea},
          { $pull: {
                  profiles:locationProfileToRemove,
        }},
    
          {new: true, useFindAndModify: false}
      );
      
      let area = await Area.findById({ _id: idArea }).populate("Ligne");
    
      for (var j = 0; j < area.Ligne.length; j++) {
        await Ligne.updateOne(
          { _id: area.Ligne[j]._id },
          {
            $pull: { profiles: locationProfileToRemove }
          },
          { new: true, useFindAndModify: false }
        );
      }
      res.status(200).json("done")
      }
    
      catch(err){
        console.log(err)
      }
    
    }
    exports.removeProfileFromLigne= async(req,res)=>{
      const idLigne=req.body._id;
      const locationProfileToRemove=req.body.locationPofileToUpdate
      
          try{
          await Ligne.updateOne(
            { _id: idLigne},
            { $pull: {
                    profiles:locationProfileToRemove,
          }},
      
            {new: true, useFindAndModify: false}
        );
        
        res.status(200).json("done")
        }
      
        catch(err){
          console.log(err)
        }
      
      }