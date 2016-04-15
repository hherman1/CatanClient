
/*
 * Animation : {
 *  draw(ctx) 
 *  isOver()
 *  }
 */

Animation = {
        Type: {
                Object: 0,
                MultiFrame: 1,
        },
        Object: function(draw,isOver) {
                this.type = Animation.Type.Object
                this.draw=draw;
                this.isOver=isOver;
        },
        MultiFrame : function(draw,frames) {
                var self = this;
                Animation.Object.call(this
                              ,function(ctx,transform) {
                                      self.frame = self.frame + 1;
                                      return draw(ctx,transform,self.frame,self.totalFrames);
                              }
                              ,function(){return (self.frame >= self.totalFrames - 1)});
                self.type = Animation.Type.MultiFrame;
                self.frame = 0;
                self.totalFrames = frames;
        },
        MultiPhase : function(anims) {
                var self = this;
                self.currentAnim = 0;
                Animation.Object.call(this
                                ,function(ctx,transform) {
                                     anims[self.currentAnim].draw(ctx,transform);
                                     if(anims[self.currentAnim].isOver()) {
                                             self.currentAnim++;
                                     }
                                }
                                ,function() {
                                     return self.currentAnim >= anims.length;
                                });
        },
        //Draws both animations simultaneously
        //Draws background while not isOver
        //whole animation isOver when main isOver
        Auxiliary : function(main,background) {
                var self = this;
                Animation.Object.call(this
                                ,function(ctx,transform) {
                                        main.draw(ctx,transform);
                                        if(!background.isOver()); {
                                                background.draw(ctx,transform);
                                        }
                                }
                                ,main.isOver);
        },


}

Timing = {

        //f(0) = 0, f(1) = 1;
        linear: function(t) {
            return t;
        },

        //f(0) = 0, f(1) = 1, f'(1) = 0
        quadratic: function(t) {
                return -Math.pow(t,2) + 2*t;
        },

        //f(0) = 0, f(1) = 1, f'(0) = d
        quadraticInitialDerivative: function(t,d) {
                return (1 - d) * Math.pow(t,2) + d * t
        },

        // A cubic function f with f' = 0 at the start and end of the period t in [0,1]
        cubic: function(t) {
                return (-2*Math.pow(t,3) + 3*Math.pow(t,2));
        },
        //A cubic function which sums to 1 for any discrete sum from k=0 to n
        //t = k/n
        cubicFixedDiscreteSum(t,n) {
                return (2/(1+n))*Timing.cubic(t);
        },

        // a quartic f with f' = 0 and f = {0,1,0} at {0,1/2,1} 
        quartic(t) {
                return 16*(Math.pow(t,4)) - 32 * Math.pow(t,3) + 16 * Math.pow(t,2);
        },

        //see cubicFixedDiscreteSum
        quarticFixedDiscreteSum(t,n) {
                var c = 15*Math.pow(n,3)/(8*(1+n)*(-1+n-Math.pow(n,2)+Math.pow(n,3)));
                return c * Timing.quartic(t); 
        },

}

ClickCircle = function(coordinate,radius,frames) {
        Animation.MultiFrame.call(this
                        ,function(ctx,transform,frame,totalFrames) {
                                //setTransform(transform,ctx);
                                resetTransform(ctx);
                                ctx.beginPath();
                                var outerRadius = radius * Timing.linear(frame/totalFrames);
                                var innerRadius = radius * Timing.cubic(frame/totalFrames);
                                ctx.fillStyle = "rgba(0,0,0,0.8)";
                                ctx.arc(coordinate.x,coordinate.y,outerRadius,0,2*Math.PI,false)
                                ctx.arc(coordinate.x,coordinate.y,innerRadius,0,2*Math.PI,true)
                                ctx.fill();
                        }
                        ,frames)
}

XClick = function(coordinate,radius,frames) {
        Animation.MultiFrame.call(this
                        ,function(ctx,transform,frame,totalFrames) {
                                //setTransform(transform,ctx);
                                resetTransform(ctx);
                                ctx.beginPath();
                                var outerRadius = radius * Timing.quadraticInitialDerivative(frame/totalFrames,4);
                                var innerRadius = radius * Timing.cubic(frame/totalFrames);
                                ctx.strokeStyle = "rgba(255,0,0,0.8)";
                                ctx.lineWidth = "4";
                                linePath(add(ident(outerRadius),coordinate),add(ident(innerRadius),coordinate),ctx);
                                ctx.stroke();
                                linePath(add(ident(-outerRadius),coordinate),add(ident(-innerRadius),coordinate),ctx);
                                ctx.stroke();
                                linePath(add(new Vector(-outerRadius,outerRadius),coordinate)
                                        ,add(new Vector(-innerRadius,innerRadius),coordinate),ctx);
                                ctx.stroke();
                                linePath(add(new Vector(outerRadius,-outerRadius),coordinate)
                                        ,add(new Vector(innerRadius,-innerRadius),coordinate),ctx);
                                ctx.stroke();
                        }
                        ,frames)
}



InfoBox = function(coordinate,text,height,width,transitionFrames) {
        var self = this;

        var padding = 10;

        self.height = 0;

        self.incrementResize = function(target,frame,frames) {
                self.height += target*Timing.quarticFixedDiscreteSum(frame/frames,frames);
        }
        self.drawBox = function(text,ctx) {
                resetTransform(ctx);
                ctx.save();

                ctx.beginPath();
                ctx.rect(coordinate.x,coordinate.y,width,self.height);

                ctx.fillStyle = "rgba(50,50,50,0.99)";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;

                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.rect(coordinate.x,coordinate.y,width,self.height - padding);
                ctx.clip();

                ctx.fillStyle = "white";
                ctx.font = "11px sans-serif";
                wrapText(ctx,text,coordinate.x+padding,coordinate.y+padding,width-padding,11);

                ctx.restore();
        }
        self.drawResize = function(target) {
                return function(ctx,transform,frame,frames) {
                        self.incrementResize(target,frame,frames);
                        self.drawBox(text,ctx);
                }
        }
        Animation.MultiPhase.call(this
                        ,[new Animation.MultiFrame(self.drawResize(height),transitionFrames)
                         ,new Animation.MultiFrame(self.drawResize(0),100)
                         ,new Animation.MultiFrame(self.drawResize(-height),transitionFrames)])

}


function pruneAnimations(anims) {
        return anims.filter(function(anim) {return !(anim.isOver())})
}

function drawAnims(anims,transform,ctx) {
        anims.forEach(function(anim){anim.draw(ctx,transform)})
}


