import * as Constants from "./Constants"
import * as Grid from "./Grid"
import * as Transform from "./Transform"
import * as TradeOffer from "./TradeOffer"
import * as BoardState from "./BoardState"
import * as Player from "./Player"
import * as GameMethods from "./GameMethods"
import * as GameState from "./GameState"
import * as Hitbox from "./Hitbox"
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

import * as Action from "./Action/Action"
import * as BuildAction from "./Action/Build"

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
    newGame(width:number,resourceList:BoardState.Resource[],tokenList:number[],numPlayers:number) {
        let players = Player.genPlayers(numPlayers);
        this.gameState = new GameState.GameState(BoardState.makeRegularHexBoard(width, resourceList, tokenList),players[0])
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
    // endTurn(actionsToBeValidated:Action.AnyAction[]) {
    //     Action.applyActions(actionsToBeValidated, this.gameState);//Applies pending actions to server gamestate
    //     Action.flushActions(actionsToBeValidated);//Flushes the pending actions
        
    //     GameState.updateLongestRoad(this.gameState);
    //     this.gameState.tradeOffers = TradeOffer.filterOutIncomingTrades(this.gameState.currentPlayer.id, this.gameState.tradeOffers);
        
    //     var unupdatedCurrentPlayerID = this.gameState.currentPlayer.id;
    //     GameState.nextPlayer(this.gameState);
    //     GameState.updateGamePhase(this.gameState, unupdatedCurrentPlayerID);
        
    //     if(this.gameState.phase == BoardState.Phase.Normal) {
    //         this.roll.left = rollDice();
    //         this.roll.right = rollDice();
    //         GameMethods.resourceGeneration(this.roll.left + this.roll.right, this.gameState.players, this.gameState.board.vertices, this.gameState.board.hexes, this.gameState.board.robber);
    //         if (this.roll.left + this.roll.right == 7) {
    //             this.gameState.subPhase = BoardState.SubPhase.Robbing;
    //         }
    //         else {
    //             this.gameState.subPhase = BoardState.SubPhase.Trading;
    //         }
    //     }
    //     this.gameState.tradeOffers = TradeOffer.filterValidTradeOffers(this.gameState.players,this.gameState.tradeOffers);
    // }
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
    log:Action.AnyAction[] = [];
    actions:Action.AnyAction[] = []; //new Reference([]);
    gameState:GameState.GameState;
    lastReplay:GameState.GameState;
    hits:Hitbox.Hitbox[] = [];
    inbox:CatanGameInputs[] = [];
    processing:View.Message<any>[] = [];
    input:Input.Input|undefined;
    constructor(public side:number,public distributor:View.Distributor) {
        super();
        let newGame:Action.NewGame = {
            numPlayers:Player.getStoredPlayers(),
            tokenList:BoardState.shuffle(Constants.BASE_TOKEN_LIST.slice()),
            resourceList:BoardState.shuffle(BoardState.BASE_RESOURCE_LIST.slice()),
            type:"NewGame",
            width:5
        }
        this.log.push(newGame);
        this.gameState = Action.newGame(newGame);
        this.lastReplay = Action.replayActions(this.log);
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
    refreshPhaseViews() {
        this.updatePhaseLabel();
        switch(this.lastReplay.subPhase) {
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
        //let endTurn:Action.EndTurn = {type:"EndTurn",roll:GameState.genRoll()}
        let endTurn:Action.EndTurn = {type:"EndTurn",roll:{left:3,right:4}}

        Action.applyActions(this.actions, this.gameState);//Applies pending actions to server gamestate
        this.log = this.log.concat(this.actions);
        this.log.push(endTurn);
        Action.flushActions(this.actions);//Flushes the pending actions
        Action.applyAction(endTurn,this.gameState);
        Action.applyAction(endTurn,this.lastReplay);

        updateLongestRoadView(this);
        if(this.gameState.phase == BoardState.Phase.Normal)
            this.distribute({type:"RollDice",targetRoll:endTurn.roll});

        // this.lastReplay = Action.replayActions(this.log);
        this.refreshPhaseViews();
        this.processWinner();
        this.processCanEnd();
        
        renderGame(this, undefined);
    }
    sendIncomingTrades() {
        var incomingTrades = TradeOffer.getIncomingTrades(this.gameState.currentPlayer.id,this.gameState.tradeOffers);
        this.distribute({type:"SetIncomingTrades",trades:incomingTrades});
    }
    sendAcceptValidations() {
        var incomingTrades = TradeOffer.getIncomingTrades(this.gameState.currentPlayer.id,this.gameState.tradeOffers);
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
                let bankTrade:Action.BankTrade = {
                    type:"BankTrade",
                    tradein:message.offerResource,
                    receive:message.requestResource
                }
                if(Action.validateAction(bankTrade,this.lastReplay)) {
                    this.log.push(bankTrade);
                    Action.applyAction(bankTrade,this.gameState);
                    Action.applyAction(bankTrade,this.lastReplay);
                    UserInterfaceJScript.updateUIInfo(this.gameState.players,this.gameState.currentPlayer.id);
                }
                this.refreshTradeWindow();
                //tradeWithBank(this.gameState,message.offerResource,message.requestResource);
                break;
        }
    }
    refreshTradeWindow() {
        this.distribute({type:"GameState",gameState:this.gameState});
        this.distribute({type:"BankableResources",bankResources:bankableResources(this.gameState)});
    }
    processTradeViewMessage(message:TradeViewMessage) {
        var trade:TradeOffer.TradeOffer;
        switch(message.type) {
            case "MakeOffer":
                trade = getOfferFromMessage(message,TradeOffer.nextTradeID(this.gameState.tradeOffers),this.gameState.currentPlayer.id);
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
                    let tradeAction = Action.fromTradeOffer(trade);
                    this.log.push(tradeAction);
                    Action.applyAction(tradeAction,this.gameState);
                    Action.applyAction(tradeAction,this.lastReplay);
                    this.gameState.tradeOffers = TradeOffer.filterOutTrades(trade.tradeID,this.gameState.tradeOffers);
                    UserInterfaceJScript.updateUIInfo(this.gameState.players,this.gameState.currentPlayer.id);
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
                // this.gameState.subPhase = BoardState.SubPhase.Building;
                // this.testState = GameState.cloneGameState(this.gameState);
                let action:Action.EndTradePhase = {type:"EndTradePhase"};
                if(Action.validateAction(action,this.gameState)) {
                    this.log.push(action);
                    Action.applyAction(action,this.gameState);
                    Action.applyAction(action,this.lastReplay);
                }
                UserInterfaceJScript.updateUIInfo(this.gameState.players,this.gameState.currentPlayer.id);
                this.refreshPhaseViews();
                // break;
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
                    if(Action.validateEndTurn(this.lastReplay)) {
                        this.distribute({
                            type:"OpenPassView",
                            playerID:GameState.getNextPlayer(this.gameState).id
                        });
                    }
                    break;
                case "PassViewClosed":
                    this.endTurn();
                    break;
                case "Undo":
                    this.actions.pop();
                    this.lastReplay = Action.replayActions(this.log.concat(this.actions));
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
    processCanEnd() {
        if(GameState.validateEndTurn(this.lastReplay)) {
            this.distribute({type:"EnableEndTurnButton"});
        } else {
            this.distribute({type:"DisableEndTurnButton"});
        }
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
            var potentialAction:Action.AnyAction | undefined;
            if( maxHit === undefined) {
                potentialAction = undefined;
            } else {
                potentialAction = Action.genPotentialAction(maxHit);
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
                if(Action.validateAction(potentialAction,this.lastReplay)){
                    if(BuildAction.isBuildAction(potentialAction)) {
                        highlight = BuildAction.getPositionObject(potentialAction,this.lastReplay.currentPlayer.id);
                        shouldRedraw = true;
                    }
                }
            }
            if(this.input.clicked) {
                var drawCircle = true;
                var robberMoved = false;

                shouldRedraw = true;
                if(maxHit != null && maxHit.data.type == BoardState.Position.Type.Hex) {
                    this.distribute({type:"DisplayHexInfo",hex:maxHit.data,position:this.input.pos});
                }
                
                if(potentialAction !== undefined) {
                    if(Action.validateAction(potentialAction,this.lastReplay)) {
                        if(this.gameState.phase == BoardState.Phase.Init){
                            this.distribute({type:"InitBuilt"});
                        }
                        if(potentialAction.type == "RobHex") {
                            robberMoved = true;
                            this.log.push(potentialAction);
                            Action.applyAction(potentialAction, this.lastReplay);
                            Action.applyAction(potentialAction, this.gameState);
                        }
                        else {
                            this.actions.push(potentialAction);
                            Action.applyAction(potentialAction, this.lastReplay);
                        }
                        this.refreshPhaseViews();
                        this.processCanEnd();
                    } else {
                        this.pushAnimation(new Animation.XClick(this.input.pos,15,10));
                        drawCircle = false;
                    }
                }
                if(drawCircle) {
                    this.pushAnimation(new Animation.ClickCircle(this.input.pos,10,10));
                }
                
                if(robberMoved) {
                    makeBoard(this);
                }
            }
        }
        
        if(shouldRedraw) {
            renderGame(this,highlight);
        }
        
    }
}

function bankableResources(gameState:GameState.GameState) {
    var currentPlayer = gameState.currentPlayer;
    var out:BoardState.Resource[] = [];
    currentPlayer.resources.forEach(function(amount,resource) {
        if(amount >= Constants.BANKABLE_RESOURCE_COUNT) {
            out.push(resource);
        }
    });
    return out;
}
function tradeWithBank(gamestate:GameState.GameState,offerResource:BoardState.Resource,requestResource:BoardState.Resource) {
    var currentPlayer = gamestate.currentPlayer;
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
        gamestate:game.lastReplay,
        highlight:positionHighlight,
        graphics:game.graphics,
        side:game.side
    })
    //drawHitboxes(hitlist,hits,game.ctx);
    UserInterfaceJScript.updateUIInfo(game.lastReplay.players,game.lastReplay.currentPlayer.id);
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
    storeBoardImage(game.graphics,game.lastReplay,game.side);
}

function flushInbox(inbox:any[]) {
    inbox.length = 0;
}
////////////////////////////
//end of module