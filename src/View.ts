//Concept:
//There are messages and clients. Clients send and receive messages.
// UIViews are Clients which interact with the UI (typically the DOM).
//
//Purpose:
// This is a generalization of the UI pattern we've used so far,
// to make it much easier to manage our UI.
//

//Do not put Messages/Types here. Use Types.registerType() from Types.js instead.
//See below for examples.

/// <reference path="declarations/jquery.d.ts" />

import * as Types from "./Types"
import * as BoardState from "./BoardState"

interface Observers {
        [type:string]:Client<any,any>[];
}
export class Distributor {
        observers:Observers = {};
        distribute<O extends Message<any>, M extends O>(message:M,sender:Client<any,O>) {
            // sender.distributeMessage(message,this.observers[message.type]);
            this.getObservers(message.type).forEach((observer) => {
                observer.onMessage(message,sender);
            })
        }
        getObservers(type:string) {
            let out = this.observers[type];
            if(out === undefined) {
                this.observers[type] = [];
                return [];
            } else {
                return out;
            }
        }
        subscribe<T extends string,M extends Message<T>>(type:T,client:Client<M,any>):number {
            if(this.observers[type] === undefined) {
                this.observers[type] = [];
            }
            return this.observers[type].push(client);
        }
        
}

// Holds a message that can be sent from or to View.js
export interface Message<T extends string> { // The message was sent by a client who will receive messages of type R
        type:T;
}
export interface BlankMessage<T extends string> extends Message<T> { // just a named message
        type:T;
}
export abstract class Client<I extends Message<any> | null, O extends Message<any> | null> { // The client will receive messages of type M
        abstract onMessage(message:I,sender:Client<any,I>): void;
        abstract types:string[];

        sendMessage(message:O,destination:Client<O,any>) {
                        destination.onMessage(message,this);
        }
        // distributeMessage(message:O,destinations:Client<O,any>[]) {
        //     destinations.forEach((dest) => this.sendMessage(message,dest));
        // }
        subscribe(dist:Distributor): void {
                let self = this;
                this.types.forEach((type) => {
                        dist.subscribe(type,<Client<Message<any>,any>>self) // should be safe in this case.
                })
        } 
}
export abstract class DistributedClient<I extends Message<any>|null,D extends Message<any>> extends Client<I,D> {
    distributor:Distributor;
    distribute(message:D):void {
        this.distributor.distribute(message,this);
    }
}


export abstract class Forwarder<I extends Message<any>,O extends Message<any>> extends Client<I,O> {
        constructor(public children:Client<I,O>[]) {
                super();
        }
        onMessage(message:I,sender:Client<any,I>) {
                this.children.forEach(function(child) {
                        child.onMessage(message,sender);
                });
        }
}



// function sendMessage<M extends Message<any>>(message:M,destination:Client<M>) {
//         destination.onMessage(message);
// }
// function respond<M extends Message<any>,R extends Message<M>>(received:R,outgoing:M) {
//         sendMessage<M>(outgoing,received.sender);
// }

export abstract class ClientView<I extends Message<any> | null,R extends Message<any> | null> extends Client<I,R> {}

export abstract class ParentClientView<I extends Message<any> | null,R extends Message<any> | null> extends ClientView<I,R> {
        constructor(protected children:Client<any,any>[]) {
                super();
        }
        subscribe(dist:Distributor) {
                super.subscribe(dist);
                this.children.forEach(function(child) {
                        child.subscribe(dist);
                })
        }
}

export class ClientViewSendOnly<O extends Message<any>> extends ClientView<null,O> {
        types:string[] = [];
        onMessage(message:null) {}
}
let a = new ClientViewSendOnly();
let b = new ClientViewSendOnly();

// newMessageType("EndTurn",function() {});
// newMessageType("DisableEndTurnButton",function(){});
// newMessageType("EnableEndTurnButton",function(){});
export type EndTurn = BlankMessage<"EndTurn">
export type DisableEndTurnButton = BlankMessage<"DisableEndTurnButton">;
export type EnableEndTurnButton = BlankMessage<"EnableEndTurnButton"> 
export type EndTurnViewReceives = DisableEndTurnButton | EnableEndTurnButton
export class EndTurnView extends ClientView<EndTurnViewReceives,BlankMessage<"EndTurn">> {
        types:string[] = ["DisableEndTurnButton","EnableEndTurnButton"];
        disable() {
                this.getButton().prop("disabled",true);
        }
        enable() {
                this.getButton().prop("disabled",false);
        }
        getButton() {
                return $("#endTurnButton");
        }
        setupButton() {
                var self = this;
                $("#endTurnButton").on('click',function() {
                        self.sendMessage({type:"EndTurn"},self.messageDestination);
                });
        }
        onMessage(message:EndTurnViewReceives) {
                switch(message.type) {
                        case "DisableEndTurnButton":
                                this.disable();
                                break;
                        case "EnableEndTurnButton":
                                this.enable();
                                break;
                }
        }
        constructor(protected messageDestination:Client<any,BlankMessage<"EndTurn">>) {
                super();
                this.setupButton();
                this.disable();
        }
}

//View for allowing the player to end their turn
// var EndTurnView = function(messageDestination) {
//         var self = this;
//         self.messageDestination = messageDestination;
//         self.setupButton();
//         ClientView.call(self,function(message) {

//         });
// }
// EndTurnView.prototype.getButton = function() {
//         return $("#endTurnButton");
// }
// EndTurnView.prototype.setupButton = function() {
//         var self = this;
//         $("#endTurnButton").on('click',function() {
//                 sendMessage(new EndTurn(self),self.messageDestination);
//         });
// }
// EndTurnView.prototype.disable = function() {
//         this.getButton().prop("disabled",true);
// }
// EndTurnView.prototype.enable = function() {
//         this.getButton().prop("disabled",false);
// }

