//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.

Colors = {
    Red: 2,
    Orange: 3,
    Blue: 0,
    Green: 1,
    White: 4
}

Colors.List = [Colors.Blue, Colors.Green, Colors.Red, Colors.Orange, Colors.White]  //Player Colors will be consistently assigned

getColor = function(colorNum){
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
getHighlight = function(colorNum){
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

Player = function(id){
  //Player owned constructions
  this.id = id;
  this.settlementCount = 0;
  this.roadCount = 0;
  this.cityCount = 0;
    this.firstSettlementsCoords = [];
  //Player owned resources
  this.resources = [];
  this.resources[Resource.Lumber] = 0;
  this.resources[Resource.Wool] = 0;
  this.resources[Resource.Ore] = 0;
  this.resources[Resource.Brick] = 0;
  this.resources[Resource.Grain] = 0;
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
        out.firstSettlementsCoords = player.firstSettlementsCoords;
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

//deprecated
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

function getPlayer(id, playerList){
    return getPlayers(id, playerList)[0];
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

function addResources(store,adder) {
        adder.forEach(function(val,resource) {
                addResource(store,resource,val);
        });
}

function subtractResources(pos,neg) {
        neg.forEach(function(val,resource) {
                addResource(pos,resource,-1 * val);
        });
        return pos;
}

//Takes in game and returns what the index is of the current player in players
function currentPlayerListIndex(gamestate){
        var out = undefined;
        gamestate.players.every(function(p,i) {
                if(p.id == gamestate.currentPlayerID) {
                        out = i;
                        return false;
                }
                return true;
        });
        return out;
}

function nextPlayer(gamestate){
      var currentPlayerIndex = currentPlayerListIndex(gamestate);
        switch(gamestate.rotation) {
                case Rotation.Forwards:
        //get current player index and then increase it by one and set the global player to this calculated player
                      var nextPlayer = (currentPlayerIndex+1) % (gamestate.players.length);
                      gamestate.currentPlayerID = gamestate.players[nextPlayer].id;//Moves to next player
                      break;
                case Rotation.Backwards:
                      var nextPlayer = (currentPlayerIndex-1) % (gamestate.players.length);
                      gamestate.currentPlayerID = gamestate.players[nextPlayer].id;//Moves to next player
                      break;
        }
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
