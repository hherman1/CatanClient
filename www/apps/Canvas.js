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


function drawHexes(gamestate,scale,ctx) {
        var tree = new ScaleNode(scale);
        tree.addChildren(makeHexNodes(gamestate.board.hexes));
        drawNode(tree,ctx);
}


function generateHexCanvas(gamestate,scale) {
        var $canvas = $("<canvas></canvas>");
        $canvas.attr("width","500");
        $canvas.attr("height","500");
        var ctx = $canvas[0].getContext("2d");
        ctx.translate(250,250);
        drawHexes(gamestate,scale,ctx);
        return $canvas[0];
}

function redraw(gamestate,highlight,graphics,side,ctx) {
        var colorMap = getPlayerColors(gamestate.players);
        var currentPlayerColor = colorMap[gamestate.currentPlayerID];

        var hexes = gamestate.board.hexes;
        var roads = gamestate.board.roads;
        var vertices = gamestate.board.vertices;

        if(highlight != null) {
                switch(highlight.type) {
                        case Position.Type.Road:
                                roads = roads.filter(notEqualPositionCoordinatesFilter(highlight))
                                             .concat(highlight);
                                break;
                        case Position.Type.Vertex:
                                vertices = vertices.filter(notEqualPositionCoordinatesFilter(highlight))
                                                   .concat(highlight);
                                break;
                }
        }

        clearCanvas(ctx,graphics.transform);

        var renderTree = new TransformNode(graphics.transform);
        renderTree.addChild(new RadialGradientNode(side*20,"#77B2EB","blue"));
        renderTree.addChild(new CenteredImageNode(graphics.renderedHexes));

        var scaled = new ScaleNode(side);
        scaled.addChildren(makeRoadNodes(roads,colorMap));
        scaled.addChildren(makeVertexNodes(vertices,colorMap));
        renderTree.addChild(scaled);
        drawNode(renderTree,ctx);

        graphics.animations.data = pruneAnimations(graphics.animations.data);
        if(graphics.animations.data.length > 0)  {
                drawAnims(graphics.animations.data,graphics.transform,ctx);
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
function drawHexImage(image, ctx){
  var w = Math.sqrt(Math.pow(1,2)-Math.pow((1/2),2));
  var x = -1 * w;
  var y = -1;
  var scale = 2;
  ctx.drawImage(image, x, y, scale - 6/25, scale);
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

function linePath(start,end,ctx) {
        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);
}
