function ident(v) {
        return makePoint(v,v)
}
function identX(x) {
        return makePoint(x,0)
}
function identY(y) {
        return makePoint(0,y)
}
function setX(x,c) {
        c.x = x;
        return c
}
function setY(c,y) {
        c.y = y;
        return c
}

function makePoint(x,y) {
        return {x:x,y:y}
}

function add(c1,c2) {
        return makePoint(c1.x + c2.x,
                         c1.y + c2.y)
}
function times(s,c) {
        return piecewiseTimes(ident(s),c)
}

function piecewiseTimes(c1,c2) {
        return makePoint(c1.x*c2.x,
                         c1.y*c2.y)
}

function vertices(hexCoords) {
        return [piecewiseTimes(makePoint(1,2),hexCoords)
                ,add(identY(1),piecewiseTimes(makePoint(1,2),hexCoords))
                ,add(identX(1),piecewiseTimes(makePoint(1,2),hexCoords))
                ,add(identY(-1),piecewiseTimes(makePoint(1,2),hexCoords))
                ,add(makePoint(1,-1),piecewiseTimes(makePoint(1,2),hexCoords))
                ,add(makePoint(1,-2),piecewiseTimes(makePoint(1,2),hexCoords))]
}


function neighbours(hexcoords) {
    return[ add(makePoint(0,1),hexcoords),
            add(makePoint(1,0),hexcoords),
            add(makePoint(1,-1),hexcoords),
            add(makePoint(0,-1),hexcoords),
            add(makePoint(-1,0),hexcoords),
            add(makePoint(-1,1),hexCoords)]
}



function hexPoints(coords,radius) {
    var out = [];
    out.push(add(xIdent(-radius),coords));
    out.push(add(times(-radius,unitY),coords));
    out.push(add(piecewiseTimes(makePoint(radius,-radius),
                                unitY),
                 coords));
    out.push(add(xIdent(radius),coords));
    out.push(add(times(radius,unitY),coords));
    out.push(add(piecewiseTimes(makePoint(-radius,radius),
                                unitY),
                 coords));
    return out
}
