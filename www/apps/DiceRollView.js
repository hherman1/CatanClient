//This file is used for our dice roll animation and functionality.

define(['jquery','Animation','View'],function($,Animation,View) {

View.Message.newMessageType("RollDice",function(sender,targetRoll){
    this.targetRoll = targetRoll;
});

var DiceRollView = function(duration,steps,max,min) {
        var self = this;
        self.duration = duration;
        self.max = max;
        self.min = min;
        self.step = 0;
        self.steps = steps;
        View.ClientView.call(self,function(message) {
                if(message.hasType("RollDice")) {
                        self.startAnimation(message.targetRoll);
                }
        });
};
DiceRollView.prototype.genNum = function() {
        return Math.round(Math.random() * (this.max - this.min) + this.min);
}
DiceRollView.prototype.getLeftBox = function() {
        return $("#rollValue1");
}
DiceRollView.prototype.getRightBox = function() {
        return $("#rollValue2");
}
DiceRollView.prototype.setBoxes = function(left,right) {
        this.getLeftBox().html(left);
        this.getRightBox().html(right);
}
DiceRollView.prototype.regenBoxes = function() {
        this.setBoxes(this.genNum(),this.genNum());
}
animateDiceRoll = function(diceRollView,targetRoll) {
        var self = diceRollView;
        var deltaTime = self.duration * Animation.Timing.quadraticFixedDiscreteSum(self.step/self.steps,self.steps);
        self.step++;
        if(self.step >= self.steps) {
                self.setBoxes(targetRoll.first,targetRoll.second);
        } else {
                self.regenBoxes();
                setTimeout(animateDiceRoll,deltaTime,self,targetRoll);
        }
}
DiceRollView.prototype.startAnimation = function(target) {
        this.step = 0;
        animateDiceRoll(this,target);
}
return {DiceRollView:DiceRollView}
});
