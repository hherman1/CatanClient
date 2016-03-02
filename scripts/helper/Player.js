//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.

function player(id){

  var colors = {
    red: 0,
    orange: 1,
    blue: 2,
    white: 3
  };

  var colList = [colors.red, colors.orange, colors.blue, colors.white];  //Player colors will be consistently assigned
                                                 //in accordance with their ID
  //Player owned constructions
  var settlementCount = 2; //each player starts out with 2 settlements
  var roadCount = 2; //each player starts out with 2 roads
  var cityCount = 0;
  //Player roads
  var roadList = [];
  //Coordinates of vertices the player has settled (list of vectors)
  var settledVertices = [];
  //Player owned resources
  var lumberCount = 0;
  var wheatCount = 0;
  var oreCount = 0;
  var brickCount = 0;
  var sheepCount = 0;
  //Color assigned
  var playerColor = colList[id-1];
  //Player victory points
  var vicPoints = 0;
  var playerInfo = {
    id:id,
    settlement: settlementCount,
    road: roadCount,
    city: cityCount,
    lumberCount: lumberCount,
    wheatCount: wheatCount,
    oreCount: oreCount,
    brickCount: brickCount,
    sheepCount: sheepCount,
    playerColor: playerColor,
    vicPoints:vicPoints,
    roadList:roadList,
    settledVertices:settledVertices
  }
  return playerInfo;
}

function getPlayer(id, playerList){
  for(i = 0;i<playerList.length;i++){
    if(playerList[i].id == id){
      return playerList[i];
    }
  }
    return undefined;
}

function addResources(player, resource, amount){
  switch(resource){
    case Resource.Brick:
          player.brickCount += amount;
    case Resource.Grain:
          player.wheatCount += amount;
    case Resource.Lumber:
          player.woodCount += amount;
    case Resource.Ore:
          player.oreCount += amount;
    case Resource.Wool:
          player.sheepCount += amount;
  }

    //TODO: Complete
}

