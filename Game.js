
function initGame(ctx) {
        var mousebuffer = newMouseBuffer();
        var hitboxes  = [];

        var canvas = ctx.canvas;

        canvas.addEventListener("click",mouseEventSaver(mousebuffer.clicks));
        canvas.addEventListener("mousemove",mouseEventSaver(mousebuffer.mousemoves));

        var frameDuration = 10;


        window.setInterval(gameStep,frameDuration,mousebuffer,ctx)
}



function gameStep(mousebuffer,hitboxes,ctx) {
        var hits = processHits(mousebuffer,hitboxes);



        flushMouseEvents(mousebuffer);
}



