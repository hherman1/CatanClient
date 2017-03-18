import * as BoardState from "./BoardState"
import * as Grid from "./Grid"

//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.

export enum Colors {
    Red,
    Orange,
    Blue,
    Green,
    White
}

export let PlayerColors:Colors[] = [Colors.Blue, Colors.Green, Colors.Red, Colors.Orange, Colors.White]  //Player Colors will be consistently assigned

export function getColor(colorNum:Colors){
    switch(colorNum) {
        case Colors.Blue:
            return "rgb(0,147,208)";
        case Colors.Green:
            return 'rgb(98,161,25)';
        case Colors.Red:
            return 'rgb(186, 36, 65)';
        case Colors.Orange:
            return 'rgb(255, 127, 42)';
        case Colors.White:
            return 'rgb(255,255,255)'
    }
}
export function getHighlight(colorNum:Colors){
    switch(colorNum) {
        case Colors.Blue:
        return "rgba(85, 153, 255,0.5)";
        case Colors.Green:
        return 'rgba(255, 255, 255,0.5)';
        case Colors.Red:
        return 'rgba(255, 0, 0,0.5)';
        case Colors.Orange:
        return 'rgba(255, 127, 42,0.5)';
    }
}
export class Player {
    id:number;
    settlementCount:number;
    roadCount:number;
    cityCount:number;
    firstSettlementsCoords:Grid.Vector[];
    resources:number[];
    color:Colors;
    vicPoints:number;
    hasSeenBuildInstruction:boolean;
    constructor(id:number) {
        this.id = id;
        this.settlementCount = 0;
        this.roadCount = 0;
        this.cityCount = 0;
        this.firstSettlementsCoords = [];
        //Player owned resources
        this.resources = [];
        this.resources[BoardState.Resource.Lumber] = 0;
        this.resources[BoardState.Resource.Wool] = 0;
        this.resources[BoardState.Resource.Ore] = 0;
        this.resources[BoardState.Resource.Brick] = 0;
        this.resources[BoardState.Resource.Grain] = 0;
        //Color assigned
        this.color = PlayerColors[id-1];
        //Player victory points
        this.vicPoints = 0;
        this.hasSeenBuildInstruction = false;
    }
}

export function clonePlayer(player:Player) {
    var out = new Player(player.id);
    out.resources = BoardState.cloneResources(player.resources);
    out.color = player.color;
    out.vicPoints = player.vicPoints;
    out.settlementCount = player.settlementCount;
    out.roadCount = player.roadCount;
    out.cityCount = player.cityCount;
    out.firstSettlementsCoords = player.firstSettlementsCoords;
    return out;
}

export function getPlayerColor(id:number,playerList:Player[]) {
    return getPlayers(id,playerList)[0].color;
}

export function getPlayerColors(playerList:Player[]):Colors[] {
    var out:Colors[] = []
    playerList.forEach(function(player) {
        out[player.id] = player.color;
    })
    return out;
}


export function getPlayers(id:number, playerList:Player[]){
    return playerList.filter(function(player) {return player.id == id});
}

export function getPlayer(id:number, playerList:Player[]){
    return getPlayers(id, playerList)[0];
}

export function getPlayersResources(player:Player) {
    return player.resources;
}

export function genPlayers(num:number) {
    var out = [];
    for(var i = 0; i < num; i++) {
        out.push(new Player(i+1));
    }
    return out;
}
export function getStoredPlayers():number {
    let numPlayers = localStorage.getItem("numPlayers");
    if(numPlayers === null) {
        throw "numPlayers not set"
    }
    return parseInt(numPlayers);
}

export function requirePlayer(id:number,players:Player[]) {
    let out = players.filter((player)=> player.id == id)[0];
    if(out === undefined) {
        throw "Not found"
    }
    return out;
}
export function getPlayerIDs(players:Player[]) {
    return players.map(function(player){return player.id});
}

