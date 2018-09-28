// init project
const express = require('express');
const app = express();
const jikanjs  = require('jikanjs');
const request = require('request');
const fetch = require('node-fetch');

// // RATE LIMITING FOR JIKAN JS
// const rateLimit = require('ratelimit.js').RateLimit;
// const redis = require('redis');
// const ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;

// const rateLimiter = new rateLimit(redis.createClient(), [{interval: 1, limit: 10}]);

// const options = {
//   ignoreRedisErrors: true 
// };

// const limitMiddleware = new ExpressMiddleware(rateLimiter, options);

// app.use(limitMiddleware.middleware((req, res, next) => {
//   res.status(429).json({message: 'rate limit exceeded'});
// }));

app.use(express.static(__dirname + '/public'));

app.get('/search', (req, res, next) => {
  const seasonUrl = 'https://api.jikan.moe/v3/season/2018/summer'
  const animeUrl = 'https://api.jikan.moe/v3/anime/'
  let animeID = "hello world"

  const getSeasonData = async seasonUrl => {
    try {
      const response = await fetch(seasonUrl);
      const json = await response.json();
      
      const songs = json["anime"]
      const filterTV = songs.filter((anime) => anime["type"] === "TV")
      const filterAnimeID = filterTV.map(anime => anime["mal_id"])
      
      //pass anime ID to anime API 
      getAnimeSongs(filterAnimeID)
      
    } catch (error) {
      console.log(error);
    }
  };
  
  getSeasonData(seasonUrl);
  
  //Get anime songs from API 
  const getAnimeSongs = (animeID) => {
    
    async function getAnimeSongData() {
      let start = 0
      let end = 20
        try {
          let promises = animeID.slice(start, end).map(id => {
            
          //to request more anime song Data 
          if(end <= animeID.length && (animeID.length - end) < 20){
            start = end 
            end += animeID.length - start
            
          } else if (end <= animeID.length){
            start = end 
            end += 20
          }
          
          let data =  fetch(`${animeUrl}${id}`).then((resp) => resp.json())
          console.log(data)
          return data
          });
          let animeSong = await Promise.all(promises);
          // console.log('animeSong =>', animeSong[0]);
          res.send(animeSong)

        } catch (error){
          console.log(error)
        }
      }
    getAnimeSongData()
  }
})
  
//view
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});