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


function nextPlayerInit(gamestate) {
        if(currentPlayerListIndex(gamestate) == (gamestate.players.length - 1)) {

        }
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


function getPositionObject(action,playerID) {
        switch(action.type) {
                case Action.Type.BuildRoad:
                        return new Position.Road(Structure.Road
                                                ,action.coordinateA
                                                ,action.coordinateB
                                                ,playerID);
                case Action.Type.BuildSettlement:
                        return new Position.Vertex(Structure.Settlement,action.coordinate, playerID);
                case Action.Type.BuildCity:
                        return new Position.Vertex(Structure.City,action.coordinate, playerID);
        }
}

function validateActionsForCurrentPlayer(actions,gamestate) {
    var clonedGameState = cloneGameState(gamestate);
    return actions.every(function(action) {
        if(validateActionForCurrentPlayer(action,clonedGameState)) {
            applyActionForCurrentPlayer(action,clonedGameState);
            console.log("true");
            return true;
        } else {
            console.log("false");
            return false;
        }
    })
}

function validateActionForCurrentPlayer(action,gamestate) {
    var currentPlayer = getPlayers(gamestate.currentPlayerID,gamestate.players)[0];
    return validateAction(action,gamestate,currentPlayer);
}

function getInitStructureLimit(rotation) {
        switch(rotation) {
                case Rotation.Forwards:
                        return 1;
                case Rotation.Backwards:
                        return 2;
                default:
                        return 2;
        }
}

function validateInit(action,gamestate,player) {
        switch (action.type) {
                case Action.Type.BuildRoad:
                        return (player.roadCount < getInitStructureLimit(gamestate.rotation)
                               && checkInitRoadLegality(action.coordinateA
                                                       , action.coordinateB
                                                       , player
                                                       , gamestate.board.vertices
                                                       , gamestate.board.roads));
                case Action.Type.BuildSettlement:
                        return (player.settlementCount < getInitStructureLimit(gamestate.rotation)
                               && checkInitSettlementLegality(action.coordinate
                                                             , gamestate.board.vertices));
                case Action.Type.BuildCity:
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

function applyActionsForCurrentPlayer(actions,gamestate) {
        actions.map(function(a) {
                applyActionForCurrentPlayer(a,gamestate);
        })
}

function applyActionForCurrentPlayer(action,gamestate) {
    var currentPlayer = getPlayers(gamestate.currentPlayerID,gamestate.players)[0];
    applyAction(action,gamestate,currentPlayer);
}

function flushActions(actions){
    actions.data.length = 0;
}

function applyAction(action,gamestate,player) {
        switch(gamestate.phase){
                case Phase.Normal:
                    player.resources = subtractResources(player.resources,getPrice(getActionBuildStructure(action)));
                    updateResourceBar(player);
                    break;

        }
        switch(action.type) {
                case Action.Type.BuildSettlement:
                        findVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = Structure.Settlement;
                                v.playerID = gamestate.currentPlayerID;
                                player.settlementCount++;
                                player.vicPoints+=SETTLEMENT_VPS;
                                if(gamestate.phase == Phase.Init){
                                    initSettlementResources(action.coordinate,gamestate.board.hexes, player);
                                    var add = true;
                                    for(var i = 0;i<player.firstSettlementsCoords.length;i++){      //TODO: Clean
                                        if(vectorEquals(player.firstSettlementsCoords[i], action.coordinate)){
                                            add = false;
                                        }
                                    }
                                    if(add){
                                        player.firstSettlementsCoords.push(action.coordinate);
                                    }
                                }
                        })
                        break;
                case Action.Type.BuildCity:
                        findVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = Structure.City;
                                v.playerID = gamestate.currentPlayerID;
                                player.cityCount++;
                                player.settlementCount--;
                                player.vicPoints-=SETTLEMENT_VPS;
                                player.vicPoints+=CITY_VPS;
                        })
                        break;
                case Action.Type.BuildRoad:
                        var r = findRoad(gamestate.board.roads,action.coordinateA,action.coordinateB);
                        r.structure = Structure.Road;
                        r.playerID = gamestate.currentPlayerID;
                        player.roadCount++;
                        player.vicPoints+=ROAD_VPS;

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
