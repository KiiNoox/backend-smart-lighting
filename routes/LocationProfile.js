var express = require('express');
var router = express.Router();
var LocationProfileService = require('../services/LocationProfile');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/getLocationProfile/:users', LocationProfileService.getAssignedProfilesByUser);
router.get('/getOneLocationProfile/:id', LocationProfileService.getOneAssignedProfile);
router.get('/getAllLocationProfiles',LocationProfileService.getAllAssignedProfiles);
router.get('/getRelatedAreas/:id',LocationProfileService.getRelatedAreas);
router.get('/getRelatedLines/:id',LocationProfileService.getRelatedLines);
router.delete('/CancelAssignProfile/:id', LocationProfileService.deleteAssignedProfile);
router.put('/:id', LocationProfileService.updateProfile);
//router.put('/updateProfileOnEdit/:id', LocationProfileService.updateProfileOnEdit);
router.post('/AssignProfile', LocationProfileService.AssignProfile);
//router.get('/CancelAsseignProfile/:id', LocationProfileService.CancelAsseignProfile);
router.put('/addProfileToArea/:id', LocationProfileService.addProfileToArea);
router.put('/addProfileToLigne/:id', LocationProfileService.addProfileToLigne);
router.put('/removeProfileFromArea/:id', LocationProfileService.removeProfileFromArea);
router.put('/removeProfileFromLigne/:id', LocationProfileService.removeProfileFromLigne);




module.exports = router;
