
View.Message.newMessageType("DisplayTradeView", function() {});

View.Message.newMessageType("RequestIncomingTrades",function(){});

View.Message.newMessageType("SetIncomingTrades", function(sender,trades) {
        this.trades = trades;
});

View.Message.newMessageType("TradeViewClosed",function(){});

View.Message.newMessageType("RequestAcceptValidations",function(){});

View.Message.newMessageType("AcceptValidation",function(sender,tradeID,validation) {
        this.tradeID = tradeID;
        this.validation = validation;
});

View.Message.newMessageType("AcceptTrade", function(sender,tradeID) {
        this.tradeID = tradeID;
});
                    
View.Message.newMessageType("RequestGameState",function(){});

View.Message.newMessageType("GameState", function(sender,gamestate) {
        this.gamestate = gamestate;
});

View.Message.newMessageType("RequestOfferValidation", function(sender,trade) {
        this.trade = trade;
});

View.Message.newMessageType("OfferValidation", function(sender,validation) {
        this.validation = validation;
});

View.Message.newMessageType("MakeOffer", function(sender,targetID,offerResources,requestResources) {
        this.targetID = targetID;
        this.offerResources = offerResources;
        this.requestResources = requestResources;
});

TradeView = function(messageDestination) {
        var ActiveView = {
                None:-1,
                Trading:0,
                MakeOffer:1
        };
        var self = this;

        self.messageDestination = messageDestination;

        self.activeView = ActiveView.None;

        self.incomingTradesView = new IncomingTradesView(messageDestination,self);
        self.makeOfferView = new MakeOfferView(messageDestination,self);

        self.setMessageDestination = function(destination) {
                self.messageDestination = destination;
                self.incomingTradesView.messageDestination = destination;
                self.makeOfferView.messageDestination = destination;
        }

        self.incomingTradesViewClosed = function() {
                self.activeView = ActiveView.MakeOffer;
                self.makeOfferView.display();
        }

        self.makeOfferViewClosed = function() {
                self.activeView = ActiveView.None;
                sendMessage(new View.Message.TradeViewClosed(self),self.messageDestination);
        }

        self.getActiveView = function() {
                switch(self.activeView) {
                        case ActiveView.None:
                                //throw "Error `getActiveView`: No active trade-view";
                                break;
                        case ActiveView.Trading:
                                return self.incomingTradesView;
                                break;
                        case ActiveView.MakeOffer:
                                return self.makeOfferView;
                                break;
                }
        }

        self.passMessage = function(message) {
                var dest = self.getActiveView();
                if(dest != undefined) {
                        sendMessage(message,dest);
                }
        };

        ClientView.call(self,function(message) {
                switch(message.type) {
                        case View.Message.Type.DisplayTradeView:
                                self.activeView = ActiveView.Trading;
                                self.incomingTradesView.display();
                    default:
                            self.passMessage(message);
                            break;
                }
        });
}


IncomingTradesView = function(messageDestination,manager) {
        var self = this;
        self.messageDestination = messageDestination;
        self.incomingTradeTemplate = $('#templateTradeOffer');
        self.manager = manager;
        $("button#finish").click(function() {
                $("#incomingTradeOffers").hide();
                $("#incomingTradeOffers>#offers").empty();
                self.manager.incomingTradesViewClosed();
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
        self.display = function() {
                $("#incomingTradeOffers").show();
                sendMessage(new View.Message.RequestIncomingTrades(self),messageDestination);
                sendMessage(new View.Message.RequestAcceptValidations(self),messageDestination);
        }
        function displayIncomingTrades(trades) {
                var DOMOffers = joinJQueryArray(trades.map(newDOMTradeOffer));
                $("#incomingTradeOffers>#offers").append(DOMOffers);
        }
        function processAcceptValidation(message) {
                $("#incomingTradeOffers>#offers>div.tradeOffer[tradeID="+message.tradeID+"]>button.acceptOffer").prop("disabled",!message.validation);
        }

        ClientView.call(self,function(message) {
                switch(message.type) {
                        case View.Message.Type.SetIncomingTrades:
                                displayIncomingTrades(message.trades);
                                break;
                        case View.Message.Type.AcceptValidation:
                                processAcceptValidation(message);
                                break;
                }
        });

}

MakeOfferView = function(messageDestination,manager) {
        var self = this;
        self.messageDestination = messageDestination;
        self.manager = manager;
        function newTargetOption(id) {
                return $("<option value="+id+"> Player "+id+" </option>");
        }
        $("#cancelOffer").click(function() {
                closeView();
        });
        $("#makeOffer").click(function() {
                makeOffer();
                resetResources();
                //closeView();
        });

        self.display = function() {
                $("#offerCreator").show();
                sendMessage(new View.Message.RequestGameState(self),messageDestination);
        }

        function resetResources() {
                $("#offerCreator input.resource-input[resource]").val(0);
        }
        function closeView() {
                $("#offerCreator").hide();
                $("select#targetPlayer").empty();
                resetResources();
                self.manager.makeOfferViewClosed();
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

        }

        ClientView.call(self,function(message) {
                switch(message.type) {
                        case View.Message.Type.GameState:
                                displayOfferDesigner(message.gamestate);
                }
        });

}




function getOfferFromMessage(message,tradeID,offererID) {
    return new TradeOffer(tradeID
                         ,offererID
                         ,message.targetID
                         ,message.offerResources
                         ,message.requestResources);
}
