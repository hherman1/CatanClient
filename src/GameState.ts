// define(['Util','BoardState','Player','TradeOffer','GameMethods','Constants']
//        ,function(Util,BoardState,Player,TradeOffer,GameMethods,Constants) {
import * as Util from "./Util"
import * as BoardState from "./BoardState"
import * as Player from "./Player"
import * as TradeOffer from "./TradeOffer"
import * as GameMethods from "./GameMethods"
import * as Constants from "./Constants"
export interface Roll {
    left:number,
    right:number
}
export function genRoll() {
    function rollDice(){
        var roll = Math.floor(Math.random()* 6) + 1;
        return roll
    }
    return {
        left:rollDice(),
        right:rollDice()
    }
}
export class GameState {
    roll:Roll;
    phase:BoardState.Phase = BoardState.Phase.Init;
    subPhase:BoardState.SubPhase = BoardState.SubPhase.Building;
    rotation:BoardState.Rotation = BoardState.Rotation.Forwards;
    players:Player.Player[] = [];
    tradeOffers:TradeOffer.TradeOffer[] = [];
    longestRoad:number = 0;
    longestRoadPlayer:Player.Player|undefined = undefined;
    constructor(public board:BoardState.Board,public currentPlayer:Player.Player) {
    }
}
export function cloneGameState(gameState:GameState) {
    var out = new GameState(gameState.board,gameState.currentPlayer);
    out.longestRoadPlayer = gameState.longestRoadPlayer;
    out.players = gameState.players.map(Player.clonePlayer);
    out.phase = gameState.phase;
    out.subPhase = gameState.subPhase;
    out.rotation = gameState.rotation;
    out.tradeOffers = gameState.tradeOffers.map(TradeOffer.cloneTradeOffer);
    out.longestRoad = gameState.longestRoad;
    return out;
}
//Takes in game and returns what the index is of the current player in players
export function currentPlayerListIndex(gamestate:GameState):number|undefined{
    var out = undefined;
    gamestate.players.every(function(p,i) { // allows shortcircuiting - probably not worth the random optimization though
        if(p.id == gamestate.currentPlayer.id) {
            out = i;
            return false;
        }
        return true;
    });
    return out;
}

export function nextPlayer(gamestate:GameState) {
    gamestate.currentPlayer = getNextPlayer(gamestate);
}
export function getNextPlayer(gamestate:GameState):Player.Player{
    var currentPlayerIndex = currentPlayerListIndex(gamestate);
    if(typeof currentPlayerIndex === "undefined") {
        throw "invalid state"
    }
    var out;
    switch(gamestate.rotation) {
        case BoardState.Rotation.Forwards:
        //get current player index and then increase it by one and set the global player to this calculated player
        var next = (currentPlayerIndex+1) % (gamestate.players.length);
        return gamestate.players[next];//Moves to next player
        case BoardState.Rotation.Backwards:
        var next = Math.max((currentPlayerIndex-1) % (gamestate.players.length),0);
        return gamestate.players[next];//Moves to next player
        case BoardState.Rotation.None:
        return gamestate.players[currentPlayerIndex];
    }
}

export function updateLongestRoad(gameState:GameState){
    var player = gameState.currentPlayer;
    for(var i =0; i<player.firstSettlementsCoords.length;i++){
        var testLength = GameMethods.longestRoad(BoardState.requireVertex(gameState.board.vertices,player.firstSettlementsCoords[i])
        ,gameState.board.vertices
        ,gameState.board.roads
        ,player
        ,[]);
        if(testLength>gameState.longestRoad && testLength >= 5){
            console.log("Longest road changed");
            gameState.longestRoad = testLength;
            if(gameState.longestRoadPlayer != null) {
                gameState.longestRoadPlayer.vicPoints -= Constants.LONGEST_ROAD_VPS;
            }
            gameState.longestRoadPlayer = player;
            gameState.longestRoadPlayer.vicPoints += Constants.LONGEST_ROAD_VPS;
        }
    }
}
export function updateGamePhase(gamestate:GameState, unupdatedCurrentPlayerID:number) {
    if(gamestate.phase == BoardState.Phase.Init) {
        if(gamestate.rotation == BoardState.Rotation.Backwards) {
            if(gamestate.players[0].id == unupdatedCurrentPlayerID) {
                gamestate.rotation = BoardState.Rotation.Forwards;
                gamestate.phase = BoardState.Phase.Normal;
                return true;
            }
        } else if(gamestate.rotation == BoardState.Rotation.None) {
            gamestate.rotation = BoardState.Rotation.Backwards;
            return false;
        } else if(Util.last(gamestate.players).id == gamestate.currentPlayer.id) {
            gamestate.rotation = BoardState.Rotation.None;
            return false;
        }
    }
}
export function validateEndTurn(teststate:GameState) {
    switch(teststate.phase){
        case BoardState.Phase.Init:
        var currentPlayer = teststate.currentPlayer;
        if (currentPlayer.roadCount == BoardState.getInitStructureLimit(teststate.rotation) &&
        currentPlayer.settlementCount == BoardState.getInitStructureLimit(teststate.rotation)){
            console.log("End turn valid");
            return true;
        }
        break;
        case BoardState.Phase.Normal:
        return true;
    }
    return false;
}
