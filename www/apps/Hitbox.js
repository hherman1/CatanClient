define(['Grid','Transform','BoardState'],function(Grid,Transform,BoardState) {

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
var Hitbox = {
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
        },
        Circle: function(center,radius,data) {
            this.type=Hitbox.Type.Circle;
            this.center=center;
            this.radius=radius;
            this.data=data;
        }
}

function isHit(hitbox,loc) {
        switch(hitbox.type) {
                case Hitbox.Type.Box:
                       var t = Grid.multiplyMatrix(Grid.rotationMatrix(-hitbox.rotation)
                                                  ,Grid.add(loc,Grid.times(-1,hitbox.center)));
                       return (t.x <= hitbox.dimension.x && t.y <= hitbox.dimension.y
                              && t.x >= -hitbox.dimension.x && t.y >= -hitbox.dimension.y)
                case Hitbox.Type.Circle:
                        return (Grid.norm(Grid.add(Grid.times(-1,loc),hitbox.center)) < hitbox.radius)
        }
}

function getHitboxStructure(vertices,roads,box) {
        switch(box.data.type) {
                case BoardState.Position.Type.Vertex:
                        return BoardState.findVertex(vertices,box.data.coordinate).structure;
                case BoardState.Position.Type.Road:
                        return BoardState.findRoad(roads,box.data.coord1,box.data.coord2).structure;
        }
}

//testBox = new Hitbox.Box(hexToWorld(new Vector(1,1),50),new Vector(10,10),new Vector (0,1),Math.PI/3)

//testBox2 = new Hitbox.Box(new Vector(300,200),new Vector(50,200),new Vector (0,1),Math.PI/6)

function transformHitlist(boxes,trans) {
        return boxes.map(function(box){return transformHitbox(box,trans)})
}
function transformHitbox(box,trans) {
        if(box.type == Hitbox.Type.Box) {
                return new Hitbox.Box(Transform.transform(box.center,trans)
                           ,Grid.times(trans.scale,box.dimension)
                           ,box.data
                           ,box.rotation)
        } else if (box.type == Hitbox.Type.Circle) {
                return new Hitbox.Circle(Transform.transform(box.center,trans)
                                   ,trans.scale * box.radius
                                   ,box.data)
        }

}


function genHitboxes(vertices,roads,hexes,side) { 
        return genVertexBoxes(vertices,side)
                .concat(genHexBoxes(hexes,side))
                .concat(genRoadBoxes(roads,side));
}

function genHexBoxes(hexes,side) {
        return hexes.map(function(hc) {
                return new Hitbox.Circle(Grid.hexToWorld(hc.coordinate,side)
                                   ,side/(2*Math.tan(Math.PI/6))
                                   ,hc)
        })
}

function genVertexBoxes(vertices,side) {
        return vertices.map(function(vertex) {
                return new Hitbox.Circle(Grid.vertexToWorld(vertex.coordinate,side)
                                ,side/4
                                ,vertex)
        })
}
function genRoadBoxes(roads,side) {
        return roads.map(function(r) {return genRoadBox(r,side)});
}

function genRoadBox(road,side) {
        var w1 = Grid.vertexToWorld(road.coord1,side);
        var w2 = Grid.vertexToWorld(road.coord2,side);
        var cost = Grid.dotProduct(new Grid.Vector(1,0),Grid.add(w1,times(-1,w2)))/(side);
        if (cost < -1) {
                cost = -1;
        } else if (cost > 1) {
                cost = 1;
        }
        var diff = Grid.add(w1,times(-1,w2));
        var rotation = Math.atan(diff.y/diff.x);
        var center = Grid.times(0.5,add(w1,w2));
        return new Hitbox.Box(center
                        ,new Grid.Vector(side/2,side/3)
                        ,road
                        ,rotation)
}




function updateCenter(box,f) {
    box.center = f(box.center);
    return box
}

function getHits(hitList,coord) {
    return hitList.filter(function(box) {
            return isHit(box,coord)
    })
}

function topRight(box) {
        return Grid.add(box.center,box.dimension)
}
function bottomLeft(box) {
        return Grid.add(box.center,Grid.times(-1,box.dimension))
}

function boxCorners(box) {
        var t =  [box.dimension
                 ,Grid.piecewiseTimes(new Grid.Vector(1,-1),box.dimension)
                 ,Grid.piecewiseTimes(new Grid.Vector(-1,-1),box.dimension)
                 ,Grid.piecewiseTimes(new Grid.Vector(-1,1),box.dimension)
                 ]
        return t.map(function(p) {
            return Grid.add(box.center,Grid.multiplyMatrix(Grid.rotationMatrix(box.rotation),p));
        })
}

return {
        Hitbox:Hitbox,
        isHit:isHit,
        getHitboxStructure:getHitboxStructure,
        transformHitlist:transformHitlist,
        genHitboxes:genHitboxes,
        getHits:getHits,
        boxCorners:boxCorners,
}

});
