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
 *///^notes?

//CANVAS
//

function transformHitlist(boxes,trans) {
        return boxes.map(function(box){return transformHitbox(box,trans)})
}
function transformHitbox(box,trans) {
        return newHitbox(transform(box.center,trans)
                           ,times(trans.scale,box.dimension)
                           ,box.data
                           ,box.rotation)

}

function transform(v,trans) {
        return add(trans.translation,times(trans.scale,v))
}

function drawHitboxes(boxes,hits,ctx) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        boxes.map(function(box) {drawHitbox(box,ctx)});
        ctx.fillStyle = "rgba(255, 122, 0, 0.5)";
        hits.map(function(box){drawHitbox(box,ctx)});
}
function drawHitbox(box,ctx) {
        resetTransform(ctx);
        drawPath(boxCorners(box),ctx);
        ctx.fill();
        ctx.stroke();
}

function resetTransform(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
}
//Draws title of the canvas
//created by sduong
function drawTitle(ctx){
     ctx.font = "bold 36px Courier New";
     ctx.fillStyle = "coral";
     ctx.fillText("MacSettlers",ctx.canvas.width/100,ctx.canvas.height/10);
 }

function clearCanvas(ctx,transform) {
        var canvas = ctx.canvas;
        resetTransform(ctx);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTransform(ctx,transform);
}

function setTransform(ctx,transform) {
  ctx.setTransform(transform.scale,0,0,transform.scale,transform.translation.x,transform.translation.y)
}

function redraw(board,mouse,transform,animations,ctx) {
        clearCanvas(ctx,transform);
        drawBoard(board,transform,ctx);

        if(mouse.clicked) {
                animations.data.push(multiFrame(function(context,frames) {
                        context.rect(mouse.pos.x,mouse.pos.y,50 + frames,50 + frames);
                        context.fillStyle = "green";
                        context.fill();
                },100))
        }
        animations.data = pruneAnimations(animations.data);
        if(animations.data.length > 0)  {
                drawAnims(animations.data,ctx);
        }
}

//draws the board by calling on helper functions to generate hex coords, a dictionary of two lists that store 19 x and y coordinates.
//created by hherman, edited by sduong [IN PROGRESS]
function drawBoard(board,transform,ctx) {
        //Set transformation
  setTransform(ctx,transform);
  //setting the side of hexagon to be a value
  var side = 50;
  //create object holding 19 xy coordinates and w value
  //var hCoords = generateHexCoords(side,ctx);
  //console.log(hCoords); //check console ...it works!

  //array of possible resource terrains
  var resList = ["lumber","lumber","lumber","lumber",
                  "grain","grain","grain","grain",
                  "wool","wool","wool","wool",
                  "ore","ore","ore",
                  "brick","brick","brick","nothing"];
  //generate number tokens aka the possible dice outcomes
  var tokens = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12];

  //shuffleRT(resList,tokens); //shuffles the resources and tokesn so we get a new board each time!

  //console.log(tokens);
  
  ctx.fillStyle = "#FFDAB9";
  for (i in board){
    var tiletype = getResImg(resList[i]); //get the source path for the hexagon's terrain image
    hexPath(board[i].coordinates,side,ctx);
    ctx.fill();
    ctx.stroke();
//    drawSVG(tiletype,hexToWorld(board[i].coordinates,side), ctx);
 //   drawToken2(hexToWorld(board[i].coordinates,side*1.75),tokens[i],ctx); //draw number token

  }
  //store all terrain nodes in one place
  // var allTerrainNodes = {}; //there should be 19 of the node objects here
  // var allSettleSpaces = {}; //there should be 54 of the node objects here

  //we want to draw a hexagon at each of the hexagon coordinates...
  // for (var i = 0; i < hCoords.x.length; i++){
  //     var hcpair = [hCoords.x[i], hCoords.y[i], hCoords.z]; //individual hexagon coordinate with the z value (distance from center of hexagon to its left/right side)
  //     //tiletype here...will be the "image link" to superimpose it onto the hexagon...
  //     var tiletype = getResImg(getResList()[i]); //get the source path for the hexagon's terrain image
  //     allTerrainNodes[i] = TerrainNode(i,hcpair[0],hcpair[1],tokens[i],getResList()[i],null); //store all terrain data into this node except for the settle space data (set to null)
  //     drawTile(hcpair,tiletype,side,ctx); //draw terrain tile
  //     drawToken(resList[i],hcpair,tokens[i],ctx); //draw number token
  //
  //     //allSettleSpaces[i] = SettleSpaceNode(hcpair[0], hcpair[1], false, )//create the settle space nodes
  // }


}

