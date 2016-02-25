
//function to shuffle up the number tokens
//Source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
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

function getResImg(res){
  //still needs work...i will have to spend some time resizing these photos somehow
  var resources = {};
  resources[Resource.Lumber] = 'graphics/forest.svg'; //'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg'; //labeled for noncommercial reuse
  resources[Resource.Grain] = 'graphics/field.svg'; //'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';//labeled for noncommercial reuse
  resources[Resource.Wool] = 'graphics/pasture.svg'; //'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg'; //labeled for noncommercial reuse
  resources[Resource.Ore] = 'graphics/mountains.svg'; //'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';//labeled for noncommercial reuse
  resources[Resource.Brick] = 'graphics/hills.svg'; //'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg';//labeled for noncommercial reuse
  resources[Resource.Desert] = 'graphics/desert.svg'; //"https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg"; //labeled for noncommercial reuse
  return resources[res];

}

//wood image src: https://static.pexels.com/photos/5766/wood-fireplace-horizontal.jpg
