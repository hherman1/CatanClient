//SETTLEMENT

function drawBuilding(vert,playerColor,side,ctx){
  var img = new Image(); //create new image element
  console.log("drawing "+ vert.settled + " " + playerColor);
  img.src = getBuildingImg(vert.settled, playerColor); //set source path
  ctx.drawImage(img, vert.coordinate.x, vert.coordinate.y);
}

Settlements = []
Settlements[Colors.red]     = 'graphics/reds.svg';
Settlements[Colors.orange]  = 'graphics/oranges.svg';
Settlements[Colors.blue]    = 'graphics/blues.svg';
Settlements[Colors.white]   = 'graphics/whites.svg';

Cities = []
Cities[Colors.red]      = 'graphics/redc.svg';
Cities[Colors.orange]   = 'graphics/orangec.svg';
Cities[Colors.blue]     = 'graphics/bluec.svg';
Cities[Colors.white]    = 'graphics/whitec.svg';

function getBuildingImg(settletype, playerColor){
  //still needs work...i will have to spend some time resizing these photos somehow
  if (settletype == 1){
    return Settlements[playerColor];
  }
  else{
    return Cities[playerColor];
  }
}
