//There appears to be a lot of cruft here that could be removed

import * as Constants from "../Constants"
import * as Grid from "../Grid"
import * as BoardState from "../BoardState"
import * as RobberMethods from "../RobberMethods"
import * as GameMethods from "../GameMethods"
import * as Hitbox from "../Hitbox"
import * as GameState from "../GameState"
import * as Player from "../Player"
import * as Build from "./Build"

import * as TradeOffer from "../TradeOffer"

type Log = AnyAction[]

export type AnyAction = BoardAction | EndTurn | NewGame | BankTrade | PlayerTrade | EndTradePhase
export type BoardAction = Build.BuildAction | RobHex
export type VertexAction = Build.BuildCity | Build.BuildSettlement | RobHex;

export interface Action<T extends string> {
    type:T;
}
export interface RobHex extends Action<"RobHex"> {
    type:"RobHex"
    coordinate:Grid.Point;
}

export function validateRobbing(coordinate:Grid.Point, gamestate:GameState.GameState){
    if(gamestate.phase == BoardState.Phase.Normal && gamestate.subPhase == BoardState.SubPhase.Robbing)
        return GameMethods.checkRobbingLegality(gamestate.board.robber, coordinate, gamestate.board.hexes);
    else return false;
}

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
export function validateAction (action:AnyAction,gameState:GameState.GameState) {
    if(Build.isBuildAction(action)) {
        return Build.validateBuildAction(action,gameState);
    } else {
        switch(action.type) {
            case "RobHex":
                return validateRobbing(action.coordinate,gameState);
            case "EndTurn":
                return validateEndTurn(gameState);
            case "NewGame":
                return true;
            case "BankTrade":
                return validateBankTrade(action,gameState);
            case "PlayerTrade":
                return validatePlayerTrade(action,gameState)
            case "EndTradePhase":
                return validateEndTradePhase(gameState);
            default:
                assertNever(action)
        }
    }
}

export function flushActions(actions:AnyAction[]){
    actions.length = 0;
}

export function replayActions(actions:AnyAction[]) {
    let initial = actions[0];
    if(!isNewGame(initial)) {
        throw "cannot replay log";
    }
    return applyActions(actions,newGame(initial));
}
export function applyActions(actions:AnyAction[],gameState:GameState.GameState) {
    actions.forEach(function(action) {
        gameState = applyAction(action,gameState);
    })
    return gameState;
}

//Must perform validations first
export function applyAction(action:AnyAction,gameState:GameState.GameState):GameState.GameState {
    if(Build.isBuildAction(action)) {
        return Build.applyBuildAction(action,gameState);
    } else {
        switch(action.type) {
            case "RobHex":
                var hex = BoardState.requireHex(action.coordinate, gameState.board.hexes);
                RobberMethods.moveRobber(gameState.board.robber, hex);
                RobberMethods.robHex(hex, gameState.currentPlayer, gameState.board.vertices, gameState.players);
                gameState.subPhase = BoardState.SubPhase.Trading;
                console.log("Robbed");
                return gameState;
            case "EndTurn":
                applyEndTurn(action.roll,gameState);
                return gameState;
            case "NewGame":
                return newGame(action);
            case "BankTrade":
                return applyBankTrade(action,gameState);
            case "PlayerTrade":
                return applyPlayerTrade(action,gameState);
            case "EndTradePhase":
                return applyEndTradePhase(gameState);
            default:
                assertNever(action);
                throw "unreachable code";
        }
    }

}
export function genPotentialAction(box:Hitbox.Hitbox): BoardAction|undefined {
    switch(box.data.type) {
        case BoardState.Position.Type.Road:
            return {type:"BuildRoad",coordinateA:box.data.coord1,coordinateB:box.data.coord2}
        case BoardState.Position.Type.Vertex:
            if(box.data.structure === undefined) {
                return {type:"BuildSettlement",coordinate:box.data.coordinate};
            } else {
                return {type:"BuildSettlement",coordinate:box.data.coordinate};
            }
        case BoardState.Position.Type.Hex:
            return {type:"RobHex",coordinate:box.data.coordinate};

    }
}

