define(['Grid','BoardState','Transform','StructureRenderer','CanvasMethods'],
       function(Grid,BoardState,Transform,StructureRenderer,CanvasMethods){


var Node = function(draw) {
        var self = this;
        self.draw = draw;
        self.children = [];
        self.addChild = function(child) {addChild(child,self)};
        self.addChildren = function(children) {addChildren(children,self)};
}

var BlankNode = function() {
        Node.call(this,function(){});
}

var CenteredImageNode = function(img) {
        Node.call(this,function(ctx) {
                ctx.translate(-1/2 * img.width,-1/2 * img.height);
        });
        this.addChild(new ImageNode(img));
}

var ImageNode = function(img) {
        Node.call(this,function(ctx){ctx.drawImage(img,0,0);});
}

var TransformNode = function(transform) {
        Node.call(this,function(ctx) {
                Transform.setTransform(transform,ctx);
        });
}

ScaleNode = function(scale) {
        Node.call(this,function(ctx) {
                ctx.scale(scale,scale);
        });
}

RadialGradientNode = function(radius,startColor,endColor) {
        Node.call(this,function(ctx) {
                var gradient = ctx.createRadialGradient(0,0,0
                                                       ,0,0,radius);
                gradient.addColorStop(0,startColor);
                gradient.addColorStop(1,endColor);
                ctx.fillStyle = gradient;
                ctx.fillRect(-radius,-radius,2*radius,2*radius);
        });
}

HexNode = function(hex, robbed) {
        Node.call(this,function(ctx) {
            drawHex(hex,ctx);
        });
        this.addChild(new TokenNode(hex.token, robbed, .015));
}

TokenNode = function(token, robbed, scale) {
        Node.call(this,function(ctx) {
            ctx.scale(scale,scale);
            drawToken(token, robbed, ctx);
        });
}

RoadNode = function(road,colorMap) {
        Node.call(this,function(ctx) {
                StructureRenderer.drawRoad(road.coord1,road.coord2,colorMap[road.playerID],ctx);
        });
}
StructureNode = function(vertex,colorMap) {
        Node.call(this,function(ctx) {
                var worldCoordinate = Grid.vertexToWorld(vertex.coordinate,1);
                ctx.translate(worldCoordinate.x,worldCoordinate.y);
                StructureRenderer.drawStructure(vertex.structure,colorMap[vertex.playerID],1,ctx);
        });
}

function addChild(childNode,parentNode) {
        parentNode.children.push(childNode);
}
function addChildren(children,parentNode) {
        parentNode.children = parentNode.children.concat(children);
}

function drawNode(node,ctx) {
        node.draw(ctx);
        ctx.save();
        node.children.map(function(child) {
                ctx.restore();
                ctx.save();
                drawNode(child,ctx);
        });
        ctx.restore();
}

function makeHexNodes(hexes, robber) {
        return hexes.map(function(hex) {
            if(robber.hex == hex){
                return new HexNode(hex, true);
            }
            else {
                return new HexNode(hex, false);
            }
        })
}
function makeRoadNodes(roads,colorMap) {
        return roads.filter(function(road) {
                   return road.structure == BoardState.Structure.Road;
               })
               .map(function(road) {
                   return new RoadNode(road,colorMap);
               });
}
function makeVertexNodes(vertices,colorMap) {
        return vertices.map(function(vertex) {
                return new StructureNode(vertex,colorMap);
        });
}

 function drawHex(hex,ctx) {
     var worldCoord = Grid.hexToWorld(hex.coordinate,1);
     ctx.translate(worldCoord.x,worldCoord.y);
     var tileImage = StructureRenderer.getResourceImage(hex.resource); //get the source path for the hexagon's terrain image
     ctx.lineWidth = 1;
     ctx.strokeStyle = "black";
     ctx.fillStyle = "#D9B5A0";
     CanvasMethods.hexPath(1,ctx);
     ctx.fill();
     ctx.save();
     Transform.resetTransform(ctx);
     ctx.stroke();
     ctx.restore();
     CanvasMethods.drawHexImage(tileImage, ctx);

 }

function drawToken(token, robbed, ctx){
  ctx.beginPath();
  ctx.strokeStyle="black"; //draw a black border for the number
  ctx.lineWidth=1; //with width 1
  ctx.fillStyle="beige"; //fill color of the token
  ctx.arc(0,0, 20, 0, 2*Math.PI); //draw the token circle
  ctx.save();
  Transform.resetTransform(ctx);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  if (robbed) {
      StructureRenderer.drawRobber(0,0,50,ctx);}
    else{
    if (token == 6 || token == 8){
  		ctx.fillStyle="red";
    }
    else{
  		ctx.fillStyle="black";
    }

    ctx.font = "24px Times New Roman";
    if (token > 9){
      ctx.fillText(String(token),-11,6);
    }
    else{
      ctx.fillText(String(token),-6,6);
    }
	}

}

return {
    Node:Node,
    BlankNode:BlankNode,
    CenteredImageNode:CenteredImageNode,
    ImageNode:ImageNode,
    TransformNode:TransformNode,
    ScaleNode:ScaleNode,
    RadialGradientNode:RadialGradientNode,
    HexNode:HexNode,
    TokenNode:TokenNode,
    RoadNode:RoadNode,
    StructureNode:StructureNode,
    addChild:addChild,
    addChildren:addChildren,
    drawNode:drawNode,
    makeRoadNodes:makeRoadNodes,
    makeVertexNodes:makeVertexNodes,
    makeHexNodes:makeHexNodes,
}

});
