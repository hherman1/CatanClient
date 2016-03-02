
Action = {
        Type: {
                BuildRoad: 0,
                BuildSettlement: 1,
                BuildCity: 2
        },
        BuildRoad : function(player,vertA,vertB) {
                this.type = Action.Type.BuildRoad;
                this.player = player;
                this.vertexA = vertexA;
                this.vertexB = vertexB;
        },
        BuildSettlement : function(player,vertex) {
                this.type = Action.Type.BuildSettlement;
                this.player = player;
                this.vertex = vertex;
        },
        BuildCity : function(player,vertex) {
                this.type = Action.Type.BuildCity;
                this.player = player;
                this.vertex = vertex;
        }
}


validateAction = function(action,gamestate) {
    switch(action.type) {
            case Action.Type.BuildRoad:
                    if(checkRoadLegality(gamestate.board.vertexBoard, action.vertA, action.vertB, action.player, gamestate.players)) {
                            buildRoad(action.vertexA, action.vertexB, action.player);
                            console.log("Road built");
                            break;
                    }
                        console.log("Road illegal")
                        break;
            case Action.Type.BuildSettlement:
                    if(checkSettlementLegality(action.vertex,action.player,gamestate.board.vertexBoard)){
                            buildSettlement(action.vertex, action.player);
                            console.log("Settlement built");
                            break;
                    }
                    console.log("Settlement illegal");
                    break;
            case Action.Type.BuildCity:
                    console.log("City Built");
                    break;
    }

}


applyAction = function(action,game) {

}



drawAction = function(action,ctx) {

  drawBuilding(action.vertex,action.player.playerColor,50,ctx);
  
}
