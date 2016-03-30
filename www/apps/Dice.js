//DICE
//generate roll of 2 dice
//created by sduong
var rsum = 0;//Initialize global instance of rsum so it can be returned

/*
rollDice generates the "rolling" for two dice and stores the sum of the two rolls in rsum.
*/
function rollDice(){
  var rollHolder = document.getElementById("rollValue");
  //disableRollButton();
  for (var i = 30000; i >= 0; i--) {//TODO make the scroll part more "conventional" and less "MVP"
    setTimeout(function()
    {
      var roll1 = Math.round(Math.random() * 5)+1;
      var roll2 = Math.round(Math.random() * 5)+1;
      rsum = roll1 + roll2;
      rollHolder.innerHTML = rsum;
    }, 100);
  };
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
Prints rsum on the bottomRightDisplay of the UI
*/
function rollUpdate(rsum){
  var rollHolder = document.getElementById("rollValue");
  rollHolder.innerHTML = rsum;
}

/*
This function disables the roll button in between turns
*/
function disableRollButton(){
  var rollButton = document.getElementById("endTurnButton")
  rollButton.disabled = true;
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



/*__________________________________________
Extra code: Can be deleted by end of project
function diceScroll2(){
  for (var i = 100; i >= 0; i--){
    setInterval(rollDice(),100);
  }
}

//Old diceRoll()
function rollDice(){
  var roll1 = Math.round(Math.random() * 5)+1;
  var roll2 = Math.round(Math.random() * 5)+1;
  var rsum = roll1 + roll2;
  rollUpdate(rsum);
  console.log(rsum);
  // if (rsum == 7){ //will have to implement elsewhere when we start worrying about moving the robber
  //  moveRobber();
  // }
}

function diceScroll(){
  var rollHolder = document.getElementById("rollValue");
  for (var i = 10000; i >= 0; i--) {
    setTimeout(function()
    {
      var roll1 = Math.round(Math.random() * 5)+1;
      var roll2 = Math.round(Math.random() * 5)+1;
      var rsum = roll1 + roll2;
      rollHolder.innerHTML = rsum;
    }, 100);
  };
}


*/
