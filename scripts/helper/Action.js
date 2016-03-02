
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
                            console.log("Road legal");
                            break;
                    }
                        console.log("Road illegal")
                        break;
            case Action.Type.BuildSettlement:
                    if(checkSettlementLegality(action.vert,action.player,gamestate.board.vertexBoard)){
                            console.log("Settlement legal");
                            break;
                    }
                    console.log("Settlement illegal");
                    break;
            case Action.Type.BuildCity:
                    if(checkCityLegality(action.vert,action.player)){
                            console.log("City legal");
                    }
                    console.log("City illegal");
                    break;
    }

}


applyAction = function(action,game) {

}



drawAction = function(action,ctx) {

  drawBuilding(action.vertex,action.player.playerColor,50,ctx);
  
}
