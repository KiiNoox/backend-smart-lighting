var express = require('express');
var router = express.Router();
const AreaService = require('../services/Area');
const multer  = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file,cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname);
    }
});
const upload = multer({storage: storage });
router.post('/ADDAREA',  AreaService.add);
router.post('/upload',  AreaService.addexcel);
router.get('/GetAREA/:users', AreaService.getArea);
router.get('/GetAREAByprofile/:id', AreaService.getAreaByprofile);
router.get('/:id', AreaService.getById);
router.delete('/:id', AreaService.deleteArea);
router.put('/:id',AreaService.updateArea);
router.put('/AffectLioArea/:id', AreaService.affecteLigneToArea);
router.put('/updateAreaStatus/:id', AreaService.updateAreaStatus);
router.put('/AsseignProfileToArea/:id', AreaService.affecteProfileToArea);
router.put('/deleteAreaFromProfile/:id', AreaService.deleteAreaFromProfile);
router.post('/uploads', upload.single('avatar') , AreaService.uploadsexcel);
router.get('/getSommesite/:id', AreaService.getSommeDataSite);
router.get('/namesite/:id', AreaService.namesite);

module.exports = router;