export interface NewGame extends Action<"NewGame"> {
    numPlayers:number;
    resourceList:number[];
    tokenList:number[];
    width:number;

}
function isNewGame(action:AnyAction):action is NewGame {
    return action.type == "NewGame"
}
export function newGame(action:NewGame):GameState.GameState {
    let players = Player.genPlayers(action.numPlayers);
    let gameState = new GameState.GameState(BoardState.makeRegularHexBoard(action.width, action.resourceList.slice(), action.tokenList.slice()),players[0])
    gameState.players = players;
    return gameState;
}

export interface EndTurn extends Action<"EndTurn"> {
    roll:GameState.Roll
}

export function validateEndTurn(gameState:GameState.GameState) {
    return GameState.validateEndTurn(gameState);
}
export function applyEndTurn(roll:GameState.Roll,gameState:GameState.GameState) {
    GameState.updateLongestRoad(gameState);
    gameState.tradeOffers = TradeOffer.filterOutIncomingTrades(gameState.currentPlayer.id, gameState.tradeOffers);
    
    var unupdatedCurrentPlayerID = gameState.currentPlayer.id;
    GameState.nextPlayer(gameState);
    GameState.updateGamePhase(gameState, unupdatedCurrentPlayerID);

    if(gameState.phase == BoardState.Phase.Normal) {
        GameMethods.resourceGeneration(roll.left + roll.right, gameState.players, gameState.board.vertices, gameState.board.hexes, gameState.board.robber);
        if (roll.left + roll.right == 7) {
            gameState.subPhase = BoardState.SubPhase.Robbing;
        }
        else {
            gameState.subPhase = BoardState.SubPhase.Trading;
        }
    }
    gameState.tradeOffers = TradeOffer.filterValidTradeOffers(gameState.players,gameState.tradeOffers);
}

export interface BankTrade extends Action<"BankTrade"> {
    tradein:BoardState.Resource;
    receive:BoardState.Resource;
}
export function validateBankTrade(action:BankTrade,gameState:GameState.GameState) {
    return gameState.subPhase == BoardState.SubPhase.Trading
        && gameState.currentPlayer.resources[action.tradein] >= Constants.BANKABLE_RESOURCE_COUNT
}
export function applyBankTrade(action:BankTrade,gameState:GameState.GameState) {
    gameState.currentPlayer.resources[action.receive]++;
    gameState.currentPlayer.resources[action.tradein] -= Constants.BANKABLE_RESOURCE_COUNT;
    return gameState;
}

export interface PlayerTrade extends Action<"PlayerTrade"> {
    initiator:number,
    target:number,
    offer:number[],
    receive:number[]
}
export function toTradeOffer(action:PlayerTrade):TradeOffer.TradeOffer {
    return {
        tradeID:-1,
        offerResources:action.offer,
        offererID:action.initiator,
        requestResources:action.receive,
        targetID:action.target
    }
}
export function fromTradeOffer(trade:TradeOffer.TradeOffer):PlayerTrade {
    return {
        type:"PlayerTrade",
        initiator:trade.offererID,
        offer:trade.offerResources,
        receive:trade.requestResources,
        target:trade.targetID
    }
}
function validatePlayerTrade(action:PlayerTrade,gameState:GameState.GameState) {
    return gameState.subPhase == BoardState.SubPhase.Trading
        && TradeOffer.validateTrade(gameState.players,toTradeOffer(action))
}
function applyPlayerTrade(action:PlayerTrade,gameState:GameState.GameState) {
    TradeOffer.applyTrade(gameState.players,toTradeOffer(action));
    return gameState;
}

export type EndTradePhase = Action<"EndTradePhase">
function validateEndTradePhase(gameState:GameState.GameState) {
    return gameState.subPhase == BoardState.SubPhase.Trading;
}
function applyEndTradePhase(gameState:GameState.GameState) {
    gameState.subPhase = BoardState.SubPhase.Building;
    return gameState;
}