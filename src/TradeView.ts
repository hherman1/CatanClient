//This file handles trading within the game. It contains many messages which helps the game
//logic communicate with the trade view.
import * as BoardState from "./BoardState"
import * as TradeOffer from "./TradeOffer"
import * as Player from "./Player"
import * as GameState from "./GameState"
import * as View from "./View"


export type DisplayTradeView = View.BlankMessage<"DisplayTradeView">
export type RequestIncomingTrades = View.BlankMessage<"RequestIncomingTrades">
export interface SetIncomingTrades extends View.Message<"SetIncomingTrades"> {
    trades:TradeOffer.TradeOffer[];
}

export type TradeViewClosed = View.BlankMessage<"TradeViewClosed">
export type RequestAcceptValidations = View.BlankMessage<"RequestAcceptValidations">

export interface AcceptValidation extends View.Message<"AcceptValidation"> {
    tradeID:number;
    validation:boolean;
}

export interface AcceptTrade extends View.Message<"AcceptTrade"> {
    tradeID:number
}

export type RequestGameState = View.BlankMessage<"RequestGameState">                   

export interface GameState extends View.Message<"GameState"> {
    gameState:GameState.GameState
}
export interface RequestOfferValidation extends View.Message<"RequestOfferValidation"> {
    trade:TradeOffer.TradeOffer
}

export interface OfferValidation extends View.Message<"OfferValidation"> {
    validation:boolean;
}

export interface MakeOffer extends View.Message<"MakeOffer"> {
    targetID:number;
    offerResources:number[];
    requestResources:number[];
}
enum ActiveView {
    None,
    FirstWindow,
    SecondWindow
};
export class TradeView extends View.ParentClientView<DisplayTradeView,TradeViewClosed> {
    activeView:ActiveView;
    types = ["DisplayTradeView"];
    nextWindow() {
        switch(this.activeView) {
            case ActiveView.None:
            this.activeView = ActiveView.FirstWindow;
            $("#firstTradeWindow").show();
            this.incomingTradesView.display();
            this.makeOfferView.hide();
            this.bankTradingView.hide();
            break;
            case ActiveView.FirstWindow:
            this.activeView = ActiveView.SecondWindow;
            $("#firstTradeWindow").hide();
            this.incomingTradesView.hide();
            $("#secondTradeWindow").show();
            this.makeOfferView.display();
            this.bankTradingView.display();
            break;
            case ActiveView.SecondWindow:
            this.activeView = ActiveView.None;
            $("#secondTradeWindow").hide();
            this.incomingTradesView.hide();
            this.makeOfferView.hide();
            this.bankTradingView.hide();
            this.sendMessage({type:"TradeViewClosed"},this.messageDestination);
            break;
        }
    }
    setMessageDestination(destination:View.Client<any,TradeViewClosed|any>) {
        this.messageDestination = destination;
        this.incomingTradesView.messageDestination = destination;
        this.makeOfferView.messageDestination = destination;
    }
    getActiveView(){
        switch(this.activeView) {
            case ActiveView.None:
            return null;
            case ActiveView.FirstWindow:
            return this.incomingTradesView;
            case ActiveView.SecondWindow:
            return this.makeOfferView;
        }
    }
    onMessage(message:View.BlankMessage<"DisplayTradeView">) {
        this.nextWindow();
    }
    incomingTradesView: IncomingTradesView;
    makeOfferView:MakeOfferView;
    bankTradingView:BankTradingView;
    constructor(public messageDestination:View.Client<any,TradeViewClosed | any>) {
        super([]); // set children later on
        var self = this;
        self.activeView = ActiveView.None;
        
        $(".tradeoffer-screen button.closeWindow").click(function() {
            self.nextWindow();
        });
        
        self.incomingTradesView = new IncomingTradesView(messageDestination);
        self.makeOfferView = new MakeOfferView(messageDestination);
        self.bankTradingView = new BankTradingView(messageDestination);
        this.children = [this.incomingTradesView,this.makeOfferView,this.bankTradingView] // here
    }
}

export type RequestBankableResources = View.BlankMessage<"RequestBankableResources">
export interface BankableResources extends View.Message<"BankableResources"> {
    bankResources:BoardState.Resource[]
}
export interface TradeWithBank extends View.Message<"TradeWithBank"> {
    offerResource:BoardState.Resource;
    requestResource:BoardState.Resource;
}

