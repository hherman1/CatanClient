//define(['Util','BoardState','Player'],function(Util,BoardState,Player){
import * as Util from "./Util"
import * as BoardState from "./BoardState"
import * as Player from "./Player"

export interface TradeOffer {
        tradeID: number;
        offererID:number;
        targetID:number;
        offerResources:number[];
        requestResources:number[];
}

export function cloneTradeOffer(offer:TradeOffer):TradeOffer {
        return {
                tradeID:offer.tradeID,
                offerResources:BoardState.cloneResources(offer.offerResources),
                offererID:offer.offererID,
                requestResources:BoardState.cloneResources(offer.requestResources),
                targetID:offer.targetID
        }
}

export function validateTradeOffer(players:Player.Player[],trade:TradeOffer) {
        return validateOffer(players,trade.offererID,trade.offerResources);
}

export function filterValidTradeOffers(players:Player.Player[],tradeoffers:TradeOffer[]) {
        return tradeoffers.filter(function(trade) {
                return validateTradeOffer(players,trade);
        });
}
export function validateOffer(players:Player.Player[],offererID:number,offerResources:number[]) {
       return Player.getPlayersResources(Player.getPlayer(offererID,players))
               .every(function(val,resource) {
                       return val >= offerResources[resource];
               });
}

export function validateAccept(players:Player.Player[],targetID:number,requestResources:number[]) {
        return validateOffer(players,targetID,requestResources);
}

export function applyTrade(players:Player.Player[],trade:TradeOffer) {
        function transaction(playerID:number,addedResources:number[],subtractedResources:number[]) {
                BoardState.subtractResources(Player.getPlayersResources(Player.getPlayer(playerID,players)),subtractedResources);
                BoardState.addResources(Player.getPlayersResources(Player.getPlayer(playerID,players)),addedResources);
        }
        transaction(trade.offererID,trade.requestResources,trade.offerResources);
        transaction(trade.targetID,trade.offerResources,trade.requestResources);
}

export function getIncomingTrades(playerID:number,trades:TradeOffer[]) {
        return trades.filter(function(trade) {return trade.targetID == playerID});
}


export function getTrades(tradeID:number,trades:TradeOffer[]) {
        return trades.filter(function(trade) {return trade.tradeID == tradeID});
}

export function filterOutTrades(tradeID:number,trades:TradeOffer[]) {
        return trades.filter(function(trade){return trade.tradeID != tradeID});
}

export function filterOutIncomingTrades(playerID:number,trades:TradeOffer[]) {
        return trades.filter(function(trade) {
                return trade.targetID != playerID;
        });
}

export function validateTrade(players:Player.Player[],trade:TradeOffer) {
        return validateOffer(players,trade.offererID,trade.offerResources)
               && validateAccept(players,trade.targetID,trade.requestResources);
}

export function nextTradeID(trades:TradeOffer[]) {
        if(trades.length > 0) {
                return Util.last(trades).tradeID + 1;
        } else {
                return 0;
        }
}



