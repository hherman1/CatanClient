//File contains requisite methods for modifying the state of the game, e.g. construction,
//road connectivity checking, legality checking, etc.

////////////////////////////////////////////////////////////////////////
/*                       NORMAL LEGALITY FUNCTIONS                    */
////////////////////////////////////////////////////////////////////////

/* checkRoadLegality
 * Given a list of vertex objects, two vector objects representing the two vertices
 * the road will travel between, and the player who wishes to build the road,
 * will return a boolean indicating the legality of the construction.
 */

function checkRoadLegality(vertexFrame, coords1, coords2, player, roadList){
	if(getRoad(roadList,coords1,coords2).playerID>0){
		return false;
	}
	vertex1 = getVertices(vertexFrame,coords1)[0];
	vertex2 = getVertices(vertexFrame,coords2)[0];
	if(vertex1.playerID==player.id || vertex2.playerID==player.id){
		return true;
	}
	else{
		return checkAdjacentPlayerRoads(coords1,coords2,player,roadList, vertexFrame);
	}
}

/* Given a vector, a player, and a vertex frame, checks if a settlement can be built on said vertex by that player.
 */

function checkSettlementLegality(coords, player, vertexFrame, roadList){
	var vert = getVertex(vertexFrame,coords);
//	if(!checkAdjacentPlayerRoads(coords, coords, player, roadList, vertexFrame)){
//		return false;
//	}
	if(vert.structure>0){
		return false;
	}
	neighborList = getVertexNeighbors(coords, vertexFrame);
	for(i=0;i<neighborList.length;i++){
		if(getVertex(vertexFrame, neighborList[i]).structure>0){
			return false;
		}
	}
	return true;
}

/* Given a vector and a player, checks if a city can be built on said vertex by that player.
 */

function checkCityLegality(coords, player, vertexFrame){
	console.log("checking city");
	var vert = getVertices(vertexFrame,coords)[0];
	if(vert.structure != 1){
		console.log("structure is " + vert.structure);
		return false;
	}
	if(vert.playerID != player.id){
		console.log("player id is "+ player.id + " but vert id is "+ vert.playerID);
		return false;
	}

	return true;
}

////////////////////////////////////////////////////////////////////////
/*                  INITIALIZATION LEGALITY FUNCTIONS                 */
////////////////////////////////////////////////////////////////////////

function checkInitSettlementLegality(coords, vertexFrame,player){
	var vert = getVertex(vertexFrame, coords);
	if(vert.structure>0){
		return false;
	}
	neighborList = getVertexNeighbors(coords, vertexFrame);
	console.log(neighborList);
	for(i=0;i<neighborList.length;i++){
		if(getVertex(vertexFrame, neighborList[i]).structure>0){
			return false;
		}
	}
	return (player.settlementCount + 1 < 2);
}

function checkInitRoadLegality(coords1, coords2, player, vertexFrame, roadList){
	if(getRoad(roadList,coords1,coords2).playerID!=0){
		return false;
	}
	vertex1 = getVertices(vertexFrame,coords1)[0];
	vertex2 = getVertices(vertexFrame,coords2)[0];
	if((vertex1.playerID==player.id || vertex2.playerID==player.id)
      && (player.roadCount + 1 < 2)){
		return true;
	}
	return false;
}

