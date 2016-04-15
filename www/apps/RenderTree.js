
Node = function(draw) {
        var self = this;
        self.draw = draw;
        self.children = [];
        self.addChild = function(child) {addChild(child,self)};
}

TransformNode = function(transform) {
        Node.call(this,function(ctx) {
                setTransform(transform,ctx);
        });
}

ScaleNode = function(scale) {
        Node.call(this,function(ctx) {
                ctx.scale(scale,scale);
        });
}

HexNode = function(hex) {
        Node.call(this,function(ctx) {
            drawHex(hex,ctx);
        });
        this.addChild(new TokenNode(hex.token,.015));
}

TokenNode = function(token,scale) {
        Node.call(this,function(ctx) {
            ctx.scale(scale,scale);
            drawToken(token,ctx);
        });
}

RoadNode = function(road,colorMap) {
        Node.call(this,function(ctx) {
                drawRoad(road.coord1,road.coord2,colorMap[road.playerID],ctx);
        });
}
StructureNode = function(vertex,colorMap) {
        Node.call(this,function(ctx) {
                var worldCoordinate = vertexToWorld(vertex.coordinate,1);
                ctx.translate(worldCoordinate.x,worldCoordinate.y);
                drawStructure(vertex.structure,colorMap[vertex.playerID],1,ctx);
        });
}

function addChild(childNode,parentNode) {
        parentNode.children.push(childNode);
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

function assembleRenderTree(gamestate,actions,colorMap,currentPlayerID,side) {
        var board = new Node(function(){});
        gamestate.board.hexes.forEach(function(hex) {
                board.addChild(new HexNode(hex));
        })
        gamestate.board.roads.forEach(function(road) {
                if(road.structure == Structure.Road) {
                        board.addChild(new RoadNode(road,colorMap));
                }
        });
        gamestate.board.vertices.forEach(function(vertex) {
                board.addChild(new StructureNode(vertex,colorMap));
        });
        actions.forEach(function(action) {
                board.addChild(genActionNode(action,currentPlayerID,colorMap,side));
        });
        return board;
}

function genActionNode(action,currentPlayerID,colorMap,side) {
        switch(action.type) {
                case Action.Type.BuildRoad:
                    return(new RoadNode(new Position.Road(Structure.Road
                                                         ,action.coordinateA
                                                         ,action.coordinateB
                                                         ,currentPlayerID)
                                       ,colorMap
                                       ,side));
                case Action.Type.BuildSettlement:
                    return(new StructureNode(new Position.Vertex(Structure.Settlement
                                                                ,currentPlayerID
                                                                ,action.coordinate)
                                            ,colorMap
                                            ,side));
                case Action.Type.BuildCity:
                    return(new StructureNode(new Position.Vertex(Structure.City
                                                                ,currentPlayerID
                                                                ,action.coordinate)
                                            ,colorMap
                                            ,side));
        }

}


 function drawHex(hex,ctx) {
     var worldCoord = hexToWorld(hex.coordinate,1);
     ctx.translate(worldCoord.x,worldCoord.y);
     var tileImage = getResourceImage(hex.resource); //get the source path for the hexagon's terrain image
     ctx.lineWidth = 1;
     ctx.strokeStyle = "black";
     ctx.fillStyle = "#D9B5A0";
     hexPath(1,ctx);
     ctx.fill();
     ctx.save();
     resetTransform(ctx);
     ctx.stroke();
     ctx.restore();
     drawHexImage(tileImage, ctx);

 }

function drawToken(token, ctx){
  ctx.beginPath();
  ctx.strokeStyle="black"; //draw a black border for the number
  ctx.lineWidth=1; //with width 1
  ctx.fillStyle="beige"; //fill color of the token
  ctx.arc(0,0, 20, 0, 2*Math.PI); //draw the token circle
  ctx.save();
  resetTransform(ctx);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  if (token != 7) {
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
	} else{
      drawRobber(0,0,50,ctx);
	}
}
