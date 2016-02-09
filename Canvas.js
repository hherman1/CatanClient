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

function drawBoard(board,ctx) {

}


//takes the start and end points of the road and a color and draws it on the ctx
function drawRoad(verta,vertb,color,ctd) {

}

//takes the vertex coordinate, color, and building type and draws it on the ctx
function drawBuilding(vert,color,building,ctx) {

}

// takes the hexcoord and tiletype (includes number) and draws it on the ctx
function drawTile(hexcoord,tiletype,ctx) {

}

function drawRect(coords,side,ctx) {
        ctx.fillRect(coords.x,coords.y,side,side)
}
function hexPath(hexCoords,side,ctx) {
        ctx.beginPath()
        var verts = vertices(hexCoords);
        var start = center(vertexToCanvas(verts[0],side),ctx.canvas)
        ctx.moveTo(start.x,start.y)
        var mappingFunction = function(coord) {
               var point = center(vertexToCanvas(coord,side),ctx.canvas);
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
        coords = center(vertexToCanvas(vertexCoords,side),ctx.canvas);

        ctx.fillRect(coords.x,coords.y,10,10)
}

function center(coords,canvas) {
        return add(makeVector(canvas.width/2, canvas.height/2),coords)
}

function hexToCanvas(hexcoords,side) {
    return add(makeVector(-side/2,-side/2),piecewiseTimes(makeVector(side,-side),fromHex(hexcoords)))
}
function vertexToCanvas(vcoords,side) {
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
