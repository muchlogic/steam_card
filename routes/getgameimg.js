const express = require('express')
const router = express.Router()
const axios = require('axios');
var xml2js = require('xml2js');

router.get('/:id', async function(req, res) {
    try {
        const apiUrl = `https://steamcommunity.com/profiles/${req.params.id}/games?tab=all&xml=1`; // Replace with your API URL
    
        // Make a GET request using Axios
        const response = await axios.get(apiUrl);


        if (response.status === 200) {

          let xmlGames = response.data          
          
          var parser = new xml2js.Parser();
          parser.parseString(xmlGames, function(err,result){
            //Extract the value from the data element
            extractedData = result['gamesList']['games'];
            res.json(extractedData)
          });
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

module.exports = router
