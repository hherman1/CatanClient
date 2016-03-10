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

function getPlayers(id, playerList){
        return playerList.filter(function(player) {return player.id == id});
}

function getResource(player,resource) {
        return player.resources[resource]
}

function addResource(resources, resource, amount){
        resources[resource] += amount;
        return resources;
}

function subtractResources(pos,neg) {
        for(resource in neg) {
                addResource(pos,resource,-neg[resource]);
        }
        return pos;
}
