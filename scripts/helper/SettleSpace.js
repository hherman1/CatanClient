


function SettleSpaceNode(x, y, sstatus, settlerID, terrainID ){
  var ssn = {
    xco : x, //the x coordinate where the settle space is
    yco : y, //the y coordinate where the settle space is
    status : sstatus, //the status of the space. can either be free (0) or taken (1)
    settler : settlerID, //the settler of the settle space
    terrain : terrainID //the terrains the settle space is connected/linked to
  }
  return ssn;
}

function ssHexCoords(side){
  //x and y coordinates of points on the board
  var xp = [];
  var yp = [];

  for (var i = 0; i < tiles; i++){
    if (i < 3) {
      xp.push(xco[i] - w);
      xp.push(xco[i]);

      yp.push(yco[1]-(side/2));
      yp.push(yco[1]-side);

      if (i ==2){
      xp.push(xco[i] + w);
      yp.push(yco[i] - (side/2));
      }
    } else if (i < 7){
  	xp.push(xco[i] - w);
      	xp.push(xco[i]);

      	yp.push(yco[i]-(side/2));
      	yp.push(yco[i]-side );
  	if (i == 6){
      	  xp.push(xco[i] + w);
      	  yp.push(yco[i] - (side/2));
      }
    } else if (i < 12){
  	xp.push(xco[i] - w);
      	xp.push(xco[i]);

      	yp.push(yco[i]-(side/2));
      	yp.push(yco[i]-side);

  	xp.push(xco[i] - w);
      	xp.push(xco[i]);

      	yp.push(yco[i]+(side/2) );
      	yp.push(yco[i]+side);
  	if (i == 11){
      	  xp.push(xco[i] + w);
  	  xp.push(xco[i] + w);
      	  yp.push(yco[i] - (side/2));
  	  yp.push(yco[i] + (side/2));
      }
    } else{
  	xp.push(xco[i] - w);
      	xp.push(xco[i]);

      	yp.push(yco[i]+(side/2));
      	yp.push(yco[i]+side );
  	if (i == 15 || i ==18){
  	  xp.push(xco[i] + w);

  	  yp.push(yco[i] + (side/2));
      }

    }
  }

}
