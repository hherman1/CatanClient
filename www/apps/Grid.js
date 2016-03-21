/* Vector object:
 * {x: int, y: int}
 *
 */

 //This is a test line. Please delete it when you find it!
 //

Vector = function(x,y) {
        return {x:x,y:y}
}

function dotProduct(v1,v2) {
        return sum(piecewiseTimes(v1,v2))
}

function sum(v) {
        return v.x + v.y
}

function ident(v) {
        return new Vector(v,v)
}
function identX(x) {
        return new Vector(x,0)
}
function identY(y) {
        return new Vector(0,y)
}
function setX(x,c) {
        c.x = x;
        return c
}
function setY(c,y) {
        c.y = y;
        return c
}


function compareVectors(vector1, vector2){
    if((vector1.x == vector2.x)&&(vector1.y==vector2.y)){
        return true;
    }
    return false;
}

function add(c1,c2) {
        return new Vector(c1.x + c2.x,
                         c1.y + c2.y)
}
function times(s,c) {
        return piecewiseTimes(ident(s),c)
}

function piecewiseTimes(c1,c2) {
        return new Vector(c1.x*c2.x,
                         c1.y*c2.y)
}

function center(vector) {
    return times(0.5,vector);
}

function norm(vector) {
        return Math.sqrt(vector.x*vector.x + vector.y*vector.y)
}

function unitVector(theta) {
        return new Vector(Math.cos(theta),Math.sin(theta))
}
function rotationMatrix(theta) {
        return new Vector(new Vector(Math.cos(theta),-Math.sin(theta)),new Vector(Math.sin(theta),Math.cos(theta)))
}
function multiplyMatrix(mat,vec) {
        return new Vector(dotProduct(mat.x,vec),dotProduct(mat.y,vec))
}

function even(n) {
        return n%2 == 0
}

function vertexNeighbors(vertex) {
        if(even(vertex.y)) {
            return [add(new Vector(0,1),vertex),
                    add(new Vector(-1,1),vertex),
                    add(new Vector(0,-1),vertex)]
        } else {
            return [add(new Vector(0,1),vertex),
                    add(new Vector(0,-1),vertex),
                    add(new Vector(1,-1),vertex)]
        }
}

function vertices(hexCoords) {
        return [piecewiseTimes(new Vector(1,2),hexCoords)
                ,add(identY(1),piecewiseTimes(new Vector(1,2),hexCoords))
                ,add(identX(1),piecewiseTimes(new Vector(1,2),hexCoords))
                ,add(new Vector(1,-1),piecewiseTimes(new Vector(1,2),hexCoords))
                ,add(new Vector(1,-2),piecewiseTimes(new Vector(1,2),hexCoords))
                ,add(identY(-1),piecewiseTimes(new Vector(1,2),hexCoords))]
}


function neighbours(hexcoords) {
    return[ add(new Vector(0,1),hexcoords),
            add(new Vector(1,0),hexcoords),
            add(new Vector(1,-1),hexcoords),
            add(new Vector(0,-1),hexcoords),
            add(new Vector(-1,0),hexcoords),
            add(new Vector(-1,1),hexCoords)]
}



function hexPoints(coords,radius) {
    var out = [];
    out.push(add(xIdent(-radius),coords));
    out.push(add(times(-radius,unitY),coords));
    out.push(add(piecewiseTimes(new Vector(radius,-radius),
                                unitY),
                 coords));
    out.push(add(xIdent(radius),coords));
    out.push(add(times(radius,unitY),coords));
    out.push(add(piecewiseTimes(new Vector(-radius,radius),
                                unitY),
                 coords));
    return out
}

function hexToWorld(hexcoords,side) {
    return piecewiseTimes(new Vector(Math.cos(Math.PI/6)*side*2,2*-side*Math.sin(Math.PI/3)),fromHex(hexcoords))
}
function vertexToWorld(vcoords,side) {
    return add(new Vector(-side*Math.sin(Math.PI/3),-side/2),piecewiseTimes(new Vector(side,-side),fromVertex(vcoords)))

}


unitY = unitVector(Math.PI/3)

function fromVertex(vcoords) {
    yunits = times(Math.ceil(vcoords.y/2),new Vector(Math.cos(Math.PI/6),Math.sin(Math.PI/6)));
    regunits = 2*Math.floor(vcoords.y/2) * Math.sin(Math.PI/6);
    xdelta = 2*vcoords.x*Math.cos(Math.PI/6)
    return add(new Vector(xdelta,regunits),yunits);
}

function fromHex(hexcoords) {
    return add(identX(hexcoords.x),
                     times(hexcoords.y,unitY))
}


