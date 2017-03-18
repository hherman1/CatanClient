import * as Grid from "./Grid"
import * as Transform from "./Transform"
import * as CanvasMethods from "./CanvasMethods"
/*
* Animation : {
    *  draw(ctx) 
    *  isOver()
    *  }
    */
    // Type: {
    //         Object: 0,
    //         MultiFrame: 1,
    // },
type DrawFunction = (ctx:CanvasRenderingContext2D,transform:Transform.Transform)=>void
export abstract class Animation {
    //type = Animation.Type.Object
    abstract draw(ctx:CanvasRenderingContext2D,transform:Transform.Transform):void
    abstract isOver():boolean;
}
export abstract class MultiFrameAnimation extends Animation {
    frame:number = 0;
    draw(ctx:CanvasRenderingContext2D,transform:Transform.Transform) {
        this.frame++;
        this.drawFrame(ctx,transform,this.frame,this.totalFrames);
    }
    isOver() {
        return (this.frame >= this.totalFrames - 1)
    }
    abstract drawFrame(ctx:CanvasRenderingContext2D,transform:Transform.Transform,frame:number,totalFrames:number):void;
    constructor(public totalFrames:number) {
        super();
    }
}
export function makeMultiFrameAnimation(drawFrame:(ctx:CanvasRenderingContext2D,transform:Transform.Transform,frame:number,totalFrames:number)=>void
,totalFrames:number):MultiFrameAnimation {
    return new class extends MultiFrameAnimation {
        drawFrame(ctx:CanvasRenderingContext2D,transform:Transform.Transform,frame:number,totalFrames:number) {
            drawFrame(ctx,transform,frame,totalFrames);
        }
    }(totalFrames)
}
export abstract class MultiPhaseAnimation extends Animation {
    currentAnim:number = 0;
    get current():Animation {
        return this.anims[this.currentAnim]
    }
    isOver() {
        return this.currentAnim >= this.anims.length;
    }
    draw(ctx:CanvasRenderingContext2D,transform:Transform.Transform) {
        this.current.draw(ctx,transform);
        if(this.current.isOver()) {
            this.currentAnim++;
        }
    }
    constructor(protected anims:Animation[]) {
        super();
    }
}

//Draws both animations simultaneously
//Draws background while not isOver
//whole animation isOver when main isOver
export class Auxiliary extends Animation {
    constructor(protected main:Animation,protected aux:Animation) {
        super()
    }
    isOver() {
        return this.main.isOver();
    }
    draw(ctx:CanvasRenderingContext2D,transform:Transform.Transform) {
        this.main.draw(ctx,transform);
        if(!this.aux.isOver()) {
            this.aux.draw(ctx,transform);
        }
    }
}
        
export namespace Timing {
    
    //f(0) = 0, f(1) = 1;
    export let linear = function(t:number) {
        return t;
    };
    
    //f(0) = 0, f(1) = 1, f'(1) = 0
    export let quadratic = function(t:number) {
        return -Math.pow(t,2) + 2*t;
    }
    
    //A quadratic function which sums to 1 for any discrete sum from k=0 to n
    //t = k/n
    export let quadraticFixedDiscreteSum = function(t:number,n:number) {
        var c = 6*n/((1+n)*(-1+4*n));
        return c*Timing.quadratic(t);
    }
    
    //f(0) = 0, f(1) = 1, f'(0) = d
    export let quadraticInitialDerivative = function(t:number,d:number) {
        return (1 - d) * Math.pow(t,2) + d * t
    }
    
    // A cubic function f with f' = 0 at the start and end of the period t in [0,1]
    export let cubic = function(t:number) {
        return (-2*Math.pow(t,3) + 3*Math.pow(t,2));
    }
    //A cubic function which sums to 1 for any discrete sum from k=0 to n
    //t = k/n
    export let cubicFixedDiscreteSum = function (t:number,n:number){
        return (2/(1+n))*Timing.cubic(t);
    }
    
    // a quartic f with f' = 0 and f = {0,1,0} at {0,1/2,1} 
    export let quartic = function(t:number) {
        return 16*(Math.pow(t,4)) - 32 * Math.pow(t,3) + 16 * Math.pow(t,2);
    }
    
    //see cubicFixedDiscreteSum
    export let quarticFixedDiscreteSum = function(t:number,n:number) {
        var c = 15*Math.pow(n,3)/(8*(1+n)*(-1+n-Math.pow(n,2)+Math.pow(n,3)));
        return c * Timing.quartic(t); 
    }
    
}

