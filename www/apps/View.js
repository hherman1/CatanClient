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

//Do not put Messages/Message.Types here. Use registerType() from Types.js instead.
//See below for examples.
View = {
        Message : {
                Type : {},
                Client : function(receiveMessage) {
                        this.receiveMessage = receiveMessage;
                },
                Forwarder : function(children) {
                        var self = this;
                        self.children = children;
                        self.addChild = function(child) {
                                self.children.push(child);
                        };
                        View.Message.Client.call(self,function(message) {
                                self.children.forEach(function(child) {
                                        sendMessage(message,child);
                                });
                        });
                },
                Blank: function(sender,messageType) {
                        this.sender = sender;
                        this.type = messageType;
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


View.Message.Type.EndTurn = registerType();
View.Message.EndTurn = function(sender) {
        View.Message.Blank.call(this,sender,View.Message.Type.EndTurn);
}
EndTurnView = function(messageDestination) {
        var self = this;
        $("#endTurnButton").on('click',function() {
                sendMessage(new View.Message.EndTurn(self),messageDestination);
        });
        ClientViewSendOnly.call(self);
}



View.Message.Type.BuildChoice = registerType();
View.Message.BuildChoice = function(sender,structure) {
        this.structure = structure;
        View.Message.Blank.call(this,sender,View.Message.Type.BuildChoice);
}

BuildChoiceView = function(structure,messageDestination) {
        var self = this;
        var incomingTrades =
        $(".buildChoice[structure="+getStructureName(structure)+"]").click(function() {
                sendMessage(new View.Message.BuildChoice(self,structure),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

View.Message.Type.Undo = registerType();

View.Message.Undo = function(sender) {
        View.Message.Blank.call(this,sender,View.Message.Type.Undo);
}

UndoView = function(messageDestination) {
        var self = this;
        $("#undoButton").on('click',function() {
                sendMessage(new View.Message.Undo(),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

View.Message.Type.Resize = registerType();
View.Message.Resize = function(sender) {
        View.Message.Blank.call(this,sender,View.Message.Type.Resize);
}

ResizeView = function(messageDestination) {
        var self = this;
        $(window).resize(function() {
                resizeBoardDOM($("#game").width(),$("#game").height());
                sendMessage(new View.Message.Resize(),messageDestination);
        });
        ClientViewSendOnly.call(self,messageDestination);
}


function joinJQueryArray(list) {
        return $(list).map(function(){return this.toArray()});
}

View.Message.Type.WinnerMessage = registerType();

View.Message.WinnerMessage = function(winner,sender){
        this.winner = winner;
        View.Message.Blank.call(this, sender, View.Message.Type.WinnerMessage);
}

WinnerMessageView = function(){
        View.Message.Client.call(this, function(winnermessage){
          if (winnermessage.type == View.Message.Type.WinnerMessage){
            localStorage.setItem('winner',winnermessage.winner);
             window.location.href = "www/result.html"; //goes to the results page
          }
          else{

          }
        })
}

View.Message.Type.PhaseMessage = registerType();

View.Message.PhaseMessage = function(phase,sender) {
    this.phase = phase;
    View.Message.Blank.call(this,sender,View.Message.Type.PhaseMessage);

}
TimerMessageView = function() {
    View.Message.Client.call(this,function(message){
        if(message.type == View.Message.Type.PhaseMessage) {
            if(message.phase == Phase.Init){
                $("#phaseMessage").html("GAME START");
                $("#phaseMessageHolder").attr("phase","init");
            }else if(message.subPhase == subPhase.Building){
                $("#phaseMessage").html("BUILDING");
                $("#phaseMessageHolder").attr("phase","normal");
            }else if(message.subPhase == subPhase.Trading){
                $("#phaseMessage").html("TRADING");
                $("#phaseMessageHolder").attr("phase","trading");
            }else if(message.subPhase == subPhase.Robbing){
                $("#phaseMessage").html("Robbin'");
                $("#phaseMessageHolder").attr("phase","robbing");
            }
        }
    });
}

function makeUIViews(destination) {
        var views = [];
        views.push(new EndTurnView(destination));
        views.push(new UndoView(destination));
        views.push(new ResizeView(destination));
        views.push(new BuildChoiceView(Structure.Road,destination));
        views.push(new BuildChoiceView(Structure.Settlement,destination));
        views.push(new BuildChoiceView(Structure.City,destination));
        views.push(new TradeView(destination));
        views.push(new WinnerMessageView());
        views.push(new TimerMessageView());
        return views;
}
