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
        this.subPhase = SubPhase.Building;
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
        this.endTurn = function(actionsToBeValidated, diceRoll, players, vertices, hexes) {
            applyActionsForCurrentPlayer(actionsToBeValidated.data, this.gamestate);//Applies pending actions to server gamestate
            flushActions(actionsToBeValidated);//Flushes the pending actions

            updateLongestRoad(this.gamestate);
            this.gamestate.tradeoffers = filterOutIncomingTrades(this.gamestate.currentPlayerID
                , this.gamestate.tradeoffers);

            if (!updateGamePhase(this.gamestate)) {
                nextPlayer(this.gamestate);//Change current player ID
            }
            if(this.gamestate.phase == Phase.Normal) {
                this.roll.first = rollDice();
                this.roll.second = rollDice();
                resourceGeneration(this.roll.first + this.roll.second, this.gamestate.players, this.gamestate.board.vertices, this.gamestate.board.hexes, this.gamestate.board.robber);
                if (this.roll.first + this.roll.second == 7) {
                    this.gamestate.subPhase = SubPhase.Robbing;
                }
                else {
                    this.gamestate.subPhase = SubPhase.Trading;
                }
            }
            }
            this.gamestate.tradeoffers = filterValidTradeOffers(this.gamestate);

            //resourceGeneration(diceRoll, playerList, vertexFrame, tileFrame)
            //UI method to show the new resources that players received at the start of their new turn
            //Generate resources
        }


Buffer = function() {
    this.mouse = new MouseBuffer();
}


CatanGame = function(side,views) {
        var self=this;
        self.views  = views;
        self.graphics = new Graphics(); //new Graphics();
        self.server = new Server(); //new Server();
        self.actions = new Reference([]); //new Reference([]);
        self.side = side;
        self.server.newGame(5,BASE_RESOURCE_LIST.slice(), BASE_TOKEN_LIST.slice(),getStoredPlayers());
        self.gamestate = self.server.getState();
        self.teststate = cloneGameState(self.gamestate);
        self.hits = [];
        self.setUpHitboxes = function() {
                sendMessage(new View.Message.SetHitboxes(self,
                        genHitboxes(self.gamestate.board.vertices
                                   ,self.gamestate.board.roads
                                   ,self.gamestate.board.hexes
                                   ,self.side)),self.views);
        }
        self.processing = [];
        self.inbox = [];
        View.Message.Client.call(self,function(message) {
                self.inbox.push(message);
                if(message.type == undefined) {
                        throw "Undefined Message Type";
                }
        });
}

cloneGameState = function(gameState) {
        var out = new GameState();
        out.board = cloneBoard(gameState.board);
        out.players = gameState.players.map(clonePlayer);
        out.currentPlayerID = gameState.currentPlayerID;
        out.phase = gameState.phase;
        out.subPhase = gameState.subPhase;
        out.rotation = gameState.rotation;
        out.tradeoffers = gameState.tradeoffers.map(cloneTradeOffer);
        out.longestRoad = gameState.longestRoad;
        out.longestRoadPlayer = gameState.longestRoadPlayer;
        return out;
}


function runGame(game,frameDuration) {
        window.setInterval(gameStep,frameDuration,game);
}

function pushAnimation(animation,game) {
        game.graphics.animations.data.push(animation);
}
function changePhaseViews(game) {
    updatePhaseLabel(game);
    switch(game.gamestate.subPhase) {
            case SubPhase.Building:
                    sendMessage(new View.Message.EnableEndTurnButton(game),game.views);
                    break;
            case SubPhase.Trading:
                    sendMessage(new View.Message.DisableEndTurnButton(game),game.views);
                    displayTrade(game);
                    break;
            default:
                    sendMessage(new View.Message.DisableEndTurnButton(game),game.views);
                    break;
    }
}

function rollDice(){
    var roll = Math.floor(Math.random()* 6) + 1;
    return roll
}

