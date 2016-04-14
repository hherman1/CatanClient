/*
 * CANVAS.JS
 *Canvas.js contains functions to draw/render objects onto the window.
 */

// wrapText function from: http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        y+= lineHeight;

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
     }

function drawStructures(vertices,colorMap,side,ctx) {
    vertices.forEach(function(vertex) {
            drawBuilding(vertex.coordinate,vertex.structure,colorMap[vertex.playerID],side,ctx);
    })
}

function drawRoads(roads,colorMap,side,ctx) {
    roads.forEach(function(road) {
            if(road.structure == Structure.Road) {
                    drawRoad(road.coord1,road.coord2,colorMap[road.playerID],side,ctx);
            }
    })
}


function transform(v,trans) {
        return add(trans.translation,times(trans.scale,v))
}

function inverseTransform(v,trans) {
        return times((1/trans.scale),add(times(-1,trans.translation),v))
}

function drawHitboxes(boxes,hits,ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(45,45,45,0.8)";
        ctx.fillStyle = "rgba(90, 172, 86, 0.3)";
        boxes.map(function(box) {drawHitbox(box,ctx)});
        ctx.fillStyle = "rgba(141, 207, 138, 0.5)";
        hits.map(function(box){drawHitbox(box,ctx)});
}
function drawHitbox(box,ctx) {
        resetTransform(ctx);
        if(box.type == Hitbox.Type.Box) {
                drawPath(boxCorners(box),ctx);
        } else if (box.type == Hitbox.Type.Circle) {
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
        setTransform(transform,ctx);
}

function setTransform(transform,ctx) {
        ctx.setTransform(transform.scale,0,0,transform.scale,transform.translation.x,transform.translation.y)
}

function redraw(gamestate,potentialAction,actions,transform,animations,side,ctx) {
        var colorMap = getPlayerColors(gamestate.players);
        var currentPlayerColor = colorMap[gamestate.currentPlayerID];

        var renderedActions;
        if(potentialAction != null) {
               renderedActions = removeRedundantSettlements(actions.concat(potentialAction));
               renderedActions.push(potentialAction);
        } else {
               renderedActions = removeRedundantSettlements(actions);
        }

        clearCanvas(ctx,transform);

        var renderTree = new TransformNode(transform);
        renderTree.addChild(assembleRenderTree(gamestate,renderedActions,colorMap,gamestate.currentPlayerID,side));
        drawNode(renderTree,ctx);

        animations.data = pruneAnimations(animations.data);
        if(animations.data.length > 0)  {
                drawAnims(animations.data,transform,ctx);
        }
}


function removeRedundantSettlements(actions) {
        return actions.filter(function(a) {
                if(a.type == Action.Type.BuildSettlement) {
                        return !willActAt(actions,Action.Type.BuildCity,a.coordinate);
                }
                return true;
        });
}



//draws the image of the terrain on the board
//created by sduong
function drawHexImage(image, side, ctx){
  var w = Math.sqrt(Math.pow(side,2)-Math.pow((side/2),2));
  var x = -1 * w;
  var y = -1 * side;
  var scale = side*2;
  ctx.drawImage(image, x, y, scale-12, scale);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function hexPath(side,ctx) {
        var verts = vertices(new Vector(0,0)).map(function(c) {
                return vertexToWorld(c,side);
        })
        drawPath(verts,ctx);
}


function drawHexPoints(hexCoords,side,ctx) {
    var mappingFunction = function(coord) {
        drawVertex(coord,side,ctx);
    }
    var coordsList = vertices(hexCoords);
    coordsList.map(mappingFunction)
}


function drawVertex(vertexCoords,side,ctx) {
        coords = vertexToWorld(vertexCoords,side);
        ctx.fillRect(coords.x,coords.y,10,10)
}
