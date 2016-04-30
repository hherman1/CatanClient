define(['Constants','Grid','BoardState','Robber','GameMethods','GameState'],
                function(Constants,Grid,BoardState,Robber,GameMethods,GameState) {

var Action = {
    Type: {
        BuildRoad: 0,
        BuildSettlement: 1,
        BuildCity: 2,
        RobHex: 3
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
    },
    RobHex : function(coordinate){
        this.type = Action.Type.RobHex;
        this.coordinate = coordinate;
    }
};


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


function getPositionObject(action,playerID) {
        switch(action.type) {
                case Action.Type.BuildRoad:
                        return new BoardState.Position.Road(Structure.Road
                                                ,action.coordinateA
                                                ,action.coordinateB
                                                ,playerID);
                case Action.Type.BuildSettlement:
                        return new BoardState.Position.Vertex(Structure.Settlement,action.coordinate, playerID);
                case Action.Type.BuildCity:
                        return new BoardState.Position.Vertex(Structure.City,action.coordinate, playerID);
        }
}

function validateActionsForCurrentPlayer(actions,gamestate) {
    var clonedGameState = GameState.cloneGameState(gamestate);
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
    var currentPlayer = GameState.getCurrentPlayer(gamestate);
    return validateAction(action,gamestate,currentPlayer);
}


function validateInit(action,gamestate,player) {
        switch (action.type) {
                case Action.Type.BuildRoad:
                        return (player.roadCount < BoardState.getInitStructureLimit(gamestate.rotation)
                               && GameMethods.checkInitRoadLegality(action.coordinateA
                                                       , action.coordinateB
                                                       , player
                                                       , gamestate.board.vertices
                                                       , gamestate.board.roads));
                case Action.Type.BuildSettlement:
                        return (player.settlementCount < getInitStructureLimit(gamestate.rotation)
                               && GameMethods.checkInitSettlementLegality(action.coordinate
                                                             , gamestate.board.vertices));
                case Action.Type.BuildCity:
                        return false;
                case Action.Type.RobHex:
                        return false;
        }
}

function validateRobbing(action, gamestate, player){
    switch (action.type){
        case Action.Type.BuildCity:
            return false;
        case Action.Type.BuildRoad:
            return false;
        case Action.Type.BuildSettlement:
            return false;
        case Action.Type.RobHex:
            return GameMethods.checkRobbingLegality(player, gamestate.board.robber, action.coordinate, gamestate.board.hexes, gamestate.board.vertices);

    }
}


function validateNormal(action,gamestate,player) {
        switch (action.type) {
                case Action.Type.BuildRoad:

                        if (GameMethods.checkRoadLegality(gamestate.board.vertices, action.coordinateA, action.coordinateB, player, gamestate.board.roads)) {
                                //console.log("Road legal");
                                return true;
                        }
                        //console.log("Road illegal")
                        return false;
                case Action.Type.BuildSettlement:
                        if (GameMethods.checkSettlementLegality(action.coordinate, player, gamestate.board.vertices, gamestate.board.roads)) {
                                //console.log("Settlement legal");
                                return true;
                        }
                        //console.log("Settlement illegal");
                        return false;
                case Action.Type.BuildCity:
                        if (GameMethods.checkCityLegality(action.coordinate, player, gamestate.board.vertices)) {
                        //        console.log("City legal");
                                return true;
                        }
                        //console.log("City illegal");
                        return false;
                case Action.Type.RobHex:
                    return false;
        }
}


function validateAction (action,gamestate,player) {
        switch(gamestate.phase) {
                case Phase.Init:
                        return validateInit(action,gamestate,player);
                case Phase.Normal:
                        switch(gamestate.subPhase){
                            case BoardState.SubPhase.Building:
                                if(validateNormal(action,gamestate,player)) {
                                    var cost = BoardState.getPrice(getActionBuildStructure(action));
                                    if (!player.resources.every(function (e, i) {
                                            return e >= cost[i]
                                        })) {
                                        return false
                                    }
                                    return true;
                                }
                            case BoardState.SubPhase.Trading:
                                return false;
                            case BoardState.SubPhase.Robbing:
                                return validateRobbing(action, gamestate, player);
                        }
        }
}

function applyActionsForCurrentPlayer(actions,gamestate) {
        actions.map(function(a) {
                applyActionForCurrentPlayer(a,gamestate);
        })
}

function applyActionForCurrentPlayer(action,gamestate) {
    var currentPlayer = GameState.getCurrentPlayer(gamestate);
    applyAction(action,gamestate,currentPlayer);
}

function flushActions(actions){
    actions.data.length = 0;
}

function applyAction(action,gamestate,player) {
        switch(gamestate.phase){
                case BoardState.Phase.Normal:
                    if(gamestate.subPhase == BoardState.SubPhase.Building) {
                        player.resources = BoardState.subtractResources(player.resources, BoardState.getPrice(getActionBuildStructure(action)));
//                        updateResourceBar(player);
//                        refix this bug the proper way
                        break;
                    }
        }
        switch(action.type) {
                case Action.Type.BuildSettlement:
                        BoardState.findVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = BoardState.Structure.Settlement;
                                v.playerID = gamestate.currentPlayerID;
                                player.settlementCount++;
                                player.vicPoints += Constants.SETTLEMENT_VPS;
                                if(gamestate.phase == BoardState.Phase.Init){
                                    GameMethods.initSettlementResources(action.coordinate,gamestate.board.hexes, player);
                                    var add = true;
                                    for(var i = 0;i<player.firstSettlementsCoords.length;i++){      //TODO: Clean
                                        if(Grid.vectorEquals(player.firstSettlementsCoords[i], action.coordinate)){
                                            add = false;
                                        }
                                    }
                                    if(add){
                                        player.firstSettlementsCoords.push(action.coordinate);
                                    }
                                }
                        });
                        break;
                case Action.Type.BuildCity:
                        BoardState.findVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                                v.structure = BoardState.Structure.City;
                                v.playerID = gamestate.currentPlayerID;
                                player.cityCount++;
                                player.settlementCount--;
                                player.vicPoints-=Constants.SETTLEMENT_VPS;
                                player.vicPoints+=Constants.CITY_VPS;
                        })
                        break;
                case Action.Type.BuildRoad:
                        var r = BoardState.findRoad(gamestate.board.roads,action.coordinateA,action.coordinateB);
                        r.structure = BoardState.Structure.Road;
                        r.playerID = gamestate.currentPlayerID;
                        player.roadCount++;
                        player.vicPoints+=Constants.ROAD_VPS;
                        break;
            case Action.Type.RobHex:
                    var hex = BoardState.findHex(action.coordinate, gamestate.board.hexes);
                    Robber.moveRobber(gamestate.board.robber, hex);
                    Robber.robHex(hex, player, gamestate.board.vertices, gamestate.players);
                    console.log("Robbed");
        }
}


