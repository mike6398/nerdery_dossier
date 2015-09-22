var router = require('express').Router(),
    path = require('path'),
    fs = require('fs'),
    multiparty = require('connect-multiparty')();

//Models
var Event = require('../models/event'),
    Profile = require('../models/profile');

//Modules
var calendarModules = require('../modules/calendar'),
    eventModules = require('../modules/events'),
    profileModules = require('../modules/profiles');


//Returns all profile objects with populated meeting information
router.get('/get', function(req, res) {
    Profile.find({}).populate('events').exec(function(err, profiles) {
        res.send(profiles);
    })
});

//Returns profile associated to email
router.get('/get/:emailAddress', function(req, res) {
    profileModules.findByEmail(req.params.emailAddress, function (err, profile) {
        res.send(profile);
    });
});

//Creates a profile req.body.user.contact.emailAddress is required
router.post('/create', function(req, res) {
    //Check profile exists for email
    profileModules.findByEmail(req.body.contact.email, function(err, profile) {
        if(profile) {
            res.send("profile already exists with email");
        }
        else {
            var newProfile = profileModules.build(req.body);
            newProfile.meetings.forEach(function(meeting) {
                //if meeting time does exist
                //add profile to event
                //add event to profile

                //if meeting time does not exist
                //create event
                //add profile to event
                //add event to profile
                newProfile.save();
            });
        }
    });
});

//Update an existing profile
router.post('/update', function(req, res) {
    profileModules.modify(req.body)

});

//Removes profile with email address
router.get('/remove/:emailAddress', function(req, res) {
   profileModules.findByEmail(req.params.emailAddress, function(err, profile) {
       if(profile) {
           profile.remove();
           res.send("profile removed");
       } else {
           res.send("Profile not found with email: " + req.params.emailAddress);
       }
    });
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

module.exports = router;