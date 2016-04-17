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

UI = {
        Message : {
                Type : {
                    EndTurn : 0,
                    BuildChoice:1,
                    Undo: 4,
                    Resize:5,
                    MakeOffer:6,
                    AcceptOffer:7,
                },
                Client : function(receiveMessage) {
                        this.receiveMessage = receiveMessage;
                },
                Message: function(sender,messageType) {
                        this.sender = sender;
                        this.type = messageType;
                },
                MakeOffer: function(sender,offerResources,targetID,requestResources) {
                        this.offerResources = offerResources;
                        this.targetID = targetID;
                        this.requestResources = requestResources;
                        UI.Message.Message.call(this,sender,UI.Message.Type.MakeOffer);
                },
                AcceptOffer: function(sender,tradeID) {
                        this.tradeID = tradeID;
                        UI.Message.Message.call(this,sender,UI.Message.Type.AcceptOffer);
                },
                BuildChoice: function(sender,structure) {
                        this.structure = structure;
                        UI.Message.Message.call(this,sender,UI.Message.Type.BuildChoice);
                }
        },
}

function sendMessage(message,destination) {
        destination.receiveMessage(message);
}


UIView = function(messageDestination,receiveMessage) {
        var self = this;
        self.messageDestination = messageDestination;
        self.setDestination = function(messageDestination){
                self.messageDestination = messageDestination;
        }
        UI.Message.Client.call(self,receiveMessage);
}

UIViewSendOnly = function(messageDestination) {
        UIView.call(this,messageDestination,function(){});
}


EndTurnView = function(messageDestination) {
        var self = this;
        $("#endTurnButton").on('click',function() {
                sendMessage(new UI.Message.Message(self,UI.Message.Type.EndTurn),messageDestination);
        });
        UIViewSendOnly.call(self,messageDestination);
}

BuildChoiceView = function(structure,messageDestination) {
        var self = this;
        $(".buildChoice[structure="+getStructureName(structure)+"]").click(function() {
                sendMessage(new UI.Message.BuildChoice(self,structure),messageDestination);
        });
        UIViewSendOnly.call(self,messageDestination);
}

UndoView = function(messageDestination) {
        var self = this;
        $("#undoButton").on('click',function() {
                sendMessage(new UI.Message.Message(self,UI.Message.Type.Undo),messageDestination);
        });
        UIViewSendOnly.call(self,messageDestination);
}

ResizeView = function(messageDestination) {
        var self = this;
        $(window).resize(function() {
                resizeBoardDOM($("#game").width(),$("#game").height());
                sendMessage(new UI.Message.Message(self,UI.Message.Type.Resize),messageDestination);
        });
        UIViewSendOnly.call(self,messageDestination);
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
