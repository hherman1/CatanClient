define(['jquery','BoardState','Player','StructureRenderer']
      ,function($,BoardState,Player,StructureRenderer) {

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

var initTime = Date.parse(new Date());
function initClock(id){
    var clock = document.getElementById(id);
    var currentTime = setInterval(function(){
        var t = getTimeElapsed();
        clock.innerHTML = t.hours + ':' + t.minutes + ':' + t.seconds;
    },1000);
}
//Helper function for initClock. This function gets the elapsed time
function getTimeElapsed(){
    var t = Date.parse(new Date()) - initTime;
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    return{seconds, minutes, hours}

};
//Helper function for keeping the clock updated

var hoursSpan = clock.querySelector('.hours');
var minutesSpan = clock.querySelector('.minutes');
var secondsSpan = clock.querySelector('.seconds');
function updateClock(){
    var t = getTimeElapsed()
    hoursSpan.innerHTML = ('00' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('00' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
}
updateClock();
var timeinterval = setInterval(updateClock,1000);


function genPlayerTabs(players) {
        var container = getPlayerTabsContainer();
        var template = getPlayerTabTemplate();
        var colorMap = Player.getPlayerColors(players);

        $(container).append(players.map(function(player) {
                return newPlayerTab(player,colorMap[player.id],template);
        }));
        updateUIInfoTopBar(players);
}

function getPlayerTabTemplate() {
        return $("#playerTabTemplate");
}

function newPlayerTab(player,color,template) {
        var out = $(template).clone(true);
        setTabPlayerID(out,player.id);
        setTabPlayerImages(out,color);
        $(out).removeAttr("id");
        $(".playerName",$(out)).css("background-color",getColor(color));
        return out;
}

function getPlayerTabsContainer() {
        return $("#playerTabs");
}

function getPlayerTab(num) {
        return $(".playerDiv[player="+num+"]");
}

function getPlayerName(num){
    return $(".playerName[player="+num+"]");
}


function setTabPlayerID(tab,playerID) {
       $(tab).attr("player",playerID);
       $(".playerNumber",tab).html(playerID);
}

function setTabPlayerImages(tab,color) {
        $(".settlementPic",tab).append(getBuildingImg(BoardState.Structure.Settlement,color))
        $(".cityPic",tab).append(getBuildingImg(BoardState.Structure.City,color))
        $(".roadPic",tab).append(getBuildingImg(BoardState.Structure.Road,color))
}

//Sets the structure info for a player. Takes in a player number (1,2,3,4), structure and amount
function setStructureVal(playerTab, structure, amount){
        $(".playerStructureQuantity[structure="+structure+"]",playerTab).html(amount);
}

//Sets the victory points for the player. Takes in a number
function setVictoryPointsVal(playerTab, amount){
        $(".playerPoints",playerTab).html(amount);
}



//Methods to change resource quantities---------------------------------------------------


    //Sets the resource amount for the player. Takes in a resource ("Lumber","Wool", etc) and an amount to be set at
    function setResourceVal(resource, amount){
        $("[resource="+resource+"]>.resourceValue").html(amount);
    }

    //Sets the roll value display for the player. Takes in a number
    function setRollVal(amount){
        $("#rollValue").html(amount)
    }
    //Tests
    //setResourceVal

// function

    function updateUIInfo(players, currentPlayerID){
        updateUIInfoTopBar(players,currentPlayerID);
        var currentPlayer = Player.getPlayers(currentPlayerID,players)[0];
        updateResourceBar(currentPlayer);
    }

    function updateUIInfoTopBar(players, currentPlayerID){
        players.map(function(player) {
            var playerName = getPlayerName(player.id);
            var playerTab = getPlayerTab(player.id);
            $(playerTab).attr("active",currentPlayerID == player.id);
            setVictoryPointsVal(playerTab, player.vicPoints);
            setStructureVal(playerTab, "Road", player.roadCount);
            setStructureVal(playerTab, "Settlement", player.settlementCount);
            setStructureVal(playerTab, "City", player.cityCount);
        })
    }

    function updateResourceBar(player){
        setResourceVal("Lumber", player.resources[Resource.Lumber]);
        setResourceVal("Grain", player.resources[Resource.Grain]);
        setResourceVal("Wool", player.resources[Resource.Wool]);
        setResourceVal("Ore", player.resources[Resource.Ore]);
        setResourceVal("Brick", player.resources[Resource.Brick]);
    }



function resizeBoardDOM(width,height) {
        $("#board").attr("width",width);
        $("#board").attr("height",height);
}
return {
        initTime:initTime,
        initClock:initClock,
        getTimeElapsed:getTimeElapsed,
        hoursSpan:hoursSpan,
        minutesSpan:minutesSpan,
        secondsSpan:secondsSpan,
        updateClock:updateClock,
        genPlayerTabs:genPlayerTabs,
        getPlayerTabTemplate:getPlayerTabTemplate,
        getPlayerTabsContainer:getPlayerTabsContainer,
        getPlayerTab:getPlayerTab,
        getPlayerName:getPlayerName,
        setTabPlayerID:setTabPlayerID,
        setTabPlayerImages:setTabPlayerImages,
        setStructureVal:setStructureVal,
        setVictoryPointsVal:setVictoryPointsVal,
}
});
