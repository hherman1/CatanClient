Action = {
    Type: {
        BuildRoad: 0,
        BuildSettlement: 1,
        BuildCity: 2,
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

function oneRoadOneSettlement(actions) {
    var settlements = 0;
    var roads = 0;
    var other = 0;
    actions.map(function(a) {
            switch(getActionBuildStructure(a)) {
                    case Structure.Settlement:
                            settlements += 1;
                            break;
                    case Structure.Road:
                            roads += 1;
                            break;
                    default:
                            other += 1;
                            break;
            }
    });
    return settlements <= 1 && roads <= 1 && actions.length <= 2 && other == 0;
}
function validateActions(actions,gamestate) {
    var clonedGameState = cloneGameState(gamestate);
    var currentPlayer = getPlayers(clonedGameState.currentPlayerID,clonedGameState.players)[0];

    if(gamestate.phase == Phase.Init && !oneRoadOneSettlement(actions)) {
            return false;
    }

    return actions.every(function(action) {
        if(validateAction(action,clonedGameState,currentPlayer)) {
            applyAction(action,clonedGameState);
            console.log("true");
            return true;
        } else {
            console.log("false");
            return false;
        }
    })
}

function validateInit(action,gamestate,player) {
        switch (action.type) {
                case Action.Type.BuildRoad:
                        if (checkInitRoadLegality(action.coordinateA, action.coordinateB, player, gamestate.board.vertices, gamestate.board.roads)) {
//                                console.log("Road legal");
                                return true;
                        }
                        //console.log("Road illegal")
                        return false;
                case Action.Type.BuildSettlement:
                        if (checkInitSettlementLegality(action.coordinate, gamestate.board.vertices,player)) {
                                //console.log("Settlement legal");
                                return true;
                        }
                        //console.log("Settlement illegal");
                        return false;
                case Action.Type.BuildCity:
                        //console.log("City illegal");
                        return false;
        }
}

function validateNormal(action,gamestate,player) {
        switch (action.type) {
                case Action.Type.BuildRoad:
                        if (checkRoadLegality(gamestate.board.vertices, action.coordinateA, action.coordinateB, player, gamestate.board.roads)) {
                                //console.log("Road legal");
                                return true;
                        }
                        //console.log("Road illegal")
                        return false;
                case Action.Type.BuildSettlement:
                        if (checkSettlementLegality(action.coordinate, player, gamestate.board.vertices, gamestate.board.roads)) {
                                //console.log("Settlement legal");
                                return true;
                        }
                        //console.log("Settlement illegal");
                        return false;
                case Action.Type.BuildCity:
                        if (checkCityLegality(action.coordinate, player, gamestate.board.vertices)) {
                        //        console.log("City legal");
                                return true;
                        }
                        //console.log("City illegal");
                        return false;
        }
}


function validateAction (action,gamestate,player) {
        switch(gamestate.phase) {
                case Phase.Init:
                        return validateInit(action,gamestate,player);
                case Phase.Normal:
                        var cost = getPrice(getActionBuildStructure(action));
                        if(!player.resources.every(function(e,i) {
                                return e >= cost[i]
                        })) {return false};
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


function willActAt(actions,type,coord) {
        return actions.filter(function(a) {
                return a.type == type
                    && vectorEquals(a.coordinate,coord);
        }).length > 0;
}

function genPotentialAction(vertices,roads,actions,box) {
        if(box == null) {
                return null;
        }
        switch(getHitboxStructure(vertices,roads,box)) {
                case Structure.Empty:
                        switch(box.data.type) {
                                case Position.Type.Vertex:
                                        if(willActAt(actions,Action.Type.BuildSettlement,box.data.coordinate)) {
                                                return new Action.BuildCity(box.data.coordinate);
                                        }
                                        return new Action.BuildSettlement(box.data.coordinate);
                                case Position.Type.Road:
                                        return new Action.BuildRoad(box.data.coord1,box.data.coord2);
                        }
                        break;
                case Structure.Settlement:
                       return new Action.BuildCity(box.data.coordinate);
        }
}
