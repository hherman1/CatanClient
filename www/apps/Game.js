//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                    UTILITY FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////

function last(list) {
        return list[list.length - 1]
}

//function to shuffle up the number tokens
//Source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                       GAME FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////

Reference = function(data) {
        return {data:data}
}


GameState = function() {
        this.board = new Board();
        this.phase;
        this.players = [];
        this.currentPlayerID = null;
}

Graphics = function(){
        this.animations = new Reference([])
        this.transform = {
               translation: new Vector(0,0)
              ,scale: 1
        }
}

Server = function() {
        this.gamestate = new GameState();
        this.getState = function() {
                return this.gamestate;
        }
        this.newGame = function(width) {
            this.gamestate.board = new RegularHexBoard(width);
            this.gamestate.players = []
        }
        this.addPlayer = function(player) {
                this.gamestate.players.push(player);
        }
}

Buffer = function() {
    this.mouse = new MouseBuffer();
    this.ui = {};
}


Game = function(ctx,mouse,buffer,graphics,server,actions,gamestate,hitboxes,images,side) {
        this.ctx = ctx;
        this.mouse = mouse; //new Mouse();
        this.buffer = buffer; //new Buffer();
        this.graphics = graphics; //new Graphics();
        this.server = server; //new Server();
        this.actions = actions; //new Reference([]);
        this.gamestate = gamestate;
        this.hitboxes = hitboxes;
        this.images = images;
        this.side = side;
}
CatanGame = function(side,ctx) {
        Game.call(this
                 ,ctx
                 ,new Mouse()
                 ,new Buffer()
                 ,new Graphics()
                 ,new Server()
                 ,new Reference([])
                 ,null,null,null,side)
        var canvas = ctx.canvas;
        this.ctx = ctx;
        this.graphics.transform.translation = center(new Vector(canvas.width,canvas.height));
        this.side = side;

        //the below code may be better suited elsewhere

        initMouseBuffer(canvas,this.buffer.mouse);
        this.server.newGame(5);
        this.gamestate = this.server.getState();
        this.hitboxes =
                genHitboxes(this.gamestate.board.vertices
                           ,[]
                           ,this.gamestate.board.hexes
                           ,this.side);

        //TEMPORARY
        this.gamestate.players.push(new Player(1));
        this.gamestate.currentPlayerID = 1;
}


cloneGameState = function(gameState) {
        var out = new GameState();
        out.board = cloneBoard(gameState.board);
        out.players = gameState.players.map(clonePlayer);
        out.currentPlayerID = gameState.currentPlayerID;
        return out;
}


function runGame(game,frameDuration) {
        window.setInterval(gameStep,frameDuration,game);
}

function gameStep(game) {
        var hitlist = transformHitlist(game.hitboxes,game.graphics.transform);
        mouse = processBuffer(game.mouse,game.buffer.mouse);
        var hits = getHits(hitlist,game.mouse.pos);

        if(game.mouse.dragging) {
                game.graphics.transform.translation = add(game.graphics.transform.translation,game.mouse.movement);
        }
        if(game.mouse.scroll.y != 0) {
                game.graphics.transform.scale = newScale(game.mouse.scroll.y,game.graphics.transform.scale);
        }
        if(game.mouse.clicked) {
                hits.forEach(function(hit) {
                        if(hit.data.type == Position.Type.Vertex) {
                                game.actions.data.push(new Action.BuildSettlement(hit.data.coordinate));
                        }
                })
        }

        //console.log(game.actions.data);

        var side=50;

        redraw(game.gamestate
              ,game.actions.data
              ,game.graphics.transform
              ,game.graphics.animations
              ,side
              ,game.ctx);
        flushMouseEvents(game.buffer.mouse);
        drawHitboxes(hitlist,hits,game.ctx);

}
