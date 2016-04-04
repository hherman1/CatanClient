

//when someone rolls a '7', the settler is allowed to move the robber to a terrain.
Robber = function(hex) {
  this.hex = hex;
}

function moveRobber(robber, hex, player){
  robber.hex.robber = false;
  robber.hex = hex;
  hex.robber = true;
  robHex(hex,player);
}

function drawRobber(x, y, z, ctx){
  ctx.drawImage(getRobberImg(), x-15, y-(z*0.75), z, z*1.25);
}

function robHex(hex,player){
  var vertices = vertices(hex.coordinate);
  var affectedPlayers = [];
  for(var i = 0; i<6;i++){
    if(vertices[i].playerID>0){
      affectedPlayers.push(vertices[i].playerID);
    }
  }
  var affectedPlayer = affectedPlayers[Math.round(Math.random() * affectedPlayers.size)];
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
    receivingPlayer.resources[i]++;
    losingPlayer.resources[i]--;
}