export class BankTradingView extends View.ClientView<BankableResources,RequestBankableResources | TradeWithBank> {
    types:string[] = ["BankableResources"]
    constructor(protected messageDestination:View.Client<any,any>) {
        super();
        
        var self = this;
        
        $("#bankTradeConfirmButton").click(function() {
            self.trade();
            self.display();
        });
    }
    onMessage(message:BankableResources) {
        this.setBankableResources(message.bankResources);
    }
    display() {
        this.sendMessage({type:"RequestBankableResources"},this.messageDestination);
    }
    clearBankableResources() {
        $("#offer-resources-bank>select").empty();
    }
    hide() {
        this.clearBankableResources();
    }
    newBankOption(resource:BoardState.Resource) {
        return $("<option value="+resource+"> " + BoardState.getResourceName(resource) + "</option>");
    }
    setBankableResources = function(bankResources:BoardState.Resource[]) {
        var self = this;
        self.clearBankableResources();
        if(bankResources.length == 0) {
            self.disable();
        } else {
            self.enable();
        }
        bankResources.forEach(function(resource) {
            $("#offer-resources-bank>select").append(self.newBankOption(resource)); 
        });
    }
    getOfferResource() {
        return parseInt($("#offer-resources-bank>select").val());
    }
    getRequestResource() {
        return parseInt($("#request-resources-bank>select").val());
    }
    trade() {
        this.sendMessage({
            type:"TradeWithBank",
            offerResource:this.getOfferResource(),
            requestResource:this.getRequestResource()
        },this.messageDestination);
    }
    disable() {
        $("#bankTradeConfirmButton").prop("disabled",true);
    }
    enable() {
        $("#bankTradeConfirmButton").prop("disabled",false);
    }
}

export class IncomingTradesView extends View.ClientView<SetIncomingTrades|AcceptValidation,AcceptTrade|RequestIncomingTrades|RequestAcceptValidations> {
    types:string[] = ["SetIncomingTrades","AcceptValidation"]
    incomingTradeTemplate:JQuery;
    constructor(public messageDestination:View.Client<any,any>) {
        super();
        var self = this;
        self.incomingTradeTemplate = $('#templateTradeOffer');
        $("#incomingTrades>#reject-all").click(self.clearOffers);
    }
    clearOffers() {
        $("#incomingTrades>#offers").empty();
    }
    hide() {
        this.clearOffers();
    };
    
    newDOMTradeDisplay() {
        return $("<table class=trade>" +
        "<tr>" +
        "<th></th>"+
        "<th>Lumber</th>"+
        "<th>Wool</th>"+
        "<th>Ore</th>"+
        "<th>Brick</th>"+
        "<th>Grain</th>"+
        "</tr>" +
        "<tr offer>" +
        "<th> Offer </th>"+
        "<td resource="+BoardState.Resource.Lumber+">0</td>"+
        "<td resource="+BoardState.Resource.Wool+">0</td>"+
        "<td resource="+BoardState.Resource.Ore+">0</td>"+
        "<td resource="+BoardState.Resource.Brick+">0</td>"+
        "<td resource="+BoardState.Resource.Grain+">0</td>"+
        "</tr>"+
        "<tr request>" +
        "<th> Request </th>"+
        "<td resource="+BoardState.Resource.Lumber+">0</td>"+
        "<td resource="+BoardState.Resource.Wool+">0</td>"+
        "<td resource="+BoardState.Resource.Ore+">0</td>"+
        "<td resource="+BoardState.Resource.Brick+">0</td>"+
        "<td resource="+BoardState.Resource.Grain+">0</td>"+
        "</tr>"+
        "</table>");
        
    }
    setTradeDisplay(display:JQuery,trade:TradeOffer.TradeOffer) {
        trade.offerResources.forEach(function(amount,resource) {
            $("tr[offer]>td[resource="+resource+"]",display).html(amount.toString());
        });
        trade.requestResources.forEach(function(amount,resource) {
            $("tr[request]>td[resource="+resource+"]",display).html(amount.toString());
        });
    }
    newTradeDOM(trade:TradeOffer.TradeOffer) {
        var out = this.newDOMTradeDisplay();
        this.setTradeDisplay(out,trade);
        return out;
    }
    newDOMTradeOffer(trade:TradeOffer.TradeOffer) {
        let self = this;
        var out = this.incomingTradeTemplate.clone();
        out.removeAttr('id');
        out.attr('tradeID',trade.tradeID);
        $(".offerer",out).html('From: Player ' + trade.offererID);
        $(".details",out).append(this.newTradeDOM(trade));
        $("button.acceptOffer",out).click(function() {
            self.sendMessage({type:"AcceptTrade",tradeID:trade.tradeID},self.messageDestination);
            out.remove();
        });
        $("button.rejectOffer",out).click(function() {
            out.remove();
        });
        return out;
    }
    display() {
        this.sendMessage({type:"RequestIncomingTrades"},this.messageDestination);
        this.sendMessage({type:"RequestAcceptValidations"},this.messageDestination);
    }
    joinJQueryArray(arr:JQuery[]):JQuery[] {
        var out:JQuery[] = [];
        arr.forEach(function(e) {
            out = $.merge<JQuery>(out,[e]);
        });
        return out;
    }
    displayIncomingTrades(trades:TradeOffer.TradeOffer[]) {
        let self = this;
        var DOMOffers = this.joinJQueryArray(trades.map((trade)=>{
            return self.newDOMTradeOffer(trade)
        }));
        $("#incomingTrades>#offers").append(DOMOffers);
        $("#incomingTrades>#offers .tradeOffer").append($("<br />"));
    }
    processAcceptValidation(message:AcceptValidation) {
        $("#incomingTrades>#offers>div.tradeOffer[tradeID="+message.tradeID+"] button.acceptOffer").prop("disabled",!message.validation);
    }
    
