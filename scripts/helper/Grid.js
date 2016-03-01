/* Vector object:
 * {x: int, y: int}
 *
 */

 //This is a test line. Please delete it when you find it!
 //

function dotProduct(v1,v2) {
        return sum(piecewiseTimes(v1,v2))
}

function sum(v) {
        return v.x + v.y
}

function ident(v) {
        return makeVector(v,v)
}
function identX(x) {
        return makeVector(x,0)
}
function identY(y) {
        return makeVector(0,y)
}
function setX(x,c) {
        c.x = x;
        return c
}
function setY(c,y) {
        c.y = y;
        return c
}

function makeVector(x,y) {
        return {x:x,y:y}
}

function compareVectors(vector1, vector2){
    if((vector1.x == vector2.x)&&(vector1.y==vector2.y)){
        return true;
    }
    return false;
}

function add(c1,c2) {
        return makeVector(c1.x + c2.x,
                         c1.y + c2.y)
}
function times(s,c) {
        return piecewiseTimes(ident(s),c)
}

function piecewiseTimes(c1,c2) {
        return makeVector(c1.x*c2.x,
                         c1.y*c2.y)
}

function center(vector) {
    return times(0.5,vector);
}

function norm(vector) {
        return Math.sqrt(vector.x*vector.x + vector.y*vector.y)
}

function unitVector(theta) {
        return makeVector(Math.cos(theta),Math.sin(theta))
}
function rotationMatrix(theta) {
        return makeVector(makeVector(Math.cos(theta),-Math.sin(theta)),makeVector(Math.sin(theta),Math.cos(theta)))
}
function multiplyMatrix(mat,vec) {
        return makeVector(dotProduct(mat.x,vec),dotProduct(mat.y,vec))
}

function vertices(hexCoords) {
        return [piecewiseTimes(makeVector(1,2),hexCoords)
                ,add(identY(1),piecewiseTimes(makeVector(1,2),hexCoords))
                ,add(identX(1),piecewiseTimes(makeVector(1,2),hexCoords))
                ,add(makeVector(1,-1),piecewiseTimes(makeVector(1,2),hexCoords))
                ,add(makeVector(1,-2),piecewiseTimes(makeVector(1,2),hexCoords))
                ,add(identY(-1),piecewiseTimes(makeVector(1,2),hexCoords))]
}


function neighbours(hexcoords) {
    return[ add(makeVector(0,1),hexcoords),
            add(makeVector(1,0),hexcoords),
            add(makeVector(1,-1),hexcoords),
            add(makeVector(0,-1),hexcoords),
            add(makeVector(-1,0),hexcoords),
            add(makeVector(-1,1),hexCoords)]
}



function hexPoints(coords,radius) {
    var out = [];
    out.push(add(xIdent(-radius),coords));
    out.push(add(times(-radius,unitY),coords));
    out.push(add(piecewiseTimes(makeVector(radius,-radius),
                                unitY),
                 coords));
    out.push(add(xIdent(radius),coords));
    out.push(add(times(radius,unitY),coords));
    out.push(add(piecewiseTimes(makeVector(-radius,radius),
                                unitY),
                 coords));
    return out
}

function hexToWorld(hexcoords,side) {
    return piecewiseTimes(makeVector(Math.cos(Math.PI/6)*side*2,2*-side*Math.sin(Math.PI/3)),fromHex(hexcoords))
}
function vertexToWorld(vcoords,side) {
    return add(makeVector(-side*Math.sin(Math.PI/3),-side/2),piecewiseTimes(makeVector(side,-side),fromVertex(vcoords)))

}


unitY = unitVector(Math.PI/3)

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


