//This file is used for our dice roll animation and functionality.
import * as View from "./View"
import * as Animation from "./Animation"
import {Roll} from "./GameState"
export interface RollDice extends View.Message<"RollDice"> {
    targetRoll:Roll;
}
export class DiceRollView extends View.ClientView<RollDice,null> {
    types:string[] = ["RollDice"]
    step:number = 0;
    constructor(protected duration:number, protected steps:number,protected max:number,protected min:number) {
        super();
    }
    
    genNum() {
            return Math.round(Math.random() * (this.max - this.min) + this.min);
    }
    getLeftBox() {
            return $("#rollValue1");
    }
    getRightBox() {
            return $("#rollValue2");
    }
    setBoxes(left:string,right:string) {
            this.getLeftBox().html(left);
            this.getRightBox().html(right);
    }
    regenBoxes() {
            this.setBoxes(this.genNum().toString(),this.genNum().toString());
    }
    animateDiceRoll(targetRoll:Roll) {
            let self = this;
            var deltaTime = self.duration * Animation.Timing.quadraticFixedDiscreteSum(self.step/self.steps,self.steps);
            self.step++;
            if(self.step >= self.steps) {
                    self.setBoxes(targetRoll.left.toString(),targetRoll.right.toString());
            } else {
                    self.regenBoxes();
                    setTimeout(this.animateDiceRoll.bind(this),deltaTime,targetRoll);
            }
    }
    startAnimation(target:Roll) {
            this.step = 0;
            this.animateDiceRoll(target);
    }
    onMessage(message:RollDice) {
        this.startAnimation(message.targetRoll);
    }
}

