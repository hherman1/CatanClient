/* Hitbox Object
 * {center:vector,
 *  dimension:vector, - Positive values
 *  data: any
 *  }
 */

testBox = {center: makeVector(0,0),
           dimension: makeVector(5,5),
           data: makeVector (0,1),
           }


function makeBox(center,dimension,data,activate) {
    return {center:center,dimension:dimension,data:data,activate:activate}
}

function updateCenter(box,f) {
    box.center = f(box.center);
    return box
}

function hexBox(hexCoords,side,dimension,activate){
    return makeBox(hexToCanvas(hexCoords,side),dimension,hexCoords,activate)
}


function getHits(hitList,coord) {
    return hitList.filter(function(box) {
            return isHit(coord,box)
    })
}

function topRight(box) {
        return add(box.center,times(0.5,box.dimension))
}
function bottomLeft(box) {
        return add(box.center,times(-0.5,box.dimension))
}
function isHit(loc,box) {
       return (loc.x <= topRight(box).x && loc.y <= topRight(box).y
              && loc.x >= bottomLeft(box).x && loc.y >= bottomLeft(box).y)
}
