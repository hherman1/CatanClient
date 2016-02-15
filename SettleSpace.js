


function SettleSpaceNode(){
  var ssn = {
    xco : x, //the x coordinate where the settle space is
    yco : y, //the y coordinate where the settle space is
    status : status, //the status of the space. can either be free or taken
    settler : settlerID, //the settler of the settle space
    terrain : terrainID //the terrains the settle space is connected/linked to
  }
  return ssn;
}
