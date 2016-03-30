
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
                              ,function(){return (this.frame >= this.totalFrames - 1)});
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

DiceRoll = function(coordinate,target,max,min,radius,vert,frames) {

        var self = this;

        self.nextNum = function() {
                return Math.round(Math.random() * (max - min) + min);
        }
        self.numCount = 12;
        self.nums = Array.apply(null,Array(self.numCount)).map(self.nextNum);
        self.nums[0] = target;

        var spinFramesFraction = 7/10;
        var angleDiff = 2 * Math.PI / self.nums.length;

        self.rotationOffset = function(totalFrames) {
                var totalRotation = 0;
                for(var i = 0; i < totalFrames;i++) {
                        totalRotation += self.getSpeed(i,totalFrames);
                }
                return (angleDiff*totalFrames/(7*2)) % (Math.PI*2) //Math.PI * 2 - totalRotation%(Math.PI * 2);
        }

        self.getSpeed = function(frame,totalFrames) {
                return 1 - 1 * (2*Math.abs(frame - totalFrames/2)/totalFrames);
        }
        
        self.rotation = self.rotationOffset(spinFramesFraction*frames);
        self.vertical = 0;

        self.tween = function(verticalDiff) {
                return function(ctx,transform,frame,totalFrames) {
                        var n = totalFrames/2;
                        var constant = 2/(n * (1 + n));
                        if(frame < n) {
                                self.vertical += 1/2 * verticalDiff  * constant * frame;
                        } else {
                                self.vertical += 1/2 * verticalDiff  * constant * (2*n - frame);
                        }
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
                        ctx.fillText("" + n,0,-radius);
                        ctx.rotate(angleDiff);
                })
        }

        self.drawSpin = function(ctx,transform,frame,totalFrames) {
                resetTransform(ctx);
                var angleDiff = 2 * Math.PI / self.nums.length;
                var speed = self.getSpeed(frame,totalFrames);
                self.rotation = self.rotation - speed*angleDiff/7;
                self.drawWheel(ctx);
        }
        Animation.MultiPhase.call(self
                        ,[new Animation.MultiFrame(self.tween(-vert),frames/10)
                         ,new Animation.MultiFrame(self.drawSpin,spinFramesFraction*frames)
                         ,new Animation.MultiFrame(self.drawWheel,frames/10)
                         ,new Animation.MultiFrame(self.tween(vert),frames/10)]);
}



function pruneAnimations(anims) {
        return anims.filter(function(anim) {return !(anim.isOver())})
}

function drawAnims(anims,transform,ctx) {
        anims.forEach(function(anim){anim.draw(ctx,transform)})
}
