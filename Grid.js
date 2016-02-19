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