function drawToken2(hc, token, ctx){
  var temp = hc;
  ctx.strokeStyle="black"; //draw a black border for the number
  ctx.lineWidth=1; //with width 1
  ctx.beginPath();
  ctx.fillStyle="beige"; //fill color of the token
  ctx.arc(temp.x+35,temp.y+20, 20, 0, 2*Math.PI); //draw the token circle
  ctx.fill();
  ctx.stroke();

  if (token != 99) {
    if (token == 6 || token == 8){
  		ctx.fillStyle="red";
    }
    else{
  		ctx.fillStyle="black";
    }
    ctx.font = "24px Times New Roman";
    ctx.fillText(String(token),temp.x+25,temp.y+25);

	} else{
      drawRobber(temp.x+30,temp.y+10,40,ctx);
	}
}

//draw them tokens
//created by sduong
// function drawToken(res,hcpair, token, ctx){
//     var xctx = hcpair[0]+hcpair[2]*1.2;
//     var yctx = hcpair[1]+hcpair[2]*1.2;
//     ctx.strokeStyle="black"; //draw a black border for the number
//   	ctx.lineWidth=1; //with width 1
//   	ctx.beginPath();
//     ctx.fillStyle="beige"; //fill color of the token
//   	ctx.arc(xctx,yctx, 20, 0, 2*Math.PI); //draw the token circle
//   	ctx.fill();
//   	ctx.stroke();
// 	if (res != "nothing") {
//     if (token == 6 || token == 8){
//   		ctx.fillStyle="red";
//     }
//     else{
//   		ctx.fillStyle="black";
//     }
//     ctx.font = "24px Times New Roman";
//     ctx.fillText(String(token),xctx-9,yctx+10);
//
// 	} else{
//       drawRobber(xctx,yctx,hcpair[2],ctx);
// 	}
// }

//shuffles the resources and number tokens and includes the robber to be set on the desert.
//created by sduong
function shuffleRT(resList,tokens){
  //shuffle them!
  shuffle(resList);
  shuffle(tokens);
  var temp = 0;
  for (var i in resList){
    if (resList[i] == "nothing"){
      tokens.splice(temp,0,99); //placing robber (99) on desert at the beginning of game
    }
    temp++;
  }
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


// takes the hexcoord and tiletype (includes number) and draws it on the ctx
function drawTile(hcpair,tiletype,side,ctx) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  //hexPath(hcpair,6,ctx); //not sure if this does anything?
  drawSVG(tiletype, hcpair,ctx);
  ctx.fill();
  ctx.stroke();

}

//generates an object that stores 19 x and y coordinates for the hexagons
//created by sduong
function generateHexCoords(side,ctx){
  var w = Math.sqrt(Math.pow(side,2)-Math.pow((side/2),2)); //half of the hexagon, from center to side
  var xco = [];
  var yco = [];

  //initial xy to place board
  var initx = ctx.canvas.width/3; //distance from left canvas border
  var inity = ctx.canvas.height/10; //distance from top canvas border

  //generate and x and y coordinates for 19 hexagons
  for (var i = 0; i < 19; i++){

    if (i < 3) { //first row of tiles
      xco.push(initx+2.3*w*i);
      yco.push(inity);

    } else if (i < 7){ //second row
      xco.push(initx-2.3*side+2.3*w*(i-2.35));
      yco.push(inity+1.5*side);

    } else if (i < 12){ //third row
      xco.push(initx-4.6*side+2.3*w*(i-5.7)); //5.7 = arbitrary numbers that work through trial & error. I need to work on how to get a system down for this.
      yco.push(inity+3*side);

    } else if (i < 16){ //fourth row
      xco.push(initx-2.3*side+2.3*w*(i-11.36));
      yco.push(inity+4.5*side);
    }
    else{ //last row
      xco.push(initx+2.3*w*(i-16.02));
      yco.push(inity+6*side);
    }}

  //to check the array of coordinate values
  //console.log(xco.length,yco.length);
  var hexCoords = {
    x:xco,
    y:yco,
    z: w
  };
  return hexCoords;
}

//draws the image of the terrain on the board
function drawSVG(path, hc,ctx){
  var img = new Image(); //create new image element
  img.src = path; //set source path
  var x = hc.x-8;
  var y = hc.y-31;
  var scale = 100;
  ctx.drawImage(img, x, y, scale-10, scale);
}
///////////////////////////////////////////////////////////////////////////////
function drawRect(coords,side,ctx) {
        ctx.fillRect(coords.x,coords.y,side,side)
}

function drawPath(verts,ctx) {
        ctx.beginPath()
        var start = verts[0]
        ctx.moveTo(start.x,start.y)
        var mappingFunction = function(coord) {
               ctx.lineTo(coord.x,coord.y);
        }
        verts.map(mappingFunction)
        ctx.closePath();
}

function hexPath(hexCoords,side,ctx) {
        var verts = vertices(hexCoords).map(function(c) {
                return vertexToWorld(c,side);
        })
        drawPath(verts,ctx)
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
        coords = vertexToCanvas(vertexCoords,side),ctx.canvas;

        ctx.fillRect(coords.x,coords.y,10,10)
}