export class ClickCircle extends MultiFrameAnimation {
    drawFrame(ctx:CanvasRenderingContext2D,transform:Transform.Transform,frame:number,totalFrames:number) {
        Transform.resetTransform(ctx);
        ctx.beginPath();
        var outerRadius = this.radius * Timing.quadraticInitialDerivative(frame/totalFrames,0);
        var innerRadius = this.radius * Timing.linear(frame/totalFrames);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.arc(this.coordinate.x,this.coordinate.y,outerRadius,0,2*Math.PI,false)
        ctx.arc(this.coordinate.x,this.coordinate.y,innerRadius,0,2*Math.PI,true)
        ctx.fill();
    }
    constructor(protected coordinate:Grid.Point,protected radius:number, totalFrames:number) {
        super(totalFrames);
    }
}

export class XClick extends MultiFrameAnimation {
    innerStyle(ctx:CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(255,0,0,0.8)";
        ctx.lineWidth = 7;
    }
    outerStyle(ctx:CanvasRenderingContext2D) {/*
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = "5";
        */
    }
    drawSegment(start:Grid.Point,end:Grid.Point,ctx:CanvasRenderingContext2D) {
        CanvasMethods.linePath(start,end,ctx);
        this.outerStyle(ctx);
        ctx.stroke();
        this.innerStyle(ctx);
        ctx.stroke();
    }
    drawFrame(ctx:CanvasRenderingContext2D,transform:Transform.Transform,frame:number,totalFrames:number) {
        //setTransform(transform,ctx);
        Transform.resetTransform(ctx);
        ctx.beginPath();
        var outerRadius = this.radius * Timing.quadraticInitialDerivative(frame/totalFrames,4);
        var innerRadius = this.radius * Timing.cubic(frame/totalFrames);
        this.drawSegment(Grid.add(Grid.ident(outerRadius),this.coordinate)
        ,Grid.add(Grid.ident(innerRadius),this.coordinate),ctx);
        this.drawSegment(Grid.add(Grid.ident(-outerRadius),this.coordinate)
        ,Grid.add(Grid.ident(-innerRadius),this.coordinate),ctx);
        this.drawSegment(Grid.add({x:-outerRadius,y:outerRadius},this.coordinate)
        ,Grid.add({x:-innerRadius,y:innerRadius},this.coordinate),ctx);
        this.drawSegment(Grid.add({x:outerRadius,y:-outerRadius},this.coordinate)
        ,Grid.add({x:innerRadius,y:-innerRadius},this.coordinate),ctx);
        ctx.stroke();
    }
    constructor(protected coordinate:Grid.Point,protected radius:number,frames:number) {
        super(frames);
        let x = new class extends MultiFrameAnimation {
            drawFrame(ctx:CanvasRenderingContext2D,transform:Transform.Transform,frame:number,totalFrames:number):void {};
        }(1)
        
    }
}

export class InfoBox extends MultiPhaseAnimation {
    currentHeight:number = 0;
    padding = 10;
    
    
    constructor(protected coordinate:Grid.Point,protected text:string,protected height:number,protected width:number,protected transitionFrames:number) {
        super([]);
        this.anims = [makeMultiFrameAnimation(this.drawResize(height),transitionFrames),
            makeMultiFrameAnimation(this.drawResize(0),100),
            makeMultiFrameAnimation(this.drawResize(-height),transitionFrames)];
        var self = this;
    }
    drawBox(text:string,ctx:CanvasRenderingContext2D) {
        Transform.resetTransform(ctx);
        ctx.save();
        
        ctx.beginPath();
        ctx.rect(this.coordinate.x,this.coordinate.y,this.width,this.currentHeight);
        
        ctx.fillStyle = "rgba(50,50,50,0.99)";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.rect(this.coordinate.x,this.coordinate.y,this.width,this.currentHeight - this.padding);
        ctx.clip();
        
        ctx.fillStyle = "white";
        ctx.font = "11px sans-serif";
        CanvasMethods.wrapText(ctx,text,this.coordinate.x+this.padding,this.coordinate.y+this.padding,this.width-this.padding,11);
        
        ctx.restore();
    }
    incrementResize(target:number,frame:number,frames:number) {
        this.currentHeight += target*Timing.quarticFixedDiscreteSum(frame/frames,frames);
    }
    drawResize(target:number) {
        let self=this;
        return function(ctx:CanvasRenderingContext2D,transform:Transform.Transform,frame:number,frames:number) {
            self.incrementResize(target,frame,frames);
            self.drawBox(self.text,ctx);
        }
    }
}

export function pruneAnimations(anims:Animation[]) {
    return anims.filter(function(anim) {return !(anim.isOver())})
}

export function drawAnims(anims:Animation[],transform:Transform.Transform,ctx:CanvasRenderingContext2D) {
    anims.forEach(function(anim){anim.draw(ctx,transform)})
}
        
        