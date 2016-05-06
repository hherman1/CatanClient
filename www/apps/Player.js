define(['BoardState'],function(BoardState) {

//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.

var Colors = {
    Red: 2,
    Orange: 3,
    Blue: 0,
    Green: 1,
    White: 4
}

Colors.List = [Colors.Blue, Colors.Green, Colors.Red, Colors.Orange, Colors.White]  //Player Colors will be consistently assigned

function getColor(colorNum){
  switch(colorNum) {
      case Colors.Blue:
          return "rgb(0,147,208)";
      case Colors.Green:
          return 'rgb(98,161,25)';
      case Colors.Red:
          return 'rgb(186, 36, 65)';
      case Colors.Orange:
          return 'rgb(255, 127, 42)';
    }
}
function getHighlight(colorNum){
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

var Player = function(id){
  //Player owned constructions
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
  this.color = Colors.List[id-1];
  //Player victory points
  this.vicPoints = 0;
  this.hasSeenBuildInstruction = false;
}

function clonePlayer(player) {
        var out = new Player(player.id);
        out.resources = BoardState.cloneResources(player.resources);
        out.playerColor = player.playerColor;
        out.vicPoints = player.vicPoints;
        out.settlementCount = player.settlementCount;
        out.roadCount = player.roadCount;
        out.cityCount = player.cityCount;
        out.firstSettlementsCoords = player.firstSettlementsCoords;
        return out;
}

function getPlayerColor(id,playerList) {
        return getPlayers(id,playerList)[0].color;
}

function getPlayerColors(playerList) {
        var out = {}
        playerList.forEach(function(player) {
                out[player.id] = player.color;
        })
        return out;
}


function getPlayers(id, playerList){
        return playerList.filter(function(player) {return player.id == id});
}

function getPlayer(id, playerList){
    return getPlayers(id, playerList)[0];
}

function getPlayersResources(player) {
        return player.resources;
}


function getStoredPlayers() {
        var out = [];
        for(var i = 0; i < localStorage.getItem("numPlayers"); i++) {
          out.push(new Player(i+1));
        }
        return out;
}

function getPlayerIDs(players) {
        return players.map(function(player){return player.id});
}
return {
        Colors:Colors,
        getColor:getColor,
        getHighlight:getHighlight,

        Player:Player,
        clonePlayer:clonePlayer,
        getPlayerColor:getPlayerColor,
        getPlayerColors:getPlayerColors,
        getPlayer:getPlayer,
        getPlayers:getPlayers,
        getPlayersResources:getPlayersResources,
        getStoredPlayers:getStoredPlayers,
        getPlayerIDs:getPlayerIDs,
}

});