/*
 * CANVAS.JS
 *Canvas.js contains functions to draw/render objects onto the window.
 */

//requirejs(['Grid','Hitbox','Animation'],function(){})

//Draws title of the canvas
//created by sduong
function drawTitle(ctx){
     resetTransform(ctx);
     ctx.font = "bold 24px Courier New";
     ctx.fillStyle = "coral";
     ctx.fillText("MacSettlers",ctx.canvas.width/100,ctx.canvas.height/20);
 }

 //draws the board by calling on helper functions to generate hex coords, a dictionary of two lists that store 19 x and y coordinates.
 //created by hherman, edited by sduong [IN PROGRESS]
 function drawBoard(board,transform,ctx) {
         //Set transformation
   setTransform(ctx,transform);
   //setting the side of hexagon to be a value
   var side = 50;

   for (i in board){
     var tiletype = getResImg(board[i].resource); //get the source path for the hexagon's terrain image
     hexPath(board[i].coordinates,side,ctx);
     ctx.strokeStyle = "black";
     ctx.fillStyle = "#FFDAB9";
     ctx.fill();
     ctx.stroke();
     drawSVG(tiletype,hexToWorld(board[i].coordinates,side), ctx);
     drawToken(hexToWorld(board[i].coordinates,side),board[i].token,ctx); //draw number token
   }
 }

function transformHitlist(boxes,trans) {
        return boxes.map(function(box){return transformHitbox(box,trans)})
}
function transformHitbox(box,trans) {
        if(box.type == Box.box) {
                return newHitbox(transform(box.center,trans)
                           ,times(trans.scale,box.dimension)
                           ,box.data
                           ,box.rotation)
        } else if (box.type == Box.circle) {
                return newHitcircle(transform(box.center,trans)
                                   ,trans.scale * box.radius
                                   ,box.data)
        }

}

function transform(v,trans) {
        return add(trans.translation,times(trans.scale,v))
}

function inverseTransform(v,trans) {
        return times((1/trans.scale),add(times(-1,trans.translation),v))
}

function drawHitboxes(boxes,hits,ctx) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        boxes.map(function(box) {drawHitbox(box,ctx)});
        ctx.fillStyle = "rgba(255, 122, 0, 0.3)";
        hits.map(function(box){drawHitbox(box,ctx)});
}
function drawHitbox(box,ctx) {
        resetTransform(ctx);
        if(box.type == Box.box) {
                drawPath(boxCorners(box),ctx);
        } else if (box.type == Box.circle) {
                ctx.beginPath();
                ctx.arc(box.center.x,box.center.y,box.radius,0,2*Math.PI,0);
        }
        ctx.fill();
        ctx.stroke();
}

function resetTransform(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        drawTitle(ctx);
        drawBoard(board,transform,ctx);
        var test = mouse.pos.x.valueOf();
        var rest = mouse.pos.y.valueOf();
        var vec = makeVector(test,rest);
        vec = inverseTransform(vec,transform);

        if(mouse.clicked) {
                // draw a square where clicked in world
                animations.data.push(multiFrame(function(context,frames) {
                        setTransform(context,transform);
                        context.fillStyle = "rgba(0, 255, 0, 0.5)";
                        context.fillRect(vec.x,vec.y,2*Math.sqrt(frames),2*Math.sqrt(frames));
                },1000))

                // move the view to the right
                animations.data.push(multiFrame(function(context,frames) {
                        transform.translation.x += 1/(1 + Math.exp(-frames/100));
                },100))
        }
        animations.data = pruneAnimations(animations.data);
        if(animations.data.length > 0)  {
                drawAnims(animations.data,ctx);
        }
}


function drawToken(hc, token, ctx){
  var temp = hc;
  ctx.strokeStyle="black"; //draw a black border for the number
  ctx.lineWidth=1; //with width 1
  ctx.beginPath();
  ctx.fillStyle="beige"; //fill color of the token
  ctx.arc(temp.x,temp.y, 20, 0, 2*Math.PI); //draw the token circle
  ctx.fill();
  ctx.stroke();
  if (token != 7) {
    if (token == 6 || token == 8){
  		ctx.fillStyle="red";
    }
    else{
  		ctx.fillStyle="black";
    }
    ctx.font = "24px Times New Roman";
    ctx.fillText(String(token),temp.x-6,temp.y+5);

	} else{
      drawRobber(temp.x,temp.y,40,ctx);
	}
}



//draws the image of the terrain on the board
//created by sduong
function drawSVG(path, hc,ctx){
  var img = new Image(); //create new image element
  img.src = path; //set source path
  var side = 50;
  var w = Math.sqrt(Math.pow(side,2)-Math.pow((side/2),2));
  var x = hc.x-w;
  var y = hc.y-side;
  var scale = side*2;
  ctx.drawImage(img, x, y, scale-12, scale);
  //console.log("image is being drawn");
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////
//not called?
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
        drawPath(verts,ctx);
}

//not called
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
