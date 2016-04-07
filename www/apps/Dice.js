//DICE
//generate roll of 2 dice
//created by sduong

/*
rollDice generates the "rolling" for two dice and stores the sum of the two rolls in rsum.
*/
function setDice(rollHolder,val) {
      rollHolder.innerHTML = val;
}
/*
function rollDice(target,time){
  //disableRollButton();
  for (var i = 30000; i >= 0; i--) {//TODO make the scroll part more "conventional" and less "MVP"
    setTimeout(function()
    {
    }, 100);
  };
	// if (rsum == 7){ //will have to implement elsewhere when we start worrying about moving the robber
	// 	moveRobber();
	// }
}
*/

function rollDice(){
    var roll1 = Math.floor(Math.random()* 6) + 1;
    var roll2 = Math.floor(Math.random()* 6) + 1;
    return roll1 + roll2
}

function rollDiceValue(max) {
      var roll1 = Math.round(Math.random() * Math.floor((max-1)/2))+1;
      var roll2 = Math.round(Math.random() * Math.floor((max-1)/2))+1;
      return roll1 + roll2;
}

DiceRollUI = function(target,max,frames) {
        var rollHolder = document.getElementById("rollValue");
        Animation.MultiFrame.call(this
                        ,function(ctx,transform,frame,totalFrames) {
                                setDice(rollHolder,rollDiceValue(max));
                                if((totalFrames - frame) <= 1) {
                                        setDice(rollHolder,target);
                                }
                        }
                        ,frames);
}

DiceRollWindow = function(box,target,max,min,frames) {
        var self = this;
        
        self.nextNum = function() {
                return Math.round(Math.random() * (max - min) + min);
        }
        self.numCount = 12;
        
        self.draw = function(ctx,transform,frame,totalFrames) {
                if(frames % Math.ceil(Timing.cubic(frame/totalFrames)) == 0) {
                        box.innerHTML = "" + self.nextNum();
                } 
                if ((totalFrames - frame) <= 1) {
                        box.innerHTML = "" + target;
                }
        }

        Animation.MultiFrame.call(self,self.draw,frames);
}

DiceRoll = function(coordinate,target,min,max,radius,vert,frames) {

        var self = this;

        self.nextNum = function() {
                return Math.round(Math.random() * (max - min) + min);
        }
        self.numCount = 12;
        self.nums = Array.apply(null,Array(self.numCount)).map(self.nextNum);
        self.nums[0] = target;

        var textWidth = 28;
        var numSpins = 10;
        var spinFramesFraction = 7/10;
        var angleDiff = 2 * Math.PI / self.nums.length;

        self.getTargetRotationWithSpins = function(spins,target,offset) {
                return spins*2*Math.PI + ((offset - target) % (2 * Math.PI))
        }

        self.getSpeed = function(frame,totalFrames) {
                var n = totalFrames - 1;
                return self.totalRotation * Timing.quadraticFixedDiscreteSum(frame/n,n);
        }
        
        self.rotation = Math.random() * 2 * Math.PI
        self.totalRotation = self.getTargetRotationWithSpins(numSpins,0,self.rotation);
        self.vertical = 0;

        self.tween = function(verticalDiff) {
                return function(ctx,transform,frame,totalFrames) {
                        self.vertical += verticalDiff * Timing.quadraticFixedDiscreteSum(frame/totalFrames,totalFrames);
                        self.drawWheel(ctx);
                }
        }

        self.drawBackground = function(ctx) {
                resetTransform(ctx);
                ctx.translate(coordinate.x,coordinate.y+self.vertical);

                var fillRadius = radius + radius/3;

                var gradient = ctx.createRadialGradient(0,0,fillRadius/2,0,0,fillRadius);
                gradient.addColorStop(1,"#FFF0BD");
                gradient.addColorStop(0,"#FFFFCD");
                ctx.fillStyle = gradient;
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";

                ctx.beginPath()
                ctx.arc(0,0,fillRadius,0,2*Math.PI,false);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
        }
        
        self.drawWheel = function(ctx) {

                self.drawBackground(ctx);
                
                resetTransform(ctx);
                ctx.translate(coordinate.x,coordinate.y + self.vertical);
                ctx.rotate(self.rotation);

                ctx.font = "28px sans-serif";
                ctx.fillStyle="rgba(0,0,0,1)";

                ctx.beginPath();
                self.nums.map(function(n) {
                        ctx.fillText("" + n,-textWidth/2,-radius,textWidth);
                        ctx.rotate(angleDiff);
                })
        }

        self.drawSpin = function(ctx,transform,frame,totalFrames) {
                resetTransform(ctx);
                var angleDiff = 2 * Math.PI / self.nums.length;
                self.rotation = self.rotation - self.getSpeed(frame,totalFrames);
                self.drawWheel(ctx);
        }
        Animation.MultiPhase.call(self
                        ,[new Animation.MultiFrame(self.tween(-vert),frames/10)
                         ,new Animation.Auxiliary(
                                 new Animation.MultiFrame(self.drawSpin,spinFramesFraction*frames)
                                ,new DiceRollUI(target,max,spinFramesFraction*frames))
                         ,new Animation.MultiFrame(self.drawWheel,frames/10)
                         ,new Animation.MultiFrame(self.tween(vert),frames/10)]);
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



