// build an array of images like this: ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg"]
var numberOfTiles = 16;
var numberOfImages = numberOfTiles/2;
var arrOfImages = buildImgArr(numberOfImages);

// create a random order for the number of tiles and then build pairs
// from this ordered array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
var orderedArr = arrayOfTileNumbers();

// to this shuffled array: [8, 1, 14, 15, 2, 10, 5, 6, 12, 7, 4, 9, 13, 11, 0, 3]
var shuffledArr = shuffle(orderedArr);

// then build pairs of this shuffled array by combining always two indices
// [[8, 1], [14, 15], [2, 10], [5, 6], [12, 7], [4, 9], [13, 11], [0, 3]]
var pairedArr = buildPairs(shuffledArr);

var numOfOpenedTiles = 0; // keep track of the number of flipped tiles (not more than two are allowed)
var indicesOfOpenedTiles = []; // keep track of which ones are flipped
var countOfTries = 0; // count the number of moves (important for the star rating)
var countOfPairs = 0; // count the number of pairs (important for the end of the game)
var seconds = 0, minutes = 0, hours = 0, // variables for the timer
    t;

// ask the player for his name and place the name in the variable "username"
var username = prompt("What is your name?");
$(".playersName").text(username);

// loop over every image in the array of images and place it on the back of the two tiles which are represented by indices in the array of pairs
// example of arrOfImages: ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg"]
// example of pairedArr: [[8, 1], [14, 15], [2, 10], [5, 6], [12, 7], [4, 9], [13, 11], [0, 3]]
// first image ("images/1.jpg") --> first pair of indices ([[8, 1]])
placeImages(arrOfImages, pairedArr);

// reload or restart the game when buttons are clicked
$( "body" ).on("click", ".btn-primary", function() { //button on the modal "try again"
    location.reload(true);
});
$( "body" ).on("click", ".btn-default", function() { // button on the main page "restart game"
    location.reload(true);
});


// ****************************************************************************************
// functions

  //jquery function to flip the tiles front to back when clicked
    $("figure.front").click(function(){
      countOfTries += 1; // keep track of the number of moves or tries, every time the user flips a closed tile this increases by one.
      rating(); // as soon as a certain amount of tries is reached this function hides stars in the star rating.
      $(".countOfTries").text(countOfTries); //shows number of moves or tries in the header on the main page.
      if(numOfOpenedTiles < 2){ // makes sure that user can not open more than 2 tiles.
        $(this).parent().toggleClass("flipped"); // toggles class of flipped tiles (this is what makes the tiles turn upside down)
        numOfOpenedTiles = $(".flipped").length; // keeps track of the number of flipped tiles.
        indicesOfOpenedTiles = arrIndexFlippedTiles(numOfOpenedTiles); //calls a function which returns the indices of the flipped tiles.
        // $("#numOfFlippedTiles").text(numOfOpenedTiles);
        if(numOfOpenedTiles === 2){ // as soon as two tiles are flipped open
          if(checkPairs()){ // a function is called which checks if the two flipped tiles are a pair of images and returns true if they are a pair and false if not
            matchedTiles(); // calls a function which turns the matching tiles into a thumbsup-picture and increases the number of pairs.
          } else {
            closeTiles(); // calls a function which turns the flipped tiles back again.
          }
        }
      }
    });

// fill the array of the indices of the flipped tiles
function arrIndexFlippedTiles(num){ // input: amount of flipped tiles.
  if(num > 1) { // if more than one tile is flipped
    indicesOfOpenedTiles.push($("div.card").index($(".flipped").eq(1))); // gets the index of the second instance of flipped tiles.
  } else if (num === 1){ // if only one tile is flipped
    indicesOfOpenedTiles.push($("div.card").index($(".flipped"))); // gets the index of the only flipped tile.
  }
  if(indicesOfOpenedTiles[0] === indicesOfOpenedTiles[1]){ // if the user flips up first the higher index of a tile (e.g. first clicks tile 8 and then clicks tile 2), then the indices are somehow the same (I don't know why)
    indicesOfOpenedTiles.pop(); // throw out the first index
    indicesOfOpenedTiles.push($("div.card").index($(".flipped").eq(0))); // replace it by the first instance of the two flipped tiles.
  }
  return indicesOfOpenedTiles; // output indices of the flipped tiles (e.g. [3, 5])
}

// close tiles again because they are not equal
function closeTiles(){
  setTimeout(function(){ // gives time for the flip animation to finish
    $(".flipped").toggleClass("flipped"); // flips tiles back again
    numOfOpenedTiles = $(".flipped").length; // resets the variable for the number of opened tiles to 0
    // $("#numOfFlippedTiles").text(numOfOpenedTiles);
    indicesOfOpenedTiles = []; // resets the variable of the indices of opened tiles
  },1000);
}

