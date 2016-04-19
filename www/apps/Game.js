//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                    UTILITY FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////

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
        this.longestRoad = 0;
        this.longestRoadPlayer = null;
}

Transform = function(translation,scale) {
        this.translation=translation;
        this.scale = scale;
}

Graphics = function(){
        this.animations = new Reference([])
        this.transform = new Transform(new Vector(0,0),1);
        this.renderedHexes = $("<canvas></canvas>")[0];
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
        this.newGame = function(width,resourceList, tokenList, players) {
            this.gamestate.board = new RegularHexBoard(width, resourceList, tokenList);
            this.gamestate.players = players;
            this.gamestate.currentPlayerID = players[0].id;
        }
        this.addPlayer = function(player) {
                this.gamestate.players.push(player);
        }
        this.endTurn = function(actionsToBeValidated, diceRoll, players, vertices, hexes){
            applyActionsForCurrentPlayer(actionsToBeValidated.data, this.gamestate);//Applies pending actions to server gamestate
            flushActions(actionsToBeValidated);//Flushes the pending actions
            checkLongestRoad(this.gamestate)
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


CatanGame = function(side,canvasView) {
        this.canvasView = canvasView;
        this.mouse = new Mouse(); //new Mouse();
        this.graphics = new Graphics(); //new Graphics();
        this.server = new Server(); //new Server();
        this.actions = new Reference([]); //new Reference([]);
        this.side = side;
        this.server.newGame(5,baseResourceList.slice(), baseTokenList.slice(),getStoredPlayers());
        this.gamestate = this.server.getState();
        this.teststate = cloneGameState(this.gamestate);
        this.hits = [];
        sendMessage(new View.Message.SetHitboxes(this,
                genHitboxes(this.gamestate.board.vertices
                           ,this.gamestate.board.roads
                           ,this.gamestate.board.hexes
                           ,this.side)),this.canvasView);
        var self=this;
        self.inbox = [];
        self.receiveMessage = function(message) {
                self.inbox.push(message);
        }
        
}

cloneGameState = function(gameState) {
        var out = new GameState();
        out.board = cloneBoard(gameState.board);
        out.players = gameState.players.map(clonePlayer);
        out.currentPlayerID = gameState.currentPlayerID;
        out.phase = gameState.phase;
        out.rotation = gameState.rotation;
        out.tradeoffers = gameState.tradeoffers.map(cloneTradeOffer);
        out.longestRoad = gameState.longestRoad;
        out.longestRoadPlayer = gameState.longestRoadPlayer
        return out;
}


function runGame(game,frameDuration) {
        window.setInterval(gameStep,frameDuration,game);
}

function pushAnimation(animation,game) {
        game.graphics.animations.data.push(animation);
}

function endTurn(game) {
        game.server.endTurn(game.actions);
        game.gamestate = game.server.getState();//Replaces the game's gamestate with the server's gamestate
        game.teststate = cloneGameState(game.gamestate);
        if(game.gamestate.phase == Phase.Normal) {
                var roll = game.server.getRoll();
                pushAnimation(new DiceRollWindow(document.getElementById("rollValue1"),roll.first,6,1,100),game);
                pushAnimation(new DiceRollWindow(document.getElementById("rollValue2"),roll.second,6,1,100),game);
        }

        for(var i = 0; i<game.gamestate.players.length;i++) {
         //   console.log(game.gamestate.players[i]);
            if (checkPlayerWin(game.gamestate.players[i])) {
                console.log(game.gamestate.players[i] + "wins");
            }
        }

}

function processUIMessage(message,game) {
        switch(message.type) {
            case View.Message.Type.EndTurn:
                endTurn(game);
                break;
            case View.Message.Type.BuildRoad:
                    console.log(elem);
                    console.log("Test case 2");
                break;
            case View.Message.Type.BuildSettlement:
                    console.log("Test case 3");
                break;
            case View.Message.Type.BuildCity:
                    console.log("Test case 4");
                break;
            case View.Message.Type.Undo:
                game.actions.data.pop();
                game.teststate = cloneGameState(game.gamestate);
                applyActionsForCurrentPlayer(game.actions.data,game.teststate);
                break;
            case View.Message.Type.Resize:
                break;
            case View.Message.Type.MakeOffer:
                var trade = getOfferFromMessage(message
                                               ,game.gamestate.tradeoffers.length
                                               ,game.gamestate.currentPlayerID);
                if(validateTradeOffer(game.gamestate,trade)) {
                        game.gamestate.tradeoffers.push(trade);
                } else {
                        pushAnimation(new XClick(game.mouse.pos,15,10),game);
                }
                break;
            case View.Message.Type.AcceptOffer:
                var trade = getTrades(message.tradeID,game.gamestate.tradeoffers)[0];
                if(validateTrade(game.gamestate,trade)) {
                        applyTrade(game.gamestate,trade);
                        game.gamestate.trades = filterOutTrades(trade.tradeID,game.gamestate.trades);
                }
        }
}

function processDataMessage(message,game) {
        switch(message.type) {
            case View.Message.Type.MouseData:
                game.mouse = message.mouse;
                break;
            case View.Message.Type.HitsData:
                game.hits = message.hits;
                break;
        }
}

function processInbox(inbox, game){
    inbox.forEach(function(message) {
            processUIMessage(message,game);
            processDataMessage(message,game);
    })
}

function processGameInbox(game) {
    processInbox(game.inbox, game);//Processes information from the UI in buffer
    flushInbox(game.inbox);

}

function gameStep(game) {
        var shouldRedraw = false;

        sendMessage(new View.Message.RequestMouseData(game),game.canvasView);
        processGameInbox(game);
        sendMessage(new View.Message.RequestHits(game,game.mouse.pos),game.canvasView);
        processGameInbox(game);

        var maxHit = getMaxPositionHit(game.hits);
        var potentialAction = genPotentialAction(game.gamestate.board.vertices
                                                 ,game.gamestate.board.roads
                                                 ,game.actions.data
                                                 ,maxHit);

        if(game.hits.length != 0 || game.graphics.animations.data.length != 0) {
                shouldRedraw = true;
        }
        if(game.mouse.dragging) {
                sendMessage(new View.Message.AdjustTranslation(game,game.mouse.movement),game.canvasView);
                shouldRedraw = true;
        }
        if(game.mouse.scroll.y != 0) {
                sendMessage(new View.Message.AdjustScale(game,game.mouse.scroll.y),game.canvasView);
                shouldRedraw = true;
        }
        if(game.mouse.clicked) {
                var drawCircle = true;
                if(maxHit != null && maxHit.data.type == Position.Type.Hex) {
                        pushAnimation(new InfoBox(game.mouse.pos,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",200,100,20),game);

                }

                if(potentialAction != null) {
                        if(validateActionForCurrentPlayer(potentialAction,game.teststate)) {
                                game.actions.data.push(potentialAction);
                                applyActionForCurrentPlayer(potentialAction,game.teststate);
                        } else {
                                pushAnimation(new XClick(game.mouse.pos,15,10),game);
                                drawCircle = false;
                        }
                }
                if(drawCircle) {
                    pushAnimation(new ClickCircle(game.mouse.pos,10,10),game);
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
        sendMessage(new View.Message.RenderGameCanvas(game
                                                     ,game.teststate
                                                     ,positionHighlight
                                                     ,game.graphics
                                                     ,game.side)
                   ,game.canvasView);
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

function checkLongestRoad(gameState){
    var player = getPlayers(gameState.currentPlayerID, gameState.players)[0];
    for(var i =0; i<player.firstSettlementsCoords.length;i++){
        var testLength = longestRoad(findVertex(gameState.board.vertices, player.firstSettlementsCoords[i]), gameState.board.vertices, gameState.board.roads, player, []);
        if(testLength>gameState.longestRoad && testLength >= 5){
            console.log("Longest road changed");
            gameState.longestRoad = testLength;
            if(gameState.longestRoadPlayer != null) {
                gameState.longestRoadPlayer.vicPoints -= 2;
            }
            gameState.longestRoadPlayer = player;
            gameState.longestRoadPlayer.vicPoints += 2;
        }
    }
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

