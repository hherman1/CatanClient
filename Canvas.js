function drawRect(coords,diameter,ctx) {
        ctx.fillRect(coords.x,coords.y,diameter,diameter)
}
function drawHex(hexCoords,diameter,ctx) {
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
        return add(makePoint(canvas.width/2, canvas.height/2),coords)
}

function hexToCanvas(hexcoords,diameter) {
    return add(makePoint(-diameter/2,-diameter/2),piecewiseTimes(makePoint(diameter,-diameter),fromHex(hexcoords)))
}
function vertexToCanvas(vcoords,diameter) {
    return add(makePoint(-diameter,-diameter),piecewiseTimes(makePoint(diameter,-diameter),fromVertex(vcoords)))

}

unitY = makePoint(Math.cos(Math.PI/3),Math.sin(Math.PI/3));
function fromVertex(vcoords) {
    yunits = times(Math.ceil(vcoords.y/2),makePoint(Math.cos(Math.PI/6),Math.sin(Math.PI/6)));
    regunits = 2*Math.floor(vcoords.y/2) * Math.sin(Math.PI/6);
    xdelta = 2*vcoords.x*Math.cos(Math.PI/6)
    return add(makePoint(xdelta,regunits),yunits);
}
function fromHex(hexcoords) {
    return add(identX(hexcoords.x),
                     times(hexcoords.y,unitY))
}
