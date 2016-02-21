Terrain = {
  Wood: 0,
  Sheep: 1,
  Brick: 2,
  Grain: 3,
  Ore: 4
}

function TerrainNode(i, x, y, toke, res, ss){
  var tn = {
    //terrainID : i, //the terrain id
    xco : x, //the x coordinate where the terrain node is placed
    yco : y, //the y coordinate where the terrain node is placed
    token : toke, //the number token assigned to this terrain
    resource : res, //the resource the terrain outputs
    settleSpaces : ss //the 6 settle spaces nodes linked to the terrain
  }
  return tn;
}
