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
	console.log("Checking current road");
	if(getRoad(roadList,coords1,coords2).playerID>0){
		return false;
	}
	console.log("Checking Resources");
	if(player.resources[Resource.Lumber] == 0 || player.resources[Resource.Brick] ==0){
		return false;
	}
	console.log("Checking adjacent vertices");
	vertex1 = getVertices(vertexFrame,coords1)[0];
	vertex2 = getVertices(vertexFrame,coords2)[0];
	if(vertex1.playerID==player.id || vertex2.playerID==player.id){
		return true;
	}
	else{
		console.log("Checking adjacent roads");
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
	console.log("Grain " + player.resources[Resource.Grain]);
	if(player.resources[Resource.Lumber] == 0 || player.resources[Resource.Grain] == 0 || player.resources[Resource.Wool] == 0 || player.resources[Resource.Brick] ==0){
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
	vert = getVertices(vertexFrame,coords)[0];
	if(vert.structure != 1 || vert.player != player.id) {
		return false;
	}
	if(player.oreCount<3 && player.grainCount<2){
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
	console.out(neighborList);
	for(i=0;i<neighborList.length;i++){
		if(getVertex(vertexFrame, neighborList[i]).structure>0){
			return false;
		}
	}
	return true;
}

function checkInitRoadLegality(coords1, coords2, player, vertexFrame, roadList){
	if(getRoad(roadList,coords1,coords2).playerID!=0){
		return false;
	}
	vertex1 = getVertices(vertexFrame,coords1)[0];
	console.log(vertex1);
	vertex2 = getVertices(vertexFrame,coords2)[0];
	console.log(vertex2);
	console.log(player.id);
	if(vertex1.playerID==player.id || vertex2.playerID==player.id){
		return true;
	}
	return false;
}

////////////////////////////////////////////////////////////////////////
/*                            HELPER FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* Given a pair of vector coordinates and a player,
 * checks if that player has roads adjacent to one of the coordinates.
 * Returns true if so, false otherwise.
 */

function checkAdjacentPlayerRoads(coords1, coords2, player, roadList, vertices) { //TODO: Fix
	var testCoords = getVertexNeighbors(coords1, vertices);
	for (i = 0; i < testCoords.length; i++) {
		if (!compareVectors(coords2, testCoords[i])) {
			var road = getRoad(roadList, coords1, testCoords[i])
			if (road != undefined) {
				if (road.playerID == player.id) {
					return true;
				}
			}
		}
	}
	testCoords = getVertexNeighbors(coords2, vertices);
	for (i = 0; i < testCoords.length; i++) {
		if (!compareVectors(coords1, testCoords[i])) {
			var road = getRoad(roadList, coords2, testCoords[i])
			if (road != undefined) {
				if (road.playerID == player.id) {
					return true;
				}
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

/* Given a diceRoll integer, the list of players, and both the tile and vertex boards, allocates resources to the appropriate players
 * from a dice roll.
 */

function resourceGeneration(diceRoll, playerList, vertexFrame, tileFrame){
	for(i = 0;i<tileFrame.length;i++){
		if(tileFrame[i].token == diceRoll){
			var tileNeighbors = neighbours(tileFrame[i].coordinates);
			for(j=0;j<tileNeighbors.length;j++){
				var currNeighbor = vertexFrame[[tileNeighbors[j].x,tileNeighbors[j].y]];
				if(currNeighbor.structure>0){
					var receivingPlayer = getPlayer(currNeighbor.player, playerList);
					addResources(receivingPlayer, tileFrame[i].resource, currNeighbor.structure);
				}
			}
		}
	}
}

