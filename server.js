// init project
const express = require('express');
const app = express();
const jikanjs  = require('jikanjs');
const request = require('request');

//RATE LIMITING FOR JIKAN JS
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

//unofficial MAL API
app.get('/search', (req, res, next) => {
  jikanjs.loadSeason(2017, 'summer')
  .then((response) => {
    let songs = response["anime"]
    let filterTV = songs.filter((anime) => anime["type"] === "TV")
    let animeID = filterTV.map(anime => anime["mal_id"])
    console.log('ANIME ID LENGTH => ', animeID.length)
    return animeID
  })
  .then((animeID) => {
    let animeSongData = []
    for(let i = 0; i < animeID.length; i++){
      request('https://api.jikan.moe/v3/anime/' + animeID[i], function (error, response, body) {
        console.log('i', i)
        console.log('ID', animeID[i])
        animeSongData.push(response.body)
        if(i === animeID.length-1){console.log('SONG DATA:', animeSongData)}
      });
    }
  })
  .catch((err) => { 
    console.log('NOT WORKING') 
  })
  
});

// //unofficial MAL API
// app.get('/search', (req, res, next) => {
//   jikanjs.loadSeason(2017, 'summer')
//   .then((response) => {
//     let songs = response["anime"]
//     let filterTV = songs.filter((anime) => anime["type"] === "TV")
//     let animeID = filterTV.map(anime => anime["mal_id"])
//     console.log('ANIME ID LENGTH => ', animeID.length)
//     return animeID
//   })
//   .then((animeID) => {
//     let animeSongData = []
//     for(let i = 0; i < animeID.length; i++){
      
//       jikanjs.loadAnime(animeID[i])
//       .then((response) =>{
//         console.log('i', i)
//         animeSongData.push({
//           "title": response.title, 
//           "op":response.opening_themes, 
//           "ed":response.ending_themes, 
//           "url": response.url, 
//           "image_url":response.image_url
//         })
//         if (i === animeID.length-1){
//           console.log("SONGDATA", animeSongData.length)
//           res.send(animeSongData)
//         }
//       }).catch(function (err) {
//         console.log('NOT WORKING') 
//       });
//     }
    
//   })
//   .catch((err) => {
//     console.log('NOT WORKING')
//   })
// });

  
//view
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});