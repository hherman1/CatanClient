

//when someone rolls a '7', the settler is allowed to move the robber to a terrain.
Robber = function(hex) {
  this.hex = hex;
}

function moveRobber(robber, hex){
  robber.hex = hex;
  hex.robber = true;
}

function drawRobber(x, y, z, ctx){
  ctx.drawImage(getRobberImg(), x-30, y-(z*0.75), z*1.2, z*1.5);
}

function robHex(hex,player, vertexList, playerList){
  var affectedVertices = vertices(hex.coordinate);
  var affectedPlayers = [];
  for(var i = 0; i<6;i++){
      var vert = findVertex(vertexList, affectedVertices[i]);
    if(vert.playerID>0 && vert.playerID != player.id){
      affectedPlayers.push(vert.playerID);
    }
  }
  var affectedPlayer = getPlayer(affectedPlayers[Math.round(Math.random() * affectedPlayers.length)],playerList);
    robPlayer(player, affectedPlayer);
}

function robPlayer(receivingPlayer, losingPlayer){
    var num = 0;
    var resource = undefined;
    for(var i = 0;i<5;i++){
        num += losingPlayer.resources[i];
    }
    num-=Math.round(Math.random() * num);
    for(var i = 0; i<5;i++){
        num-= losingPlayer.resources[i];
        if(num<=0){
            resource = i;
            break;
        }
    }
    console.log(receivingPlayer.resources);
    console.log(losingPlayer.resources);
    receivingPlayer.resources[i]++;
    losingPlayer.resources[i]--;
    console.log(receivingPlayer.resources);
    console.log(losingPlayer.resources);
}
