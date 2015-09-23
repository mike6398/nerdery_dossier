var router = require('express').Router(),
    path = require('path'),
    fs = require('fs'),
    multiparty = require('connect-multiparty')();

//Models
var Event = require('../models/event'),
    Profile = require('../models/profile');


//Removes profile with email address
router.get('/remove/:emailAddress', function(req, res) {
    Profile.findOne({'contact.emailAddress': req.params.emailAddress}, function(err, profile) {
        if(err) console.log(err);
        profile.remove();
    })
});

//Returns profile associated to email
router.get('/get/:emailAddress', function(req, res) {
    var email = req.params.emailAddress;
    console.log(email);
    Profile.findOne({'contact.emailAddress': email}, function(err, profile) {
        if(err) console.log(err);
        console.log(profile.contact.emailAddress);
        res.send(profile);
    })
});

//Handles saving an uploaded image
router.post('/image', multiparty, function(req, res){
    var file = req.files.file;
    var is = fs.createReadStream(file.path);
    var os = fs.createWriteStream(path.join(__dirname, "../public/assets/images/uploads/", file.name));
    is.pipe(os);

    is.on('error', function(err) {
        if(err) {
            console.log(err);
        }
        res.send(err);
    });

    is.on('end', function() {
        fs.unlink(file.path, function(err) {
            console.log(err);
        });
        res.send("assets/images/uploads/" + file.name);
    });
});

//Creates a profile req.body.user.contact.emailAddress is required
router.post('/create', function(req, res) {
    var newProfile = profileModules.create(req.body.user);
    newProfile.save();

    //does an event exist?

    //yes - add profile to event

    //no - create event, add profile, add to event

    res.send(newProfile);
});

//Returns all profile objects with populated meeting information
router.get('/', function(req, res) {
    Profile.find({}).populate('events').exec(function(err, profiles) {
        res.send(profiles);
    })
});

module.exports = router;