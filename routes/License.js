var express = require('express');
var router = express.Router();
const LicenseService = require('../services/License');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/ADDLicense', LicenseService.addlicence);
router.get('/getLicense', LicenseService.getLicence);
router.get('/ActivatedLicense/:code', LicenseService.ActivatedLicence);
router.get('/getBydatefin/:id', LicenseService.getBydatefin);
module.exports = router;
