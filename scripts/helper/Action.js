


Action = {
        Type: {
                BuildRoad: 0,
                BuildSettlement: 1,
                BuildCity: 2
        },
        BuildRoad : function(player,vertA,vertB) {
                this.type = Action.Type.BuildRoad;
                this.player = player;
                this.vertA = vertA;
                this.vertB = vertB;
        },
        BuildSettlement : function(player,vert) {
                this.type = Action.Type.BuildSettlement;
                this.player = player;
                this.vert = vert;
        },
        BuildCity : function(player,vert) {
                this.type = Action.Type.BuildCity;
                this.player = player;
                this.vert = vert;
        }
}


validateAction = function(action,gamestate) {
    switch(action.type) {
            case Action.Type.BuildRoad:
                    if(checkRoadLegality(gamestate.board.vertexBoard, action.vertA, action.vertB, action.player, gamestate.players)) {
                            buildRoad(action.vertA, action.vertB, action.player);
                            console.log("Road built");
                            break;
                    }
                        console.log("Road illegal")
                        break;
            case Action.Type.BuildSettlement:
                    if(checkSettlementLegality(action.vert,action.player,gamestate.board.vertexBoard)){
                            buildSettlement(action.vert, action.player);
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


//May be unnecessary
drawAction = function(action,ctx) {

}


