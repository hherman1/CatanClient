
function newServer() {
        return {
                gamestate: null
                ,getState:function() {
                        return this.gamestate
                }
                ,newGame: function(width) {
                    this.gamestate = {
                        board: buildRegularHexFramework(width),
                        phase: null,
                        players: []
                    }
                }
                ,addPlayer: function(player) {
                        this.gamestate.players.push(player);
                }
        }
}

UI = {
        build: 0
       ,loading: 1
}
                

function initGame(ctx) {
        var mousebuffer = newMouseBuffer();
        var hitboxes  = [];

        var canvas = ctx.canvas;

        canvas.addEventListener("click",mouseEventSaver(mousebuffer.clicks));
        canvas.addEventListener("mousemove",mouseEventSaver(mousebuffer.mousemoves));

        var frameDuration = 10;

        var server = newServer();
        server.newGame(5);
        var gamestate =  server.getState();

        var uimode = UI.build; //None?


        window.setInterval(gameStep,frameDuration
                            ,mousebuffer
                            ,hitboxes
                            ,uiaction
                            ,gamestate
                            ,server
                            ,ctx);
}



function gameStep(mousebuffer,hitboxes,uimode,gamestate,server,ctx) {
        var hits = processHits(mousebuffer,hitboxes);

        
        flushMouseEvents(mousebuffer);
}