function endTurn(game) {
        game.server.endTurn(game.actions);
        game.gamestate = game.server.getState();//Replaces the game's gamestate with the server's gamestate
        //game.teststate = cloneGameState(game.gamestate);
        updateLongestRoadView(game);
        if(game.gamestate.phase == Phase.Normal) {
                var roll = game.server.getRoll();
                sendMessage(new View.Message.RollDice(game,roll),game.views);
            }
            game.teststate = cloneGameState(game.gamestate);
            changePhaseViews(game);

            for (var i = 0; i < game.gamestate.players.length; i++) {
                //   console.log(game.gamestate.players[i]);
                if (checkPlayerWin(game.gamestate.players[i])) {
                    var winner = game.gamestate.players[i];
                    console.log(winner.id); //we see the player info of the winner
                    console.log(game.gamestate.players[i] + "wins");
                    //console.log("donefdsf");
                    sendMessage(new View.Message.WinnerMessage(game,winner.id), game.views);
                    //window.location.href = "www/result.html"; //goes to the results page
                    //document.getElementById('winner').value = winner; //i'm trying to save the winner info to pass it into the results html page but this doesn't work
                }

            }
            renderGame(game, null);

}
function sendIncomingTrades(game) {
    var incomingTrades = getIncomingTrades(game.gamestate.currentPlayerID,game.gamestate.tradeoffers);
    sendMessage(new View.Message.SetIncomingTrades(game,incomingTrades)
        ,game.views);
}

function sendAcceptValidations(game) {
    var incomingTrades = getIncomingTrades(game.gamestate.currentPlayerID,game.gamestate.tradeoffers);
    incomingTrades.forEach(function(trade) {
        sendMessage(new View.Message.AcceptValidation(game
                ,trade.tradeID
                ,validateAccept(game.gamestate
                    ,trade.targetID
                    ,trade.requestResources))
            ,game.views);
    });
}

function setTradeSubPhase(gamestate) {
        gamestate.subPhase = SubPhase.Trading;
}

function updatePhaseLabel(game) {
        sendMessage(new View.Message.PhaseMessage(game,game.gamestate.phase, game.gamestate.subPhase),game.views);
}
function displayTrade(game){
        sendMessage(new View.Message.DisplayTradeView(game),game.views);
}