    onMessage(message:AcceptValidation | SetIncomingTrades) {
        switch(message.type) {
            case "SetIncomingTrades":
            this.displayIncomingTrades(message.trades);
            break;
            case "AcceptValidation":
            this.processAcceptValidation(message);
            break;
        }
    };
}

export class MakeOfferView extends View.ClientView<GameState,RequestGameState|MakeOffer> {
    types:string[] = ["GameState"]
    constructor(public messageDestination:View.Client<any,any>) {
        super();
        var self = this;
        
        $("#resetOffer").click(function() {
            self.resetResources();
        });
        $("#makeOffer").click(function() {
            self.makeOffer();
            self.resetResources();
        });
        
    }
    newTargetOption(id:number) {
        return $("<option value="+id+"> Player "+id+" </option>");
    }
    display = function() {
        this.sendMessage({type:"RequestGameState"},this.messageDestination);
    }
    
    hide() {
        this.resetResources();
        this.clearTargets();
    }
    resetResources() {
        $("#offerCreator input.resource-input[resource]").val(0);
    }
    clearTargets() {
        $("select#targetPlayer").empty();
    }
    makeOffer() {
        var offerResources = this.getResources($("#offer-resources"));
        var requestResources = this.getResources($("#request-resources"));
        var targetID = parseInt($("select#targetPlayer").val());
        this.sendMessage({type:"MakeOffer",targetID:targetID,offerResources:offerResources,requestResources:requestResources}
        ,this.messageDestination);
    }
    getResources(par:JQuery) {
        var out = [];
        out[BoardState.Resource.Lumber] = this.getVal(par,BoardState.Resource.Lumber);
        out[BoardState.Resource.Wool] = this.getVal(par,BoardState.Resource.Wool);
        out[BoardState.Resource.Ore] = this.getVal(par,BoardState.Resource.Ore);
        out[BoardState.Resource.Brick] = this.getVal(par,BoardState.Resource.Brick);
        out[BoardState.Resource.Grain] = this.getVal(par,BoardState.Resource.Grain);
        return out;
    }
    getVal(par:JQuery,resource:BoardState.Resource) {
        return Math.round(parseFloat($("input.resource-input[resource="+BoardState.getResourceName(resource)+"]",par).val()));
    }
    setupInputCorrection(resources:number[]) {
        $("input.resource-input[resource]").attr("max",99);
        $("#offer-resources input.resource-input[resource=Lumber]").attr("max",resources[BoardState.Resource.Lumber]);
        $("#offer-resources input.resource-input[resource=Wool]").attr("max",resources[BoardState.Resource.Wool]);
        $("#offer-resources input.resource-input[resource=Ore]").attr("max",resources[BoardState.Resource.Ore]);
        $("#offer-resources input.resource-input[resource=Brick]").attr("max",resources[BoardState.Resource.Brick]);
        $("#offer-resources input.resource-input[resource=Grain]").attr("max",resources[BoardState.Resource.Grain]);
        $("input.resource-input[resource]").change(function(ev) {
            var valFloat = parseFloat($(ev.target).val());
            var val = Math.round(valFloat);
            var max = Math.round(parseFloat($(ev.target).attr("max")));
            var min = Math.round(parseFloat($(ev.target).attr("min")));
            if(isNaN(val)) {
                $(ev.target).val(min);
            } else {
                if(val != valFloat) {
                    $(ev.target).val(val);
                }
                if(val > max) {
                    $(ev.target).val(max);
                }else if(val < min) {
                    $(ev.target).val(min);
                } 
            }
        });
    }
    displayOfferDesigner(gamestate:GameState.GameState) {
        let self = this;
        Player.getPlayerIDs(gamestate.players).forEach(function(id) {
            if(id != gamestate.currentPlayer.id) {
                $("select#targetPlayer").append(self.newTargetOption(id));
            }
        });
        this.setupInputCorrection(Player.getPlayersResources(gamestate.currentPlayer));
        
    }
    onMessage(message:GameState) {
        this.hide();
        this.displayOfferDesigner(message.gameState);
    }
} 
