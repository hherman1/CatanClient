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
        this.phase = Phase.Init;
        this.rotation = Rotation.Forwards;
        this.players = [];
        this.tradeoffers = [];
        this.currentPlayerID = null;
}


Graphics = function(){
        this.animations = new Reference([])
        this.transform = {
               translation: new Vector(0,0)
              ,scale: 1
        }
        this.renderedHexes = $("<canvas></canvas>")[0];
        this.views = [];
}

Server = function() {
        this.roll = {
                first:undefined,
                second:undefined
        };
        this.gamestate = new GameState();
        this.getState = function() {
                return this.gamestate;
        }
        this.getRoll = function() {
                return this.roll;
        }
        this.newGame = function(width,players) {
            this.gamestate.board = new RegularHexBoard(width);
            this.gamestate.players = players;
            this.gamestate.currentPlayerID = players[0].id;
        }
        this.addPlayer = function(player) {
                this.gamestate.players.push(player);
        }
        this.endTurn = function(actionsToBeValidated, diceRoll, players, vertices, hexes){
            applyActionsForCurrentPlayer(actionsToBeValidated.data, this.gamestate);//Applies pending actions to server gamestate
            flushActions(actionsToBeValidated);//Flushes the pendng actions
            updateGamePhase(this.gamestate);
            nextPlayer(this.gamestate);//Change current player ID
            if(this.gamestate.phase == Phase.Normal) {
                    this.roll.first = rollDice();
                    this.roll.second = rollDice();
                    resourceGeneration(this.roll.first + this.roll.second, this.gamestate.players, this.gamestate.board.vertices, this.gamestate.board.hexes);
            }

            //resourceGeneration(diceRoll, playerList, vertexFrame, tileFrame)
            //UI method to show the new resources that players recieved at the start of their new turn
            //Generate resources
        }
}

Buffer = function() {
    this.mouse = new MouseBuffer();
}

Game = function(ctx,mouse,buffer,graphics,server,actions,gamestate,teststate,hitboxes,images,side,receiveMessage) {
        this.ctx = ctx;
        this.mouse = mouse; //new Mouse();
        this.buffer = buffer; //new Buffer();
        this.graphics = graphics; //new Graphics();
        this.server = server; //new Server();
        this.actions = actions; //new Reference([]);
        this.gamestate = gamestate;
        this.teststate = teststate;
        this.hitboxes = hitboxes;
        this.images = images;
        this.side = side;
        this.inbox = [];
        UI.Message.Client.call(this,receiveMessage);
}

CatanGame = function(side,ctx) {
        Game.call(this
                 ,ctx
                 ,new Mouse()
                 ,new Buffer()
                 ,new Graphics()
                 ,new Server()
                 ,new Reference([])
                 ,null,null,null,null,side,null)
        var canvas = ctx.canvas;
        this.ctx = ctx;
        this.graphics.transform.translation = center(new Vector(canvas.width,canvas.height));
        this.side = side;

        //the below code may be better suited elsewhere

        initMouseBuffer(canvas,this.buffer.mouse);
        this.server.newGame(5,getStoredPlayers());
        this.gamestate = this.server.getState();
        this.teststate = cloneGameState(this.gamestate);
        this.hitboxes =
                genHitboxes(this.gamestate.board.vertices
                           ,this.gamestate.board.roads
                           ,this.gamestate.board.hexes
                           ,this.side);
        var self=this;
        self.receiveMessage = function(message) {
                self.inbox.push(message);
        }
        //TEMPORARY
        // this.gamestate.players.push(new Player(1));
        // this.gamestate.currentPlayerID = 1;
        
}

cloneGameState = function(gameState) {
        var out = new GameState();
        out.board = cloneBoard(gameState.board);
        out.players = gameState.players.map(clonePlayer);
        out.currentPlayerID = gameState.currentPlayerID;
        out.phase = gameState.phase;
        out.rotation = gameState.rotation;
        out.tradeoffers = gameState.tradeoffers.map(cloneTradeOffer);
        return out;
}


function runGame(game,frameDuration) {
        window.setInterval(gameStep,frameDuration,game);
}

function pushAnimation(animation,game) {
        game.graphics.animations.data.push(animation);
}

