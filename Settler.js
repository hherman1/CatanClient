//

//user/settler object

function settler(){
  var settlementCount = 2; //keep track of number of settlements built
  var roadCount = 2;   //keep track of number of roads built
  var cityCount = 0; //keep track of number of cities built
  var resCount = 0; //keep track of the number of resources the settle has
  var colorID = selectColor(); //color of the settler's buildings

  var settlerInfo = {
    settlement: settlementCount,
    road: roadCount,
    city: cityCount,
    resources: resCount,
    settlerID: colorID
  }
  return settlerInfo;
}

function selectColor(){
  var color = "yellow"; //for now i'm just going to make users be yellow
  //colors for select from (4): red, blue, yellow, white <--Catan colors (we can change this if we want)
  return color;
}
