var express = require('express');
var router = express.Router();
const ProfileService = require('../services/Profile');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/ADDProfile', ProfileService.add);
router.get('/GetProfile/:users', ProfileService.getProfile);
router.get('/getProfiles',ProfileService.getProfiles)
router.delete('/:id', ProfileService.deleteProfile);
router.put('/:id', ProfileService.updateProfile);
//router.put('/updateProfileOnEdit/:id', ProfileService.updateProfileOnEdit);
//router.put('/AsseignProfile/:id', ProfileService.updateAsseignProfile);
//router.get('/CancelAsseignProfile/:id', ProfileService.CancelAsseignProfile);
module.exports = router;
