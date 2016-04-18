//Concept:
//There are messages and clients. Clients send and receive messages. 
// UIViews are Clients which interact with the UI (typically the DOM). 
//
//Purpose:
// This is a generalization of the UI pattern we've used so far, 
// to make it much easier to manage our UI.
//
// Future:
// It may make sense to have Game implement Client

View = {
        Message : {
                Type : {
                    EndTurn : 0,
                    BuildChoice:1,
                    Undo: 4,
                    Resize:5,
                    RenderGameCanvas:8,
                    RequestMouseData:9,
                    MouseData:10,
                    AdjustTranslation:11,
                    AdjustScale:12,
                    RequestHits:13,
                    SetHitboxes:14,
                    HitsData:15,
                    DisplayIncomingTrades:16,
                    RequestAcceptValidation:17,
                    AcceptValidation:18,
                    AcceptTrade:19,
                    DisplayOfferDesigner:20,
                    RequestOfferValidation:21,
                    OfferValidation:22,
                    MakeOffer:23,
                },
                Client : function(receiveMessage) {
                        this.receiveMessage = receiveMessage;
                },
                Blank: function(sender,messageType) {
                        this.sender = sender;
                        this.type = messageType;
                },
                BuildChoice: function(sender,structure) {
                        this.structure = structure;
                        View.Message.Blank.call(this,sender,View.Message.Type.BuildChoice);
                },
                RenderGameCanvas : function(sender,gamestate,highlight,graphics,side) {
                        this.gamestate= gamestate;
                        this.highlight = highlight;
                        this.graphics = graphics;
                        this.side = side;
                        View.Message.Blank.call(this,sender,View.Message.Type.RenderGameCanvas);
                },
                RequestMouseData : function(sender) {
                        View.Message.Blank.call(this,sender,View.Message.Type.RequestMouseData);
                },
                MouseData : function(sender,mouse) {
                        this.mouse = mouse;
                        View.Message.Blank.call(this,sender,View.Message.Type.MouseData);
                },
                AdjustTranslation: function(sender,translation) {
                        this.translation = translation;
                        View.Message.Blank.call(this,sender,View.Message.Type.AdjustTranslation);
                },
                AdjustScale: function(sender,adjustment) {
                        this.adjustment = adjustment;
                        View.Message.Blank.call(this,sender,View.Message.Type.AdjustScale);
                },
                RequestHits: function(sender,coordinate) {
                        this.coordinate = coordinate;
                        View.Message.Blank.call(this,sender,View.Message.Type.RequestHits);
                },
                SetHitboxes: function(sender,hitboxes) {
                        this.hitboxes = hitboxes;
                        View.Message.Blank.call(this,sender,View.Message.Type.SetHitboxes);
                },
                HitsData: function(sender,hits) {
                        this.hits = hits;
                        View.Message.Blank.call(this,sender,View.Message.Type.HitsData);
                },
                DisplayIncomingTrades: function(sender,trades) {
                        this.trades = trades;
                        View.Message.Blank.call(this,sender,View.Message.Type.DisplayIncomingTrades);
                },
                RequestAcceptValidation: function(sender,tradeID) {
                        this.trades = trades;
                        View.Message.Blank.call(this,sender,View.Message.Type.DisplayIncomingTrades);
                },
                AcceptValidation: function(sender,validation) {
                        this.validation = validation;
                        View.Message.Blank.call(this,sender,View.Message.Type.AcceptValidation);
                },
                AcceptTrade: function(sender,tradeID) {
                        this.tradeID = tradeID;
                        View.Message.Blank.call(this,sender,View.Message.Type.AcceptTrade);
                },
                DisplayOfferDesigner: function(sender,gamestate) {
                        this.gamestate = gamestate;
                        View.Message.Blank.call(this,sender,View.Message.Type.DisplayOfferDesigner);
                },
                RequestOfferValidation: function(sender,trade) {
                        this.trade = trade;
                        View.Message.Blank.call(this,sender,View.Message.Type.RequestOfferValidation);
                },
                OfferValidation: function(sender,validation) {
                        this.validation = validation;
                        View.Message.Blank.call(this,sender,View.Message.Type.OfferValidation);
                },
                MakeOffer: function(sender,trade) {
                        this.trade = trade;
                        View.Message.Blank.call(this,sender,View.Message.Type.MakeOffer);
                },
        },
}

function sendMessage(message,destination) {
        destination.receiveMessage(message);
}
function respond(received,outgoing) {
        sendMessage(outgoing,received.sender);
}


ClientView = function(receiveMessage) {
        var self = this;
        View.Message.Client.call(self,receiveMessage);
}

ClientViewSendOnly = function() {
        ClientView.call(this,function(){});
}


EndTurnView = function(messageDestination) {
        var self = this;
        $("#endTurnButton").on('click',function() {
                sendMessage(new View.Message.Blank(self,View.Message.Type.EndTurn),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

BuildChoiceView = function(structure,messageDestination) {
        var self = this;
        $(".buildChoice[structure="+getStructureName(structure)+"]").click(function() {
                sendMessage(new View.Message.BuildChoice(self,structure),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

UndoView = function(messageDestination) {
        var self = this;
        $("#undoButton").on('click',function() {
                sendMessage(new View.Message.Blank(self,View.Message.Type.Undo),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

ResizeView = function(messageDestination) {
        var self = this;
        $(window).resize(function() {
                resizeBoardDOM($("#game").width(),$("#game").height());
                sendMessage(new View.Message.Blank(self,View.Message.Type.Resize),messageDestination);
        });
        ClientViewSendOnly.call(self,messageDestination);
}

TradeView = function(messageDestination) {
        var self = this;
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

