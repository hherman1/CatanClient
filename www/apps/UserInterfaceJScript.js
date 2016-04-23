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
/*
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
*/

function genPlayerTabs(players) {
        var container = getPlayerTabsContainer();
        var template = getPlayerTabTemplate();
        var colorMap = getPlayerColors(players);

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
        $(".settlementPic",tab).append(getBuildingImg(Structure.Settlement,color))
        $(".cityPic",tab).append(getBuildingImg(Structure.City,color))
        $(".roadPic",tab).append(getBuildingImg(Structure.Road,color))
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


    function resizeGame(buffer) {
        resizeBoardDOM($("#game").width(),$("#game").height());
        buffer.messages.push(UI.Message.Resize);
    }


// function

    function updateUIInfo(players, currentPlayerID){
        updateUIInfoTopBar(players,currentPlayerID);
        var currentPlayer = getCurrentPlayer(players, currentPlayerID);
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

function getStructureName(structure) {
        switch(structure) {
                case Structure.Road:
                        return "Road";
                case Structure.Settlement:
                        return "Settlement";
                case Structure.City:
                        return "City";
        }
};

function flattenDictionary(dictionary) {
        var out = [];
        Object.keys(dictionary).forEach(function(k) {
                out.push(dictionary[k]);
        });
        return out;
}
function flattenJQuery(selectors) {
        var out = $();
        selectors.forEach(function(s) {
                out = out.add(s);
        });
        return out;
}

function genResourceSymbolImages() {
        var images = flattenDictionary(getResourceSymbolImages());
        return $(images).clone();
}

function addResourceSymbolImages(images) {
        function addToResource(resource,image) {
                $("[resource="+resource+"]").append(image);
        }
        addToResource("Lumber",images[Resource.Lumber]);
        addToResource("Grain",images[Resource.Grain]);
        addToResource("Wool",images[Resource.Wool]);
        addToResource("Ore",images[Resource.Ore]);
        addToResource("Brick",images[Resource.Brick]);
}

function addStructureIcons(images) {
        function addStructureImage(structure,image) {
            var structureName = getStructureName(structure);
            $("[structure="+structureName+"] .structureImage").append(image);
        };
        addStructureImage(Structure.Settlement,images[Structure.Settlement]);
        addStructureImage(Structure.City,images[Structure.City]);
        addStructureImage(Structure.Road,images[Structure.Road]);

}
function genStructureIcons() {
        function genIcon(structure) {
            return $(getBuildingImg(structure,Colors.White)).clone();
        }
        var out = {};
        out[Structure.Settlement] = genIcon(Structure.Settlement);
        out[Structure.City] = genIcon(Structure.City);
        out[Structure.Road] = genIcon(Structure.Road);
        return out;
}

function addCostImages(images) {
        function addCostImagesForStructure(structure) {
                var imgs = images[structure];
                var structureName = getStructureName(structure);
                $("[structure="+structureName+"] .choiceReqs").append(imgs);
        };
        addCostImagesForStructure(Structure.Settlement);
        addCostImagesForStructure(Structure.City);
        addCostImagesForStructure(Structure.Road);
}

function genCostImages() {
        function genCostImagesFromResources(resources) {
                var out = [];
                resources.forEach(function(count,resource) {
                        var img = getResourceSymbolImage(resource);
                        for(var i  = 0; i < count; i ++) {
                                out.push(img);
                        }
                });
                return $(out).clone();
        };
        var out = {};
        out[Structure.Road] = genCostImagesFromResources(getPrice(Structure.Road));
        out[Structure.Settlement] = genCostImagesFromResources(getPrice(Structure.Settlement));
        out[Structure.City] = genCostImagesFromResources(getPrice(Structure.City));
        return out;
}

function gameImageCount() {
        return getLoadedImages().length;
}




function addUIImages(structureIcons,costImages,resourceSymbolImages) {
        addStructureIcons(structureIcons);
        addCostImages(costImages);
        addResourceSymbolImages(resourceSymbolImages);
}

function loadGame(game,callback) {
        var structureIcons = genStructureIcons();
        var costImages = genCostImages();
        var resourceSymbolImages = genResourceSymbolImages();
        var gameImages = getLoadedImages(); // array
        var images = flattenJQuery([flattenJQuery(flattenDictionary(structureIcons))
                              ,flattenJQuery(flattenDictionary(costImages))
                              ,resourceSymbolImages
                              ,$(gameImages)]);

        var numLoadedImages = 0;
        var totalImages = images.length;

        addUIImages(structureIcons,costImages,resourceSymbolImages);

//        $("#board,#userInterface").css("opacity","0");

        $(images).load(function() {
                numLoadedImages++;

                $("#loaded").css("width",100* numLoadedImages/totalImages + "%");

                if(numLoadedImages == totalImages) {
                        makeBoard(game);
                        renderGame(game,null); // Initial render with no highlight.
                        setTimeout(function() {
                                $("#loading-screen").fadeOut(300);
 //                               $("#board,#userInterface").fadeTo(2000,1);
                                callback();
                        },1000);
                }
        });
}
