define(['jquery'
       ,'Constants'
       ,'Grid'
       ,'Transform'
       ,'TradeOffer'
       ,'BoardState'
       ,'Player'
       ,'GameMethods'
       ,'GameState'
       ,'Hitbox'
       ,'Action'
       ,'Animation'
       ,'View'
       ,'Canvas'
       ,'UserInterfaceJScript'
       ]
      ,function($
               ,Constants
               ,Grid
               ,Transform
               ,TradeOffer
               ,BoardState
               ,Player
               ,GameMethods
               ,GameState
               ,Hitbox
               ,Action
               ,Animation
               ,View
               ,Canvas
               ,UserInterfaceJScript
               ) {


//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                    UTILITY FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////



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

Graphics = function(){
        this.animations = new Reference([])
        this.transform = new Transform.Transform(new Grid.Vector(0,0),1);
        this.renderedHexes = $("<canvas></canvas>")[0];
}

Server = function() {
        this.roll = {
                first:undefined,
                second:undefined
        };
        this.gamestate = new GameState.GameState();
        this.getState = function() {
                return this.gamestate;
        }
        this.getRoll = function() {
                return this.roll;
        }
        this.newGame = function(width,resourceList, tokenList, players) {
            this.gamestate.board = new BoardState.RegularHexBoard(width, resourceList, tokenList);
            this.gamestate.players = players;
            this.gamestate.currentPlayerID = players[0].id;
        }
        this.addPlayer = function(player) {
                this.gamestate.players.push(player);
        }
        this.endTurn = function(actionsToBeValidated, diceRoll, players, vertices, hexes) {
            Action.applyActionsForCurrentPlayer(actionsToBeValidated.data, this.gamestate);//Applies pending actions to server gamestate
            Action.flushActions(actionsToBeValidated);//Flushes the pending actions

            GameState.updateLongestRoad(this.gamestate);
            this.gamestate.tradeoffers = TradeOffer.filterOutIncomingTrades(this.gamestate.currentPlayerID
                , this.gamestate.tradeoffers);

            GameState.nextPlayer(this.gamestate);
            GameState.updateGamePhase(this.gamestate)

            if(this.gamestate.phase == BoardState.Phase.Normal) {
                this.roll.first = rollDice();
                this.roll.second = rollDice();
                GameMethods.resourceGeneration(this.roll.first + this.roll.second, this.gamestate.players, this.gamestate.board.vertices, this.gamestate.board.hexes, this.gamestate.board.robber);
                if (this.roll.first + this.roll.second == 7) {
                    this.gamestate.subPhase = BoardState.SubPhase.Robbing;
                }
                else {
                    this.gamestate.subPhase = BoardState.SubPhase.Trading;
                }
            }
            }
            this.gamestate.tradeoffers = TradeOffer.filterValidTradeOffers(this.gamestate);

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
        self.server.newGame(5, BoardState.BASE_RESOURCE_LIST.slice()
                             , Constants.BASE_TOKEN_LIST.slice()
                             , Player.getStoredPlayers());
        self.gamestate = self.server.getState();
        self.teststate = GameState.cloneGameState(self.gamestate);
        self.hits = [];
        self.setUpHitboxes = function() {
                View.sendMessage(new View.Message.SetHitboxes(self,
                        Hitbox.genHitboxes(self.gamestate.board.vertices
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



function runGame(game,frameDuration) {
        window.setInterval(gameStep,frameDuration,game);
}

function pushAnimation(animation,game) {
        game.graphics.animations.data.push(animation);
}
function changePhaseViews(game) {
    updatePhaseLabel(game);
    switch(game.gamestate.subPhase) {
            case BoardState.SubPhase.Building:
                    View.sendMessage(new View.Message.EnableEndTurnButton(game),game.views);
                    break;
            case BoardState.SubPhase.Trading:
                    View.sendMessage(new View.Message.DisableEndTurnButton(game),game.views);
                    displayTrade(game);
                    break;
            default:
                    View.sendMessage(new View.Message.DisableEndTurnButton(game),game.views);
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
        //game.teststate = GameState.cloneGameState(game.gamestate);
        updateLongestRoadView(game);
        if(game.gamestate.phase == BoardState.Phase.Normal) {
                var roll = game.server.getRoll();
                View.sendMessage(new View.Message.RollDice(game,roll),game.views);
            }
            game.teststate = GameState.cloneGameState(game.gamestate);
            changePhaseViews(game);

            for (var i = 0; i < game.gamestate.players.length; i++) {
                //   console.log(game.gamestate.players[i]);
                if (GameMethods.checkPlayerWin(game.gamestate.players[i])) {
                    var winner = game.gamestate.players[i];
                    console.log(winner.id); //we see the player info of the winner
                    console.log(game.gamestate.players[i] + "wins");
                    //console.log("donefdsf");
                    View.sendMessage(new View.Message.WinnerMessage(game,winner.id), game.views);
                    //window.location.href = "www/result.html"; //goes to the results page
                    //document.getElementById('winner').value = winner; //i'm trying to save the winner info to pass it into the results html page but this doesn't work
                }

            }
            renderGame(game, null);

}
function sendIncomingTrades(game) {
    var incomingTrades = TradeOffer.getIncomingTrades(game.gamestate.currentPlayerID,game.gamestate.tradeoffers);
    View.sendMessage(new View.Message.SetIncomingTrades(game,incomingTrades)
        ,game.views);
}

function sendAcceptValidations(game) {
    var incomingTrades = TradeOffer.getIncomingTrades(game.gamestate.currentPlayerID,game.gamestate.tradeoffers);
    incomingTrades.forEach(function(trade) {
        View.sendMessage(new View.Message.AcceptValidation(game
                ,trade.tradeID
                ,TradeOffer.validateAccept(game.gamestate
                    ,trade.targetID
                    ,trade.requestResources))
            ,game.views);
    });
}

function setTradeSubPhase(gamestate) {
        gamestate.subPhase = BoardState.SubPhase.Trading;
}

function updatePhaseLabel(game) {
        View.sendMessage(new View.Message.PhaseMessage(game,game.gamestate.phase, game.gamestate.subPhase),game.views);
}
function displayTrade(game){
        View.sendMessage(new View.Message.DisplayTradeView(game),game.views);
}


function bankableResources(gamestate) {
        var currentPlayer = GameState.getCurrentPlayer(gamestate);
        var out = [];
        currentPlayer.resources.forEach(function(amount,resource) {
                if(amount >= Constants.BANKABLE_RESOURCE_COUNT) {
                        out.push(resource);
                }
        });
        return out;
}
function tradeWithBank(gamestate,offerResource,requestResource) {
        var currentPlayer = GameState.getCurrentPlayer(gamestate);
        if(currentPlayer.resources[offerResource] >= Constants.BANKABLE_RESOURCE_COUNT) {
                currentPlayer.resources[requestResource] += 1;
                currentPlayer.resources[offerResource] -= Constants.BANKABLE_RESOURCE_COUNT;
        }
}
function processBankMessage(message,game) {
        switch(message.type) {
                case View.Message.Type.RequestBankableResources:
                        View.respond(message
                               ,new View.Message.BankableResources(game, bankableResources(game.gamestate)));
                        break;
                case View.Message.Type.TradeWithBank:
                        tradeWithBank(game.gamestate,message.offerResource,message.requestResource);
                        UserInterfaceJScript.updateUIInfo(game.gamestate.players,game.gamestate.currentPlayerID);
                        break;
        }
}

function getOfferFromMessage(message,tradeID,offererID) {
    return new TradeOffer.TradeOffer(tradeID
                                    ,offererID
                                    ,message.targetID
                                    ,message.offerResources
                                    ,message.requestResources);
}


function processUIMessage(message,game) {
        switch(message.type) {
            case View.Message.Type.EndTurn:
                if(GameState.validateEndTurn(game.teststate)) {
                        View.sendMessage(new View.Message.OpenPassView(game
                                                                      ,GameState.getNextPlayer(game.gamestate))
                                         ,game.views);
                }
                break;
            case View.Message.Type.PassViewClosed:
                endTurn(game);
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
                game.teststate = GameState.cloneGameState(game.gamestate);
                Action.applyActionsForCurrentPlayer(game.actions.data,game.teststate);
                renderGame(game,null);
                break;
            case View.Message.Type.Resize:
                renderGame(game,null);
                break;
            case View.Message.Type.MakeOffer:
                var trade = getOfferFromMessage(message
                                               ,TradeOffer.nextTradeID(game.gamestate.tradeoffers)
                                               ,game.gamestate.currentPlayerID);
                if(TradeOffer.validateTradeOffer(game.gamestate,trade)) {
                        game.gamestate.tradeoffers.push(trade);
                } else {
                        pushAnimation(new Animation.XClick(game.mouse.pos,15,10),game);
                }
                break;
            case View.Message.Type.AcceptTrade:
                var trade = TradeOffer.getTrades(message.tradeID,game.gamestate.tradeoffers)[0];
                if(TradeOffer.validateTrade(game.gamestate,trade)) {
                        TradeOffer.applyTrade(game.gamestate,trade);
                        game.teststate = GameState.cloneGameState(game.gamestate);
                        game.gamestate.trades = TradeOffer.filterOutTrades(trade.tradeID,game.gamestate.tradeoffers);
                        UserInterfaceJScript.updateUIInfo(game.gamestate.players,game.gamestate.currentPlayerID);
                }
                break;
            case View.Message.Type.RequestGameState:
                View.respond(message,new View.Message.GameState(game,game.gamestate));
                break;
            case View.Message.Type.RequestAcceptValidations:
                sendAcceptValidations(game);
                break;
            case View.Message.Type.RequestIncomingTrades:
                sendIncomingTrades(game);
                break;
            case View.Message.Type.TradeViewClosed:
                game.gamestate.subPhase = BoardState.SubPhase.Building;
                game.teststate = GameState.cloneGameState(game.gamestate);
                UserInterfaceJScript.updateUIInfo(game.gamestate.players,game.gamestate.currentPlayerID);
                changePhaseViews(game);
                break;
            default:
                processBankMessage(message,game);
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

        View.sendMessage(new View.Message.RequestMouseData(game),game.views);
        processGameInbox(game);
        View.sendMessage(new View.Message.RequestHits(game,game.mouse.pos),game.views);
        processGameInbox(game);

        var maxHit = getMaxPositionHit(game.hits);
        var potentialAction = Action.genPotentialAction(game.gamestate.board.vertices
                                                       ,game.gamestate.board.roads
                                                       ,game.actions.data
                                                       ,maxHit);

        if(game.hits.length != 0 || game.graphics.animations.data.length != 0) {
                shouldRedraw = true;
        }
        if(game.mouse.dragging) {
//                View.sendMessage(new View.Message.HideHexInfo(game),game.views);
                View.sendMessage(new View.Message.AdjustTranslation(game,game.mouse.movement),game.views);
                shouldRedraw = true;
        }
        if(game.mouse.scroll.y != 0) {
                View.sendMessage(new View.Message.HideHexInfo(game),game.views);
                View.sendMessage(new View.Message.AdjustScale(game,game.mouse.scroll.y),game.views);
                shouldRedraw = true;
        }
        if(potentialAction != null) {
                if(Action.validateActionForCurrentPlayer(potentialAction,game.teststate)){
                    highlight = Action.getPositionObject(potentialAction,game.teststate.currentPlayerID);
                }
        }
        if(game.mouse.clicked) {
                var drawCircle = true;
                shouldRedraw = true;
                if(maxHit != null && maxHit.data.type == BoardState.Position.Type.Hex) {
                        View.sendMessage(new View.Message.DisplayHexInfo(game,maxHit.data,game.mouse.pos),game.views);
                }

                if(potentialAction != null) {
                    highlight = Action.getPositionObject(potentialAction,game.teststate.currentPlayerID);
                    if(potentialAction.type == Action.Action.Type.RobHex){
                        if(Action.validateActionForCurrentPlayer(potentialAction,game.teststate)){
                            Action.applyActionForCurrentPlayer(potentialAction, game.gamestate);
                            game.gamestate.subPhase = BoardState.SubPhase.Trading;
                            game.teststate = GameState.cloneGameState(game.gamestate);
                            changePhaseViews(game);
                        }
                    }
                    else{
                        if(Action.validateActionForCurrentPlayer(potentialAction,game.teststate)) {
                                    game.actions.data.push(potentialAction);
                                    Action.applyActionForCurrentPlayer(potentialAction, game.teststate);
                        } else {
                                pushAnimation(new Animation.XClick(game.mouse.pos,15,10),game);
                                drawCircle = false;
                        }
                }

                }
                if(drawCircle) {
                    pushAnimation(new Animation.ClickCircle(game.mouse.pos,10,10),game);
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
        View.sendMessage(new View.Message.RenderGameCanvas(game
                                                     ,game.teststate
                                                     ,positionHighlight
                                                     ,game.graphics
                                                     ,game.side)
                   ,game.views);
        //drawHitboxes(hitlist,hits,game.ctx);
        UserInterfaceJScript.updateUIInfo(game.teststate.players
                    ,game.teststate.currentPlayerID);
}

/* checkPlayerWin
 * Given a player, checks whether or not they have met the victory conditions
 */


function updateLongestRoadView(game) {
        if(game.gamestate.longestRoadPlayer != null) {
                View.sendMessage(new View.Message.SetLongestRoadID(game,game.gamestate.longestRoadPlayer.id)
                                ,game.views);
        }
}
        

function storeBoardImage(graphics,gamestate,side) {
        graphics.renderedHexes = Canvas.generateHexCanvas(gamestate,side);
}

function makeBoard(game) {
        storeBoardImage(game.graphics,game.gamestate,game.side);
}

function flushInbox(inbox) {
        inbox.length = 0;
}
return {
        CatanGame:CatanGame,
        runGame:runGame,
        renderGame:renderGame,
        makeBoard:makeBoard,
}
});
////////////////////////////
//end of module
