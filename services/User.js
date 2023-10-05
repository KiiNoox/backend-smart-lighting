const users = require('../models/users');
const license = require('../models/License');
var bcrypt = require("bcrypt-nodejs");
var nodemailer = require('nodemailer');
var jwt = require("jsonwebtoken");

exports.getalluser = async  (req, res) => {
    try {
        const area = await users.find({ useractive: req.params.id});
        console.log(area);
        res.json(area);
    } catch (err) {
        res.json({message: err});
    }
}
exports.getById = async  (req, res) => {
    try {
        const area  = await users.findById(req.params.id).populate({
            path: "license",
        });
        res.json(area);
    } catch (err) {
        res.json({message: err});
    }
};
////// add delete methode
exports.deleteUser = async  (req, res) => {
    try {
        const user = await users.remove({_id: req.params.id}).then(res.json("User Delete"));
    } catch (err) {
        res.json({message: err});
    }
};

exports.VerifUserDate = async  (req, res) => {
    try {
        const user  = await users.findById(req.params.id);
        console.log(user.Date_Creation);
        var date1 = user.Date_Creation;
        console.log(date1);
        var date2 = Date.now();
        console.log(date2);
        var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); //gives day difference
        res.json(diffDays);
    } catch (err) {
        res.json({message: err});
    }
};
exports.Updateuserlicense = async  (req, res) => {
    console.log(req.params.useractive);
    console.log(req.body.license);
    const user  = await users.find({useractive: req.params.useractive});
    const lic  = await license.find({code: req.params.license});
    for(let i=0;i<user.length;i++) {
        console.log(user[i].email);
        user[i].license = lic[0]._id;
        user[i].save();
    }
    res.json('done');
}


exports.AddLicense =   async  (req, res) => {
    try {
        console.log(req.params.id );
        console.log(req.params.code );
        const lic  = await license.find({code: req.params.code});
		console.log(lic[0].Status);
		
        if(lic[0].Status === false) {
			res.json("this Key is used");
           
        } 
		if (lic[0].Status === true)
			{
				
         const user = await users.find({_id: req.params.id});
            user[0].license.push(lic[0]._id);
			res.json("Welcom To LuxBoard");
            user[0].save();
           lic[0].Status = false;
           lic[0].save();
            console.log("lic :"+lic[0]._id);
            //  console.log(lic._id);

            console.log('ok');
			}
} catch (err) {
    console.log(err);

    res.json({message: err});
}
};




exports.SendMailConfirmation = async  (req, res) => {
    var token ;
    console.log('------------------------------------');
    console.log(req.body.email);
    users.findOne({email: req.body.email}, (err, users) => {

        console.log(users);
         token = jwt.sign({users}, 'secret');
        console.log(token);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'aziz.chalghaf@gmail.com',
                pass: '123456789'
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        console.log(req.body.email);
        var mailOptions = {
            from: 'Luxbord',
            to: req.body.email,
            subject: 'Verify your email',
            text: 'Verify your email!',
             
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json("user");

                console.log(error);
            } else {
                res.json("user2");

                console.log('Email sent: ' + info.response);
            }
        });
    })


}

exports.register = async  (req, res) => {
    console.log('req.body.username');
    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.password);
    console.log('req.body.username');

    users.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                console.log('req.body.username2');
                const User = new users({
                    username: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                    role: 'admin'
                });
                User.save((err, User) => {
                    if (err) res.json(err);
                    else res.json(User);
                });
            }

            else {
                res.json({error : "User already exist"})
            }
        })

}

exports.login = async  (req, res) => {
    console.log(req.body,"body")
    console.log(req.params,'params')
    users.findOne({email: req.body.email}, (err, users) => {
		//console.log("MailConfirm :"+users.MailConfirm);
		
        if (err) res.json(err);
        if ((!users)||users.MailConfirm === false) res.status(300).json({error: "The email address you entered is not associated with an account"});
        else {
            if (bcrypt.compareSync(req.body.password, users.password)) {
                var token = jwt.sign({users}, 'secret', {expiresIn: 28800});
                res.json(token)
            } else {
                res.status(300).json({error : "Incorrect password"});
            }
        }
    })
}

exports.ConfirmMail =   async  (req, res) => {
    try {
        const updated = await users.updateOne(
            { _id: req.params.id },
            { $set: {
                    MailConfirm: true,
                }},

            {new: true, useFindAndModify: false}
        );
        console.log('ok');
        res.json(updated);
    } catch (err) {
        console.log(err);

        res.json({message: err});
    }
};

function parseToken(token) {
    return jwt.verify(token.split(' ')[1],'secret');

}

exports.registeruser = async  (req, res) => {
    users.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            const User = new users({
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                role: 'user',
                useractive: req.body.useractive,
                license: req.body.license
            });
            User.save((err, User) => {
                if (err) res.json(err);
                else res.json(User);
            });
        }

        else {
            res.json({error : " User already exist"})
        }
    })

}




















exports.forgotpassword = async  (req, res) => {
    var token ;
    console.log('------------------------------------');
    console.log(req.body.email);
    users.findOne({email: req.body.email}, (err, users) => {
		console.log(users);
		if(!users){
			res.json({error: "The email address you entered is not associated with an account"});
		}
   else {
        console.log(users);
    token = jwt.sign({users}, 'secret', {expiresIn: '1800s'});
 console.log(token);
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
            to: req.body.email,
            subject: 'Reset Password',
            text: 'Reset Password',
            html: '<h3>Hello : '+users.username+'</h3><br>' +
                'Click this link within 24 hours to Change your password: ' +
                '<a href="http://localhost:4200/#/password_reset/'+token+'"> here </a>'
        };

		  transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.json("user");

                console.log(error);
            } else {
                res.json("user2");

                console.log('Email sent: ' + info.response);
            }
        });
        console.log(req.body.email);
    res.json(users);
     
      }
	})


}




exports.updateuserspassword =   async  (req, res) => {
    console.log(req.params.id)
    console.log(req.body.password)
    try {
        const updated = await users.updateOne(
            { _id: req.params.id },
            { $set: {
                    password:bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                }},

            {new: true, useFindAndModify: false}
        );
        console.log('ok');
        res.json(updated);
    } catch (err) {
        console.log(err);

        res.json({message: err});
    }
};
