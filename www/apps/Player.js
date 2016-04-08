//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.

Colors = {
    Red: 2,
    Orange: 3,
    Blue: 0,
    White: 1,
}

Colors.List = [Colors.Blue, Colors.White, Colors.Red, Colors.Orange]  //Player Colors will be consistently assigned

getColor = function(colorNum){
  switch(colorNum) {
      case Colors.Blue:
          return "rgb(85, 153, 255)";
      case Colors.White:
          return 'rgb(255, 255, 255)';
      case Colors.Red:
          return 'rgb(255, 0, 0)';
      case Colors.Orange:
          return 'rgb(255, 127, 42)';
    }
}
getHighlight = function(colorNum){
  switch(colorNum) {
      case Colors.Blue:
          return "rgba(85, 153, 255,0.5)";
      case Colors.White:
          return 'rgba(255, 255, 255,0.5)';
      case Colors.Red:
          return 'rgba(255, 0, 0,0.5)';
      case Colors.Orange:
          return 'rgba(255, 127, 42,0.5)';
    }
}

Player = function(id){
  //Player owned constructions
  this.id = id;
  this.settlementCount = 0;
  this.roadCount = 0;
  this.cityCount = 0;
  //Player owned resources
  this.resources = [];
  this.resources[Resource.Lumber] = 5;
  this.resources[Resource.Wool] = 5;
  this.resources[Resource.Ore] = 5;
  this.resources[Resource.Brick] = 5;
  this.resources[Resource.Grain] = 5;
  //Color assigned
  this.color = Colors.List[id-1];
  //Player victory points
  this.vicPoints = 0;
}

/*WIPWIPWIP
function initPlayers(numPlayers){
  for (var i = 0; i < numPlayers; i++) {
    Players.
  };
}
*/

function clonePlayer(player) {
        var out = new Player(player.id);
        out.resources = cloneResources(player.resources);
        out.playerColor = player.playerColor;
        out.vicPoints = player.vicPoints;
        out.settlementCount = player.settlementCount;
        out.roadCount = player.roadCount;
        out.cityCount = player.cityCount;
        return out;
}

function cloneResources(resources) {
        var out = [];
        out[Resource.Lumber] = resources[Resource.Lumber];
        out[Resource.Wool] = resources[Resource.Wool];
        out[Resource.Ore] = resources[Resource.Ore];
        out[Resource.Brick] = resources[Resource.Brick];
        out[Resource.Grain] = resources[Resource.Grain];
        return out;
}

function getColor(id,playerList) {
        return getPlayers(id,playerList)[0].color;
}

function getPlayerColors(playerList) {
        var out = {}
        playerList.forEach(function(player) {
                out[player.id] = player.color;
        })
        return out;
}

function getCurrentPlayer(players, currentPlayerID){
  for (player in players){
    if (currentPlayerID == players[player].id){
      return players[player];
    }
  }
}

function getPlayers(id, playerList){
        return playerList.filter(function(player) {return player.id == id});
}

function getPlayersResources(player) {
        return player.resources;
}

function getResource(resources,resource) {
        return resources[resource]
}

function addResource(resources, resource, amount){
        resources[resource] += amount;
        return resources;
}

function subtractResources(pos,neg) {
        for(resource in neg) {
                addResource(pos,resource,-1 * getResource(neg,resource));
        }
        return pos;
}

//Takes in game and returns what the index is of the current player in players
function currentPlayerListIndex(gamestate){
              for (var i = 0; i<gamestate.players.length; i++){
                if (gamestate.players[i].id == gamestate.currentPlayerID){
                  return gamestate.players[i].id;//index of current player in players
                }
              }
              return 'Err | currentPlayersListIndex';
}

function nextPlayer(gamestate){
//get current player index and then increase it by one and set the global player to this calculated player
              var currentPlayerIndex = currentPlayerListIndex(gamestate);
              var nextPlayer = currentPlayerIndex % (gamestate.players.length) + 1;
              gamestate.currentPlayerID = nextPlayer;//Moves to next player
              console.log("current player id now: " + nextPlayer);
}