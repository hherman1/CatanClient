//SETTLEMENT

function drawBuilding(vert,playerColor,side,ctx){
  var img = new Image(); //create new image element
  img.src = getBuildingImg(vert.settled, playerColor); //set source path
  ctx.drawImage(img, vertexToWorld(vert, side).x, vertexToWorld(vert, side).y);
}
function getBuildingImg(settletype, playerColor){
  //still needs work...i will have to spend some time resizing these photos somehow
  var settlements = {
    colors.red : 'graphics/reds.svg',
    colors.orange : 'graphics/oranges.svg',
    colors.blue : 'graphics/blues.svg',
    colors.white : 'graphics/whites.svg'
  };
  var cities = {
    colors.red : 'graphics/redc.svg',
    colors.orange : 'graphics/orangec.svg',
    colors.blue : 'graphics/bluec.svg',
    colors.white : 'graphics/whitec.svg'
  };
  if (settletype == 1){
    return settlement[playerColor];
  }
  else{
    return cities[playerColor];
  }
}
