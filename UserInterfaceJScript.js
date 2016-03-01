//This function adds the functionality for the slide up build menu information---------
$(document).ready(function(){
	$("#bottomLeftDisplay").click(function(){
		var rBar = $('#bottomLeftDisplay');
		if(rBar.hasClass('animateDown')){
			rBar.removeClass('animateDown');
			rBar.addClass('animateUp');
		}else{
			rBar.removeClass('animateUp');
			rBar.addClass('animateDown');
		}
	});
});

//This function adds the drop down functionality for the playerTabs class--------------
$(document).ready(function(){
    $(".playerInfo").hide();
    $(".playerTabs").click(function(e){
        //$(parent(ee.target())).slideToggle("slow");
        $(this).find('.playerInfo').slideToggle("down");
    });
});

//Clock for the bottom right display----------------------------------------------------
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
//Methods to change resource quantities---------------------------------------------------
//This function takes in a resource to be changed, and a variable named change. 
//The resource is changed by the amount of change. Valid options are 'wood' 'wheat'
//'sheep' 'ore' 'brick'
function updateResource(resource, change){

}

//Function to update the wood value
// $(document).ready(function(){
//     $('#woodValue')
// });


//functions i need
/*
function updateDiceRollValue()

function updatePlayerInfoValues(player, resource, value)

function buildRoad()

function buildCity()

function buildSettlement()

function endTurn()
*/



/*
function startTime(){
	var base = new Date().getTime();
	
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	return newTime;
}
*/



/*Old Timer

function timer(){
	var d = new Date();
	var start = d.getTime();
	for(int i = 0; i < 1000; i++){
		var newTime = d.getTime();
		var result = newTime - start;
		document.getElementById("demo").innerHTML = result;
	}
}
*/




/*THIS DOESNT WORK EITHER. AHH!
$(function () { 

    $('#buildCard').tabSlideOut({
        tabHandle: '#resourceBar', //class of the element that will become your tab
        
        tabLocation: 'left', //side of screen where tab lives, top, right, bottom, or left
        speed: 300, //speed of animation
        action: 'click', //options: 'click' or 'hover', action to trigger animation
        topPos: '200px', //position from the top/ use if tabLocation is left or right
        leftPos: '20px', //position from left/ use if tabLocation is bottom or top
        fixedPosition: false //options: true makes it stick(fixed position) on scroll
    });


    $('#bottomLeftDisplay > #resourceBar').click();    // Add this line and that's it

});*/

/*Closer, but hides tabs when done sliding
$('#bottomLeftDisplay').on('click', function () {
    $('#resourceBar').toggle("slide", { direction: "up" }, 9000);
    $('#buildCard').toggle("slide", { direction: "up" }, 1000);
});
*/

/*$(document).ready(function(){
	$("#bottomLeftDisplay").click(function(){
		$("#buildCard").animate({ height:'30px'});
	});
});
*/
/*
function move() {
    var elem = document.getElementById("bottomLeftDisplay"),
        speed = 10,
        currentPos = 78;
    // Reset the element
    elem.style.top = 464+"px";
    elem.style.bottom = "auto";
    var motionInterval = setInterval(function() {
        currentPos += speed;
        if (currentPos >= 300 && speed > 0) {
           currentPos = 800;
           speed = -2 * speed;
           elem.style.width = parseInt(elem.style.width)*2+"px";
           elem.style.height = parseInt(elem.style.height)*2+"px";
        }
        if (currentPos <= 40 && speed < 0) {
           clearInterval(motionInterval);
        }
        elem.style.height = currentPos+"px";
    },20);
}
*/

/*$(document).ready(function(){
	$("#bottomLeftDisplay").click(function(){
		$("#bottomLeftDisplay").slideToggle("slow");
		$(this).toggleClass("active"); return false;
	});
});
*/
/*
    $('#bottomLeftDisplay').on("click", function(){
    	var hidden = $('.hidden');
        if (hidden.hasClass('visable')){
            hidden.animate({"up":"300px"},"slow").removeClass('visible');
        } else {
            hidden.animate({"down":"300px"}, "slow").addClass('visible');
        }
    });
*/