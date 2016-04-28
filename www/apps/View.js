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

                //newMessageType takes the name of the message, and a constructor. Then it wraps
                //the constructor in its own constructor which extends it with View.Message.Default,
                //and gives it a type generated by registerType, stored in View.Message.Type[messageName].
                newMessageType: function(messageName,constructor) {
                        View.Message.Type[messageName] = registerType();
                        View.Message[messageName] = function(sender) {
                                View.Message.Default.call(this,sender,View.Message.Type[messageName]);
                                constructor.apply(this,arguments);
                        }
                        View.Message[messageName].prototype = Object.create(View.Message.Default.prototype);
                        View.Message[messageName].prototype.constructor = View.Message[messageName];
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
                Default: function(sender,messageType) {
                        this.sender = sender;
                        this.type = messageType;
                },
        },
}

View.Message.Default.prototype.hasType = function(type) {
        this.type == View.Message.Type[type];
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


View.Message.newMessageType("EndTurn",function() {});

EndTurnView = function(messageDestination) {
        var self = this;
        $("#endTurnButton").on('click',function() {
                sendMessage(new View.Message.EndTurn(self),messageDestination);
        });
        ClientViewSendOnly.call(self);
}



View.Message.newMessageType("BuildChoice",function(sender,structure) {
        this.structure = structure;
});

BuildChoiceView = function(structure,messageDestination) {
        var self = this;
        var incomingTrades =
        $(".buildChoice[structure="+getStructureName(structure)+"]").click(function() {
                sendMessage(new View.Message.BuildChoice(self,structure),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

View.Message.newMessageType("Undo",function(){});

UndoView = function(messageDestination) {
        var self = this;
        $("#undoButton").on('click',function() {
                sendMessage(new View.Message.Undo(),messageDestination);
        });
        ClientViewSendOnly.call(self);
}

View.Message.newMessageType("Resize",function(){});

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

View.Message.newMessageType("WinnerMessage",function(sender,winner){
        this.winner = winner;
});

WinnerMessageView = function(){
        View.Message.Client.call(this, function(winnermessage){
          if (winnermessage.hasType("WinnerMessage")){
            localStorage.setItem('winner',winnermessage.winner);
             window.location.href = "www/result.html"; //goes to the results page
          }
        })
}

// View.Message.Type.PhaseMessage = registerType();

// View.Message.PhaseMessage = function(phase,sender) {
//     this.phase = phase;
//     View.Message.Blank.call(this,sender,View.Message.Type.PhaseMessage);

// }
// TimerMessageView = function() {
//     View.Message.Client.call(this,function(message){
//         if(message.type == View.Message.Type.PhaseMessage) {
//             if(message.phase == Phase.Init){
//                 $("#phaseMessage").html("GAME START");
//                 $("#phaseMessageHolder").attr("phase","init");
//             }else if(message.subPhase == subPhase.Building){
//                 $("#phaseMessage").html("BUILDING");
//                 $("#phaseMessageHolder").attr("phase","normal");
//             }else if(message.subPhase == subPhase.Trading){
//                 $("#phaseMessage").html("TRADING");
//                 $("#phaseMessageHolder").attr("phase","trading");
//             }else if(message.subPhase == subPhase.Robbing){
//                 $("#phaseMessage").html("Robbin'");
//                 $("#phaseMessageHolder").attr("phase","robbing");
//             }
//         }
//     });
// }

View.Message.newMessageType("PhaseMessage",function(sender,phase,subPhase) {
    this.phase = phase;
    this.subPhase = subPhase;
});

// View.Message.SubPhaseMessage = function(phase,subPhase,sender) {
//     this.phase = phase;
//     this.subPhase = subPhase;
//     View.Message.Blank.call(this,sender,View.Message.Type.PhaseMessage);
// }

TimerMessageView = function() {
    View.Message.Client.call(this,function(message){
        if(message.hasType("PhaseMessage")) {
            if(message.phase == Phase.Init) {
                $("#phaseMessage").html("GAME START");
                $("#phaseMessageHolder").attr("phase","init");                
            }else if(message.subPhase == SubPhase.Building){
                $("#phaseMessage").html("BUILDING");
                $("#phaseMessageHolder").attr("phase","normal");
            }else if(message.subPhase == SubPhase.Trading){
                $("#phaseMessage").html("TRADING");
                $("#phaseMessageHolder").attr("phase","trading");
            }else if(message.subPhase == SubPhase.Robbing){
                $("#phaseMessage").html("Robbin'");
                $("#phaseMessageHolder").attr("phase","robbing");
            }else{
                throw ("Err: TimerMessageView not getting a proper phase or subphase");
                console.log(message.subPhase);
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
