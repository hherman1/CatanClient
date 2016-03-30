
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
                Animation.Object.call(this
                              ,function(ctx,transform) {
                                      this.frame = this.frame + 1;
                                      return draw(ctx,transform,this.frame,this.totalFrames);
                              }
                              ,function(){return (this.frame > this.totalFrames)});
                this.type = Animation.Type.MultiFrame;
                this.frame = 0;
                this.totalFrames = frames;
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