// check if opened tiles are a pair of equal cards
// loops over every pair in the array of pairs and checks if both indices of the opened tiles are equal to one of the indices in the pair.
// if both are equal the function returns true.
function checkPairs(){
  for(var i = 0; i < pairsArr.length; i++){
    if((pairsArr[i].indexOf(indicesOfOpenedTiles[0]) !== -1) && (pairsArr[i].indexOf(indicesOfOpenedTiles[1])!== -1)) {
      return true;
    }
  }
}

// turn matching tiles into static images
function matchedTiles(){
  setTimeout(function(){ // gives time for the flip animation to finish
    $("div.flipped").children().remove(); // removes the images from the flipped tiles
    $("div.flipped").append($("<div class=\"matched\"></div>")); // puts a "thumbs-up" image on the tile to show the user which tiles are already successfully paired.
    $("div.flipped").removeClass("flipped"); // removes the flipped class from the successfully paired tiles.
    numOfOpenedTiles = $(".flipped").length; // resets the counter of flipped tiles to 0.
    //$("#numOfFlippedTiles").text(numOfOpenedTiles);
    indicesOfOpenedTiles = []; // resets the variable of the indices of opened tiles
    countOfPairs += 1; // increases the counter of pairs by 1
    $("#countOfPairs").text(countOfPairs); // shows the amount of pairs in the header of the main page.
    if(countOfPairs === numberOfImages){ // if the amount of pairs equals the amount of images the game is finished
      stopTimer(); // calls a function to stop the timer.
      $(".timer").text((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
      $("#winningPic").attr("src", rating()); // call a function which returns a rating picture according to the number of moves the user needed to win the game.
      $('#exampleModalCenter').modal("show"); // shows the modal which congratulates the user and shows his score, timer and a funny picture to rate his performance
    }
  },1000);
}
// function which hides a star in the rating as soon as the user exceeds a certain amount of removes
// and chooses a picture according to the amount of moves (e.g. less than 26 moves = superhero)
// output is the picture which is shown in the modal at the end of the game
function rating(){
  if (countOfTries>40){
    thePic = "images/idiot.jpg";
    $("#firstStar").hide();
  } else if (countOfTries>30){
    thePic = "images/beginner.jpg";
    $("#secondStar").hide();
  } else if (countOfTries>26){
    thePic = "images/nerd.jpg";
    $("#thirdStar").hide();
  } else {
    thePic = "images/superhero.png";
  }
  return thePic;
}

// place images on the back of the tiles
// loop over every image in the array of images and place it on the back of the two tiles which are represented by indices in the array of pairs
// example of arrOfImages: ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg"]
// example of pairedArr: [[8, 1], [14, 15], [2, 10], [5, 6], [12, 7], [4, 9], [13, 11], [0, 3]]
// first image ("images/1.jpg") --> first pair of indices ([[8, 1]])
function placeImages(arrOfImages, pairedArr){
  for(var i = 0; i < arrOfImages.length; i++){
    $("figure.back").eq(pairsArr[i][0]).css("background-image", "url('" + arrOfImages[i] + "')");
    $("figure.back").eq(pairsArr[i][1]).css("background-image", "url('" + arrOfImages[i] + "')");
  }
}

// create an array of images
// build an array of images like this: ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg"]
// output is the array of images --> "arr"
function buildImgArr(num){
  arr = [];
  for (var i = 1; i <= num; i++){
    arr.push("images/" + i + ".jpg");
  }
  return arr;
}

// create an ordered array of the numbers of the tiles
// ordered array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
function arrayOfTileNumbers() {
  arr = [];
  for (var i = 0; i < numberOfTiles; i++){
    arr.push(i);
  }
  return arr;
}

// shuffle this ordered array of tiles numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
// to a shuffled array: e.g. --> [8, 1, 14, 15, 2, 10, 5, 6, 12, 7, 4, 9, 13, 11, 0, 3]
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// build pairs from the number of tiles
// input: e.g. --> [8, 1, 14, 15, 2, 10, 5, 6, 12, 7, 4, 9, 13, 11, 0, 3]
// output: e.g. --> [[8, 1], [14, 15], [2, 10], [5, 6], [12, 7], [4, 9], [13, 11], [0, 3]]
function buildPairs(arr){
  pairsArr = [];
  for (var i = 0; i < arr.length-1; i=i+2){
    thePair = [arr[i], arr[i+1]];
    pairsArr.push(thePair);
  }
  return pairsArr;
}

/****************************************
  timer
****************************************/

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    $(".timer").text((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}
timer();

/* Stop button */
function stopTimer(){
    clearTimeout(t);
}



/* Clear button */
// $(".btn-default").click(function() {
//     $(".timer").text("00:00:00");
//     seconds = 0; minutes = 0; hours = 0;
//     timer;
//     $(".countOfTries").text(0);
//     countOfTries = 0;
//     $("#countOfPairs").text(0);
//     countOfPairs = 0;
// });
