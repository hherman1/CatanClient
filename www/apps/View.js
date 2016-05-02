//Concept:
//There are messages and clients. Clients send and receive messages.
// UIViews are Clients which interact with the UI (typically the DOM).
//
//Purpose:
// This is a generalization of the UI pattern we've used so far,
// to make it much easier to manage our UI.
//

//Do not put Messages/Message.Types here. Use Types.registerType() from Types.js instead.
//See below for examples.

define(['Types','BoardState'],function(Types,BoardState) {

var Message = {
        Type : {},
        Client : function(receiveMessage) {
                this.receiveMessage = receiveMessage;
        },

        //newMessageType takes the name of the message, and a constructor. Then it wraps
        //the constructor in its own constructor which extends it with Message.Default,
        //and gives it a type generated by Types.registerType, stored in Message.Type[messageName].
        newMessageType: function(messageName,constructor) {
                Message.Type[messageName] = Types.registerType();
                Message[messageName] = function(sender) {
                        Message.Default.call(this,sender,Message.Type[messageName]);
                        constructor.apply(this,arguments);
                }
                Message[messageName].prototype = Object.create(Message.Default.prototype);
                Message[messageName].prototype.constructor = Message[messageName];
        },
        Forwarder : function(children) {
                var self = this;
                self.children = children;
                self.addChild = function(child) {
                        self.children.push(child);
                };
                Message.Client.call(self,function(message) {
                        self.children.forEach(function(child) {
                                sendMessage(message,child);
                        });
                });
        },
        Default: function(sender,messageType) {
                this.sender = sender;
                this.type = messageType;
        },
};

Message.Default.prototype.hasType = function(type) {
        return this.type == Message.Type[type];
}

function sendMessage(message,destination) {
        destination.receiveMessage(message);
}
function respond(received,outgoing) {
        sendMessage(outgoing,received.sender);
}


var ClientView = function(receiveMessage) {
        var self = this;
        Message.Client.call(self,receiveMessage);
}

var ClientViewSendOnly = function() {
        ClientView.call(this,function(){});
}

Message.newMessageType("EndTurn",function() {});
Message.newMessageType("DisableEndTurnButton",function(){});
Message.newMessageType("EnableEndTurnButton",function(){});

var EndTurnView = function(messageDestination) {
        var self = this;
        self.messageDestination = messageDestination;
        self.setupButton();
        ClientView.call(self,function(message) {
                switch(message.type) {
                        case Message.Type.DisableEndTurnButton:
                                self.disable();
                                break;
                        case Message.Type.EnableEndTurnButton:
                                self.enable();
                                break;
                }
        });
}
EndTurnView.prototype.getButton = function() {
        return $("#endTurnButton");
}
EndTurnView.prototype.setupButton = function() {
        var self = this;
        $("#endTurnButton").on('click',function() {
                sendMessage(new Message.EndTurn(self),self.messageDestination);
        });
}
EndTurnView.prototype.disable = function() {
        this.getButton().prop("disabled",true);
}
EndTurnView.prototype.enable = function() {
        this.getButton().prop("disabled",false);
}


Message.newMessageType("BuildChoice",function(sender,structure) {
        this.structure = structure;
});

var BuildChoiceView = function(structure,messageDestination) {
        var self = this;
        $(".buildChoice[structure="+BoardState.getStructureName(structure)+"]").click(function() {
                sendMessage(new Message.BuildChoice(self,structure),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

Message.newMessageType("Undo",function(){});

var UndoView = function(messageDestination) {
        var self = this;
        $("#undoButton").on('click',function() {
                sendMessage(new Message.Undo(),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

Message.newMessageType("Resize",function(){});

function resizeBoardDOM(width,height) {
        $("#board").attr("width",width);
        $("#board").attr("height",height);
}

function resizeGame() {
        resizeBoardDOM($("#game").width(),$("#game").height());
}

var ResizeView = function(messageDestination) {
        var self = this;
        $(window).resize(function() {
                resizeGame();
                sendMessage(new Message.Resize(),messageDestination);
        });
        ClientViewSendOnly.call(self,messageDestination);
}


Message.newMessageType("WinnerMessage",function(sender,winner){
        this.winner = winner;
});

var WinnerMessageView = function(){
        Message.Client.call(this, function(winnermessage){
          if (winnermessage.hasType("WinnerMessage")){
            localStorage.setItem('winner',winnermessage.winner);
            window.location.href = "www/result.html"; //goes to the results page
          }
        })
}


Message.newMessageType("PhaseMessage",function(sender,phase,subPhase) {
    this.phase = phase;
    this.subPhase = subPhase;
});


var TimerMessageView = function() {
    Message.Client.call(this,function(message){
        if(message.hasType("PhaseMessage")) {
            if(message.phase == BoardState.Phase.Init) {
                $("#phaseMessage").html("GAME START");
                $("#phaseMessageHolder").attr("phase","init");                
            }else if(message.subPhase == BoardState.SubPhase.Building){
                $("#phaseMessage").html("BUILDING");
                $("#phaseMessageHolder").attr("phase","normal");
            }else if(message.subPhase == BoardState.SubPhase.Trading){
                $("#phaseMessage").html("TRADING");
                $("#phaseMessageHolder").attr("phase","trading");
            }else if(message.subPhase == BoardState.SubPhase.Robbing){
                $("#phaseMessage").html("ROBBIN'");
                $("#phaseMessageHolder").attr("phase","robbing");
            }else{
                throw ("Err: TimerMessageView not getting a proper phase or subphase");
                console.log(message.subPhase);
            }
        }
    });
}

Message.newMessageType("FirstTimePlaying",function(sender,firstTime) {
        this.firstTime = firstTime;
});



Message.newMessageType("InitBuilt",function(sender) {})

var InstructionsMessageView = function() {
    Message.Client.call(this,function(message){
        switch(message.type) {
            case Message.Type.PhaseMessage:
                if(message.phase == BoardState.Phase.Init) {
                    $("#instructions").html("Build a house on an intersection and then a road attached to it");
                }else if(message.subPhase == BoardState.subPhase.Building) {
                    $("#instructions").html("Use your resources to build roads, houses or cities").delay(10000).fadeOut();
                }else if(message.subPhase == BoardState.SubPhase.Robbing){
                    $("#instructions").html("Place the robber on a tile of your choice").delay(10000).fadeOut(3000);
                }else if(message.subPhase == BoardState.subPhase.Trading){
                    $("#instructions").html("").delay(10000).fadeOut();                
                }     
                break;
            case Message.Type.InitBuilt:
                $("#instructions").fadeOut(3000);     
                break; 
        }
        
    });
}



return {
        Message:Message,
        sendMessage:sendMessage,
        respond:respond,
        ClientView:ClientView,
        ClientViewSendOnly:ClientViewSendOnly,
        EndTurnView:EndTurnView,
        BuildChoiceView:BuildChoiceView,
        UndoView:UndoView,
        ResizeView:ResizeView,
        WinnerMessageView:WinnerMessageView,
        TimerMessageView:TimerMessageView,
        InstructionsMessageView:InstructionsMessageView,
        resizeBoardDOM:resizeBoardDOM,
}

});