export interface BuildChoice extends Message<"BuildChoice"> {
        data:BoardState.Structure
}

// newMessageType("BuildChoice",function(sender,structure) {
//         this.structure = structure;
// });

export class BuildChoiceView extends ClientViewSendOnly<BuildChoice> {
        constructor(structure:BoardState.Structure,messageDestination:Client<any,BuildChoice>) {
                super();
                var self = this;
                $(".buildChoice[structure="+BoardState.getStructureName(structure)+"]").click(function() {
                        self.sendMessage({type:"BuildChoice",data:structure},messageDestination);
                });
        }
}

// newMessageType("Undo",function(){});
export type Undo = BlankMessage<"Undo">;
export class UndoView extends ClientViewSendOnly<BlankMessage<"Undo">> {
        constructor(public messageDestination:Client<any,BlankMessage<"Undo">>) {
                super();
                var self = this;
                $("#undoButton").on('click',function() {
                        self.sendMessage({type:"Undo"},messageDestination);
                });
        }
}


// newMessageType("Resize",function(){});
export type Resize = BlankMessage<"Resize">
//The following views work with resizing the board
export function resizeBoardDOM(width:number,height:number) {
        $("#board").attr("width",width);
        $("#board").attr("height",height);
}

function resizeGame() {
        resizeBoardDOM($("#game").width(),$("#game").height());
}

export class ResizeView extends ClientViewSendOnly<BlankMessage<"Resize">> {
        constructor(messageDestination:Client<any,BlankMessage<"Resize">>) {
                super();
                var self = this;
                $(window).resize(function() {
                        resizeGame();
                        self.sendMessage({type:"Resize"},messageDestination);
                });
        }
}
// var ResizeView = function(messageDestination:Client<any,BlankMessage<"Resize">>) {
//         var self = this;
//         $(window).resize(function() {
//                 resizeGame();
//                 sendMessage(new Resize(),messageDestination);
//         });
//         ClientViewSendOnly.call(self,messageDestination);
// }


// newMessageType("WinnerMessage",function(sender,winner){
//         this.winner = winner;
// });
export interface WinnerMessage extends Message<"WinnerMessage"> {
        winner:number;
}

//View for when a player wins the game
export class WinnerMessageView extends ClientView<WinnerMessage,null> {
        types:string[] = ["WinnerMessage"];
        onMessage(message:WinnerMessage) {
            localStorage.setItem('winner',message.winner+"");
            window.location.href = "./result.html"; //goes to the results page
        }
        
}
// var WinnerMessageView = function(){
//         Client.call(this, function(winnermessage){
//           if (winnermessage.hasType("WinnerMessage")){
//           }
//         })
// }


// newMessageType("PhaseMessage",function(sender,phase,subPhase) {
//     this.phase = phase;
//     this.subPhase = subPhase;
// });

export interface PhaseMessage extends Message<"PhaseMessage"> {
        phase:BoardState.Phase;
        subPhase:BoardState.SubPhase;
}

//View that contains a timer and phase message. The timer displays the total current game length
//and the phase message indicates what stage of the game the players are in (init = game start,
//building = building, etc)
export class TimerMessageView extends ClientView<PhaseMessage,null> {
        types:string[] = ["PhaseMessage"]
        onMessage(message:PhaseMessage) {
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
                        //console.log(message.subPhase);
                }
        }
}

// var TimerMessageView = function() {
//     Client.call(this,function(message){
//         if(message.hasType("PhaseMessage")) {
            
//         }
//     });
// }

// newMessageType("FirstTimePlaying",function(sender,firstTime) {
//         this.firstTime = firstTime;
// });
export interface FirstTimePlaying extends Message<"FirstTimePlaying"> {
        firstTime:boolean;
}


// newMessageType("InitBuilt",function(sender) {})

// newMessageType("Robbed",function(sender) {})

export type InitBuilt = BlankMessage<"InitBuilt">
export type Robbed = BlankMessage<"Robbed">

export class InstructionsMessageView extends Client<PhaseMessage | BlankMessage<"InitBuilt">,null> {
        types:string[] = ["PhaseMessage","InitBuilt"]
        onMessage(message: PhaseMessage | BlankMessage<"InitBuilt">) {
                switch(message.type) {
                        case "PhaseMessage":
                                if(message.phase == BoardState.Phase.Init) {
                                        $("#instructions").html("Place 1 settlement and 1 adjoining road, then click 'End Turn'").show();
                                }else if(message.subPhase == BoardState.SubPhase.Building) {
                                        $("#instructions").html("Use your resources to build roads, houses or cities").show().delay(5000).fadeOut(1000);
                                }else if(message.subPhase == BoardState.SubPhase.Robbing){
                                        $("#instructions").html("Place the robber on a tile of your choice").show().delay(12000).fadeOut(3000);
                                }else if(message.subPhase == BoardState.SubPhase.Trading){
                                        $("#instructions").html("").hide();
                                }
                                break;
                        case "InitBuilt":
                                $("#instructions").fadeOut(1000);
                                break;
                }
        }
}

//Used to display instructions that helps to guide the player through the game.
// var InstructionsMessageView = function() {
//     Client.call(this,function(message){
//         switch(message.type) {
//             case Type.PhaseMessage:

//             case Type.InitBuilt:
//                 $("#instructions").fadeOut(1000);
//                 break;
//         }

//     });
// }