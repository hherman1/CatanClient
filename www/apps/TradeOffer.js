
TradeOffer = function(tradeID,offererID,targetID,offerResources,requestResources) {
        this.tradeID = tradeID;
        this.offererID = offererID;
        this.targetID = targetID;
        this.offerResources = offerResources;
        this.requestResources = requestResources;
}

function cloneTradeOffer(offer) {
        return new TradeOffer(offer.offererID
                             ,offer.targetID
                             ,cloneResources(offer.offerResources)
                             ,cloneResources(offer.requestResources));
}

function validateTradeOffer(gamestate,trade) {
        return validateOffer(gamestate,trade.offererID,trade.offerResources);
}

function validateOffer(gamestate,offererID,offerResources) {
       return getPlayersResources(getPlayers(offererID,gamestate.players)[0])
               .every(function(val,resource) {
                       return val >= offerResources[resource];
               });
}

function validateAccept(gamestate,targetID,requestResources) {
        return validateOffer(gamestate,targetID,requestResources);
}

function applyTrade(gamestate,trade) {
        function transaction(playerID,players,addedResources,subtractedResources) {
                addResources(subtractResources(getPlayersResources(getPlayers(playerID
                                                                             ,players)[0])
                                              ,trade.offerResources)
                            ,trade.requestResources);
        }
        transaction(trade.offererID,gamestate.players,trade.requestResources,trade.offerResources);
        transaction(trade.targetID,gamestate.players,trade.offerResources,trade.requestResources);
}


function getTrades(tradeID,trades) {
        return trades.filter(function(trade) {return trade.tradeID == tradeID});
}

function filterOutTrades(tradeID,trades) {
        return trades.filter(function(trade){return trade.tradeID != tradeID});
}

function validateTrade(gamestate,trade) {
        return validateOffer(gamestate,trade.offererID,trade.offerResources)
               && validateAccept(gamestate,trade.targetID,trade.requestResources);
}

