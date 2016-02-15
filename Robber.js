

//when someone rolls a '7', the settler is allowed to move the robber to a terrain.
function moveRobber(){
  //move the robber!
  //getSettlers //to check which settlers are settled around the terrain/hexagon. this will be a getter method.
  //robSettler //rob one of the settlers of their resources
  console.log("777 we moved the robber oh yeahh");
}

function drawRobber(x, y, z, ctx){
  var rob = new Image();
  rob.src = 'graphics/robber.svg';
  ctx.drawImage(rob, x-15, y-(z*0.75), z, z*1.25);

}



function robSettler(){

}
