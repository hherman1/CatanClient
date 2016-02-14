//takes the start and end points of the road and a color and draws it on the ctx
function drawRoad(verta,vertb,color,ctx) {
  ctx.beginPath();
  ctx.moveTo(verta[0],verta[1]);
  ctx.lineTo(vertb[0],vertb[1]);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.stroke();
}
