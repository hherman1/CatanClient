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
Hitbox = {
        Type: {
                Box:0,
                Circle:1
        },
        Box: function(center,dimension,data,rotation) {
            this.type=Hitbox.Type.Box;
            this.center=center;
            this.dimension=dimension;
            this.data=data;
            this.rotation=rotation;
            this.isHit=function(loc) {
               var t = multiplyMatrix(rotationMatrix(-this.rotation),add(loc,times(-1,this.center)));
               return (t.x <= this.dimension.x && t.y <= this.dimension.y
                      && t.x >= -this.dimension.x && t.y >= -this.dimension.y)
            }
        },
        Circle: function(center,radius,data) {
            this.type=Hitbox.Type.Circle;
            this.center=center;
            this.radius=radius;
            this.data=data;
            this.isHit= function(loc) {
                return (norm(add(times(-1,loc),center)) < radius)
            }
        }
}

testBox = new Hitbox.Box(hexToWorld(new Vector(1,1),50),new Vector(10,10),new Vector (0,1),Math.PI/3)

testBox2 = new Hitbox.Box(new Vector(300,200),new Vector(50,200),new Vector (0,1),Math.PI/6)

function transformHitlist(boxes,trans) {
        return boxes.map(function(box){return transformHitbox(box,trans)})
}
function transformHitbox(box,trans) {
        if(box.type == Hitbox.Type.Box) {
                return new Hitbox.Box(transform(box.center,trans)
                           ,times(trans.scale,box.dimension)
                           ,box.data
                           ,box.rotation)
        } else if (box.type == Hitbox.Type.Circle) {
                return new Hitbox.Circle(transform(box.center,trans)
                                   ,trans.scale * box.radius
                                   ,box.data)
        }

}


genHitboxes = function(vertexCoordinates,roadCoordinatePairs,hexCoordinates,side) { 
        return genVertexBoxes(vertexCoordinates,side)
                .concat(genHexBoxes(hexCoordinates,side))
                .concat();
}

function genHexBoxes(hexes,side) {
        return hexes.map(function(hc) {
                return new Hitbox.Circle(hexToWorld(hc.coordinate,side)
                                   ,side/(2*Math.tan(Math.PI/6))
                                   ,hc)
        })
}

function genVertexBoxes(coords,side) {
        return coords.map(function(vc) {
                return new Hitbox.Circle(vertexToWorld(vc,side)
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
        return new Hitbox.Box(center
                        ,new Vector(side/2,side/5)
                        ,[Type.Line,new Vector(c1,c2)]
                        ,rotation)
}




function updateCenter(box,f) {
    box.center = f(box.center);
    return box
}

function hexBox(hexCoords,side,dimension,activate){
    return new Hitbox.Box(hexToCanvas(hexCoords,side),dimension,hexCoords,activate)
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
