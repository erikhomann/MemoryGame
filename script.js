//jquery function to flip the tiles front to back
  $("figure.front").click(function(){
    $(this).parent().toggleClass("flipped");
    return false
  });
//jquery function to flip the tiles back to front
  $("div.content").click(function(){
    $(this).children(".flipped").toggleClass("flipped");
  })

// build an array of images
var numberOfTiles = 16;
var numberOfImages = numberOfTiles/2;
var arrOfImages = buildImgArr(numberOfImages);

// create a random order for the number of tiles and then build pairs
var orderedArr = arrayOfTileNumbers();
var shuffledArr = shuffle(orderedArr);
var pairedArr = buildPairs(shuffledArr);
placeImages(arrOfImages, pairedArr);

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
