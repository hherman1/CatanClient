// File contains methods dealing with the construction and actions of the robber

/* Robber constructor - the Robber object simply takes a positional argument, so that it knows which hex it's on
 */

Robber = function(hex, moved) {
  this.hex = hex;
    this.moved = false;
}

/* moveRobber
 * Given a hex, updates the robber's hex position
 */

function moveRobber(robber, hex){
  robber.hex = hex;
    robber.moved = true;
}

//TODO: Needs commenting

function drawRobber(x,y, z, ctx){
    ctx.drawImage(getRobberImg(), x-30, y-(z*0.75), z*1.2, z*1.5);
}

//TODO: Needs commenting

function drawRobberFromHex(coordinate,side,ctx){
    var worldCoordinate = hexToWorld(coordinate, side);
    ctx.drawImage(getRobberImg(),worldCoordinate.x, worldCoordinate.y, side*1.2, side*1.5);
}

/* robHex
 * Given a hex, a robbing player, a list of vertices and a list of players,
 * steals a random resource from a random opposing player on the hex that the robber is moving to
 */

function robHex(hex,player, vertexList, playerList){
  var affectedVertices = vertices(hex.coordinate);
  var affectedPlayers = [];
  for(var i = 0; i<6;i++){
      var vert = findVertex(vertexList, affectedVertices[i]);
    if(vert.playerID>0 && vert.playerID != player.id){
      affectedPlayers.push(vert.playerID); // Checks each vertex around the hex for opposing players, adding them to a list
    }
  }
  var randomNum = Math.floor(Math.random() * affectedPlayers.length)
    robPlayer(player, getPlayer(affectedPlayers[randomNum],playerList)); // Robs a random player from those affected
}

/* robPlayer
 * Given a receiving (robbing) player, and a losing (robbed) player, takes one random resource from the
 * losing player and gives it to the receiving player.
 */

function robPlayer(receivingPlayer, losingPlayer){
    var num = 0;
    var resource = undefined;
    for(var i = 0;i<5;i++){
        num += losingPlayer.resources[i]; // num equals total number of resources the losing player has
    }
    num-=Math.round(Math.random() * num); // A random number is subtracted from num
    for(var i = 0; i<5;i++){
        num-= losingPlayer.resources[i]; // The number the player has of each resource is subtracted, until num reaches 0
        if(num<=0){                      // When num is 0, that resource is selected - this means that resources the losing player
            resource = i;                // has more of are more likely to be robbed
            break;
        }
    }
    receivingPlayer.resources[i]++;
    losingPlayer.resources[i]--;
}
