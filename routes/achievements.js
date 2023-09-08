const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const key = "Your Key"

router.get('/user/:steamid/:appid', async (req, res) => {
    let url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${req.params.appid}&key=${key}&steamid=${req.params.steamid}`
    try {
        fetch(url)
        .then((response) => response.json())
        .then((data) => res.json(data))
    } catch (error) {
        console.error(error)
    }
})

router.get('/global/:appid', async (req, res) => {
    let url = `http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/??gameid=${req.params.appid}`
    try {
        fetch(url)
        .then((response) => response.json())
        .then((data) => res.json(data))
    } catch (error) {
        console.error(error)
    }
})

router.get('/getSchema/:appid', async (req, res) => {
    let url = `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=${key}&appid=${req.params.appid}&l=english&format=json`
    try {
        fetch(url)
        .then((response) => response.json())
        .then((data) => res.json(data))
    } catch (error) {
        console.error(error)
    }
})

module.exports = router