////////////////////////////////////////////////////////////////////////
/*                     VICTORY POINT FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

function longestRoad(vert, vertices, roadList, player, visitedVertices){
	visitedVertices.push(vert);
	var newVertices = [];
	var connectedVertices = getConnectedVertices(vert.coordinate, player, roadList, vertices);
	for(var i = 0; i<connectedVertices.length;i++){
		console.log(connectedVertices[i]);
		if(checkForSameVector(visitedVertices,connectedVertices[i].coordinate)){  //TODO: Current problem
			newVertices.push(connectedVertices[i]);
			console.log("vertex added");
		}
	}
	if(newVertices.length==0){
		return 0;
	}
	var maxSubRoad = 0;
	for(var j = 0 ;j<newVertices.length;j++){
		var testLength = longestRoad(newVertices[j], vertices, roadList, player, visitedVertices);
		if(testLength>maxSubRoad){
			maxSubRoad = testLength;
		}
	}
	return 1 + maxSubRoad;
}

////////////////////////////////////////////////////////////////////////
/*                            HELPER FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////


function getConnectedVertices(coords, player, roadList, vertices){
	var connectedVertices = [];
	var neighbors = getVertexNeighbors(coords, vertices);
	for (var i = 0; i<neighbors.length;i++){
		var testRoad = getRoad(roadList, neighbors[i], coords);
		if(testRoad.playerID == player.id){
			connectedVertices.push(getVertex(vertices,neighbors[i]));
		}
	}
	return connectedVertices;
}

/* Given a pair of vector coordinates and a player,
 * checks if that player has roads adjacent to one of the coordinates.
 * Returns true if so, false otherwise.
 */



function checkAdjacentPlayerRoads(coords1, coords2, player, roadList, vertices) {
	var testCoords1 = getVertexNeighbors(coords1, vertices);
	for (var i = 0; i < testCoords1.length; i++) {
		var road1 = getRoad(roadList, coords1, testCoords1[i]);
		if (road1 != undefined) {
			if (road1.playerID == player.id) {
				return true;
			}
		}
	}
	var testCoords2 = getVertexNeighbors(coords2, vertices);
	for (i = 0; i < testCoords2.length; i++) {
		var road2 = getRoad(roadList, coords2, testCoords2[i]);
		if (road2 != undefined) {
			if (road2.playerID == player.id) {
				return true;
			}
		}
	}
	return false;
}
/* Given a vector and it's board, returns a list of its three neighbors.
 */

function getVertexNeighbors(coords, vertexFrame){
	if(coords.y%2==0){
		neighbor0 = getVertex(vertexFrame, new Vector(coords.x,coords.y+1));
		neighbor1 = getVertex(vertexFrame, new Vector(coords.x-1,coords.y+1));
		neighbor2 = getVertex(vertexFrame, new Vector(coords.x,coords.y-1));
	}
	else{
		neighbor0 = getVertex(vertexFrame, new Vector(coords.x,coords.y+1));
		neighbor1 = getVertex(vertexFrame, new Vector(coords.x+1,coords.y-1));
		neighbor2 = getVertex(vertexFrame, new Vector(coords.x, coords.y-1));
	}
	var realNeighbors = [];
	var neighbors = [neighbor0, neighbor1, neighbor2];
	for(i=0;i<3;i++){
		if(neighbors[i]!=undefined){
				realNeighbors.push(neighbors[i]);
		}
	}

	return realNeighbors;
}

////////////////////////////////////////////////////////////////////////
/*                          RESOURCE FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* Given a diceRoll integer, the list of players, and both the tile and vertex boards, allocates resources to the appropriate players
 * from a dice roll.
 */

function resourceGeneration(diceRoll, playerList, vertexFrame, tileFrame){
	for(var i = 0;i<tileFrame.length;i++){
		if(tileFrame[i].token == diceRoll){
			var tileVerticesCoordinates = vertices(tileFrame[i].coordinate);
			var tileVertices = [];
			for(var j = 0; j<tileVerticesCoordinates.length;j++){
				tileVertices.push(getVertex(vertexFrame,tileVerticesCoordinates[j]));
			}
			for(var l=0;l<tileVertices.length;l++){
				var currNeighbor = tileVertices[l];
				if(currNeighbor.structure>0){
					var receivingPlayer = getPlayers(currNeighbor.playerID, playerList)[0];
					addResource(receivingPlayer.resources, tileFrame[i].resource, currNeighbor.structure);
				}
			}
		}
	}
}

function initSettlementResources(settlementCoords, tileFrame, player){
	var resourceHexCoords = adjacentHexes(settlementCoords);
	for(var i = 0; i<resourceHexCoords.length;i++){
		var hex = getHex(resourceHexCoords[i], tileFrame);
		if(hex != undefined){
			addResource(player.resources, hex.resource, 1);
		}
	}
}

