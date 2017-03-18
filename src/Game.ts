import * as Constants from "./Constants"
import * as Grid from "./Grid"
import * as Transform from "./Transform"
import * as TradeOffer from "./TradeOffer"
import * as BoardState from "./BoardState"
import * as Player from "./Player"
import * as GameMethods from "./GameMethods"
import * as GameState from "./GameState"
import * as Hitbox from "./Hitbox"
import * as Action from "./Action"
import * as Animation from "./Animation"
import * as View from "./View"
import * as Canvas from "./Canvas"
import * as UserInterfaceJScript from "./UserInterfaceJScript"

import * as Input from "./Input"
import * as InputView from "./InputView"

import * as DiceRollView from "./DiceRollView"
import * as TradeView from "./TradeView"
import * as PassView from "./PassView"

import * as HexInfoView from "./HexInfoView"

import * as LongestRoadView from "./LongestRoadView"

//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                    UTILITY FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                  FUNCTIONS THAT DON'T FIT                                        */
//////////////////////////////////////////////////////////////////////////////////////////////////////

function getMaxPositionHit(hits:Hitbox.Hitbox[]):Hitbox.Hitbox | undefined {
    var max:Hitbox.Hitbox|undefined = undefined;
    hits.map(function(h) {
        if (max == null) {
            max = h
        }
        if (h.data.type < max.data.type) {
            max = h
        }
    })
    return max;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                       GAME FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Reference = function(data) {
    //         return {data:data}
    // }
    

function makeGraphics():Canvas.Graphics {
    return {
        animations:[],
        transform: {translation:{x:0,y:0},scale:1},
        renderedHexes:<HTMLCanvasElement>$("<canvas></canvas>")[0]
    }
}

class Server {
    roll:GameState.Roll = {
        left:0,
        right:0
    };
    gameState:GameState.GameState;
    newGame(width:number,resourceList:BoardState.Resource[],tokenList:number[],players:Player.Player[]) {
        this.gameState = new GameState.GameState(BoardState.makeRegularHexBoard(width, resourceList, tokenList),players[0].id)
        this.gameState.players = players;
    }
    addPlayer(player:Player.Player) {
        this.gameState.players.push(player);
    }
    getState() {
        return this.gameState;
    }
    getRoll() {
        return this.roll;
    }
    endTurn(actionsToBeValidated:Action.Action.Any[]) {
        Action.applyActionsForCurrentPlayer(actionsToBeValidated, this.gameState);//Applies pending actions to server gamestate
        Action.flushActions(actionsToBeValidated);//Flushes the pending actions
        
        GameState.updateLongestRoad(this.gameState);
        this.gameState.tradeOffers = TradeOffer.filterOutIncomingTrades(this.gameState.currentPlayerID
        , this.gameState.tradeOffers);
        
        var unupdatedCurrentPlayerID = this.gameState.currentPlayerID;
        GameState.nextPlayer(this.gameState);
        GameState.updateGamePhase(this.gameState, unupdatedCurrentPlayerID);
        
        if(this.gameState.phase == BoardState.Phase.Normal) {
            this.roll.left = rollDice();
            this.roll.right = rollDice();
            GameMethods.resourceGeneration(this.roll.left + this.roll.right, this.gameState.players, this.gameState.board.vertices, this.gameState.board.hexes, this.gameState.board.robber);
            if (this.roll.left + this.roll.right == 7) {
                this.gameState.subPhase = BoardState.SubPhase.Robbing;
            }
            else {
                this.gameState.subPhase = BoardState.SubPhase.Trading;
            }
        }
        this.gameState.tradeOffers = TradeOffer.filterValidTradeOffers(this.gameState.players,this.gameState.tradeOffers);
    }
}
type CatanGameOutputs = 
Canvas.SetHitboxes |
View.FirstTimePlaying | View.WinnerMessage | View.PhaseMessage | View.InitBuilt |
View.EnableEndTurnButton | View.DisableEndTurnButton | 
DiceRollView.RollDice | 
TradeView.SetIncomingTrades | TradeView.AcceptValidation | TradeView.DisplayTradeView | TradeView.BankableResources | TradeView.GameState |
PassView.OpenPassView  |
InputView.RequestInputData | Canvas.RequestHits |
Canvas.AdjustTranslation | Canvas.AdjustScale | Canvas.RenderGameCanvas |
HexInfoView.HideHexInfo | HexInfoView.DisplayHexInfo |
LongestRoadView.SetLongestRoadID

type CatanGameInputs = 
View.EndTurn | View.Undo | View.Resize |
PassView.PassViewClosed |
BankMessage |
TradeViewMessage |
DataMessage;

type TradeViewMessage = 
TradeView.MakeOffer | TradeView.AcceptTrade | TradeView.RequestGameState | TradeView.RequestAcceptValidations |TradeView.RequestIncomingTrades |
TradeView.TradeViewClosed

function isTradeViewMessage(message:View.Message<any>): message is TradeViewMessage {
    return message.type == "MakeOffer"
        || message.type == "AcceptTrade"
        || message.type == "RequestGameState"
        || message.type == "RequestAcceptValidations"
        || message.type == "RequestIncomingTrades"
        || message.type == "TradeViewClosed"
}

type BankMessage = TradeView.RequestBankableResources | TradeView.TradeWithBank

function isBankMessage(message:View.Message<any>): message is BankMessage {
    return message.type === "RequestBankableResources" 
        || message.type === "TradeWithBank"
}

type DataMessage = InputView.InputData | Canvas.HitsData
function isDataMessage(message:View.Message<any>): message is DataMessage {
    return message.type == "InputData" || message.type == "HitsData"
}

export class CatanGame extends View.DistributedClient<CatanGameInputs,CatanGameOutputs> {
    types:string[] = [];
    graphics = makeGraphics(); //new Graphics();
    server = new Server(); //new Server();
    actions:Action.Action.Any[] = []; //new Reference([]);
    gameState:GameState.GameState;
    testState:GameState.GameState;
    hits:Hitbox.Hitbox[] = [];
    inbox:CatanGameInputs[] = [];
    processing:View.Message<any>[] = [];
    input:Input.Input|undefined;
    constructor(public side:number,public distributor:View.Distributor) {
        super();
        this.server.newGame(5, BoardState.BASE_RESOURCE_LIST.slice()
            , Constants.BASE_TOKEN_LIST.slice()
            , Player.getStoredPlayers());
        this.gameState = this.server.getState();
        this.testState = GameState.cloneGameState(this.gameState);
    }
    setUpHitboxes() {
        let x = 1;
        this.distributor.distribute({
            type:"SetHitboxes",
            hitboxes:Hitbox.genHitboxes(this.gameState.board.vertices
                                   ,this.gameState.board.roads
                                   ,this.gameState.board.hexes
                                   ,this.side)
        },this);
    }
    onMessage(message:CatanGameInputs) {
        this.inbox.push(message);
    }
    //send a message to all game views indicating if it is the first time playing; 
    //updates first-time storage data
    processFirstTime() {
        var firstTime = localStorage.getItem("first-time-playing");
        this.distribute({type:"FirstTimePlaying",firstTime:firstTime === null || firstTime == 'true'});
        localStorage.setItem("first-time-playing","false");
    }
    //call only once
    run(frameDuration:number) {
        this.processFirstTime();
        window.setInterval(this.gameStep.bind(this),frameDuration);
    }
    pushAnimation(animation:Animation.Animation) {
        this.graphics.animations.push(animation);
    }
    changePhaseViews() {
        this.updatePhaseLabel();
        switch(this.gameState.subPhase) {
            case BoardState.SubPhase.Building:
                this.distribute({type:"EnableEndTurnButton"});
                break;
            case BoardState.SubPhase.Trading:
                this.distribute({type:"DisableEndTurnButton"});
                this.displayTrade();
                break;
            default:
                this.distribute({type:"DisableEndTurnButton"});
                break;
        }
    }
    processWinner() {
        for (var i = 0; i < this.gameState.players.length; i++) {
            //   console.log(game.gamestate.players[i]);
            if (GameMethods.checkPlayerWin(this.gameState.players[i])) {
                var winner = this.gameState.players[i];
                console.log(winner.id); //we see the player info of the winner
                console.log(this.gameState.players[i] + "wins");
                //console.log("donefdsf");
                this.distribute({type:"WinnerMessage",winner:winner.id});
                //window.location.href = "www/result.html"; //goes to the results page
                //document.getElementById('winner').value = winner; //i'm trying to save the winner info to pass it into the results html page but this doesn't work
            }
            
        }
    }
    endTurn() {
        this.server.endTurn(this.actions);
        this.gameState = this.server.getState();//Replaces the game's gamestate with the server's gamestate
        //game.teststate = GameState.cloneGameState(game.gamestate);
        updateLongestRoadView(this);
        if(this.gameState.phase == BoardState.Phase.Normal) {
            var roll = this.server.getRoll();
            this.distribute({type:"RollDice",targetRoll:roll});
            // View.sendMessage(new View.Message.RollDice(this,roll),this.views);
        }
        this.testState = GameState.cloneGameState(this.gameState);
        this.changePhaseViews();
        this.processWinner();
        
        renderGame(this, undefined);
    }
    sendIncomingTrades() {
        var incomingTrades = TradeOffer.getIncomingTrades(this.gameState.currentPlayerID,this.gameState.tradeOffers);
        this.distribute({type:"SetIncomingTrades",trades:incomingTrades});
    }
    sendAcceptValidations() {
        var incomingTrades = TradeOffer.getIncomingTrades(this.gameState.currentPlayerID,this.gameState.tradeOffers);
        let self = this;
        incomingTrades.forEach(function(trade) {
            self.distribute({
                type:"AcceptValidation",
                tradeID:trade.tradeID,
                validation:TradeOffer.validateAccept(self.gameState.players,trade.targetID,trade.requestResources)
            });
        });
    }
    updatePhaseLabel() {
        this.distribute({type:"PhaseMessage",phase:this.gameState.phase,subPhase:this.gameState.subPhase});
    }
    displayTrade() {
        this.distribute({type:"DisplayTradeView"})
    }
    processBankMessage(message:BankMessage) {
        switch(message.type) {
            case "RequestBankableResources":
                this.distribute({type:"BankableResources",bankResources:bankableResources(this.gameState)});
                break;
            case "TradeWithBank":
                tradeWithBank(this.gameState,message.offerResource,message.requestResource);
                UserInterfaceJScript.updateUIInfo(this.gameState.players,this.gameState.currentPlayerID);
                break;
        }
    }
    processTradeViewMessage(message:TradeViewMessage) {
        var trade:TradeOffer.TradeOffer;
        switch(message.type) {
            case "MakeOffer":
                trade = getOfferFromMessage(message,TradeOffer.nextTradeID(this.gameState.tradeOffers),this.gameState.currentPlayerID);
                if(TradeOffer.validateTradeOffer(this.gameState.players,trade)) {
                    this.gameState.tradeOffers.push(trade);
                } else {
                    if(this.input)
                        this.pushAnimation(new Animation.XClick(this.input.pos,15,10));
                }
                break;
            case "AcceptTrade":
                trade = TradeOffer.getTrades(message.tradeID,this.gameState.tradeOffers)[0];
                if(TradeOffer.validateTrade(this.gameState.players,trade)) {
                    TradeOffer.applyTrade(this.gameState.players,trade);
                    this.gameState.tradeOffers = TradeOffer.filterOutTrades(trade.tradeID,this.gameState.tradeOffers);
                    this.testState = GameState.cloneGameState(this.gameState);
                    UserInterfaceJScript.updateUIInfo(this.gameState.players,this.gameState.currentPlayerID);
                }
                break;
            case "RequestGameState":
                this.distribute({type:"GameState",gameState:this.gameState})
                break;
            case "RequestAcceptValidations":
                this.sendAcceptValidations();
                break;
            case "RequestIncomingTrades":
                this.sendIncomingTrades();
                break;
            case "TradeViewClosed":
                this.gameState.subPhase = BoardState.SubPhase.Building;
                this.testState = GameState.cloneGameState(this.gameState);
                UserInterfaceJScript.updateUIInfo(this.gameState.players,this.gameState.currentPlayerID);
                this.changePhaseViews();
                break;
        }
    }
    processDataMessage(message:DataMessage) {
        switch(message.type) {
            case "InputData":
                this.input = message.input;
                break;
            case "HitsData":
                this.hits = message.hits;
                break;
        }
    }
    processMessage(message:CatanGameInputs) {
        if(isTradeViewMessage(message)) {
            this.processTradeViewMessage(message);
        } else if (isBankMessage(message)) {
            this.processBankMessage(message);
        } else if (isDataMessage(message)) {
            this.processDataMessage(message);
        }
        else {
            switch(message.type) {
                case "EndTurn":
                    if(GameState.validateEndTurn(this.testState)) {
                        this.distribute({
                            type:"OpenPassView",
                            playerID:GameState.getNextPlayer(this.gameState)
                        });
                    }
                    break;
                case "PassViewClosed":
                    this.endTurn();
                    break;
                case "Undo":
                    this.actions.pop();
                    this.testState = GameState.cloneGameState(this.gameState);
                    Action.applyActionsForCurrentPlayer(this.actions,this.testState);
                    renderGame(this,undefined);
                    break;
                case "Resize":
                    renderGame(this,undefined);
                    break;
            }
        }
    }
    processMessages(messages:CatanGameInputs[]) {
        // let self = this;
        messages.forEach((message) => {
            this.processMessage(message);
        })
    }
    processInbox() {
        this.processing = this.inbox.slice();
        flushInbox(this.inbox);
        this.processMessages(this.processing);//Processes information from the UI in buffer
        flushInbox(this.processing);
        
    }
    gameStep() {
        var shouldRedraw = false;
        var highlight:BoardState.Position.Road | BoardState.Position.Vertex | undefined = undefined;
        
        this.distribute({type:"RequestInputData"});
        this.processInbox();
        if(this.input) {
            this.distribute({type:"RequestHits",coordinate:this.input.pos});
            this.processInbox();
        

        
            var maxHit = getMaxPositionHit(this.hits);
            var potentialAction:Action.Action.Any | undefined;
            if( maxHit === undefined) {
                potentialAction = undefined;
            } else {
                potentialAction = Action.genPotentialAction(this.gameState.board.vertices
                ,this.gameState.board.roads
                ,this.actions
                ,maxHit);
            }

        
            if(this.hits.length != 0 || this.graphics.animations.length != 0) {
                shouldRedraw = true;
            }
            if(this.input.dragging) {
                //                View.sendMessage(new View.Message.HideHexInfo(game),game.views);
                this.distribute({type:"AdjustTranslation",translation:this.input.movement});
                shouldRedraw = true;
            }
            if(this.input.scroll.y != 0) {
                this.distribute({type:"HideHexInfo"});
                this.distribute({type:"AdjustScale",adjustment:this.input.scroll.y});
                shouldRedraw = true;
            }
            if(potentialAction != null) {
                if(Action.validateActionForCurrentPlayer(potentialAction,this.testState)){
                    if(potentialAction.type != "RobHex")  {
                        highlight = Action.getPositionObject(potentialAction,this.testState.currentPlayerID);
                        shouldRedraw = true;
                    }
                }
            }
            if(this.input.clicked) {
                var drawCircle = true;
                shouldRedraw = true;
                if(maxHit != null && maxHit.data.type == BoardState.Position.Type.Hex) {
                    this.distribute({type:"DisplayHexInfo",hex:maxHit.data,position:this.input.pos});
                }
                
                if(potentialAction !== undefined) {
                    if(potentialAction.type != "RobHex") {
                        highlight = Action.getPositionObject(potentialAction,this.testState.currentPlayerID);
                        shouldRedraw = true;
                    }
                    if(potentialAction.type == "RobHex"){
                        if(Action.validateActionForCurrentPlayer(potentialAction,this.testState)){
                            Action.applyActionForCurrentPlayer(potentialAction, this.gameState);
                            this.gameState.subPhase = BoardState.SubPhase.Trading;
                            this.testState = GameState.cloneGameState(this.gameState);
                            this.changePhaseViews;
                        }
                    }
                    else{
                        if(Action.validateActionForCurrentPlayer(potentialAction,this.testState)) {
                            if(this.gameState.phase == BoardState.Phase.Init){
                                this.distribute({type:"InitBuilt"});
                            }
                            this.actions.push(potentialAction);
                            Action.applyActionForCurrentPlayer(potentialAction, this.testState);
                        } else {
                            this.pushAnimation(new Animation.XClick(this.input.pos,15,10));
                            drawCircle = false;
                        }
                    }
                    
                }
                if(drawCircle) {
                    this.pushAnimation(new Animation.ClickCircle(this.input.pos,10,10));
                }
                
                if(this.gameState.board.robber.moved) {
                    makeBoard(this);
                    this.gameState.board.robber.moved = false;
                }
            }
        }
        
        if(shouldRedraw) {
            renderGame(this,highlight);
        }
        
    }
}
function rollDice(){
    var roll = Math.floor(Math.random()* 6) + 1;
    return roll
}

function bankableResources(gameState:GameState.GameState) {
    var currentPlayer = GameState.getCurrentPlayer(gameState);
    var out:BoardState.Resource[] = [];
    currentPlayer.resources.forEach(function(amount,resource) {
        if(amount >= Constants.BANKABLE_RESOURCE_COUNT) {
            out.push(resource);
        }
    });
    return out;
}
function tradeWithBank(gamestate:GameState.GameState,offerResource:BoardState.Resource,requestResource:BoardState.Resource) {
    var currentPlayer = GameState.getCurrentPlayer(gamestate);
    if(currentPlayer.resources[offerResource] >= Constants.BANKABLE_RESOURCE_COUNT) {
        currentPlayer.resources[requestResource] += 1;
        currentPlayer.resources[offerResource] -= Constants.BANKABLE_RESOURCE_COUNT;
    }
}


function getOfferFromMessage(message:TradeView.MakeOffer,tradeID:number,offererID:number):TradeOffer.TradeOffer {
    return {
        offerResources:message.offerResources,
        offererID:offererID,
        requestResources:message.requestResources,
        targetID:message.targetID,
        tradeID:tradeID
    } 
}

export function renderGame(game:CatanGame,positionHighlight:BoardState.Position.Road | BoardState.Position.Vertex | undefined) {
    game.distribute({
        type:"RenderGameCanvas",
        gamestate:game.testState,
        highlight:positionHighlight,
        graphics:game.graphics,
        side:game.side
    })
    //drawHitboxes(hitlist,hits,game.ctx);
    UserInterfaceJScript.updateUIInfo(game.testState.players,game.testState.currentPlayerID);
}

/* checkPlayerWin
* Given a player, checks whether or not they have met the victory conditions
*/


function updateLongestRoadView(game:CatanGame) {
    if(game.gameState.longestRoadPlayer != null) {
        game.distribute({type:"SetLongestRoadID",longestRoadID:game.gameState.longestRoadPlayer.id});
    }
}


function storeBoardImage(graphics:Canvas.Graphics,gamestate:GameState.GameState,side:number) {
    graphics.renderedHexes = Canvas.generateHexCanvas(gamestate,side);
}

export function makeBoard(game:CatanGame) {
    storeBoardImage(game.graphics,game.gameState,game.side);
}

function flushInbox(inbox:any[]) {
    inbox.length = 0;
}
////////////////////////////
//end of module