//

//user/settler object

function settler(){
  var settlementCount = 2; //keep track of number of settlements
  var roadCount = 2;   //keep track of number of roads built
  var resCount = 0; //keep track of the number of resources the settle has

  var settlerInfo = {
    settlement: settlementCount,
    road: roadCount,
    resources: resCount
  }
  return settlerInfo;
}
