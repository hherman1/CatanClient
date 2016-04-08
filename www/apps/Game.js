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
            applyActions(actionsToBeValidated.data, this.gamestate);//Applies pending actions to server gamestate
            flushActions(actionsToBeValidated);//Flushes the pendng actions
            nextPlayer(this.gamestate);//Change current player ID
            
            //UI method to show the new resources that players recieved at the start of their new turn
            //Generate resources
            //Roll Dice
            //UpdateUI with proper resource count and stats count
        }
}

Buffer = function() {
    this.mouse = new MouseBuffer();
    this.UI = new UI.Buffer();
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

function pushAnimation(animation,game) {
        game.graphics.animations.data.push(animation);
}

function processUIBuffer(buffer, game){
    buffer.messages.map(function(elem) {
            switch(elem) {
                    case UI.Message.EndTurn:
                        var coord = new Vector(game.ctx.canvas.width-150
                                              ,game.ctx.canvas.height+30);
                        var roll1 = rollDice();
                        var roll2 = rollDice();
                        var roll = roll1 + roll2;
                        console.log(getPlayers(3, game.gamestate.players)[0].resources);
                        console.log(roll);
                        pushAnimation(new DiceRollWindow(document.getElementById("rollValue1"),roll1,6,1,100),game);
                        pushAnimation(new DiceRollWindow(document.getElementById("rollValue2"),roll2,6,1,100),game);
    //                                  ,-1,1,12,100,60,1000) //new Vector(850,510)
      //                                ,game);
                        resourceGeneration(roll, game.gamestate.players, game.gamestate.board.vertices, game.gamestate.board.hexes);
                        game.server.endTurn(game.actions);
                        game.gamestate = game.server.getState();//Replaces the game's gamestate with the server's gamestate
                        break;
                    case UI.Message.BuildRoad:
                            console.log(elem);
                            console.log("Test case 2");
                        break;
                    case UI.Message.BuildSettlement:
                            console.log("Test case 3");
                        break;
                    case UI.Message.BuildCity:
                            console.log("Test case 4");
                        break;
                    default:
                            console.log('Err: UI.Buffer.messages| Array either contains null or a number not between 0-3 inclusive!');
                        break;
            }
    })
    flushBufferMessages(buffer);
    updateUIInfo(game.gamestate.players, game.gamestate.currentPlayerID);
}

function gameStep(game) {
        var shouldRedraw = false;

        var mouse = processBuffer(game.mouse,game.buffer.mouse);
        flushMouseEvents(game.buffer.mouse);

        var hitlist = transformHitlist(game.hitboxes,game.graphics.transform);
        var hits = getHits(hitlist,game.mouse.pos);
        var maxHit = getMaxPositionHit(hits);
        var potentialAction = genPotentialAction(game.gamestate.board.vertices
                                                 ,game.gamestate.board.roads
                                                 ,game.actions.data
                                                 ,maxHit);

        if(game.buffer.UI.messages.length !=  0) {

            processUIBuffer(game.buffer.UI, game)//Processes information from the UI in buffer

            game.buffer.UI.messages.map(function(message) {
                    switch(message) {
                            case UI.Messages.EndTurn:
                                    game.server.endTurn(game.actions.data);
                                    flushActions(game.actions);
                    }
            });
            flushBufferMessages(game.buffer.UI);//Flushes processed messages

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
                pushAnimation(new ClickCircle(mouse.pos,10,10),game);
                //hits.forEach(function(hit) {
                //
                if(maxHit != null && maxHit.data.type == Position.Type.Hex) {
                        pushAnimation(new InfoBox(mouse.pos,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",200,100,20),game);

                }

                if(potentialAction != null) {
                        game.actions.data.push(potentialAction);
                        if(!validateActions(game.actions.data,game.gamestate)) {
                                game.actions.data.pop();
                        }
                        shouldRedraw = true;
                }
        }

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


  server.gamestate.currentPlayerID = 1;

  console.log(server.getState().players);
}
