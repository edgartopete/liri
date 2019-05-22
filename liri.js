require("dotenv").config();
// Include the axios,http npm packages
var axios = require("axios");
var http = require('http');
var fs = require('fs');
var moment = require('moment');
var Spotify = require('node-spotify-api');

//Include chlid proces to be able to star a web server
var childProc = require('child_process');
//varible to store the result from the diferents API's
var res = null;

/*Sopotyfy API setup */
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// get parameters
var params = process.argv;
var comand = params[2];
var request = params[3];

lirithis(comand,request);
function lirithis(doCommand,request){
  //in case the call comes from do-what-it-says
  comand=doCommand;
  
    //liri switch case
    switch (doCommand) {
      case 'concert-this':
        if(request!=="")
          concerthis(request.replace(/ /g, "%20"));
        else
          console.log("You need to provide a 'Band name' ");
        break;
      case 'spotify-this-song':
        spotifythis(request);

        break;
      case 'movie-this':
        if(request!=="")
          moviethis(request.replace(/ /g, "%20"));
        else 
        console.log("You need to provide a 'Movie name' ");
        break;
      case 'do-what-it-says':
        dothis();
        break;
      default:
        console.log("Conand not found")
    }
  

}



// * `concert-this`
function concerthis(band) {

  axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp").then(
    function (response) {
      //set the response to the global variable
      res = response.data;
      //execute a http server to be able to deplay the result in a html page
      http.createServer(onRequest).listen(8000);
      //open choreme to desplay the index.html
      childProc.exec('open -a "Google Chrome" http://localhost:8000/index.html', () => { });

    }
  );
}

// * `spotify-this-song`
function spotifythis(song) {
  
  if (song === undefined) {
    song = "The Sign"; //default Song
}

  spotify.search({ type: 'track', query: song })
    .then(function (response) {
      
      //set the response to the global variable
      res = response.tracks.items;
      
      //execute a http server to be able to deplay the result in a html page
      http.createServer(onRequest).listen(8000);
      //open choreme to desplay the index.html
      childProc.exec('open -a "Google Chrome" http://localhost:8000/index.html', () => { });

    })
    .catch(function (err) {
      console.log(err);
    });
}

// * `movie-this`

// Then run a request with axios to the OMDB API with the movie specified
function moviethis(movie) {

  axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy").then(
    function (response) {
      //set the response to the global variable
      res = response;
      //execute a http server to be able to deplay the result in a html page
      http.createServer(onRequest).listen(8000);
      //open choreme to desplay the index.html
      childProc.exec('open -a "Google Chrome" http://localhost:8000/index.html', () => { });
    }
  );
}


// * `do-what-it-says`
function dothis() {
  // This block of code will read from the "movies.txt" file.
  // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
  // The code will store the contents of the reading inside the variable "data"
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
   
    lirithis(dataArr[0],dataArr[1]);

  });
}

// on request

function onRequest(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  fs.readFile('./index.html', null, function (error, data) {
    if (error) {
      response.writeHead(404);
      response.write('File not found!');
    } else {

      switch (comand) {
        case 'concert-this':
          response.write("<table class='striped responsive-table'><tr><th>Des</th><th>Value</th></tr>");
          for (var i = 0; i < res.length; i++) {
            response.write("<tr><td>Venue: </td><td>" + res[i].venue.name + "</td>");
            response.write("</tr><tr>");
            response.write("<td>Location:</td><td>" + res[i].venue.country + "</td>");
            response.write("</tr><tr>");
            response.write("<td>Date:</td><td>" + moment(res[i].datetime).format("MM/DD/YYYY", moment.ISO_8601) + "</td>");
            response.write("</tr>");
            response.write("<tr><td colspan='2'>--------------------</td></tr>");
          }
          response.write("</table>");
          //render html
          response.write(data);
          break;
        case 'spotify-this-song':
          response.write("<table class='striped responsive-table'><tr><th>Des</th><th>Value</th></tr>");
          for (var i = 0; i < res.length; i++) {
            response.write("<tr><td>Song Name: </td><td>" + res[i].name + "</td>");
            response.write("</tr><tr>");
            response.write("<td>Preview song:</td><td><a href='" + res[i].preview_url + "'target='_blank'>" + res[i].preview_url + "</a></td>");
            response.write("</tr><tr>");
            response.write("<td>Album</td><td>" + res[i].album.name + "</td>");
            response.write("</tr><tr>");
            response.write("<td>Artis:</td><td>" + res[i].artists[0].name + "</td>");
            response.write("</tr>");
            response.write("<tr><td colspan='2'>--------------------</td></tr>");
          }
          response.write("</table>");
          //render html
          response.write(data);

          break;
        case 'movie-this':

          response.write("<table class='striped responsive-table'><tr><th>Des</th><th>Value</th></tr><tr>");
          response.write("<td>Movie title: </td><td>" + res.data.Title + "</td>");
          response.write("</tr><tr>");
          response.write("<td>Movie premier:</td><td>" + res.data.Year + "</td>");
          response.write("</tr><tr>");
          response.write("<td>Movie IMDB raiting:</td><td>" + res.data.imdbRating + "</td>");
          response.write("</tr><tr>");
          response.write("<td>Movie Rotten Tomatoes raiting:</td><td>" + res.data.tomatoRating + "</td>");
          response.write("</tr><tr>");
          response.write("<td>Movie contry:</td><td>" + res.data.Country + "</td>");
          response.write("</tr><tr>");
          response.write("<td>Movie Language:</td><td>" + res.data.Language + "</td>");
          response.write("</tr><tr>");
          response.write("<td>Movie Plot:</td><td>" + res.data.Plot + "</td>");
          response.write("</tr><tr>");
          response.write("<td>Movie Actors:</td><td>" + res.data.Actors + "</td>");
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


