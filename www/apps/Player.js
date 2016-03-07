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
  this.settlementCount = 2; //each player starts out with 2 settlements
  this.roadCount = 2; //each player starts out with 2 roads
  this.cityCount = 0;
  //Coordinates of vertices the player has settled (list of vectors)
  this.settledVertices = [];
  //Player owned resources
  this.lumberCount = 0;
  this.wheatCount = 0;
  this.oreCount = 0;
  this.brickCount = 0;
  this.sheepCount = 0;
  //Color assigned
  this.playerColor = Colors.List[id-1];
  //Player victory points
  this.vicPoints = 0;
}

function getPlayer(id, playerList){
  for(i = 0;i<playerList.length;i++){
    if(playerList[i].id == id){
      return playerList[i];
    }
  }
    return undefined;
}

function modifyResources(player, resource, amount){
  switch(resource){
    case Resource.Brick:
          player.brickCount += amount;
    case Resource.Grain:
          player.grainCount += amount;
    case Resource.Lumber:
          player.lumberCount += amount;
    case Resource.Ore:
          player.oreCount += amount;
    case Resource.Wool:
          player.woolCount += amount;
  }

    //TODO: Complete
}
