/*
 * board data:
 * {buildings: [(coords,(color,building))]
 *  roads:[(coords,coords,color)],
 *  tiles: [(vector,tiletype)],
 *  }
 * Goal: become capable of rendering board objects
 *
 * Next Steps:
 * - Render Thiefs
 * - Render trade ports
 * - ?
 */

//Draws title of the canvas
//created by sduong
function drawTitle(ctx){
     ctx.font = "bold 36px Courier New";
     ctx.fillStyle = "coral";
     ctx.fillText("MacSettlers",ctx.canvas.width/100,ctx.canvas.height/10);
 }

//draws the board by calling on helper functions to generate hex coords, a dictionary of two lists that store 19 x and y coordinates.
//created by hherman, edited by sduong [IN PROGRESS]
function drawBoard(ctx) {
  //setting the side of hexagon to be a value
  var side = 50;
  //create object holding 19 xy coordinates
  var hCoords = generateHexCoords(side);
  console.log(hCoords); //check console ...it works!
  //array of possible resource terrains
  var resList = ["lumber","lumber","lumber","lumber",
                  "grain","grain","grain","grain",
                  "wool","wool","wool","wool",
                  "ore","ore","ore",
                  "brick","brick","brick","nothing"];
  //generate number tokens
  var tokens = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12];
  //shuffle them!
  shuffle(resList);
  shuffle(tokens);

  console.log(resList);
  var temp = 0;
  for (var i in resList){
    
    temp++;
    if (i == "nothing"){
      tokens.splice(temp,0,99); //placing robber on desert
    }
  }
  console.log(tokens);


  for (var i = 0; i < hCoords.x.length; i++){
      var hcpair = [hCoords.x[i],hCoords.y[i]];

      //tiletype here...will be the "image link" to superimpose it onto the hexagon...
      var tiletype = getResImg(resList[i]);
      drawTile(hcpair,tiletype,ctx);
  }
}

function getResImg(res){
  //still needs work...i will have to spend some time resizing these photos somehow
  var resources = {};
  resources.lumber = 'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg'; //labeled for noncommercial reuse
  resources.grain = 'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';//labeled for noncommercial reuse
  resources.wool = 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg'; //labeled for noncommercial reuse
  resources.ore = 'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';//labeled for noncommercial reuse
  resources.brick = 'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg';//labeled for noncommercial reuse
  resources.nothing = "https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg"; //labeled for noncommercial reuse
  return resources[res];

}

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

//generates an object that stores 19 x and y coordinates for the hexagons
function generateHexCoords(side){
  var w = Math.sqrt(Math.pow(side,2)-Math.pow((side/2),2)); //half of the hexagon, from center to side
  var xco = [];
  var yco = [];

  //initial xy to place board
  var initx = canvas.width/5; //distance from left canvas border
  var inity = canvas.height/3.5; //distance from top canvas border

  //generate and x and y coordinates for 19 hexagons
  for (var i = 0; i < 19; i++){
  if (i < 3) { //first row of tiles
    xco.push(initx+2*w*i);
    yco.push(inity);

  } else if (i < 7){ //second row
    xco.push(initx-2*side+2*w*(i-2.35));
    yco.push(inity+1.5*side);

  } else if (i < 12){ //third row
    xco.push(initx-4*side+2*w*(i-5.7)); //5.7 = arbitrary numbers that work through trial & error. I need to work on how to get a system down for this.
    yco.push(inity+3*side);

  } else if (i < 16){ //fourth row
    xco.push(initx-2*side+2*w*(i-11.36));
    yco.push(inity+4.5*side);
  }
  else{ //last row
    xco.push(initx+2*w*(i-16.02));
    yco.push(inity+6*side);
  }}

  //to check the array of coordinate values
  console.log(xco.length,yco.length);
  var hexCoords = {
    x:xco,
    y:yco
  };
  return hexCoords;
}


//takes the start and end points of the road and a color and draws it on the ctx
function drawRoad(verta,vertb,color,ctd) {

}

//takes the vertex coordinate, color, and building type and draws it on the ctx
function drawBuilding(vert,color,building,ctx) {

}

// takes the hexcoord and tiletype (includes number) and draws it on the ctx
function drawTile(hexcoord,tiletype,ctx) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  hexPath(hexcoord,6,ctx);
  //polygon(ctx, xco[i],yco[i],side,6,-Math.PI/2);
  //ctx.fillStyle=color;
  ctx.fill();
  ctx.stroke();


}

function drawRect(coords,side,ctx) {
        ctx.fillRect(coords.x,coords.y,side,side)
}

function hexPath(hexCoords,side,ctx) {
        ctx.beginPath()
        var verts = vertices(hexCoords);
        var start = worldToCanvas(vertexToWorld(verts[0],side),ctx.canvas)
        ctx.moveTo(start.x,start.y)
        var mappingFunction = function(coord) {
               var point = worldToCanvas(vertexToWorld(coord,side),ctx.canvas);
               ctx.lineTo(point.x,point.y);
        }
        verts.map(mappingFunction)
        ctx.closePath();

}

function makeHex(hexCoords,side,ctx) {
        hexPath(hexCoords,side,ctx)
        ctx.fill();
}

function drawHexPoints(hexCoords,side,ctx) {
    var mappingFunction = function(coord) {
        drawVertex(coord,side,ctx);
    }
    var coordsList = vertices(hexCoords);
    coordsList.map(mappingFunction)
}

function drawVertex(vertexCoords,side,ctx) {
        coords = worldToCanvas(vertexToCanvas(vertexCoords,side),ctx.canvas);

        ctx.fillRect(coords.x,coords.y,10,10)
}

function worldToCanvas(coords,canvas) {
        return add(makeVector(canvas.width/2, canvas.height/2),coords)
}

function hexToWorld(hexcoords,side) {
    return add(makeVector(-side/2,-side/2),piecewiseTimes(makeVector(side,-side),fromHex(hexcoords)))
}
function vertexToWorld(vcoords,side) {
    return add(makeVector(-side,-side),piecewiseTimes(makeVector(side,-side),fromVertex(vcoords)))

}

unitY = makeVector(Math.cos(Math.PI/3),Math.sin(Math.PI/3));

function fromVertex(vcoords) {
    yunits = times(Math.ceil(vcoords.y/2),makeVector(Math.cos(Math.PI/6),Math.sin(Math.PI/6)));
    regunits = 2*Math.floor(vcoords.y/2) * Math.sin(Math.PI/6);
    xdelta = 2*vcoords.x*Math.cos(Math.PI/6)
    return add(makeVector(xdelta,regunits),yunits);
}

function fromHex(hexcoords) {
    return add(identX(hexcoords.x),
                     times(hexcoords.y,unitY))
}
