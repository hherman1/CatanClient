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
/*                                  FUNCTIONS THAT DON'T FIT                                        */
//////////////////////////////////////////////////////////////////////////////////////////////////////

function isPositionGreater(pos1,pos2) {
        return pos1 < pos2;
}


function getMaxPositionHit(hits) {
        var max = null;
        hits.map(function(h) {
            if (max == null) {
                    max = h
            }
            if (isPositionGreater(h.data.type,max.data.type)) {
                    max = h
            }
        })
        return max;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                       GAME FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////

Reference = function(data) {
        return {data:data}
}


GameState = function() {
        this.board = new Board();
        this.phase = Phase.Normal;
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
                player.resources = player.resources.map(function(){return 5})
                this.gamestate.players.push(player);
                this.gamestate.currentPlayerID = player.id;
        }
        this.endTurn = function(actionsToBeValidated){
            //Switch player method
            // -Takes in a list of actions, validate them, apply changes

            //need to get playerList
            //need to get vertexFrame
            //ned to get tileFrame
            /*
            var diceRoll = getRsum();
            var playerList = gamestate.players;
            var vertexFrame = gamestate.board.vertexFrame;
            var tileFrame = gamestate.tileFrame;
            resourceGeneration(diceRoll, playerList, vertexFrame, tileFrame)
            */
            //Shift player context (Who is making the moves/calls)
            //UI method to show the new resources that players recieved at the start of their new turn
            //
            ////////////////////////////////////////////////////
            //             TESTING CODE                       //
            ////////////////////////////////////////////////////

            applyActions(actionsToBeValidated,this.gamestate);
            this.gamestate.currentPlayerID = (this.gamestate.currentPlayerID + 1)%3+1;
        }
}

Buffer = function() {
    this.mouse = new MouseBuffer();
    this.UI = new UI.Buffer();
    //when click end turn put something in here so the game can see it the next turn
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
                           ,this.gamestate.board.roads
                           ,this.gamestate.board.hexes
                           ,this.side);

        //TEMPORARY
        // this.gamestate.players.push(new Player(1));
        // this.gamestate.currentPlayerID = 1;
        addPlayers(this.server);
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
        var shouldRedraw = false;

        var hitlist = transformHitlist(game.hitboxes,game.graphics.transform);
        var mouse = processBuffer(game.mouse,game.buffer.mouse);
        var hits = getHits(hitlist,game.mouse.pos);
        var potentialAction = genPotentialAction(game.gamestate.board.vertices
                                                 ,game.gamestate.board.roads
                                                 ,game.actions.data
                                                 ,getMaxPositionHit(hits));

        processUIBuffer(game.buffer.UI)

        if(game.buffer.UI.messages.length !=  0) {
                game.buffer.UI.messages.map(function(message) {
                        switch(message) {
                                case UI.Messages.EndTurn:
                                        game.server.endTurn(game.actions.data);
                                        game.actions.data.length = 0;
                        }
                });
                flushBufferMessages(game.buffer.UI);
        }
        if(hits.length != 0 || game.graphics.animations.data.length != 0) {
                shouldRedraw = true;
        }
        if(game.mouse.dragging) {
                game.graphics.transform.translation = add(game.graphics.transform.translation,game.mouse.movement);
                shouldRedraw = true;
        }
        if(game.mouse.scroll.y != 0) {
                game.graphics.transform.scale = newScale(game.mouse.scroll.y,game.graphics.transform.scale);
                shouldRedraw = true;
        }
        if(game.mouse.clicked) {
                game.graphics.animations.data.push(new ClickCircle(mouse.pos,10,10));
                //hits.forEach(function(hit) {

                if(potentialAction != null) {
                        game.actions.data.push(potentialAction);
                        if(!validateActions(game.actions.data,game.gamestate)) {
                                game.actions.data.pop();
                        }
                        shouldRedraw = true;
                }
        }

        //console.log(game.actions.data);
        flushMouseEvents(game.buffer.mouse);

        var side=50;

        if(shouldRedraw) {
                redraw(game.gamestate
                      ,potentialAction
                      ,game.actions.data
                      ,game.graphics.transform
                      ,game.graphics.animations
                      ,side
                      ,game.ctx);
                //drawHitboxes(hitlist,hits,game.ctx);
        }

}

//initialize players array. this function is used when users select which game to play (3 or 4 player game)
addPlayers = function(server){
  console.log("add players function in")
  for(var i = 0; i < localStorage.getItem("numPlayers"); i++) {
    server.addPlayer(new Player(i+1));
    console.log("player was added to the list of players");
  }

  console.log(server.getState().players);
}
