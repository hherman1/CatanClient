//RESOURCE
function getResImg(res){
  //still needs work...i will have to spend some time resizing these photos somehow
  var resources = {};
  resources.lumber = 'graphics/forest.svg'; //'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg'; //labeled for noncommercial reuse
  resources.grain = 'graphics/field.svg'; //'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';//labeled for noncommercial reuse
  resources.wool = 'graphics/pasture.svg'; //'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg'; //labeled for noncommercial reuse
  resources.ore = 'graphics/mountains.svg'; //'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';//labeled for noncommercial reuse
  resources.brick = 'graphics/hills.svg'; //'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg';//labeled for noncommercial reuse
  resources.nothing = 'graphics/desert.svg'; //"https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg"; //labeled for noncommercial reuse
  return resources[res];

}

//wood image src: https://static.pexels.com/photos/5766/wood-fireplace-horizontal.jpg
