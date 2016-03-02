/*  input {
 *  }
 *  
 *  deterministicly produce object:
 *  {renderBoard : board,
 *   hitboxes:[hitbox]
 *   receivehits:function
 *   hitreceivers:[function]}
 *
 *      receivehits takes a callback function which accepts the triggerred
 *   hitbox as an argument and registers that callback function to be called when
 *   a hit is detected. 
 */

/*
 * MouseEventBuffer {
 *  clicks : [evt]
 *  mouseovers : [evt]
 *  }
 *
 *  ActivatedBox {
 *  hitbox: hitbox
 *  evt : evt
 *  }
 */

maxClickMove = 0
Mouse = function() {
        this.pos = new Vector(-1,-1);
        this.button = -1;
        this.click = 0; // could the mouse be clicking
        this.clicked = 0; // has the mouse just clicked
        this.dragging = 0; // is the mouse dragging
        this.movement = new Vector(0,0);
        this.scroll = new Vector(0,0);
}

MouseBuffer = function() {
        this.mousemoves=[];
        this.mousedowns = [];
        this.mouseups = [];
        this.mousescrolls = [];
}

function processBuffer(mouse,mousebuffer) {
        mouse.clicked = 0;
        mouse.movement.x = 0;
        mouse.movement.y = 0;
        mouse.scroll.x = 0;
        mouse.scroll.y = 0;
        if(mousebuffer.mousescrolls.length > 0) {
                var wheel = collapseWheelEvents(mousebuffer.mousescrolls);
                mouse.scroll = new Vector(wheel.deltaX,wheel.deltaY);
        }
        if(mousebuffer.mousemoves.length > 0) {
                updateMouse(mouse,collapseMousemoveEvents(mousebuffer.mousemoves));
        }
        if (mousebuffer.mousedowns.length > 0) {
                mouse.click = 1;
        }
        if (mouse.click && norm(mouse.movement) > maxClickMove) {
                mouse.click = 0;
                mouse.dragging = 1;
        }
        if (mousebuffer.mouseups.length > 0) {
                mouse.dragging = 0;
                if(mouse.click) {
                        mouse.clicked = 1;
                        mouse.click = 0;
                }
        }
        return mouse
}

function updateMouse(mouse,evt) {
        mouse.pos = getCoords(evt);

        mouse.button = evt.button;

        mouse.movement.x = evt.movementX;
        mouse.movement.y = evt.movementY;

}

function mouseEventSaver(mousebuffer) {
        return (function(evt) {
            evt.preventDefault();
            mousebuffer.push(evt);
        })
}

function flushMouseEvents(mousebuffer) {
    mousebuffer.mousemoves.length = 0;
    mousebuffer.mousedowns.length = 0;
    mousebuffer.mouseups.length = 0;
}


function initMouseBuffer(elem,buffer) {
    elem.addEventListener("mousemove",mouseEventSaver(buffer.mousemoves));
    elem.addEventListener("mousedown",mouseEventSaver(buffer.mousedowns));
    elem.addEventListener("mouseup",mouseEventSaver(buffer.mouseups));
    elem.addEventListener("wheel",mouseEventSaver(buffer.mousescrolls));
}

function getCoords(evt) {
    return new Vector(evt.offsetX,evt.offsetY);
}

function collapseMousemoveEvents(evts) {
    out = evts.pop();
    evts.forEach(function(evt) {
            out.movementX += evt.movementX;
            out.movementY += evt.movementY;
    })
    return out;
}
function collapseWheelEvents(evts) {
    out = evts.pop();
    evts.forEach(function(evt) {
            out.deltaX += evt.deltaX;
            out.deltaY += evt.deltaY;
    })
    return out;
}


//Returns a mousebuffer of ActivatedBox's

//Takes a list of current players and produces a mapping [(player,color)]
function pickColors(players) {

}

//takes a value 'a' and a map: [[a,b]] and returns the corresponding b or null
function lookup(index,map) {
    var res = null;
    map.some(function(vals) {
            if (vals[0] == index) {
                res = vals[1];
                return true;
            }
            return false;
    })
    return res
}

//takes a keyMap [[k,k']] and a map [[k,v]] and returns [[k',v]], also 
//modifies input 'map'. 
function updateKeys(keyMap,map) {
        var res = map
        res.map(function(vals) {
                vals[0] = lookup(vals[0],keyMap);
                return vals;
        })
        return res;
}
