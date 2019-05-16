require("dotenv").config();
// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
var axios = require("axios");
var http = require('http');
var childProc = require('child_process');
var fs = require('fs');
var res=null;


//var keys = require("./keys.js");

//var spotify = new Spotify(keys.spotify);
// get parameters
var params= process.argv;
var comand = params[2];
var request = params[3];

//liri switch case
switch(comand) {
    case 'concert-this':
    concerthis(request.replace(/ /g,"%20"));
      break;
    case 'spotify-this-song':
      console.log(comand);
      break;
    case 'movie-this':
        moviethis(request.replace(/ /g,"%20"));
        break;
    default:
      // code block
  }

// * `concert-this`
function concerthis(band){
    
  axios.get("https://rest.bandsintown.com/artists/"+band+"/events?app_id=codingbootcamp").then(
      function(response) {
        console.log(response);
      
      
      }
    );
}  




// * `spotify-this-song`

// * `movie-this`

// Then run a request with axios to the OMDB API with the movie specified
function moviethis(movie){
    
    axios.get("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&tomatoes=true&apikey=trilogy").then(
        function(response) {
          
         

          res= response;
         http.createServer(onRequest).listen(8000);
        
         childProc.exec('open -a "Google Chrome" http://localhost:8000/index.html', () => {});
        }
      );
}   


// * `do-what-it-says`

// on request

function onRequest(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('./index.html', null, function(error, data) {
      if (error) {
          response.writeHead(404);
          response.write('File not found!');
      } else {
          
        switch(comand) {
          case 'concert-this':
          //concerthis(request.replace(/ /g,"%20"));
            break;
          case 'spotify-this-song':
            //console.log(comand);
            break;
          case 'movie-this':
          
          response.write("<table><tr><th>Des</th><th>Value</th></tr><tr>");
          response.write("<td>Movie title: </td>" +"<td>"+ res.data.Title+"</td>");
          
          response.write("Movie premier: " + res.data.Year);
          response.write("Movie IMDB raiting: " + res.data.imdbRating);
          response.write("Movie Rotten Tomatoes raiting: " + res.data.tomatoRating);
          response.write("Movie contry: " + res.data.Country);
          response.write("Movie Language: " + res.data.Language);
          response.write("Movie Plot: " + res.data.Plot);
          response.write("Movie Actors: " + res.data.Actors);
          response.write("</tr></table>");
          //render html
              response.write(data);
              break;
          default:
            // code block
        }
          
          
      }
      response.end();
  });
}

//http.createServer(onRequest).listen(8080);
