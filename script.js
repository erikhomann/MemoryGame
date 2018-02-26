// build an array of images
var numberOfTiles = 16;
var numberOfImages = numberOfTiles/2;
var numOfOpenedTiles = 0;
var arrOfImages = buildImgArr(numberOfImages);
var indicesOfOpenedTiles = [];
// create a random order for the number of tiles and then build pairs
var orderedArr = arrayOfTileNumbers();
var shuffledArr = shuffle(orderedArr);
var pairedArr = buildPairs(shuffledArr);
placeImages(arrOfImages, pairedArr);


// ****************************************************************************************
// functions

  //jquery function to flip the tiles front to back
    $("figure.front").click(function(){
      clearTimeout();
      if(numOfOpenedTiles < 2){
        $(this).parent().toggleClass("flipped");
        numOfOpenedTiles = $(".flipped").length;
        indicesOfOpenedTiles = arrIndexFlippedTiles(numOfOpenedTiles)
        console.log("indices of opened tiles: " + indicesOfOpenedTiles);
        $("#numOfFlippedTiles").text(numOfOpenedTiles);
        if(numOfOpenedTiles === 2){
          if(checkPairs()){
            console.log("you did it")
            console.log($(this));
            matchedTiles();
          } else {
            closeTiles();
          }
        }
      }
      console.log(indicesOfOpenedTiles);
    });

// fill the array of the indices of the flipped tiles
function arrIndexFlippedTiles(num){
  if(num > 1) {
    indicesOfOpenedTiles.push($("div.card").index($(".flipped").eq(1)));
  } else if (num === 1){
    indicesOfOpenedTiles.push($("div.card").index($(".flipped")));
  }
  if(indicesOfOpenedTiles[0] === indicesOfOpenedTiles[1]){
    indicesOfOpenedTiles.pop();
    indicesOfOpenedTiles.push($("div.card").index($(".flipped").eq(0)));
  }
  return indicesOfOpenedTiles;
}
// close tiles again because they are not equal
function closeTiles(){
  setTimeout(function(){
    $(".flipped").toggleClass("flipped");
    numOfOpenedTiles = $(".flipped").length;
    $("#numOfFlippedTiles").text(numOfOpenedTiles);
    indicesOfOpenedTiles = [];
  },1000);
}
// check if opened tiles are a pair of equal cards
function checkPairs(){
  for(var i = 0; i < pairsArr.length; i++){
    console.log(pairsArr[i]);
    console.log(pairsArr[i].indexOf(indicesOfOpenedTiles[0])); console.log(pairsArr[i].indexOf(indicesOfOpenedTiles[1]));
    if((pairsArr[i].indexOf(indicesOfOpenedTiles[0]) !== -1) && (pairsArr[i].indexOf(indicesOfOpenedTiles[1])!== -1)) {
      return true;
    }
  }
}

// turn matching tiles into static images
function matchedTiles(){
  setTimeout(function(){
    $("div.flipped").children().remove();
    $("div.flipped").removeClass("flipped");
    numOfOpenedTiles = $(".flipped").length;
    $("#numOfFlippedTiles").text(numOfOpenedTiles);
    indicesOfOpenedTiles = [];
  },1000);
}
// place images on the back of the tiles
function placeImages(arrOfImages, pairedArr){
  for(var i = 0; i < arrOfImages.length; i++){
    $("figure.back").eq(pairsArr[i][0]).css("background-image", "url('" + arrOfImages[i] + "')");
    $("figure.back").eq(pairsArr[i][1]).css("background-image", "url('" + arrOfImages[i] + "')");
  }
}

// create an array of images
function buildImgArr(num){
  arr = [];
  for (var i = 1; i <= num; i++){
    arr.push("images/" + i + ".jpg");
  }
  return arr;
}
// create an ordered array of the numbers of the tiles
function arrayOfTileNumbers() {
  arr = [];
  for (var i = 0; i < numberOfTiles; i++){
    arr.push(i);
  }
  return arr;
}
// shuffle this ordered array of tiles numbers

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

function buildPairs(arr){
  pairsArr = [];
  for (var i = 0; i < arr.length-1; i=i+2){
    thePair = [arr[i], arr[i+1]];
    pairsArr.push(thePair);
  }
  return pairsArr;
}
console.log(pairsArr);
console.log(arrOfImages);
console.log(numOfOpenedTiles);
