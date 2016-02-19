/* Hitbox Object
 * {center:vector,
 *  dimension:vector, - Positive values
 *  data: any
 *  }
 */

testBox = {center: hexToWorld(makeVector(0,0),50),
           dimension: makeVector(100,100),
           data: makeVector (0,1),
           rotation: Math.PI/3,
           }

testBox2 = {center: makeVector(300,200),
           dimension: makeVector(50,200),
           data: makeVector (0,1),
           rotation: Math.PI/6,
           }


function newHitbox(center,dimension,data,rotation) {
    return {center:center,dimension:dimension,data:data,rotation:rotation}
}

function updateCenter(box,f) {
    box.center = f(box.center);
    return box
}

function hexBox(hexCoords,side,dimension,activate){
    return newHitbox(hexToCanvas(hexCoords,side),dimension,hexCoords,activate)
}


function getHits(hitList,coord) {
    return hitList.filter(function(box) {
            return isHit(coord,box)
    })
}

function topRight(box) {
        return add(box.center,box.dimension)
}
function bottomLeft(box) {
        return add(box.center,times(-1,box.dimension))
}
function isHit(loc,box) {
        var t = multiplyMatrix(rotationMatrix(-box.rotation),add(loc,times(-1,box.center)))
       return (t.x <= box.dimension.x && t.y <= box.dimension.y
              && t.x >= -box.dimension.x && t.y >= -box.dimension.y)
}

function boxCorners(box) {
        var t =  [box.dimension
                 ,piecewiseTimes(makeVector(1,-1),box.dimension)
                 ,piecewiseTimes(makeVector(-1,-1),box.dimension)
                 ,piecewiseTimes(makeVector(-1,1),box.dimension)
                 ]
        return t.map(function(p) {
            return add(box.center,multiplyMatrix(rotationMatrix(box.rotation),p));
        })
}
