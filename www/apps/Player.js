//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.

Colors = {
    Red: 0,
    Orange: 1,
    Blue: 2,
    White: 3,
}
Colors.List = [Colors.Red, Colors.Orange, Colors.Blue, Colors.White]  //Player Colors will be consistently assigned

Player = function(id){
  //Player owned constructions
  this.id = id;
  this.settlementCount = 2; //each player starts out with 2 settlements
  this.roadCount = 2; //each player starts out with 2 roads
  this.cityCount = 0;
  //Coordinates of vertices the player has settled (list of vectors)
  this.settledVertices = [];
  //Player owned resources
  this.resources = [];
  this.resources[Resource.Lumber] = 0;
  this.resources[Resource.Wool] = 0;
  this.resources[Resource.Ore] = 0;
  this.resources[Resource.Brick] = 0;
  this.resources[Resource.Grain] = 0;
  //Color assigned
  this.playerColor = Colors.List[id-1];
  //Player victory points
  this.vicPoints = 0;
}

function getPlayers(id, playerList){
        return playerList.filter(function(player) {return player.id == id});
}

function getResource(player,resource) {
        return player.resources[resource]
}

function addResources(player, resource, amount){
        player.resources[resource] += amount;
    //TODO: Complete
}
