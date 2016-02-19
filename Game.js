
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
       ,transform: {
               translation: makeVector(0,0)
              ,scale: 1
       }
       ,mode: this.build
}
                

function initGame(ctx) {
        var mouse = newMouse();
        var mousebuffer = newMouseBuffer();
        var hitboxes  = [];

        var canvas = ctx.canvas;

        initBuffer(canvas,mousebuffer);
        //Pay attention to mouse releases from anywhere in the document
        document.addEventListener("mouseup",mouseEventSaver(mousebuffer.mouseups))


        var frameDuration = 10;

        var server = newServer();
        server.newGame(5);
        var gamestate =  server.getState();

        var ui = UI //None?


        window.setInterval(gameStep,frameDuration
                            ,mouse
                            ,mousebuffer
                            ,hitboxes
                            ,ui
                            ,gamestate
                            ,server
                            ,ctx);
}


function last(list) {
        return list[list.length - 1]
}

function gameStep(mouse,mousebuffer,hitboxes,ui,gamestate,server,ctx) {

        mouse = processBuffer(mouse,mousebuffer);
        var hits = processHits(mouse,hitboxes);
        
        if(mouse.dragging) {
                ui.transform.translation = add(ui.transform.translation,mouse.movement);
        }


        redraw(gamestate.board,ui.transform,ctx);
        flushMouseEvents(mousebuffer);
        
}



