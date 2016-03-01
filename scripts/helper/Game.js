
function Reference(data) {
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


function Buffer() {
    this.mouse = newMouseBuffer();
    this.ui = {};
}


Game = function(context) {
        this.ctx;
        this.mouse = newMouse();
        this.buffer = new Buffer();
        this.graphics = new Graphics();
        this.server = newServer();
        this.gamestate;
        this.hitboxes;  
        this.ui;
}

initGame = function(game,ctx) {
        var canvas = ctx.canvas;
        game.ctx = ctx;
        game.ui = new UI(canvas); //None?
        game.graphics.transform.translation = center(makeVector(canvas.width,canvas.height));

        //the below code may be better suited elsewhere

        initMouseBuffer(canvas,game.buffer.mouse);
        document.addEventListener("mouseup",mouseEventSaver(game.buffer.mouse.mouseups)) //Pay attention to mouse releases from anywhere in the document
        game.server.newGame(5);
        game.gamestate = game.server.getState();
        game.hitboxes = 
                genHitboxes(game.gamestate.board.map(function(tile) {return tile.coordinates})
                           ,[]
                           ,game.gamestate.board.map(function(tile) {return tile.coordinates})
                           ,50);
}

Graphics = function(){
        this.animations = new Reference([])
        this.transform = {
               translation: makeVector(0,0)
              ,scale: 1
        }
}

function UI(canvas) {
       this.build = 0
       this.loading = 1
       this.mode = this.build
}


function runGame(game,frameDuration) {
        window.setInterval(gameStep,frameDuration,game);
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

function gameStep(game) {
        var hitlist = transformHitlist(game.hitboxes,game.graphics.transform);
        mouse = processBuffer(game.mouse,game.buffer.mouse);
        var hits = getHits(hitlist,game.mouse.pos);

        if(game.mouse.clicked) {
                console.log("click")
        }
        if(game.mouse.dragging) {
                game.graphics.transform.translation = add(game.graphics.transform.translation,game.mouse.movement);
        }
        if(game.mouse.scroll.y != 0) {
                game.graphics.transform.scale = newScale(game.mouse.scroll.y,game.graphics.transform.scale);
        }

        //console.log(mouse.pos);

        redraw(game.gamestate.board,game.mouse,game.graphics.transform,game.graphics.animations,game.ctx);
        flushMouseEvents(game.buffer.mouse);
        drawHitboxes(hitlist,hits,game.ctx);

}
