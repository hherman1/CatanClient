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


Game = function() {
        this.ctx;
        this.mouse = new Mouse();
        this.buffer = new Buffer();
        this.graphics = new Graphics();
        this.server = new Server();
        this.actions = new Reference([]);
        this.gamestate;
        this.hitboxes;
        this.images;
}

getPlayers = function(players,playerID) {
        return players.filter(function(p) {return p.id == playerID});
}

cloneGameState = function(gameState) {
        var out = new GameState();
        out.board = cloneBoard(gameState.board);
        out.players = gameState.players.map(clonePlayer);
        out.currentPlayerID = gameState.currentPlayerID;
        return out;
}

initGame = function(game,ctx) {
        var canvas = ctx.canvas;
        game.ctx = ctx;
        game.graphics.transform.translation = center(new Vector(canvas.width,canvas.height));

        //the below code may be better suited elsewhere

        initMouseBuffer(canvas,game.buffer.mouse);
        game.server.newGame(5);
        game.gamestate = game.server.getState();
        game.hitboxes =
                genHitboxes(game.gamestate.board.vertices
                           ,[]
                           ,game.gamestate.board.hexes
                           ,50);

        //TEMPORARY
        game.gamestate.players.push(new Player(1));
        game.gamestate.currentPlayerID = 1;
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

        }

        hits.forEach(function(hit) {
//                if(hit.data.type == 
        })

        redraw(game.gamestate.board,game.mouse,game.graphics.transform,game.graphics.animations,game.ctx);
        flushMouseEvents(game.buffer.mouse);
        drawHitboxes(hitlist,hits,game.ctx);

}
