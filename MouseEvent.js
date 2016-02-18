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

function mouseEventSaver(mousebuffer) {
        return (function(evt) {
            mousebuffer.push(evt)
        })
}

function flushMouseEvents(mousebuffer) {
    mousebuffer.clicks = [];
    mousebuffer.mousemoves = [];

}

function newMouseBuffer() {
        return {clicks:[]
                ,mousemoves:[]
                }
}

function getCoords(evt) {
    return makeVector(evt.offsetX,evt.offsetY);
}

function makeActivatedBox(hitbox,evt){
        return {hitbox:hitbox,evt:evt}
}

function allHits(events,hitboxes) {
    var out = []
    events.forEach(function(cevt) {
            var hits = getHits(hitboxes,getCoords(cevt));
            hits.map(function(hitbox) {
                    return makeActivatedBox(hitbox,cevt)
            })
            out.concat(hits);
    })
    return out
}

//Returns a mousebuffer of ActivatedBox's
function processHits(mousebuffer,hitboxes) {
    var out = newMouseBuffer();
    out.clicks = allHits(mousebuffer.clicks,hitboxes)
    out.mousemoves = allHits(mousebuffer.mousemoves,hitboxes)
}

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
