//SETTLEMENT

function drawBuilding(vert,playerColor,side,ctx){
  var img = new Image(); //create new image element
  console.log("drawing "+ vert.settled + " " + playerColor);
  img.src = getBuildingImg(vert.settled, playerColor); //set source path
  ctx.drawImage(img, vert.x, vert.y);
}
function getBuildingImg(settletype, playerColor){
  //still needs work...i will have to spend some time resizing these photos somehow
  var settlements = {
    0 : 'graphics/reds.svg',
    1 : 'graphics/oranges.svg',
    2: 'graphics/blues.svg',
    3: 'graphics/whites.svg'
  };
  var cities = {
    0 : 'graphics/redc.svg',
    1 : 'graphics/orangec.svg',
    2 : 'graphics/bluec.svg',
    3 : 'graphics/whitec.svg'
  };
  if (settletype == 1){
    return settlements[playerColor];
  }
  else{
    return cities[playerColor];
  }
}
