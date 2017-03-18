import * as Grid from "./Grid"
import * as BoardState from "./BoardState"
import * as Player from "./Player"
import * as Transform from "./Transform"
//SETTLEMENT
//
//

let images = {
        Loaded:{
                Settlements:<HTMLImageElement[]>[],
                Cities:<HTMLImageElement[]>[],
                Roads:<HTMLImageElement[]>[],
                Resources:<HTMLImageElement[]>[],
                ResourceSymbols:<HTMLImageElement[]>[],
                Robber:<HTMLImageElement|undefined>undefined,
                LongestRoad:<HTMLImageElement|undefined>undefined,
        },
        Settlements:<string[]>[],

        Cities:<string[]>[],

        Roads:<string[]>[],

        Resources:<string[]>[],

        ResourceSymbols:<string[]>[],

        Robber:"",

        LongestRoad:""
}
// let images:Images = {
//     Loaded: {
//         Settlements:[]
//     }
// };

images.Robber = '../graphics/swiper.svg';
images.Loaded.Robber = loadImage(images.Robber);

images.LongestRoad = '../graphics/longestroad.svg';
images.Loaded.LongestRoad = loadImage(images.LongestRoad);

images.Settlements[Player.Colors.Red]     = '../graphics/reds.svg';
images.Settlements[Player.Colors.Orange]  = '../graphics/oranges.svg';
images.Settlements[Player.Colors.Blue]    = '../graphics/blues.svg';
images.Settlements[Player.Colors.Green]   = '../graphics/whites.svg';
images.Settlements[Player.Colors.White]   = '../graphics/buildingcosts.svg';
images.Loaded.Settlements = images.Settlements.map(loadImage);

images.Cities[Player.Colors.Red]      = '../graphics/redc.svg';
images.Cities[Player.Colors.Orange]   = '../graphics/orangec.svg';
images.Cities[Player.Colors.Blue]     = '../graphics/bluec.svg';
images.Cities[Player.Colors.Green]    = '../graphics/whitec.svg';
images.Cities[Player.Colors.White]   = '../graphics/buildingcostc.svg';
images.Loaded.Cities = images.Cities.map(loadImage);

images.Roads[Player.Colors.Red]     = '../graphics/redr.svg';
images.Roads[Player.Colors.Orange]  = '../graphics/oranger.svg';
images.Roads[Player.Colors.Blue]    = '../graphics/bluer.svg';
images.Roads[Player.Colors.Green]   = '../graphics/whiter.svg';
images.Roads[Player.Colors.White]   = '../graphics/buildingcostr.svg';
images.Loaded.Roads = images.Roads.map(loadImage);


//'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg';
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Lumber] = '../graphics/forest.png';
//'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Grain] = '../graphics/field.svg';
//'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg';
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Wool] = '../graphics/pasture.svg';
//'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';
//quarry: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Bethesda-Mine-07367u.jpg';
//labeled for noncommercial reuse

images.Resources[BoardState.Resource.Ore] = '../graphics/quarry.png';
//'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg'
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Brick] = '../graphics/hills.svg';
//"https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Desert] = '../graphics/desert.svg';
images.Loaded.Resources = images.Resources.map(loadImage);

images.ResourceSymbols[BoardState.Resource.Lumber] = '../graphics/WOODS.svg';
images.ResourceSymbols[BoardState.Resource.Grain] = '../graphics/wheatsymbol.svg';
images.ResourceSymbols[BoardState.Resource.Wool] = '../graphics/WOOL.svg';
images.ResourceSymbols[BoardState.Resource.Ore] = '../graphics/oresymbol.svg';
images.ResourceSymbols[BoardState.Resource.Brick] = '../graphics/bricksymbol.svg';
images.Loaded.ResourceSymbols = images.ResourceSymbols.map(loadImage);

export function getGameImages() {
        return images.Loaded;
}

export function getLoadedImages() {
        var out:HTMLImageElement[] = [];
        if(images.Loaded.LongestRoad && images.Loaded.Robber) {
            out = out.concat(images.Loaded.Cities,images.Loaded.LongestRoad,images.Loaded.Resources,images.Loaded.ResourceSymbols,
                    images.Loaded.Roads,images.Loaded.Robber,images.Loaded.Settlements);
        }
        return out;
}

export function loadImage(src:string) {
        var out = new Image();
        out.src = src;
        return out;
}

export function drawRoad(coordinateA:Grid.Point,coordinateB:Grid.Point,color:Player.Colors,ctx:CanvasRenderingContext2D) {
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

export function drawBuilding(coordinate:Grid.Point,structure:BoardState.Structure,color:Player.Colors,side:number,ctx:CanvasRenderingContext2D){
    var worldCoord = Grid.vertexToWorld(coordinate,side);
    ctx.drawImage(getBuildingImg(structure, color)
                , worldCoord.x-side/2, worldCoord.y-side/2
                , side, side*0.75); //need to adjust width and height of the building rendered...right now its set to w=side and h=side*0.75
}
export function drawStructure(structure:BoardState.Structure,color:Player.Colors,side:number,ctx:CanvasRenderingContext2D){
    ctx.drawImage(getBuildingImg(structure, color)
                , -side/2, -side/2
                , side, side*0.75); //need to adjust width and height of the building rendered...right now its set to w=side and h=side*0.75
}

/* drawRobber
 * Given coordinates, scale and a context, draws the image of the robber.
 */

export function drawRobber(x:number,y:number, z:number, ctx:CanvasRenderingContext2D){
    let robber = getRobberImg();
    if(robber) {
        ctx.drawImage(robber, x-30, y-(z*0.75), z*1.2, z*1.5);
    }
}

export function getRobberImg() {
        return images.Loaded.Robber;
}


export function getBuildingImg(settletype:BoardState.Structure, playerColor:Player.Colors){
  //still needs work...i will have to spend some time resizing these photos somehow
  switch(settletype) {
        case BoardState.Structure.Settlement:
            return images.Loaded.Settlements[playerColor];
        case BoardState.Structure.City:
            return images.Loaded.Cities[playerColor];
        case BoardState.Structure.Road:
            return images.Loaded.Roads[playerColor];
  }
}

export function getResourceImage(resourceType:BoardState.Resource) {
  return images.Loaded.Resources[resourceType];
}

export function getResourceSymbolImages() {
        return images.Loaded.ResourceSymbols;
}
export function getResourceSymbolImage(resource:BoardState.Resource) {
  return images.Loaded.ResourceSymbols[resource];
}


//wood image src: https://static.pexels.com/photos/5766/wood-fireplace-horizontal.jpg
//bricks image src: https://pixabay.com/static/uploads/photo/2013/07/25/12/07/bricks-167072_960_720.jpg
//wool image src: http://s0.geograph.org.uk/geophotos/02/40/15/2401511_d55c4dac.jpg
//grain image src: https://c1.staticflickr.com/5/4038/4525119513_1ec891529b_b.jpg
//ore image src: https://upload.wikimedia.org/wikipedia/commons/5/52/Gold-Quartz-273364.jpg


