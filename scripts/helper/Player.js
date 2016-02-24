//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.

function player(id){
  colList = ["red", "orange", "blue", "white"];  //Player colors will be consistently assigned
                                                 //in accordance with their ID
  //Player owned constructions
  var settlementCount = 0;
  var roadCount = 0;
  var cityCount = 0;
  //Player roads
  var roadList = [];
  //Coordinates of vertices the player has settled
  var settledVertices = []; 
  //Player owned resources
  var woodCount = 0;
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
    woodCount: woodCount,
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