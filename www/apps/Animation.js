
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
