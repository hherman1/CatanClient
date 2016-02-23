
function newReference(data) {
        return {data:data}
}

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

function newUI(canvas) {
        return {
                build: 0
               ,loading: 1
               ,transform: {
                       translation: makeVector(canvas.width/2,canvas.height/2)
                      ,scale: 1
               }
               ,mode: this.build
        }
}


function initGame(ctx) {
        var mouse = newMouse();
        var mousebuffer = newMouseBuffer();

        var canvas = ctx.canvas;

        initBuffer(canvas,mousebuffer);
        //Pay attention to mouse releases from anywhere in the document
        document.addEventListener("mouseup",mouseEventSaver(mousebuffer.mouseups))


        var frameDuration = 10;

        var animations = newReference([]);

        var server = newServer();
        server.newGame(5);
        var gamestate =  server.getState();
        var hitboxes  = genTileBoxes(gamestate.board.map(function(tile) {return tile.coordinates}),50)
                        .concat(genVertexBoxes(gamestate.board.map(function(tile) {return tile.coordinates}),50))
                        .concat([genLineBox(makeVector(0,0),makeVector(0,1),50),genLineBox(makeVector(1,0),makeVector(0,1),50)])
        var ui = newUI(canvas) //None?

        setInitResTok(); //set the resources and tokens (new shuffling of resources and tokens)
        window.setInterval(gameStep,frameDuration
                            ,mouse
                            ,mousebuffer
                            ,hitboxes
                            ,ui
                            ,animations
                            ,gamestate
                            ,server
                            ,ctx);
}


function last(list) {
        return list[list.length - 1]
}

function newScale(delta,scale) {

        function sigmoid(x) {
                return 1/(1 + Math.exp(-x))
        }
        function spec(x) {
                return sigmoid(x) + 0.5
        }
        var out = scale + sigmoid(scale)/2* ((sigmoid(delta/10) - 0.5)/4) ;
        if ( out < 0.5) {
                return 0.5;
        } else if (out > 1.5) {
                return 1.5;
        } else {
                return out;
        }
}

function gameStep(mouse,mousebuffer,hitboxes,ui,animations,gamestate,server,ctx) {
        var hitlist = transformHitlist(hitboxes,ui.transform);
        mouse = processBuffer(mouse,mousebuffer);
        var hits = getHits(hitlist,mouse.pos);

        if(mouse.clicked) {
                console.log("click")
        }
        if(mouse.dragging) {
                ui.transform.translation = add(ui.transform.translation,mouse.movement);
        }
        if(mouse.scroll.y != 0) {
                ui.transform.scale = newScale(mouse.scroll.y,ui.transform.scale);
        }

        //console.log(mouse.pos);

        redraw(gamestate.board,mouse,ui.transform,animations,ctx);
        flushMouseEvents(mousebuffer);
        drawHitboxes(hitlist,hits,ctx);

}
