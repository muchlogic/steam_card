const express = require('express');
const router = express.Router();

const SteamAuth = require("node-steam-openid");
let user = {}

const steam = new SteamAuth({
  realm: "http://localhost:3000", // Site name displayed to users on logon
  returnUrl: "http://localhost:3000/auth/steam/authenticate", // Your return route
  apiKey: "Your Key" // Steam API key
});


router.get("/steam", async (req, res) => {
    const redirectUrl = await steam.getRedirectUrl();
    return res.redirect(redirectUrl);
});
  
router.get("/steam/authenticate", async (req, res) => {
    try {
        user = await steam.authenticate(req);
        res.redirect('/signed-in/steamcard.html')
    } catch (error) {
        console.error(error);
    }
});

router.get("/getuser", async (req, res) => {
    try {
        res.json(user)
    } catch (error) {
        console.error(error);
    }
})

module.exports = router