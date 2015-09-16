/**
 * Created by lukedowell on 9/9/15.
 */
var router = require('express').Router();
var path = require('path');

/**
 * Wilcard router. Needs authentication to provide anything
 */
router.get('/*', function(req, res) {
    if(req.isAuthenticated()) {
        var file = req.params[0] || "assets/views/index.html";
        res.sendFile(path.join(__dirname, "../public", file));
    } else {
        //If not authorized, kick the request to the login page
        res.redirect('/auth');
    }
});

module.exports = router;