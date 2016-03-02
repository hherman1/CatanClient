/* Hitbox Object
 * {center:vector,
 *  dimension:vector, - Positive values
 *  data: any
 *  }
 *
 *  Hitcircle
 *  {center:vector,
 *  radius:int,
 *  data:any
 *  }
 */
Type = {
        Vertex: 0,
        Line: 1,
        Tile: 2
}

Box = {
        box:0,
        circle:1
}


testBox = newHitbox(hexToWorld(new Vector(1,1),50),new Vector(10,10),new Vector (0,1),Math.PI/3)

testBox2 = newHitbox(new Vector(300,200),new Vector(50,200),new Vector (0,1),Math.PI/6)
/* Use hitcircles instead
function genTileBoxes(coords,side) {
        return coords.map(function(hc) {
                return newHitbox(hexToWorld(hc,side)
                                ,ident((side + side*Math.sin(Math.PI/3))/(2 * Math.sqrt(2)))
                                ,[Type.Tile,hc]
                                ,Math.PI/4)
        })
}
*/


genHitboxes = function(vertices,roads,hexes,side) { 
        return genVertexBoxes(vertices,side)
                .concat(genTileBoxes(hexes,side))
                .concat([genLineBox(new Vector(0,0),new Vector(0,1),50),genLineBox(new Vector(1,0),new Vector(0,1),50)]);
}

function genTileBoxes(coords,side) {
        return coords.map(function(hc) {
                return newHitcircle(hexToWorld(hc,side)
                                   ,side/(2*Math.tan(Math.PI/6))
                                   ,[Type.Tile,hc])
        })
}
/* Use hitcircles instead
function genVertexBoxes(coords,side) {
        return coords.map(function(vc) {
                return newHitbox(vertexToWorld(vc,side)
                                ,ident(side/5)
                                ,[Type.Vertex,vc]
                                ,0)
        })
}
*/
function genVertexBoxes(coords,side) {
        return coords.map(function(vc) {
                return newHitcircle(vertexToWorld(vc,side)
                                ,side/5
                                ,[Type.Vertex,vc])
        })
}

function genLineBox(c1,c2,side) {
        var w1 = vertexToWorld(c1,side);
        var w2 = vertexToWorld(c2,side);
        var cost = dotProduct(new Vector(1,0),add(w1,times(-1,w2)))/(side);
        if (cost < -1) {
                cost = -1;
        } else if (cost > 1) {
                cost = 1;
        }
        var rotation = Math.acos(cost);
        var center = times(0.5,add(w1,w2));
        return newHitbox(center
                        ,new Vector(side/2,side/5)
                        ,[Type.Line,new Vector(c1,c2)]
                        ,rotation)
}

function newHitbox(center,dimension,data,rotation) {
    return {center:center
           ,dimension:dimension
           ,data:data
           ,rotation:rotation
           ,type: Box.box
           ,isHit: (function(loc) {
               var t = multiplyMatrix(rotationMatrix(-this.rotation),add(loc,times(-1,this.center)));
               return (t.x <= this.dimension.x && t.y <= this.dimension.y
                      && t.x >= -this.dimension.x && t.y >= -this.dimension.y)
            })
        }
}

function newHitcircle(center,radius,data) {
        return {center:center,
                radius:radius,
                data:data,
                type:Box.circle,
                isHit: function(loc) {
                    return (norm(add(times(-1,loc),center)) < radius)
                }
        }
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
            return box.isHit(coord)
    })
}

function topRight(box) {
        return add(box.center,box.dimension)
}
function bottomLeft(box) {
        return add(box.center,times(-1,box.dimension))
}

function boxCorners(box) {
        var t =  [box.dimension
                 ,piecewiseTimes(new Vector(1,-1),box.dimension)
                 ,piecewiseTimes(new Vector(-1,-1),box.dimension)
                 ,piecewiseTimes(new Vector(-1,1),box.dimension)
                 ]
        return t.map(function(p) {
            return add(box.center,multiplyMatrix(rotationMatrix(box.rotation),p));
        })
}
