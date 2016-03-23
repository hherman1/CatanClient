//SETTLEMENT
//
//

Images = {
        Loaded:{
                Settlements:[],
                Cities:[],
                Resources:[],
                Robber:{},
        },
        Settlements:[],

        Cities:[],

        Resources:[],

        Robber:'',
}

Images.Robber = 'graphics/robber.svg'; 
Images.Loaded.Robber = loadImage(Images.Robber);

Images.Settlements[Colors.Red]     = 'graphics/reds.svg';
Images.Settlements[Colors.Orange]  = 'graphics/oranges.svg';
Images.Settlements[Colors.Blue]    = 'graphics/blues.svg';
Images.Settlements[Colors.White]   = 'graphics/whites.svg';
Images.Loaded.Settlements = Images.Settlements.map(loadImage);

Images.Cities[Colors.Red]      = 'graphics/redc.svg';
Images.Cities[Colors.Orange]   = 'graphics/orangec.svg';
Images.Cities[Colors.Blue]     = 'graphics/bluec.svg';
Images.Cities[Colors.White]    = 'graphics/whitec.svg';
Images.Loaded.Cities = Images.Cities.map(loadImage);


//'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Lumber] = 'graphics/forest.svg';
//'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Grain] = 'graphics/field.svg';
//'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Wool] = 'graphics/pasture.svg';
//'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';
//labeled for noncommercial reuse
Images.Resources[Resource.Ore] = 'graphics/mountains.svg';
//'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg'
//labeled for noncommercial reuse
Images.Resources[Resource.Brick] = 'graphics/hills.svg';
//"https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg
//labeled for noncommercial reuse
Images.Resources[Resource.Desert] = 'graphics/desert.svg';
Images.Loaded.Resources = Images.Resources.map(loadImage);

function loadImage(src) {
        var out = new Image();
        out.src = src;
        return out;
}

function drawRoad(coordinateA,coordinateB,color,side, ctx) {
  var worldA = hexToWorld(coordinateA,side);
  var worldB = hexToWorld(coordinateB,side);
  ctx.beginPath();
  ctx.moveTo(worldA.x, worldA.y);
  ctx.lineTo(worldB.x,worldB.y);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawBuilding(coordinate,structure,color,side,ctx){
        if(structure != Structure.Empty) {
          var worldCoord = vertexToWorld(coordinate,side);
          ctx.drawImage(getBuildingImg(structure, color)
                       , worldCoord.x, worldCoord.y
                       , side, side*0.75); //need to adjust width and height of the building rendered...right now its set to w=side and h=side*0.75
        }
}

function getRobberImg() {
        return Images.Loaded.Robber;
}

function getBuildingImg(settletype, playerColor){
  //still needs work...i will have to spend some time resizing these photos somehow
  switch(settletype) {
        case Structure.Settlement:
            return Images.Loaded.Settlements[playerColor];
        case Structure.City:
            return Images.Loaded.Cities[playerColor];
  }
}

function getResourceImage(resourceType) {
  return Images.Loaded.Resources[resourceType];
}


//wood image src: https://static.pexels.com/photos/5766/wood-fireplace-horizontal.jpg
//bricks image src: https://pixabay.com/static/uploads/photo/2013/07/25/12/07/bricks-167072_960_720.jpg
//wool image src: http://s0.geograph.org.uk/geophotos/02/40/15/2401511_d55c4dac.jpg
//grain image src: https://c1.staticflickr.com/5/4038/4525119513_1ec891529b_b.jpg
//ore image src: https://upload.wikimedia.org/wikipedia/commons/5/52/Gold-Quartz-273364.jpg
