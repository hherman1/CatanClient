View.Message.Type.DisplayIncomingTrades = registerType();
View.Message.DisplayIncomingTrades = function(sender,trades) {
        this.trades = trades;
        View.Message.Blank.call(this,sender,View.Message.Type.DisplayIncomingTrades);
}

View.Message.Type.IncomingTradesViewClosed = registerType();
View.Message.IncomingTradesViewClosed = function(sender) {
        View.Message.Blank.call(this,sender,View.Message.Type.IncomingTradesViewClosed);
}

View.Message.Type.AcceptValidation = registerType();
View.Message.AcceptValidation = function(sender,tradeID,validation) {
        this.tradeID = tradeID;
        this.validation = validation;
        View.Message.Blank.call(this,sender,View.Message.Type.AcceptValidation);
}

View.Message.Type.AcceptTrade = registerType();
View.Message.AcceptTrade = function(sender,tradeID) {
        this.tradeID = tradeID;
        View.Message.Blank.call(this,sender,View.Message.Type.AcceptTrade);
}
                    
View.Message.Type.DisplayOfferDesigner = registerType();
View.Message.DisplayOfferDesigner = function(sender,gamestate) {
        this.gamestate = gamestate;
        View.Message.Blank.call(this,sender,View.Message.Type.DisplayOfferDesigner);
}

View.Message.Type.RequestOfferValidation = registerType();
View.Message.RequestOfferValidation = function(sender,trade) {
        this.trade = trade;
        View.Message.Blank.call(this,sender,View.Message.Type.RequestOfferValidation);
}

View.Message.Type.OfferValidation = registerType();
View.Message.OfferValidation = function(sender,validation) {
        this.validation = validation;
        View.Message.Blank.call(this,sender,View.Message.Type.OfferValidation);
}

View.Message.Type.MakeOffer = registerType();
View.Message.MakeOffer= function(sender,targetID,offerResources,requestResources) {
        this.targetID = targetID;
        this.offerResources = offerResources;
        this.requestResources = requestResources;
        View.Message.Blank.call(this,sender,View.Message.Type.MakeOffer);
}

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
                closeView();
        });
        $("#makeOffer").click(function() {
                makeOffer();
                closeView();
        });

        function closeView() {
                $("#offerCreator").hide();
                $("select#targetPlayer").empty();
                $("#offerCreator input.resource-input[resource]").val(0);
        }
        function makeOffer() {
                var offerResources = getResources($("#offer-resources"));
                var requestResources = getResources($("#request-resources"));
                var targetID = parseInt($("#offerCreator>#targetPlayer").val());
                sendMessage(new View.Message.MakeOffer(self,targetID,offerResources,requestResources)
                           ,self.messageDestination);
        }
        function getResources(par) {
                var out = [];
                out[Resource.Lumber] = getVal(par,"Lumber");
                out[Resource.Wool] = getVal(par,"Wool");
                out[Resource.Ore] = getVal(par,"Ore");
                out[Resource.Brick] = getVal(par,"Brick");
                out[Resource.Grain] = getVal(par,"Grain");
                return out;
        }
        function getVal(par,resource) {
                return Math.round(parseFloat($("input.resource-input[resource="+resource+"]",par).val()));
        }
        function setupInputCorrection(resources) {
                $("input.resource-input[resource]").attr("max",99);
                $("#offer-resources>input.resource-input[resource=Lumber]").attr("max",resources[Resource.Lumber]);
                $("#offer-resources>input.resource-input[resource=Wool]").attr("max",resources[Resource.Wool]);
                $("#offer-resources>input.resource-input[resource=Ore]").attr("max",resources[Resource.Ore]);
                $("#offer-resources>input.resource-input[resource=Brick]").attr("max",resources[Resource.Brick]);
                $("#offer-resources>input.resource-input[resource=Grain]").attr("max",resources[Resource.Grain]);
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
        function displayOfferDesigner(gamestate) {
                getPlayerIDs(gamestate.players).forEach(function(id) {
                        if(id != gamestate.currentPlayerID) {
                                $("select#targetPlayer").append(newTargetOption(id));
                        }
                });
                setupInputCorrection(getPlayersResources(getPlayers(gamestate.currentPlayerID,gamestate.players)[0]));

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



function getOfferFromMessage(message,tradeID,offererID) {
    return new TradeOffer(tradeID
                         ,offererID
                         ,message.targetID
                         ,message.offerResources
                         ,message.requestResources);
}