function processInbox(inbox, game){
    inbox.forEach(function(message) {
            switch(message.type) {
                    case UI.Message.Type.EndTurn:
    //                                  ,-1,1,12,100,60,1000) //new Vector(850,510)
      //                                ,game);
                        //resourceGeneration(roll, game.gamestate.players, game.gamestate.board.vertices, game.gamestate.board.hexes);
                        game.server.endTurn(game.actions);
                        game.gamestate = game.server.getState();//Replaces the game's gamestate with the server's gamestate
                        game.teststate = cloneGameState(game.gamestate);
                        if(game.gamestate.phase == Phase.Normal) {
                                var roll = game.server.getRoll();
                                pushAnimation(new DiceRollWindow(document.getElementById("rollValue1"),roll.first,6,1,100),game);
                                pushAnimation(new DiceRollWindow(document.getElementById("rollValue2"),roll.second,6,1,100),game);
                        }

                        for(var i = 0; i<game.gamestate.players.length;i++) {
                            console.log(game.gamestate.players[i]);
                            if (checkPlayerWin(game.gamestate.players[i])) {
                                console.log(game.gamestate.players[i] + "wins");
                            }
                        }
                        break;
                    case UI.Message.Type.BuildRoad:
                            console.log(elem);
                            console.log("Test case 2");
                        break;
                    case UI.Message.Type.BuildSettlement:
                            console.log("Test case 3");
                        break;
                    case UI.Message.Type.BuildCity:
                            console.log("Test case 4");
                        break;
                    case UI.Message.Type.Undo:
                        game.actions.data.pop();
                        game.teststate = cloneGameState(game.gamestate);
                        applyActionsForCurrentPlayer(game.actions.data,game.teststate);
                        break;
                    case UI.Message.Type.Resize:
                        break;
                    case UI.Message.Type.MakeOffer:
                        var trade = getOfferFromMessage(message
                                                       ,game.gamestate.tradeoffers.length
                                                       ,game.gamestate.currentPlayerID);
                        if(validateTradeOffer(game.gamestate,trade)) {
                                game.gamestate.tradeoffers.push(trade);
                        } else {
                                pushAnimation(new XClick(game.mouse.pos,15,10),game);
                        }
                        break;
                    case UI.Message.Type.AcceptOffer:
                        var trade = getTrades(message.tradeID,game.gamestate.tradeoffers)[0];
                        if(validateTrade(game.gamestate,trade)) {
                                applyTrade(game.gamestate,trade);
                                game.gamestate.trades = filterOutTrades(trade.tradeID,game.gamestate.trades);
                        }
                    default:
                            console.log('Err: UI.Buffer.messages| Array either contains null or a number not between 0-3 inclusive!');
                        break;
            }
    })
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

        if(game.inbox.length !=  0) {
            processInbox(game.inbox, game);//Processes information from the UI in buffer
            flushInbox(game.inbox);
            shouldRedraw = true;

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
                var drawCircle = true;
                //hits.forEach(function(hit) {
                //
                if(maxHit != null && maxHit.data.type == Position.Type.Hex) {
                        pushAnimation(new InfoBox(mouse.pos,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",200,100,20),game);

                }

                if(potentialAction != null) {
                        if(validateActionForCurrentPlayer(potentialAction,game.teststate)) {
                                game.actions.data.push(potentialAction);
                                applyActionForCurrentPlayer(potentialAction,game.teststate);
                        } else {
                                pushAnimation(new XClick(mouse.pos,15,10),game);
                                drawCircle = false;
                        }
                }
                if(drawCircle) {
                    pushAnimation(new ClickCircle(mouse.pos,10,10),game);
                }
                shouldRedraw = true;
        }


        if(shouldRedraw) {
                var highlight = null;
                if(potentialAction != null) {
                        highlight = getPositionObject(potentialAction,game.teststate.currentPlayerID);
                }
                renderGame(game,highlight);
        }

}

function renderGame(game,positionHighlight) {
        redraw(game.teststate
              ,positionHighlight
              ,game.graphics
              ,game.side
              ,game.ctx);
        //drawHitboxes(hitlist,hits,game.ctx);
        updateUIInfo(game.teststate.players
                    ,game.teststate.currentPlayerID);
}

function checkPlayerWin(player){
    if(player.vicPoints>=10){
        return true;
    }
    return false;
}

function storeBoardImage(graphics,gamestate,side) {
        graphics.renderedHexes = generateHexCanvas(gamestate,side);
}

function makeBoard(game) {
        storeBoardImage(game.graphics,game.gamestate,game.side);
}

function flushInbox(inbox) {
        inbox.length = 0;
}

