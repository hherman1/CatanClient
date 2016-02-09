/* optional object
 * Board object:
 * {camera: {location:{x:int,y:int},
 *           zoom:int},
 *  vertices: [coords]
 *  hexes: [coords]
 *  }
 */


function drawBoard(board) {

}

function drawRect(coords,diameter,ctx) {
        ctx.fillRect(coords.x,coords.y,diameter,diameter)
}
function hexPath(hexCoords,diameter,ctx) {
        ctx.beginPath()
        var verts = vertices(hexCoords);
        var start = center(vertexToCanvas(verts[0],diameter),ctx.canvas)
        ctx.moveTo(start.x,start.y)
        var mappingFunction = function(coord) {
               var point = center(vertexToCanvas(coord,diameter),ctx.canvas);
               ctx.lineTo(point.x,point.y);
        }
        verts.map(mappingFunction)
        ctx.closePath();

}
function makeHex(hexCoords,diameter,ctx) {
        hexPath(hexCoords,diameter,ctx)
        ctx.fill();
}
function drawHexPoints(hexCoords,diameter,ctx) {
    var mappingFunction = function(coord) {
        drawVertex(coord,diameter,ctx);
    }
    var coordsList = vertices(hexCoords);
    coordsList.map(mappingFunction)
}
function drawVertex(vertexCoords,diameter,ctx) {
        coords = center(vertexToCanvas(vertexCoords,diameter),ctx.canvas);

        ctx.fillRect(coords.x,coords.y,10,10)
}

function center(coords,canvas) {
        return add(makeVector(canvas.width/2, canvas.height/2),coords)
}

function hexToCanvas(hexcoords,diameter) {
    return add(makeVector(-diameter/2,-diameter/2),piecewiseTimes(makeVector(diameter,-diameter),fromHex(hexcoords)))
}
function vertexToCanvas(vcoords,diameter) {
    return add(makeVector(-diameter,-diameter),piecewiseTimes(makeVector(diameter,-diameter),fromVertex(vcoords)))

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
