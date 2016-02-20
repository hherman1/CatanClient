/* Hitbox Object
 * {center:vector,
 *  dimension:vector, - Positive values
 *  data: any
 *  }
 */
Type = {
        Vertex: 0,
        Line: 1,
        Tile: 2
}

testBox = {center: hexToWorld(makeVector(1,1),50),
           dimension: makeVector(10,10),
           data: makeVector (0,1),
           rotation: Math.PI/3,
           }

testBox2 = {center: makeVector(300,200),
           dimension: makeVector(50,200),
           data: makeVector (0,1),
           rotation: Math.PI/6,
           }

function genTileBoxes(coords,side) {
        return coords.map(function(hc) {
                return newHitbox(hexToWorld(hc,side)
                                ,ident((side + side*Math.sin(Math.PI/3))/(2 * Math.sqrt(2)))
                                ,[Type.Tile,hc]
                                ,Math.PI/4)
        })
}
function genVertexBoxes(coords,side) {
        return coords.map(function(vc) {
                return newHitbox(vertexToWorld(vc,side)
                                ,ident(side/5)
                                ,[Type.Vertex,vc]
                                ,0)
        })
}
function genLineBox(c1,c2,side) {
        var w1 = vertexToWorld(c1,side);
        var w2 = vertexToWorld(c2,side);
        var cost = dotProduct(makeVector(1,0),add(w1,times(-1,w2)))/(side);
        if (cost < -1) {
                cost = -1;
        } else if (cost > 1) {
                cost = 1;
        }
        var rotation = Math.acos(cost);
        var center = times(0.5,add(w1,w2));
        return newHitbox(center
                        ,makeVector(side/2,side/5)
                        ,[Type.Line,makeVector(c1,c2)]
                        ,rotation)
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
