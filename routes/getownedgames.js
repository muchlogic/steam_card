const express = require('express')
const router = express.Router()
const key = 'A3B8B9E506089A1AEEEE54E5349CA060'


router.get('/:id', function(req, res) {
    var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + key + '&steamid=' + req.params.id + '&include_appinfo=true&format=json';
    try {
        fetch(url)
        .then((response) => response.json())
        .then((data) => res.send(data))
    } catch (error) {
        console.error(error)
    }
})

module.exports = router