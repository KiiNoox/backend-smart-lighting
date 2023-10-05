var express = require('express');
var router = express.Router();
const userService = require('../services/User');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var date1 = new Date("08/09/2017");
  var date2 = new Date("08/11/2017");
  var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); //gives day difference
//one_day means 1000*60*60*24
//one_hour means 1000*60*60
//one_minute means 1000*60
//one_second means 1000
  console.log(diffDays)
  res.send('respond with a resource' + '/' + diffDays);
});
router.get('/:id', userService.getById);
router.delete('/:id', userService.deleteUser);
router.get('/verifuser/:id', userService.VerifUserDate);
router.post('/login', userService.login);
router.get('/Addlicense/:id/:code', userService.AddLicense);
router.post('/register', userService.register);
router.get('/Updateuserlicense/:useractive/:license', userService.Updateuserlicense);
router.post('/registerUser', userService.registeruser);
router.post('/SendMailConfirmation', userService.SendMailConfirmation);
router.post('/SendMailResetPassword', userService.forgotpassword);
router.put('/ConfirmMail/:id', userService.ConfirmMail);
router.put('/ChangePassword/:id', userService.updateuserspassword);
router.get('/allusers/:id', userService.getalluser);
module.exports = router;
