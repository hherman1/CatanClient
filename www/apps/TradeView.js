
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
                FirstWindow:0,
                SecondWindow:1
        };
        var self = this;

        self.messageDestination = messageDestination;

        self.activeView = ActiveView.None;

        $(".tradeoffer-screen button.closeWindow").click(function() {
                self.nextWindow();
        });

        self.incomingTradesView = new IncomingTradesView(messageDestination);
        self.makeOfferView = new MakeOfferView(messageDestination);
        //self.bankTrading = new BankTradingView(messageDestination);

        self.nextWindow = function() {
                switch(self.activeView) {
                        case ActiveView.None:
                                self.activeView = ActiveView.FirstWindow;
                                $("#firstTradeWindow").show();
                                self.incomingTradesView.display();
                                self.makeOfferView.hide();
         //                       self.bankTrading.hide();
                                break;
                        case ActiveView.FirstWindow:
                                self.activeView = ActiveView.SecondWindow;
                                $("#firstTradeWindow").hide();
                                self.incomingTradesView.hide();
                                $("#secondTradeWindow").show();
                                self.makeOfferView.display();
//                                self.bankTrading.display();
                                break;
                        case ActiveView.SecondWindow:
                                self.activeView = ActiveView.None;
                                $("#secondTradeWindow").hide();
                                self.incomingTradesView.hide();
                                self.makeOfferView.hide();
//                                self.bankTrading.hide();
                                sendMessage(new View.Message.TradeViewClosed(self),self.messageDestination);
                                break;
                }
        }

        self.setMessageDestination = function(destination) {
                self.messageDestination = destination;
                self.incomingTradesView.messageDestination = destination;
                self.makeOfferView.messageDestination = destination;
        }

        self.getActiveView = function() {
                switch(self.activeView) {
                        case ActiveView.None:
                                return null;
                                break;
                        case ActiveView.FirstWindow:
                                return self.incomingTradesView;
                                break;
                        case ActiveView.SecondWindow:
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
                            self.nextWindow();
                        default:
                            self.passMessage(message);
                            break;
                }
        });
}


IncomingTradesView = function(messageDestination) {
        var self = this;
        self.messageDestination = messageDestination;
        self.incomingTradeTemplate = $('#templateTradeOffer');
        self.hide = function() {
                $("#incomingTrades>#offers").empty();
        };
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
                sendMessage(new View.Message.RequestIncomingTrades(self),messageDestination);
                sendMessage(new View.Message.RequestAcceptValidations(self),messageDestination);
        }
        function displayIncomingTrades(trades) {
                var DOMOffers = joinJQueryArray(trades.map(newDOMTradeOffer));
                $("#incomingTrades>#offers").append(DOMOffers);
        }
        function processAcceptValidation(message) {
                $("#incomingTrades>#offers>div.tradeOffer[tradeID="+message.tradeID+"]>button.acceptOffer").prop("disabled",!message.validation);
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

MakeOfferView = function(messageDestination) {
        var self = this;
        self.messageDestination = messageDestination;
        function newTargetOption(id) {
                return $("<option value="+id+"> Player "+id+" </option>");
        }
        $("#resetOffer").click(function() {
                resetResources();
        });
        $("#makeOffer").click(function() {
                makeOffer();
                resetResources();
        });

        self.display = function() {
                sendMessage(new View.Message.RequestGameState(self),messageDestination);
        }

        self.hide = function() {
                resetResources();
                clearTargets();
        }
        function resetResources() {
                $("#offerCreator input.resource-input[resource]").val(0);
        }
        function clearTargets() {
                $("select#targetPlayer").empty();
        }
        function makeOffer() {
                var offerResources = getResources($("#offer-resources"));
                var requestResources = getResources($("#request-resources"));
                var targetID = parseInt($("select#targetPlayer").val());
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
