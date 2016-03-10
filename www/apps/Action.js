
Action = {
        Type: {
                BuildRoad: 0,
                BuildSettlement: 1,
                BuildCity: 2
        },
        BuildRoad : function(coordinateA,coordinateB) {
                this.type = Action.Type.BuildRoad;
                this.coordinateA = coordinateA;
                this.coordinateB = coordinateB;
        },
        BuildSettlement : function(coordinate) {
                this.type = Action.Type.BuildSettlement;
                this.coordinate = coordinate;
        },
        BuildCity : function(coordinate) {
                this.type = Action.Type.BuildCity;
                this.coordinate = coordinate;
        }
}

function drawActions(actions,side,ctx) {
        actions.forEach(function(action) {
                drawAction(action,side,ctx);
        });
}

function drawAction(action,side,ctx) {
        switch(action.type) {
                case Action.Type.BuildRoad:
                        drawRoad(action.coordinateA,action.coordinateB,Colors.Red,side,ctx);
                        break;
                case Action.Type.BuildSettlement:
                        drawBuilding(action.coordinate,Structure.Settlement,Colors.Red,side,ctx);
                        break;
                case Action.Type.BuildCity:
                        drawBuilding(action.coordinate,Structure.City,Colors.Red,side,ctx);
                        break;
        }
}

function validateActions(actions,gamestate) {
        var currentPlayer = getPlayers(gamestate.currentPlayerID,gamestate.players)[0];
        var temp = cloneGameState(gamestate);
        actions.forEach(function(action) {
                if(validateAction(action,temp,currentPlayer)) {
                        applyAction(action,temp,currentPlayer);
                } else {
                        return false;
                }
        })
        return true;
}


function validateAction (action,gamestate,player) {
    switch(action.type) {
            case Action.Type.BuildRoad:
                    if(checkRoadLegality(gamestate.board.vertices, action.coordinateA, action.coordinateB, player, gamestate.board.roads)) {
                            console.log("Road legal");
                            return true;
                    }
                        console.log("Road illegal")
                        return false;
            case Action.Type.BuildSettlement:
                    if(checkSettlementLegality(action.coordinate,player,gamestate.board.vertices, gamestate.board.roads)){
                            console.log("Settlement legal");
                            return true;
                    }
                    console.log("Settlement illegal");
                    return false;
            case Action.Type.BuildCity:
                    if(checkCityLegality(action.coordinate,player)){
                            console.log("City legal");
                            return true
                    }
                    console.log("City illegal");
                    return false;
    }

}

function applyAction(action,gamestate) {
        var currentPlayer = getPlayers(gamestate.currentPlayerID,gamestate.players)[0];
        applyActionForPlayer(action,gamestate,currentPlayer);
}


function applyActionForPlayer(action,gamestate,player) {
        switch(action.type) {
                case Action.Type.BuildSettlement:
                        getVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = Structure.Settlement;
                                v.playerID = gamestate.currentPlayerID;
                        })
                        player.resources = subtractResources(player.resources,getPrice(Structure.Settlement));
                        break;
                case Action.Type.BuildCity:
                        getVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = Structure.City;
                                v.playerID = gamestate.currentPlayerID;
                        })
                        player.resources = subtractResources(player.resources,getPrice(Structure.City));
                        break;
                case Action.Type.BuildRoad:
                // not functional
                        getVertices(gamestate.board.vertices,action.vertex.coordinate).forEach(function(v) {
                                v.structure = Structure.City;
                                v.playerID = gamestate.currentPlayerID;
                        })
                        player.resources = subtractResources(player.resources,getPrice(Structure.City));
                        break;
        }

}