function processUIMessage(message,game) {
        switch(message.type) {
            case View.Message.Type.EndTurn:
                switch(game.gamestate.phase){
                    case Phase.Init:
                        var currentPlayer = getPlayers(game.gamestate.currentPlayerID,game.teststate.players)[0];
                        if (currentPlayer.roadCount == getInitStructureLimit(game.gamestate.rotation) &&
                            currentPlayer.settlementCount == getInitStructureLimit(game.gamestate.rotation)){
                            console.log("End game valid");
                            endTurn(game);
                        }
                        break;
                        // End if settlement & Road were built
                    case Phase.Normal:
                        endTurn(game);
                }
                break;
            case View.Message.Type.BuildRoad:
                    //console.log(elem);
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
                renderGame(game,null);
                break;
            case View.Message.Type.Resize:
                renderGame(game,null);
                break;
            case View.Message.Type.MakeOffer:
                var trade = getOfferFromMessage(message
                                               ,nextTradeID(game.gamestate.tradeoffers)
                                               ,game.gamestate.currentPlayerID);
                if(validateTradeOffer(game.gamestate,trade)) {
                        game.gamestate.tradeoffers.push(trade);
                } else {
                        pushAnimation(new XClick(game.mouse.pos,15,10),game);
                }
                break;
            case View.Message.Type.AcceptTrade:
                var trade = getTrades(message.tradeID,game.gamestate.tradeoffers)[0];
                if(validateTrade(game.gamestate,trade)) {
                        applyTrade(game.gamestate,trade);
                        game.teststate = cloneGameState(game.gamestate);
                        game.gamestate.trades = filterOutTrades(trade.tradeID,game.gamestate.tradeoffers);
                        updateUIInfo(game.gamestate.players,game.gamestate.currentPlayerID);
                }
                break;
            case View.Message.Type.RequestGameState:
                respond(message,new View.Message.GameState(game,game.gamestate));
                break;
            case View.Message.Type.RequestAcceptValidations:
                sendAcceptValidations(game);
                break;
            case View.Message.Type.RequestIncomingTrades:
                sendIncomingTrades(game);
                break;
            case View.Message.Type.TradeViewClosed:
                game.gamestate.subPhase = SubPhase.Building;
                game.teststate = cloneGameState(game.gamestate);
                updateUIInfo(game.gamestate.players,game.gamestate.currentPlayerID);
                changePhaseViews(game);
                break;
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
        game.processing = game.inbox.slice();
        flushInbox(game.inbox);
    processInbox(game.processing, game);//Processes information from the UI in buffer
    flushInbox(game.processing);

}

function gameStep(game) {
        var shouldRedraw = false;
        var highlight = null;

        sendMessage(new View.Message.RequestMouseData(game),game.views);
        processGameInbox(game);
        sendMessage(new View.Message.RequestHits(game,game.mouse.pos),game.views);
        processGameInbox(game);

        var maxHit = getMaxPositionHit(game.hits);
        var potentialAction = genPotentialAction(game.gamestate.board.vertices
                                                 ,game.gamestate.board.roads
                                                 , game.actions.data
                                                 ,maxHit);

        if(game.hits.length != 0 || game.graphics.animations.data.length != 0) {
                shouldRedraw = true;
        }
        if(game.mouse.dragging) {
//                sendMessage(new View.Message.HideHexInfo(game),game.views);
                sendMessage(new View.Message.AdjustTranslation(game,game.mouse.movement),game.views);
                shouldRedraw = true;
        }
        if(game.mouse.scroll.y != 0) {
                sendMessage(new View.Message.HideHexInfo(game),game.views);
                sendMessage(new View.Message.AdjustScale(game,game.mouse.scroll.y),game.views);
                shouldRedraw = true;
        }
        if(potentialAction != null) {
                if(validateActionForCurrentPlayer(potentialAction,game.teststate)){
                    highlight = getPositionObject(potentialAction,game.teststate.currentPlayerID);
                }
        }
        if(game.mouse.clicked) {
                var drawCircle = true;
                shouldRedraw = true;
                if(maxHit != null && maxHit.data.type == Position.Type.Hex) {
                        sendMessage(new View.Message.DisplayHexInfo(game,maxHit.data,game.mouse.pos),game.views);
                }

                if(potentialAction != null) {
                    highlight = getPositionObject(potentialAction,game.teststate.currentPlayerID);
                    if(potentialAction.type == Action.Type.RobHex){
                        if(validateActionForCurrentPlayer(potentialAction,game.teststate)){
                            applyActionForCurrentPlayer(potentialAction, game.gamestate);
                            game.gamestate.subPhase = SubPhase.Trading;
                            game.teststate = cloneGameState(game.gamestate);
                            changePhaseViews(game);
                        }
                    }
                    else{
                        if(validateActionForCurrentPlayer(potentialAction,game.teststate)) {

                                    game.actions.data.push(potentialAction);
                                    applyActionForCurrentPlayer(potentialAction, game.teststate);

                        } else {
                                pushAnimation(new XClick(game.mouse.pos,15,10),game);
                                drawCircle = false;
                        }
                }

                }
                if(drawCircle) {
                    pushAnimation(new ClickCircle(game.mouse.pos,10,10),game);
                }

            if(game.gamestate.board.robber.moved) {
                makeBoard(game);
                game.gamestate.board.robber.moved = false;
            }
        }


        if(shouldRedraw) {
                renderGame(game,highlight);
        }

}

function renderGame(game,positionHighlight) {
        sendMessage(new View.Message.RenderGameCanvas(game
                                                     ,game.teststate
                                                     ,positionHighlight
                                                     ,game.graphics
                                                     ,game.side)
                   ,game.views);
        //drawHitboxes(hitlist,hits,game.ctx);
        updateUIInfo(game.teststate.players
                    ,game.teststate.currentPlayerID);
}

/* checkPlayerWin
 * Given a player, checks whether or not they have met the victory conditions
 */

function checkPlayerWin(player){
    if(player.vicPoints>=VPS_REQUIRED_FOR_WIN){
       console.log("WONN");
        return true;
    }
    return false;
}

function updateLongestRoadView(game) {
        if(game.gamestate.longestRoadPlayer != null) {
                sendMessage(new View.Message.SetLongestRoadID(game,game.gamestate.longestRoadPlayer.id),game.views);
        }
}

function updateLongestRoad(gameState){
    var player = getPlayers(gameState.currentPlayerID, gameState.players)[0];
    for(var i =0; i<player.firstSettlementsCoords.length;i++){
        var testLength = longestRoad(findVertex(gameState.board.vertices, player.firstSettlementsCoords[i]), gameState.board.vertices, gameState.board.roads, player, []);
        if(testLength>gameState.longestRoad && testLength >= 5){
            console.log("Longest road changed");
            gameState.longestRoad = testLength;
            if(gameState.longestRoadPlayer != null) {
                gameState.longestRoadPlayer.vicPoints -= LONGEST_ROAD_VPS;
            }
            gameState.longestRoadPlayer = player;
            gameState.longestRoadPlayer.vicPoints += LONGEST_ROAD_VPS;
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
