import * as Grid from "./Grid"
import * as BoardState from "./BoardState"
import * as Player from "./Player"
// File contains methods dealing with the construction and actions of the robber


/* moveRobber
 * Given a hex, updates the robber's hex position
 */

export function moveRobber(robber:BoardState.Robber, hex:BoardState.Position.Hex){
  robber.hex = hex;
}


/* robHex
 * Given a hex, a robbing player, a list of vertices and a list of players,
 * steals a random resource from a random opposing player on the hex that the robber is moving to
 */

export function robHex(hex:BoardState.Position.Hex,player:Player.Player, vertexList:BoardState.Position.Vertex[], playerList:Player.Player[]){
  var affectedVertices = Grid.vertices(hex.coordinate);
  var affectedPlayers = [];
  for(var i = 0; i<6;i++){
      var vert = BoardState.requireVertex(vertexList, affectedVertices[i]);
    if(vert.playerID>0 && vert.playerID != player.id){
      affectedPlayers.push(vert.playerID); // Checks each vertex around the hex for opposing players, adding them to a list
    }
  }
    if(affectedPlayers.length == 0){
        return;
    }
  var randomNum = Math.floor(Math.random() * affectedPlayers.length);
    robPlayer(player, Player.getPlayer(affectedPlayers[randomNum],playerList)); // Robs a random player from those affected
}

/* robPlayer
 * Given a receiving (robbing) player, and a losing (robbed) player, takes one random resource from the
 * losing player and gives it to the receiving player.
 */

export function robPlayer(receivingPlayer:Player.Player, losingPlayer:Player.Player){
    var num = 0;
    var resource = undefined;
    for(var i = 0;i<5;i++){
        num += losingPlayer.resources[i]; // num equals total number of resources the losing player has
    }
    if (num == 0){
        return;
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
