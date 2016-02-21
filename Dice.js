//DICE
//generate roll of 2 dice
//created by sduong

function rollDice(){
	var roll1 = Math.round(Math.random() * 5)+1;
	var roll2 = Math.round(Math.random() * 5)+1;
  var rsum = 0;
	rsum = roll1 + roll2;
  drawRoll(roll1,roll2,rsum);
	if (rsum == 7){
		moveRobber();
	}
  return rsum;
}

function drawRoll(roll1, roll2,rsum){
  ctx.fillStyle = '#C2DFFF';
  ctx.fillRect(ctx.canvas.width/100,ctx.canvas.height/9,175,30);
  ctx.font = "bold 24px Courier New";
  ctx.fillStyle = "#6AA121";
  //ctx.fillText("ROLL RESULTS: " + roll1 + ", " + roll2,canvas.width/100,canvas.height/7);
  ctx.fillText("ROLL SUM: " + rsum, canvas.width/100,canvas.height/6);
}