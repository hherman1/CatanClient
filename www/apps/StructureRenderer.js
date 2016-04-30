define(['Grid','Transform','BoardState','Player'],function(Grid,Transform,BoardState,Player) {

//SETTLEMENT
//
//

var Images = {
        Loaded:{
                Settlements:[],
                Cities:[],
                Roads:[],
                Resources:[],
                ResourceSymbols:[],
                Robber:{},
        },
        Settlements:[],

        Cities:[],

        Roads:[],

        Resources:[],

        ResourceSymbols:[],

        Robber:'',
}

Images.Robber = '../graphics/swiper.svg';
Images.Loaded.Robber = loadImage(Images.Robber);

Images.Settlements[Player.Colors.Red]     = '../graphics/reds.svg';
Images.Settlements[Player.Colors.Orange]  = '../graphics/oranges.svg';
Images.Settlements[Player.Colors.Blue]    = '../graphics/blues.svg';
Images.Settlements[Player.Colors.Green]   = '../graphics/whites.svg';
Images.Settlements[Player.Colors.White]   = '../graphics/buildingcosts.svg';
Images.Loaded.Settlements = Images.Settlements.map(loadImage);

Images.Cities[Player.Colors.Red]      = '../graphics/redc.svg';
Images.Cities[Player.Colors.Orange]   = '../graphics/orangec.svg';
Images.Cities[Player.Colors.Blue]     = '../graphics/bluec.svg';
Images.Cities[Player.Colors.Green]    = '../graphics/whitec.svg';
Images.Cities[Player.Colors.White]   = '../graphics/buildingcostc.svg';
Images.Loaded.Cities = Images.Cities.map(loadImage);

Images.Roads[Player.Colors.Red]     = '../graphics/redr.svg';
Images.Roads[Player.Colors.Orange]  = '../graphics/oranger.svg';
Images.Roads[Player.Colors.Blue]    = '../graphics/bluer.svg';
Images.Roads[Player.Colors.Green]   = '../graphics/whiter.svg';
Images.Roads[Player.Colors.White]   = '../graphics/buildingcostr.svg';
Images.Loaded.Roads = Images.Roads.map(loadImage);


//'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg';
//labeled for noncommercial reuse
Images.Resources[BoardState.Resource.Lumber] = '../graphics/forest.svg';
//'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';
//labeled for noncommercial reuse
Images.Resources[BoardState.Resource.Grain] = '../graphics/field.svg';
//'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg';
//labeled for noncommercial reuse
Images.Resources[BoardState.Resource.Wool] = '../graphics/pasture.svg';
//'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';
//quarry: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Bethesda-Mine-07367u.jpg';
//labeled for noncommercial reuse
<<<<<<< HEAD
Images.Resources[Resource.Ore] = 'graphics/quarry.png';
=======
Images.Resources[BoardState.Resource.Ore] = '../graphics/quarry.svg';
>>>>>>> 0fb2e415a1391a49026abca4ba744642aa6628d4
//'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg'
//labeled for noncommercial reuse
Images.Resources[BoardState.Resource.Brick] = '../graphics/hills.svg';
//"https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg
//labeled for noncommercial reuse
Images.Resources[BoardState.Resource.Desert] = '../graphics/desert.svg';
Images.Loaded.Resources = Images.Resources.map(loadImage);

Images.ResourceSymbols[BoardState.Resource.Lumber] = '../graphics/WOODS.svg';
Images.ResourceSymbols[BoardState.Resource.Grain] = '../graphics/wheatsymbol.svg';
Images.ResourceSymbols[BoardState.Resource.Wool] = '../graphics/WOOL.svg';
Images.ResourceSymbols[BoardState.Resource.Ore] = '../graphics/oresymbol.svg';
Images.ResourceSymbols[BoardState.Resource.Brick] = '../graphics/bricksymbol.svg';
Images.Loaded.ResourceSymbols = Images.ResourceSymbols.map(loadImage);

function getGameImages() {
        return Images.Loaded;
}

function getLoadedImages() {
        var out = [];
        for(var key in Images.Loaded) {
                out = out.concat(Images.Loaded[key]);
        }
        return out;
}

function loadImage(src) {
        var out = new Image();
        out.src = src;
        return out;
}

function drawRoad(coordinateA,coordinateB,color,ctx) {
  var worldA = Grid.vertexToWorld(coordinateA,1);//vertexToWorld(coordinateA,side);
  var worldB = Grid.vertexToWorld(coordinateB,1);//vertexToWorld(coordinateB,side);
  ctx.beginPath();
  ctx.moveTo(worldA.x, worldA.y);

  ctx.lineTo(worldB.x,worldB.y);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#000000";
  ctx.save();
  Transform.resetTransform(ctx);
  ctx.stroke();
  ctx.restore();

  ctx.lineTo(worldB.x,worldB.y);
  ctx.lineWidth = 5;
  ctx.strokeStyle = Player.getColor(color);
  ctx.save();
  Transform.resetTransform(ctx);
  ctx.stroke();
  ctx.restore();
}

function drawBuilding(coordinate,structure,color,side,ctx){
        if(structure != BoardState.Structure.Empty) {
          var worldCoord = Grid.vertexToWorld(coordinate,side);
          ctx.drawImage(getBuildingImg(structure, color)
                       , worldCoord.x-side/2, worldCoord.y-side/2
                       , side, side*0.75); //need to adjust width and height of the building rendered...right now its set to w=side and h=side*0.75
        }
}
function drawStructure(structure,color,side,ctx){
        if(structure != BoardState.Structure.Empty) {
          ctx.drawImage(getBuildingImg(structure, color)
                       , -side/2, -side/2
                       , side, side*0.75); //need to adjust width and height of the building rendered...right now its set to w=side and h=side*0.75
        }
}

/* drawRobber
 * Given coordinates, scale and a context, draws the image of the robber.
 */

function drawRobber(x,y, z, ctx){
    ctx.drawImage(getRobberImg(), x-30, y-(z*0.75), z*1.2, z*1.5);
}

function getRobberImg() {
        return Images.Loaded.Robber;
}


function getBuildingImg(settletype, playerColor){
  //still needs work...i will have to spend some time resizing these photos somehow
  switch(settletype) {
        case BoardState.Structure.Settlement:
            return Images.Loaded.Settlements[playerColor];
        case BoardState.Structure.City:
            return Images.Loaded.Cities[playerColor];
        case BoardState.Structure.Road:
            return Images.Loaded.Roads[playerColor];
  }
}

function getResourceImage(resourceType) {
  return Images.Loaded.Resources[resourceType];
}

function getResourceSymbolImages() {
        return Images.Loaded.ResourceSymbols;
}
function getResourceSymbolImage(resource) {
  return Images.Loaded.ResourceSymbols[resource];
}


//wood image src: https://static.pexels.com/photos/5766/wood-fireplace-horizontal.jpg
//bricks image src: https://pixabay.com/static/uploads/photo/2013/07/25/12/07/bricks-167072_960_720.jpg
//wool image src: http://s0.geograph.org.uk/geophotos/02/40/15/2401511_d55c4dac.jpg
//grain image src: https://c1.staticflickr.com/5/4038/4525119513_1ec891529b_b.jpg
//ore image src: https://upload.wikimedia.org/wikipedia/commons/5/52/Gold-Quartz-273364.jpg


return {
        Images:Images,
        getGameImages:getGameImages,
        getLoadedImages:getLoadedImages,
        drawRoad:drawRoad,
        drawBuilding:drawBuilding,
        drawStructure:drawStructure,
        drawRobber:drawRobber,
        getRobberImg:getRobberImg,
        getBuildingImg:getBuildingImg,
        getResourceImage:getResourceImage,
        getResourceSymbolImages:getResourceSymbolImages,
        getResourceSymbolImage:getResourceSymbolImage,
}

});
