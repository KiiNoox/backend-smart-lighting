var express = require('express');
var router = express.Router();
const LigneService = require('../services/Ligne');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/ADDLigne', LigneService.addLigne);
router.get('/GetLigne/:users', LigneService.getLigne);
router.get('/GetLigneByProfile/:id', LigneService.getLigneByProfile);

router.get('/:id', LigneService.getById);
router.put('/:id', LigneService.updateLigne);

router.get('/GetByIdArea/:id', LigneService.getLigneByArea);
router.delete('/:id', LigneService.deleteLigne);
router.put('/AffectDeviceToLigne/:id', LigneService.affecteDeviceToLigne);
router.put('/updateLigneStatusByidDevice/:id', LigneService.updateLigneStatusByidDevice);
router.put('/updateLigneStatusByidDeviceA/:id', LigneService.updateLigneStatusByidDeviceA);
router.put('/updateLigneStatus3/:id', LigneService.updateLigneStatus3);
router.put('/affecteProfileToLigne/:id', LigneService.affecteProfileToLigne);
router.put('/removeLigneFromProfile/:id', LigneService.removeLigneFromProfile);
router.post('/getligneData', LigneService.getligneData);
router.get('/getSommeligne/:id' , LigneService.getSommeDataline);
router.get('/nameline/:id' , LigneService.nameline);
module.exports = router;
