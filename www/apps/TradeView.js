
IncomingTradesView = function(messageDestination) {
        var self = this;
        self.messageDestination = messageDestination;
        self.incomingTradeTemplate = $('#templateTradeOffer');
        $("button#finish").click(function() {
                $("#incomingTradeOffers").hide();
                $("#incomingTradeOffers>#offers").empty();
                sendMessage(new View.Message.IncomingTradesViewClosed(self),self.messageDestination);
        });
        function newDOMTradeOffer(trade) {
                var out = self.incomingTradeTemplate.clone();
                out.removeAttr('id');
                out.attr('tradeID',trade.tradeID);
                $(".offerer",out).html('From: ' + trade.offererID);
                $(".offeredResources",out).html('Offering: ' + trade.offerResources);
                $(".requestedResources",out).html('Requesting: ' + trade.requestResources);
                $("button.acceptOffer",out).click(function() {
                        sendMessage(new View.Message.AcceptTrade(self,trade.tradeID),self.messageDestination);
                        out.remove();
                });
                $("button.rejectOffer",out).click(function() {
                        out.remove();
                });
                return out;
        }
        function displayIncomingTrades(trades) {
                $("#incomingTradeOffers").show();
                var DOMOffers = joinJQueryArray(trades.map(newDOMTradeOffer));
                $("#incomingTradeOffers>#offers").append(DOMOffers);
        }
        function processAcceptValidation(message) {
                $("#incomingTradeOffers>#offers>div.tradeOffer[tradeID="+message.tradeID+"]>button.acceptOffer").prop("disabled",!message.validation);
        }

        ClientView.call(self,function(message) {
                switch(message.type) {
                        case View.Message.Type.DisplayIncomingTrades:
                                displayIncomingTrades(message.trades);
                                break;
                        case View.Message.Type.AcceptValidation:
                                processAcceptValidation(message);
                                break;
                }
        });

}

MakeOfferView = function(messageDestination) {
        var self = this;
        self.messageDestination = messageDestination;
        function newTargetOption(id) {
                return $("<option value="+id+"> Player "+id+" </option>");
        }
        $("#cancelOffer").click(function() {
                $("#offerCreator").hide();
                $("select#targetPlayer").empty();
        });
        function displayOfferDesigner(gamestate) {
                getPlayerIDs(gamestate.players).forEach(function(id) {
                        if(id != gamestate.currentPlayerID) {
                                $("select#targetPlayer").append(newTargetOption(id));
                        }
                });
                $("#offerCreator").show();
        }

        ClientView.call(self,function(message) {
                switch(message.type) {
                        case View.Message.Type.DisplayOfferDesigner:
                                displayOfferDesigner(message.gamestate);
                }
        });

}

TradeView = function(messageDestination) {
        var self = this;

        self.messageDestination = messageDestination;

        self.incomingTradesView = new IncomingTradesView(messageDestination);
        self.makeOfferView = new MakeOfferView(messageDestination);

        self.setMessageDestination = function(destination) {
                self.messageDestination = destination;
                self.incomingTradesView.messageDestination = destination;
                self.makeOfferView.messageDestination = destination;
        }

        ClientView.call(self,function(message) {
                sendMessage(message,self.incomingTradesView);
                sendMessage(message,self.makeOfferView);
        });
}


function setUpUIViews(destination) {
        var views = [];
        views.push(new EndTurnView(destination));
        views.push(new UndoView(destination));
        views.push(new ResizeView(destination));
        views.push(new BuildChoiceView(Structure.Road,destination));
        views.push(new BuildChoiceView(Structure.Settlement,destination));
        views.push(new BuildChoiceView(Structure.City,destination));
        return views;
}

