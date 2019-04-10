//Read and set environment variables
require('dotenv').config();

//Import files and access data
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var command = process.argv[2];
var arg = process.argv;
var refer = [];
var mySong = '';
var myMovie = '';
var myBand = '';
var fileName = 'log.txt';
var fullComand = [];

//Reference to accept several words
for(var i = 3; i < arg.length; i++){
    refer.push(arg[i]);
}
var bandReference = refer.join('');

//Log in command
fullComand.push(command);
if(refer.length != 0){
    fullComand.push(bandReference);
}

//Log information to the log.txt file
function logging(val){
    fs.appendFile(fileName, ',' + val, function(err){
        if(err){
            return console.log('There was an error');
        }
    })
}
logging(fullComand);

//Make liri take one of the following commands
//concert-this   spotify-this-song   movie-this  do-what-it-says
if(command === 'concert-this'){
    concert(bandReference);
}else if(command === 'spotify-this-song'){
    spotifySong(refer);
}else if(command === 'movie-this'){
    movie(refer);
}else if(command === 'do-what-it-says'){
    doThat();
}

//The concert-this function
function concert(bandReference){
   var bandURL = "https://rest.bandsintown.com/artists/" + bandReference +  "/events?app_id=codingbootcamp";
   axios.get(bandURL).then(function (response) {
    console.log("  ");
    console.log("********GETTING***BAND/ARTIST***INFO: " + bandReference + "  **************");
    for (var i = 0; i < response.data.length; i++) {

        var datetime = response.data[i].datetime; //Saves datetime response into a variable

        var dateArr = datetime.split('T'); //Splits the date and time in the response

        var concertResults =
            "--------------------------------------------------------------------" +
            "\nVenue Name: " + response.data[i].venue.name +
            "\nVenue Location: " + response.data[i].venue.city +
            "\nDate of the Event: " + moment(dateArr[0], "YYYY-DD-MM").format('DD/MM/YYYY'); //dateArr[0] should be the date separated from the time
        //and it changes to a new format
        console.log(concertResults);
    }    console.log("  ");
         console.log("////////////////////////////////////////////////////////////////// ");
         console.log("  ");
})
.catch(function (err) {
    console.log('This is the error: ' + err);
});
}

//The spotify-this-song function
function spotifySong(refer){
    if(refer.length === 0){
        refer = "The Sign";
    }
    spotify
    .search({ type: 'track', query: refer})
    .then(function(response){
        console.log(' ');
        console.log('**********You chose***' + refer + '***************');
        console.log(' ');
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                "--------------------------------------------------------------------" +
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name + 
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url;
                    
            console.log(spotifyResults);

        }
        console.log("  ");
        console.log("********************************************************************  ");
        console.log("  ");
    })
    .catch(function(err) {
        console.log(err);
    });

}

 //movie-this  Function

 function movie(refer) {
    if(refer.length === 0){
        refer = "Mr Nobody";
    }
    axios.get('http://www.omdbapi.com/?t=' + refer + '&plot=short&apikey=trilogy').then(
        function (response) {
            var rotten = response.data.Ratings[1]
            // console.log("This is the Rotten value : "+rotten)
            if (rotten === undefined) { rotten = "Not available" } 
            else{ rotten = response.data.Ratings[1].Value;}
            console.log("  ");
            console.log("******MOVIE**INFORMATION**FOR*****" + response.data.Title + "*************");
            console.log("  ");

            var movieResults = 
                "\n* Title: " + response.data.Title + 
                "\n* Year: " + response.data.Year +
                "\n* IMDB Rating: " + response.data.Rated +
                "\n* Rotten Tomatoes Rating: " + rotten +
                "\n* Country Produced: " + response.data.Country +
                "\n* Language: " + response.data.Language +
                "\n* Plot: " + response.data.Plot +
                "\n* Actors: " + response.data.Actors +
                "\n " +
                "\n************************************************************** "+
                "\n ";
        console.log(movieResults);

        })
        .catch(function (err) {
            console.log('This is the error: ' + err);
        });
}

// The do-what-it-says function

function doThat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        console.log('')
        console.log('-------------------MENU--OF--CONTENT-------------------')
        console.log('')
        for (var i = 0; i < dataArr.length; i++) {
        if (dataArr[i] === 'spotify-this-song'){ 
            mySong= dataArr[++i];
            console.log('--------SPOTIFIYING-------' + mySong + '---------')
            spotifySong(theSong);

        }else if (dataArr[i] === 'movie-this'){  
            myMovie= dataArr[++i];
            console.log('--------WHATCH-THIS-MOVIE-------' + myMovie + '---------')
                movie(theMovie);
        }else if (dataArr[i] === 'concert-this'){
            myBand= dataArr[++i];
            console.log('--------CHECK-OUT-THIS-BAND-------' + myBand + '---------')
            concert(theBand);
        } else { console.log("Sorry, This command is not accepted");
            
        }
            
    }
    })

}