

//when someone rolls a '7', the settler is allowed to move the robber to a terrain.
function moveRobber(){
  //move the robber!
  console.log("we moved the robber oh yeahh");
}

function drawRobber(x, y, z, ctx){
  var rob = new Image();
  rob.src = 'graphics/robber.svg';
  ctx.drawImage(rob, x-15, y-(z*.75), z, z*1.25);

}
