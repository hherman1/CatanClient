
function initGame(ctx) {
        var mousebuffer = newMouseBuffer();
        var hitboxes  = [];

        var canvas = ctx.canvas;

        canvas.addEventListener("click",mouseEventSaver(mousebuffer.clicks));
        canvas.addEventListener("mousemove",mouseEventSaver(mousebuffer.mousemoves));

        var frameDuration = 10;

        var server = null; //newServer()
        var gamestate = server.getState();

        var uiaction = null; //None?


        window.setInterval(gameStep,frameDuration
                            ,mousebuffer
                            ,hitboxes
                            ,uiaction
                            ,gamestate
                            ,server
                            ,ctx);
}



function gameStep(mousebuffer,hitboxes,uiaction,gamestate,server,ctx) {
        var hits = processHits(mousebuffer,hitboxes);


        flushMouseEvents(mousebuffer);
}



