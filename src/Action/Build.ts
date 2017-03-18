import * as Constants from "../Constants"
import * as Grid from "../Grid"
import * as BoardState from "../BoardState"
import * as GameMethods from "../GameMethods"
import * as Hitbox from "../Hitbox"
import * as GameState from "../GameState"
import * as Player from "../Player"
import {Action,AnyAction} from "./Action"
export type BuildAction = BuildRoad | BuildSettlement | BuildCity;

export interface BuildRoad extends Action<"BuildRoad"> {
    coordinateA:Grid.Point;
    coordinateB:Grid.Point;
}
export interface BuildSettlement extends Action<"BuildSettlement"> {
    coordinate:Grid.Point;
}
export interface BuildCity extends Action<"BuildCity"> {
    coordinate:Grid.Point;
}
export function isBuildAction(action:AnyAction): action is BuildAction {
    return ["BuildRoad","BuildSettlement","BuildCity"].indexOf(action.type) >= 0;
}
export function getBuildActionStructure(action:BuildAction) {
    switch (action.type) {
        case "BuildRoad":
            return BoardState.Structure.Road;
        case "BuildSettlement":
            return BoardState.Structure.Settlement;
        case "BuildCity":
            return BoardState.Structure.City;
    }
}


export function getPositionObject(action:BuildAction,playerID:number):BoardState.Position.Vertex | BoardState.Position.Road  {
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
export function validateBuildAction(action:BuildAction,gameState:GameState.GameState){
    switch(action.type) {
        case "BuildRoad":
            return validateRoad(action.coordinateA,action.coordinateB,gameState);
        case "BuildSettlement":
            return validateSettlement(action.coordinate,gameState);
        case "BuildCity":
            return validateCity(action.coordinate,gameState);
    }
}
function validateRoad(coordinateA:Grid.Point,coordinateB:Grid.Point,gameState:GameState.GameState) {
    if(gameState.phase == BoardState.Phase.Normal && gameState.subPhase == BoardState.SubPhase.Building)
        return GameMethods.checkRoadLegality(gameState.board.vertices, coordinateA, coordinateB, gameState.currentPlayer, gameState.board.roads)
            && canAfford(BoardState.getPrice(BoardState.Structure.Road),gameState.currentPlayer);
    else if(gameState.phase == BoardState.Phase.Init)
        return (gameState.currentPlayer.roadCount < BoardState.getInitStructureLimit(gameState.rotation)
            && GameMethods.checkInitRoadLegality(coordinateA, coordinateB
                , gameState.currentPlayer
                , gameState.board.vertices
                , gameState.board.roads))
    return false;
}
function validateCity(coordinate:Grid.Point,gameState:GameState.GameState) {
    if(gameState.phase == BoardState.Phase.Normal && gameState.subPhase == BoardState.SubPhase.Building)
        return (GameMethods.checkCityLegality(coordinate, gameState.currentPlayer, gameState.board.vertices))
            && canAfford(BoardState.getPrice(BoardState.Structure.City),gameState.currentPlayer);
    return false;
}
function validateSettlement(coordinate:Grid.Point,gameState:GameState.GameState) {
    if(gameState.phase == BoardState.Phase.Init)
        return (gameState.currentPlayer.settlementCount < BoardState.getInitStructureLimit(gameState.rotation)
                && GameMethods.checkInitSettlementLegality(coordinate, gameState.board.vertices));
    else if(gameState.phase == BoardState.Phase.Normal && gameState.subPhase == BoardState.SubPhase.Building) 
        return GameMethods.checkSettlementLegality(coordinate, gameState.currentPlayer, gameState.board.vertices, gameState.board.roads)
            && canAfford(BoardState.getPrice(BoardState.Structure.Settlement),gameState.currentPlayer);
    else
        return false;
}

function buildSettlement(coordinate:Grid.Point,gameState:GameState.GameState) {
    let player = gameState.currentPlayer;
    let settlement = BoardState.requireVertex(gameState.board.vertices,coordinate);
    settlement.structure = BoardState.Structure.Settlement;
    settlement.playerID = gameState.currentPlayer.id;
    player.settlementCount++;
    player.vicPoints += Constants.SETTLEMENT_VPS;
    if(gameState.phase == BoardState.Phase.Init){
        GameMethods.initSettlementResources(coordinate,gameState.board.hexes, player);
        player.firstSettlementsCoords.push(coordinate);
    } else {
        gameState.currentPlayer.resources = BoardState.subtractResources(gameState.currentPlayer.resources, BoardState.getPrice(BoardState.Structure.Settlement));
    }
}
function buildCity(coordinate:Grid.Point,gameState:GameState.GameState) {
    let city = BoardState.requireVertex(gameState.board.vertices,coordinate)
    city.structure = BoardState.Structure.City;
    city.playerID = gameState.currentPlayer.id;
    gameState.currentPlayer.cityCount++;
    gameState.currentPlayer.settlementCount--;
    gameState.currentPlayer.vicPoints-=Constants.SETTLEMENT_VPS;
    gameState.currentPlayer.vicPoints+=Constants.CITY_VPS;
    gameState.currentPlayer.resources = BoardState.subtractResources(gameState.currentPlayer.resources, BoardState.getPrice(BoardState.Structure.City));
}
function buildRoad(coordinateA:Grid.Point,coordinateB:Grid.Point,gameState:GameState.GameState) {
    var r = BoardState.requireRoad(gameState.board.roads,coordinateA,coordinateB);
    r.structure = BoardState.Structure.Road;
    r.playerID = gameState.currentPlayer.id;
    gameState.currentPlayer.roadCount++;
    gameState.currentPlayer.vicPoints+=Constants.ROAD_VPS;
    if(gameState.phase == BoardState.Phase.Normal)
        gameState.currentPlayer.resources = BoardState.subtractResources(gameState.currentPlayer.resources, BoardState.getPrice(BoardState.Structure.Road));
}
export function applyBuildAction(action:BuildAction,gameState:GameState.GameState) {
    switch(action.type) {
        case "BuildRoad":
            buildRoad(action.coordinateA,action.coordinateB,gameState);
            break;
        case "BuildCity":
            buildCity(action.coordinate,gameState);
            break;
        case "BuildSettlement":
            buildSettlement(action.coordinate,gameState);
            break;
    }
    return gameState;
}

function canAfford(cost:number[],player:Player.Player) {
    return player.resources.every(function (e, i) {
        return e >= (<number[]>cost)[i] // kind of annoying that i have to do this
    })
}