// init project
const express = require('express');
const app = express();
const jikanjs  = require('jikanjs');
const fetch = require('node-fetch');

app.use(express.static(__dirname + '/public'));

app.get('/search/:year/:season', (req, res, next) => {
  
  const year = req.params.year
  const season = req.params.season
  const seasonUrl = `https://api.jikan.moe/v3/season/${year}/${season}`
  const animeUrl = "https://api.jikan.moe/v3/anime/"
  let animeID = "hello world"
  
  //Get anime season data via season API 
  const getSeasonData = async seasonUrl => {
    try {
      const response = await fetch(seasonUrl);
      const json = await response.json();
      const songs = json["anime"]
      
      //Filter for anime IDs only 
      const filterTV = songs.filter((anime) => anime["type"] === "TV")
      const filterAnimeID = filterTV.map(anime => anime["mal_id"])
      
      //pass anime ID to anime API 
      getAnimeSongs(filterAnimeID)
      
    } catch (error) {
      console.log(error);
    }
  };
  
  //Call Season function 
  getSeasonData(seasonUrl);
  
  //Get anime songs from API 
  const getAnimeSongs = (animeID) => {
    async function getAnimeSongData() {
      let start = 0
      let end = 20
        try {
          let promises = animeID.slice(start, end).map(id => {
            
            //To request more anime song data in increments
            if(end <= animeID.length && (animeID.length - end) < 20){
              start = end 
              end = animeID.length - start
            } else if (end <= animeID.length){
              start = end 
              end += 20
            }
            
            //Fetch anime song data from anime ID 
            let data =  fetch(`${animeUrl}${id}`).then((resp) => resp.json()).then((anime) => {
              return {
                      "image_url": anime.image_url, 
                      "title": anime.title, 
                      "opening_themes": anime.opening_themes, 
                      "ending_themes": anime.ending_themes,
                      "url": anime.url
                      }
            })
            return data
          });
          
          let animeSong = await Promise.all(promises);
          
          //Send all data to view
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