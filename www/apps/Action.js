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

Phase = {               //Wasn't sure where this fit best
    Init: 0,
    Normal: 1
}

function getActionBuildStructure(action) {
        switch (action.type) {
                case Action.Type.BuildRoad:
                    return Structure.Road;
                case Action.Type.BuildSettlement:
                    return Structure.Settlement;
                case Action.Type.BuildCity:
                    return Structure.City;
        } 
}

function drawActions(actions,color,side,ctx) {
    actions.forEach(function(action) {
        drawAction(action,color,side,ctx);
    });
}

function drawAction(action,color,side,ctx) {
    switch(action.type) {
        case Action.Type.BuildRoad:
            drawRoad(action.coordinateA,action.coordinateB,color,side,ctx);
            break;
        case Action.Type.BuildSettlement:
            drawBuilding(action.coordinate,Structure.Settlement,color,side,ctx);
            break;
        case Action.Type.BuildCity:
            drawBuilding(action.coordinate,Structure.City,color,side,ctx);
            break;
    }
}

function validateActions(actions,gamestate) {
    var currentPlayer = getPlayers(gamestate.currentPlayerID,gamestate.players)[0];
    var clonedGameState = cloneGameState(gamestate);
    return actions.every(function(action) {
        if(validateAction(action,clonedGameState,currentPlayer)) {
            applyAction(action,clonedGameState);
            return true;
        } else {
            return false;
        }
    })
}

function validateInit(action,gamestate,player) {
        switch (action.type) {
                case Action.Type.BuildRoad:
                        if (checkInitRoadLegality(action.coordinateA, action.coordinateB, player, gamestate.board.vertices, gamestate.board.roads)) {
                                console.log("Road legal");
                                return true;
                        }
                        console.log("Road illegal")
                        return false;
                case Action.Type.BuildSettlement:
                        if (checkInitSettlementLegality(action.coordinate, gamestate.board.vertices,player)) {
                                console.log("Settlement legal");
                                return true;
                        }
                        console.log("Settlement illegal");
                        return false;
                case Action.Type.BuildCity:
                        console.log("City illegal");
                        return false;
        }
}

function validateNormal(action,gamestate,player) {
        var cost = getPrice(getActionBuildStructure(action));
        if(!player.resources.every(function(e,i) {
                return e >= cost[i]
        })) {return false};

        switch (action.type) {
                case Action.Type.BuildRoad:
                        if (checkRoadLegality(gamestate.board.vertices, action.coordinateA, action.coordinateB, player, gamestate.board.roads)) {
                                console.log("Road legal");
                                return true;
                        }
                        console.log("Road illegal")
                        return false;
                case Action.Type.BuildSettlement:
                        if (checkSettlementLegality(action.coordinate, player, gamestate.board.vertices, gamestate.board.roads)) {
                                console.log("Settlement legal");
                                return true;
                        }
                        console.log("Settlement illegal");
                        return false;
                case Action.Type.BuildCity:
                        if (checkCityLegality(action.coordinate, player)) {
                                console.log("City legal");
                                return true
                        }
                        console.log("City illegal");
                        return false;
        }
}


function validateAction (action,gamestate,player) {
        switch(gamestate.phase) {
                case Phase.Init:
                        return validateInit(action,gamestate,player);
                case Phase.Normal:
                        return validateNormal(action,gamestate,player);
        }
}

function applyAction(action,gamestate) {
    var currentPlayer = getPlayers(gamestate.currentPlayerID,gamestate.players)[0];
    applyActionForPlayer(action,gamestate,currentPlayer);
}


function applyActionForPlayer(action,gamestate,player) {
        switch(gamestate.phase){
                case Phase.Normal:
                    player.resources = subtractResources(player.resources,getPrice(getActionBuildStructure(action)));
                    break;
        }
        switch(action.type) {
                case Action.Type.BuildSettlement:
                        getVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = Structure.Settlement;
                                v.playerID = gamestate.currentPlayerID;
                                player.settlementCount++;
                        })
                        break;
                case Action.Type.BuildCity:
                        getVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = Structure.City;
                                v.playerID = gamestate.currentPlayerID;
                                player.cityCount++;
                        })
                        break;
                case Action.Type.BuildRoad:
                        var r = getRoad(gamestate.board.roads,action.coordinateA,action.coordinateB);
                        r.structure = Structure.Road;
                        r.playerID = gamestate.currentPlayerID;
                        player.roadCount++;
                        break;
        }
}



