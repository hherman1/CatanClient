//There appears to be a lot of cruft here that could be removed

import * as Constants from "./Constants"
import * as Grid from "./Grid"
import * as BoardState from "./BoardState"
import * as RobberMethods from "./RobberMethods"
import * as GameMethods from "./GameMethods"
import * as Hitbox from "./Hitbox"
import * as GameState from "./GameState"
import * as Player from "./Player"

export namespace Action {
    export type Any = BuildRoad | BuildSettlement | BuildCity | RobHex;
    export type Build = BuildRoad | BuildSettlement | BuildCity;
    export type VertexAction = BuildCity | BuildSettlement | RobHex;
    export interface BuildRoad {
        type:"BuildRoad";
        coordinateA:Grid.Point;
        coordinateB:Grid.Point;
    }
    export interface BuildSettlement {
        type:"BuildSettlement"
        coordinate:Grid.Point;
    }
    export interface BuildCity {
        type:"BuildCity"
        coordinate:Grid.Point;
    }
    export interface RobHex {
        type:"RobHex"
        coordinate:Grid.Point;
    }
};


export function getActionBuildStructure(action:Action.Build) {
    switch (action.type) {
        case "BuildRoad":
            return BoardState.Structure.Road;
        case "BuildSettlement":
            return BoardState.Structure.Settlement;
        case "BuildCity":
            return BoardState.Structure.City;
    }
}


export function getPositionObject(action:Action.Build,playerID:number):BoardState.Position.Vertex | BoardState.Position.Road  {
    switch(action.type) {
        case "BuildRoad":
            return {
                type:BoardState.Position.Type.Road,
                coord1:action.coordinateA,
                coord2:action.coordinateB,
                structure:BoardState.Structure.Road,
                playerID:playerID
            }
        case "BuildSettlement":
            return {
                type:BoardState.Position.Type.Vertex,
                structure:BoardState.Structure.Settlement,
                coordinate:action.coordinate,
                playerID:playerID
            }
            // return new BoardState.Position.Vertex(BoardState.Structure.Settlement,action.coordinate, playerID);
        case "BuildCity":
            return {
                type:BoardState.Position.Type.Vertex,
                structure:BoardState.Structure.City,
                coordinate:action.coordinate,
                playerID:playerID
            }
            // return new BoardState.Position.Vertex(BoardState.Structure.City,action.coordinate, playerID);
    }
}