function willActAt(actions,type,coord) {
        return actions.filter(function(a) {
                return a.type == type
                    && Grid.vectorEquals(a.coordinate,coord);
        }).length > 0;
}

function genPotentialAction(vertices,roads,actions,box) {
        if(box == null) {
                return null;
        }
        if(box.data.type == BoardState.Position.Type.Hex){
            return new Action.RobHex(box.data.coordinate);
        }
        switch(getHitboxStructure(vertices,roads,box)) {
                case BoardState.Structure.Empty:
                        switch(box.data.type) {
                                case BoardState.Position.Type.Vertex:
                                        if(willActAt(actions,Action.Type.BuildSettlement,box.data.coordinate)) {
                                                return new Action.BuildCity(box.data.coordinate);
                                        }
                                        return new Action.BuildSettlement(box.data.coordinate);
                                case BoardState.Position.Type.Road:
                                        return new Action.BuildRoad(box.data.coord1,box.data.coord2);


                        }
                        break;
                case BoardState.Structure.Settlement:
                       return new Action.BuildCity(box.data.coordinate);
        }
}
function removeRedundantSettlements(actions) {
        return actions.filter(function(a) {
                if(a.type == Action.Type.BuildSettlement) {
                        return !willActAt(actions,Action.Type.BuildCity,a.coordinate);
                }
                return true;
        });
}
return {
        Action:Action,
        getActionBuildStructure:getActionBuildStructure,
        getPositionObject:getPositionObject,
        validateActionsForCurrentPlayer:validateActionsForCurrentPlayer,
        validateActionForCurrentPlayer:validateActionForCurrentPlayer,
        validateInit:validateInit,
        validateRobbing:validateRobbing,
        validateNormal:validateNormal,
        validateAction:validateAction,
        applyActionsForCurrentPlayer:applyActionsForCurrentPlayer,
        applyActionForCurrentPlayer:applyActionForCurrentPlayer,
        flushActions:flushActions,
        applyAction:applyAction,
        willActAt:willActAt,
        genPotentialAction:genPotentialAction,
        removeRedundantSettlements:removeRedundantSettlements,
}
});
