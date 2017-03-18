/// <reference path="declarations/jquery.d.ts" />

import * as jquery from "jquery"
import * as BoardState from "./BoardState"
import * as Player from "./Player"
import * as StructureRenderer from "./StructureRenderer"
import * as View from "./View"


//This function adds the functionality for the slide up build menu information---------
$(document).ready(function(){
    $("#bottomLeftDisplay").click(function(){
        var rBar = $('#bottomLeftDisplay');
        if(rBar.attr("panel") == "Down"){
            rBar.attr("panel","Up");
        }else{
            rBar.attr("panel","Down");
        }
    });
});

//This function adds the drop down functionality for the playerTabs class--------------

$(document).ready(function(){
    $(".playerInfo").hide();
    $(".playerDiv").click(function(e){
        //$(parent(ee.target())).slideToggle("slow");
        $(".playerInfo",$(this)).slideToggle("down");
    });
});



//Clock for the bottom right display----------------------------------------------------
//Used help from this website for the clock: http://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/

class ClockView { // Nothing to extend actually
    clock:HTMLElement;
    initTime = new Date().getMilliseconds();
    hoursSpan:Element;
    minutesSpan:Element;
    secondsSpan:Element;
    constructor(protected id:string) {
        let _clock = document.getElementById(id);
        if(_clock === null) {
            throw "no clock"
        }
        this.clock = _clock;
        var hoursSpan = this.clock.querySelector('.hours');
        var minutesSpan = this.clock.querySelector('.minutes');
        var secondsSpan = this.clock.querySelector('.seconds');
        if(hoursSpan && minutesSpan && secondsSpan) {
            this.hoursSpan = hoursSpan;
            this.minutesSpan = minutesSpan;
            this.secondsSpan = secondsSpan;
        }else {
            throw "Error"
        }
        var timeinterval = setInterval(this.updateClock.bind(this),1000);
        // var currentTime = setInterval(function(){
        //     var t = getTimeElapsed();
        //     clock.innerHTML = t.hours + ':' + t.minutes + ':' + t.seconds;
        // },1000);
    }
    getTimeElapsed(){
        var t = new Date().getMilliseconds() - this.initTime;
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        return{seconds, minutes, hours}
    };
    updateClock(){
        var t = this.getTimeElapsed()
        this.hoursSpan.innerHTML = ('00' + t.hours).slice(-2);
        this.minutesSpan.innerHTML = ('00' + t.minutes).slice(-2);
        this.secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    }
}

$(document).ready(()=> {
    console.log("wtf?");
    let cv = new ClockView("clock");
})


export function genPlayerTabs(players:Player.Player[]) {
        var container = getPlayerTabsContainer();
        var template = getPlayerTabTemplate();
        var colorMap = Player.getPlayerColors(players);

        $(container).append(players.map(function(player) {
                return newPlayerTab(player,colorMap[player.id],template);
        }));
        updateUIInfoTopBar(players,undefined);
}

export function getPlayerTabTemplate() {
        return $("#playerTabTemplate");
}

export function newPlayerTab(player:Player.Player,color:Player.Colors,template:JQuery) {
        var out = $(template).clone(true);
        setTabPlayerID(out,player.id);
        setTabPlayerImages(out,color);
        $(out).removeAttr("id");
        $(".playerName",$(out)).css("background-color",Player.getColor(color));
        return out;
}

export function getPlayerTabsContainer() {
        return $("#playerTabs");
}

export function getPlayerTab(num:number) {
        return $(".playerDiv[player="+num+"]");
}

export function getPlayerName(num:number){
    return $(".playerName[player="+num+"]");
}


export function setTabPlayerID(tab:JQuery,playerID:number) {
       $(tab).attr("player",playerID);
       $(".playerNumber",tab).html(playerID.toString());
}

export function setTabPlayerImages(tab:JQuery,color:Player.Colors) {
        $(".settlementPic",tab).append(StructureRenderer.getBuildingImg(BoardState.Structure.Settlement,color))
        $(".cityPic",tab).append(StructureRenderer.getBuildingImg(BoardState.Structure.City,color))
        $(".roadPic",tab).append(StructureRenderer.getBuildingImg(BoardState.Structure.Road,color))
}

//Sets the structure info for a player. Takes in a player number (1,2,3,4), structure and amount
export function setStructureVal(playerTab:JQuery, structure:string, amount:number){
        $(".playerStructureQuantity[structure="+structure+"]",playerTab).html(amount.toString());
}

//Sets the victory points for the player. Takes in a number
export function setVictoryPointsVal(playerTab:JQuery, amount:number){
        $(".playerPoints",playerTab).html(amount.toString());
}



//Methods to change resource quantities---------------------------------------------------


    //Sets the resource amount for the player. Takes in a resource ("Lumber","Wool", etc) and an amount to be set at
export function setResourceVal(resource:string, amount:number){
    $("[resource="+resource+"]>.resourceValue").html(amount.toString());
}

//Sets the roll value display for the player. Takes in a number
export function setRollVal(amount:number){
    $("#rollValue").html(amount.toString())
}
//Tests
//setResourceVal

// function

export function updateUIInfo(players:Player.Player[], currentPlayerID:number){
    updateUIInfoTopBar(players,currentPlayerID);
    var currentPlayer = Player.getPlayers(currentPlayerID,players)[0];
    updateResourceBar(currentPlayer);
}

export function updateUIInfoTopBar(players:Player.Player[], currentPlayerID?:number){
    players.map(function(player) {
        var playerName = getPlayerName(player.id);
        var playerTab = getPlayerTab(player.id);
        $(playerTab).attr("active",(currentPlayerID == player.id).toString());
        setVictoryPointsVal(playerTab, player.vicPoints);
        setStructureVal(playerTab, "Road", player.roadCount);
        setStructureVal(playerTab, "Settlement", player.settlementCount);
        setStructureVal(playerTab, "City", player.cityCount);
    })
}

export function updateResourceBar(player:Player.Player){
    setResourceVal("Lumber", player.resources[BoardState.Resource.Lumber]);
    setResourceVal("Grain", player.resources[BoardState.Resource.Grain]);
    setResourceVal("Wool", player.resources[BoardState.Resource.Wool]);
    setResourceVal("Ore", player.resources[BoardState.Resource.Ore]);
    setResourceVal("Brick", player.resources[BoardState.Resource.Brick]);
}



