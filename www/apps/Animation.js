
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
        }

}

Timing = {

        // A cubic function f with f' = 0 at the start and end of the period t in [0,1]
        cubic: function(t) {
                return (-2*Math.pow(t,3) + 3*Math.pow(t,2));
        },
        //A cubic function which sums to 1 for any discrete sum
        //t = k/n
        cubicFixedDiscreteSum(t,n) {
                return (2/(1+n))*Timing.cubic(t);
        },

        // a quadratic f with f' = 0 and f = {0,1,0} at {0,1/2,1} 
        quadratic(t) {
                return 16*(Math.pow(t,4)) - 32 * Math.pow(t,3) + 16 * Math.pow(t,2);
        },

        //see cubicFixedDiscreteSum
        quadraticFixedDiscreteSum(t,n) {
                var c = 15*Math.pow(n,3)/(8*(1+n)*(-1+n-Math.pow(n,2)+Math.pow(n,3)));
                return c * Timing.quadratic(t); 
        },

}

ClickCircle = function(coordinate,radius,frames,style) {
        Animation.MultiFrame.call(this
                        ,function(ctx,transform,frame,totalFrames) {
                                //setTransform(transform,ctx);
                                resetTransform(ctx);
                                ctx.beginPath();
                                var outerRadius = radius/2 + radius/2 * frame/totalFrames;
                                var innerRadius = radius * (frame/totalFrames)^2;
                                ctx.arc(coordinate.x,coordinate.y,outerRadius,0,2*Math.PI,false)
                                ctx.arc(coordinate.x,coordinate.y,innerRadius,0,2*Math.PI,true)
                                ctx.fill();
                        }
                        ,frames)
}




function pruneAnimations(anims) {
        return anims.filter(function(anim) {return !(anim.isOver())})
}

function drawAnims(anims,transform,ctx) {
        anims.forEach(function(anim){anim.draw(ctx,transform)})
}
