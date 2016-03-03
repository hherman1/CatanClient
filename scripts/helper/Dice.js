//DICE
//generate roll of 2 dice
//created by sduong

/*
rollDice generates the "rolling" for two dice and stores the sum of the two rolls in rsum.
*/
function rollDice(){
	var roll1 = Math.round(Math.random() * 5)+1;
	var roll2 = Math.round(Math.random() * 5)+1;
  var rsum = roll1 + roll2;
  drawRoll(rsum);
	// if (rsum == 7){ //will have to implement elsewhere when we start worrying about moving the robber
	// 	moveRobber();
	// }
}
/*
getRsum is a getter method that returns rsum.
*/
function getRsum(){
	return rsum;
}

/*
drawRoll renders the roll sum onto the canvas.
*/
function drawRoll(rsum){
  // ctx.fillStyle = '#C2DFFF';
  // ctx.fillRect(ctx.canvas.width/100,ctx.canvas.height/9,175,30);
  ctx.font = "bold 24px Courier New";
  ctx.fillStyle = "#6AA121";
  //ctx.fillText("ROLL RESULTS: " + roll1 + ", " + roll2,canvas.width/100,canvas.height/7);
  ctx.fillText("ROLL SUM: " + rsum, canvas.width/100,canvas.height/6);
}
