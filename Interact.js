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

function initCanvas(canvas) {
        canvas.addEventListener('mousedown',function(evt) {
                console.log(evt)
            })
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
