
/*
 * Animation : {
 *  draw(ctx) 
 *  isOver()
 *  }
 */

function newAnimation(draw,isOver) {
        return {draw:draw,isOver:isOver}
}


function multiFrame(draw,frames) {
        return {draw:function(ctx){this.frames -= 1; return draw(ctx,this.frames)}
               ,frames:frames
               ,isOver: function(){return (this.frames <= 0)}
        }

}

function pruneAnimations(anims) {
        return anims.filter(function(anim) {return !(anim.isOver())})
}

function drawAnims(anims,ctx) {
        anims.forEach(function(anim){anim.draw(ctx)})
}