export function validateActionsForCurrentPlayer(actions:Action.Any[],gamestate:GameState.GameState) {
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

export function validateActionForCurrentPlayer(action:Action.Any,gamestate:GameState.GameState) {
    var currentPlayer = GameState.getCurrentPlayer(gamestate);
    return validateAction(action,gamestate,currentPlayer);
}


export function validateInit(action:Action.Any,gamestate:GameState.GameState,player:Player.Player) {
    switch (action.type) {
        case "BuildRoad":
            return (player.roadCount < BoardState.getInitStructureLimit(gamestate.rotation)
                && GameMethods.checkInitRoadLegality(action.coordinateA
                , action.coordinateB
                , player
                , gamestate.board.vertices
                , gamestate.board.roads));
        case "BuildSettlement":
            return (player.settlementCount < BoardState.getInitStructureLimit(gamestate.rotation)
                && GameMethods.checkInitSettlementLegality(action.coordinate
                , gamestate.board.vertices));
        default:
            return false;
    }
}

export function validateRobbing(action:Action.Any, gamestate:GameState.GameState, player:Player.Player){
    switch (action.type){
        case "RobHex":
            return GameMethods.checkRobbingLegality(gamestate.board.robber, action.coordinate, gamestate.board.hexes);
        default:
            return false;
    }
}


export function validateNormal(action:Action.Any,gamestate:GameState.GameState,player:Player.Player): action is Action.Build & boolean {
    switch (action.type) {
        case "BuildRoad":
            if (GameMethods.checkRoadLegality(gamestate.board.vertices, action.coordinateA, action.coordinateB, player, gamestate.board.roads)) {
                //console.log("Road legal");
                return true;
            }
            //console.log("Road illegal")
            return false;
        case "BuildSettlement":
            if (GameMethods.checkSettlementLegality(action.coordinate, player, gamestate.board.vertices, gamestate.board.roads)) {
                //console.log("Settlement legal");
                return true;
            }
            //console.log("Settlement illegal");
            return false;
        case "BuildCity":
            if (GameMethods.checkCityLegality(action.coordinate, player, gamestate.board.vertices)) {
                //        console.log("City legal");
                return true;
            }
            //console.log("City illegal");
            return false;
        case "RobHex":
            return false;
    }
}


export function validateAction (action:Action.Any,gamestate:GameState.GameState,player:Player.Player) {
    switch(gamestate.phase) {
        case BoardState.Phase.Init:
            return validateInit(action,gamestate,player);
        case BoardState.Phase.Normal:
            switch(gamestate.subPhase){
                case BoardState.SubPhase.Building:
                    if(validateNormal(action,gamestate,player)) { // Rejects non-build actions
                        var cost = BoardState.getPrice(getActionBuildStructure(action));
                        if(typeof cost !== "undefined") {
                            return !player.resources.every(function (e, i) {
                                return e >= (<number[]>cost)[i] // kind of annoying that i have to do this
                            })
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

export function applyActionsForCurrentPlayer(actions:Action.Any[],gamestate:GameState.GameState) {
    actions.map(function(a) {
        applyActionForCurrentPlayer(a,gamestate);
    })
}

export function applyActionForCurrentPlayer(action:Action.Any,gamestate:GameState.GameState) {
    var currentPlayer = GameState.getCurrentPlayer(gamestate);
    applyAction(action,gamestate,currentPlayer);
}

export function flushActions(actions:Action.Any[]){
    actions.length = 0;
}

//Must perform validations first
export function applyAction(action:Action.Any,gamestate:GameState.GameState,player:Player.Player) {
    switch(gamestate.phase){
        case BoardState.Phase.Normal:
            if(gamestate.subPhase == BoardState.SubPhase.Building) {
                player.resources = BoardState.subtractResources(player.resources, BoardState.getPrice(getActionBuildStructure(<Action.Build>action)));
                //                        updateResourceBar(player);
                //                        refix this bug the proper way
            }
            break;
    }
    switch(action.type) {
        case "BuildSettlement":
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
        case "BuildCity":
            BoardState.findVertices(gamestate.board.vertices,action.coordinate).forEach(function(v) {
                v.structure = BoardState.Structure.City;
                v.playerID = gamestate.currentPlayerID;
                player.cityCount++;
                player.settlementCount--;
                player.vicPoints-=Constants.SETTLEMENT_VPS;
                player.vicPoints+=Constants.CITY_VPS;
            })
            break;
        case "BuildRoad":
            var r = BoardState.findRoad(gamestate.board.roads,action.coordinateA,action.coordinateB);
            if(typeof r === "undefined") {
                throw "could not find road"
            }
            r.structure = BoardState.Structure.Road;
            r.playerID = gamestate.currentPlayerID;
            player.roadCount++;
            player.vicPoints+=Constants.ROAD_VPS;
            break;
        case "RobHex":
            var hex = BoardState.findHex(action.coordinate, gamestate.board.hexes);
            if(typeof hex === "undefined") {
                throw "could not find hex"
            }
            RobberMethods.moveRobber(gamestate.board.robber, hex);
            RobberMethods.robHex(hex, player, gamestate.board.vertices, gamestate.players);
            console.log("Robbed");
    }
}


export function willActAt(actions:Action.VertexAction[],type:string,coord:Grid.Point) {
    return actions.filter(function(a) {
        return a.type == type
        && Grid.vectorEquals(a.coordinate,coord);
    }).length > 0;
}

export function genPotentialAction(vertices:BoardState.Position.Vertex[],roads:BoardState.Position.Road[],actions:Action.Any[],box:Hitbox.Hitbox): Action.Any|undefined {
    if(box == null) {
        return undefined;
    }
    if(box.data.type == BoardState.Position.Type.Hex){
        return {type:"RobHex",coordinate:box.data.coordinate};
    }
    switch(Hitbox.getHitboxStructure(vertices,roads,box)) {
        case undefined:
            switch(box.data.type) {
                case BoardState.Position.Type.Vertex:
                    if(willActAt(<Action.VertexAction[]>actions,"BuildSettlement",box.data.coordinate)) {
                        return {type:"BuildCity",coordinate:box.data.coordinate};
                    }
                    return {type:"BuildSettlement",coordinate:box.data.coordinate};
                case BoardState.Position.Type.Road:
                    return {type:"BuildRoad",coordinateA:box.data.coord1,coordinateB:box.data.coord2};
                
            }
            break;
        case BoardState.Structure.Settlement:
            return {type:"BuildCity",coordinate:(<BoardState.Position.Vertex>box.data).coordinate};
    }
}

export function removeRedundantSettlements(actions:Action.VertexAction[]) {
    return actions.filter(function(a) {
        if(a.type == "BuildSettlement") {
            return !willActAt(actions,"BuildCity",a.coordinate);
        }
        return true;
    });
}