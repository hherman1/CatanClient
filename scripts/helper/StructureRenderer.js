<<<<<<< HEAD
=======
/* StructureRenderer.js
 * Functions and objects for rendering structures 
 */
>>>>>>> c864f3b116c2d57e8b0663a5311fd7c9bd7d8cdc

Images = {
        Settlements                 : [],

        Cities                      : [],

        Resources                   : [],
}

Images.Settlements[Colors.red]      = 'graphics/reds.svg';
Images.Settlements[Colors.orange]   = 'graphics/oranges.svg';
Images.Settlements[Colors.blue]     = 'graphics/blues.svg';
Images.Settlements[Colors.white]    = 'graphics/whites.svg';

Images.Cities[Colors.red]           = 'graphics/redc.svg';
Images.Cities[Colors.orange]        = 'graphics/orangec.svg';
Images.Cities[Colors.blue]          = 'graphics/bluec.svg';
Images.Cities[Colors.white]         = 'graphics/whitec.svg';


//'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Lumber]   = 'graphics/forest.svg';
//'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';
//labeled for noncommercial reuse
<<<<<<< HEAD
Images.Resources[Resource.Grain] = 'graphics/field.svg';
//'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Wool] = 'graphics/pasture.svg';
//'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Ore] = 'graphics/mountains.svg';
=======
Images.Resources[Resource.Grain]    = 'graphics/field.svg'; 
//'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg'; 
//labeled for noncommercial reuse
Images.Resources[Resource.Wool]     = 'graphics/pasture.svg'; 
//'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Ore]      = 'graphics/mountains.svg'; 
>>>>>>> c864f3b116c2d57e8b0663a5311fd7c9bd7d8cdc
//'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg'
//labeled for noncommercial reuse
Images.Resources[Resource.Brick]    = 'graphics/hills.svg';
//"https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg
//labeled for noncommercial reuse
<<<<<<< HEAD
Images.Resources[Resource.Desert] = 'graphics/desert.svg';
=======
Images.Resources[Resource.Desert]   = 'graphics/desert.svg'; 
>>>>>>> c864f3b116c2d57e8b0663a5311fd7c9bd7d8cdc


function drawRoad(verta,vertb,color,ctx) {
  ctx.beginPath();
  ctx.moveTo(verta.x,verta.y);
  ctx.lineTo(vertb.x,vertb.y);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawBuilding(vert,playerColor,side,ctx){
  var img = new Image(); //create new image element
  console.log("drawing "+ vert.settled + " " + playerColor);
  img.src = getBuildingImg(vert.settled, playerColor); //set source path
  ctx.drawImage(img, vert.coordinate.x, vert.coordinate.y);
}

function getBuildingImg(settletype, playerColor){
  //still needs work...i will have to spend some time resizing these photos somehow
  switch(settletype) {
        case Structure.Settlement:
            return Settlements[playerColor];
        case Structure.City:
            return Cities[playerColor];
  }
}

function getResourceImage(resourceType) {
        return Images.Resources[resourceType]
}


//wood image src: https://static.pexels.com/photos/5766/wood-fireplace-horizontal.jpg
//bricks image src: https://pixabay.com/static/uploads/photo/2013/07/25/12/07/bricks-167072_960_720.jpg
//wool image src: http://s0.geograph.org.uk/geophotos/02/40/15/2401511_d55c4dac.jpg
//grain image src: https://c1.staticflickr.com/5/4038/4525119513_1ec891529b_b.jpg
//ore image src: https://upload.wikimedia.org/wikipedia/commons/5/52/Gold-Quartz-273364.jpg
