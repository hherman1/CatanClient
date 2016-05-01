// File contains requisite methods for modifying the state of the game, e.g. construction,
// road connectivity checking, legality checking, etc.

////////////////////////////////////////////////////////////////////////
/*                       NORMAL LEGALITY FUNCTIONS                    */
////////////////////////////////////////////////////////////////////////

/* checkRoadLegality
 * Given a list of vertex objects, two vector objects representing the two vertices
 * the road will travel between, and the player who wishes to build the road,
 * will return a boolean indicating the legality of the construction.
 */

function checkRoadLegality(vertexList, coords1, coords2, player, roadList){
	if(findRoad(roadList,coords1,coords2).playerID>0){
		return false; // Ensures no road already exists at those coordinates
	}
	var vertex1 = findVertex(vertexList,coords1);
	var vertex2 = findVertex(vertexList,coords2);
	if(vertex1.playerID==player.id || vertex2.playerID==player.id){ // Checks for player settlements at either end of the intended road
		return true;
	}
	else{
		return checkAdjacentPlayerRoads(coords1,coords2,player,roadList, vertexList); // Returns true if the player has roads adjacent to either end of the intended road
	}
}

/* checkSettlementLegality
 * Given the vector of the intended settlement, a player wishing to build the settlement, and a
 * list of vertex objects, checks if a settlement can be built on said vertex by that player.
 */

function checkSettlementLegality(coords, player, vertexList, roadList){
	var vert = findVertex(vertexList,coords);
	if(!checkAdjacentPlayerRoads(coords, coords, player, roadList, vertexList)){ // Checks if the player has roads next to the planned settlement
		return false;
	}
	if(vert.structure>0){ // Ensures the vertex isn't already settled
		return false;
	}
	var neighborList = getVertexNeighbors(coords, vertexList);
	for(i=0;i<neighborList.length;i++){
		if(findVertex(vertexList, neighborList[i]).structure>0){ // Ensures the adjacent vertices aren't already settled
			return false;
		}
	}
	return true;
}

/* checkCityLegality
 * Given the vector of the intended city and a player wishing to build it,
 * checks if a city can be built.
 */

function checkCityLegality(coords, player, vertexList){
	var vert = findVertices(vertexList,coords)[0];
	if(vert.structure != 1){ // Ensures settlement is already present
		return false;
	}
	if(vert.playerID != player.id){ // Ensures settlement belongs to correct player
		return false;
	}
	return true;
}

////////////////////////////////////////////////////////////////////////
/*                  INITIALIZATION LEGALITY FUNCTIONS                 */
////////////////////////////////////////////////////////////////////////

/* checkInitSettlementLegality
 * Given a vector and a list of vertex objects, checks if the building of a settlement
 * at those coordinates during the initialization phase is legal
 */

function checkInitSettlementLegality(coords, vertexList){
	var vert = findVertex(vertexList, coords);
	if(vert.structure>0){ // Ensures the vertex isn't already settled
		return false;
	}
	var neighborList = getVertexNeighbors(coords, vertexList);
	for(i=0;i<neighborList.length;i++){
		if(findVertex(vertexList, neighborList[i]).structure>0){ // Ensures the neighboring vertices aren't already settled
			return false;
		}
	}
    return true;
}

/* checkInitRoadLegality
 * Given a pair of vectors, a list of vertex objects, a list of road objects, and a player,
 * checks if the building of a settlement at those coordinates during the initialization phase
 * by that player is legal.
 */

function checkInitRoadLegality(coords1, coords2, player, vertexList, roadList){
	if(findRoad(roadList,coords1,coords2).playerID!=0){ // Ensures there isn't already a road at the intended coordinates
		return false;
	}
	var vertex1 = findVertex(vertexList,coords1);
	var vertex2 = findVertex(vertexList,coords2);
    return vertex1.playerID==player.id || vertex2.playerID==player.id; // Ensures the road is adjacent to a player settlement
}

////////////////////////////////////////////////////////////////////////
/*                   ROBBING LEGALITY FUNCTIONS                       */
////////////////////////////////////////////////////////////////////////

function checkRobbingLegality(player, robber, coords, hexList, vertList){
	var hex = findHex(coords, hexList);
	if(hex == robber.hex){
		return false;
	}
	return checkHexSettled(hex, player, vertList);

}

////////////////////////////////////////////////////////////////////////
/*                     VICTORY POINT FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* longestRoad
 * Given a starting vertex, a list of vertices, a list of roads, and a player, recursively finds
 * the longest road stemming from the initial vertex
 */

function longestRoadWrapper(vertexList, roadList, player){
	if(player.firstSettlementsCoords[0]!=undefined) {
		var settlement1Verts = getConnectedVertices(player.firstSettlementsCoords[0], player, roadList, vertexList);
		var settlement1Max = 0;
		var settlement1Max2 = 0;
		for (var i = 0; i < settlement1Verts.length; i++) {
			var result = longestRoad(settlement1Verts[i], vertexList, roadList, player, []);
			if (result > settlement1Max) {
				settlement1Max2 = settlement1Max;
				settlement1Max = result;
			} else {
				if (result > settlement1Max2) {
					settlement1Max2 = result;
				}
			}
		} //TODO: Fix longest road
	}
	if(player.firstSettlementsCoords[1]!=undefined) {
		var settlement2Verts = getConnectedVertices(player.firstSettlementsCoords[1], player, roadList, vertexList);
		var settlement2Max = 0;
		var settlement2Max2 = 0;
		for (var j = 0; j < settlement2Verts.length; j++) {
			var result = longestRoad(settlement2Verts[j], vertexList, roadList, player, []);
			if (result > settlement2Max) {
				settlement2Max2 = settlement2Max;
				settlement2Max = result;
			} else {
				if (result > settlement2Max2) {
					settlement2Max2 = result;
				}
			}
		}
	}
	var val = Math.max(settlement1Max+settlement1Max2, settlement2Max+settlement2Max2);
	console.log(val);
	return val;
}

function longestRoad(vert, vertexList, roadList, player, visitedVertices){
	visitedVertices.push(vert); // Adds the current vertex to the vertices that have been visited
	var newVertices = [];
	var connectedVertices = getConnectedVertices(vert.coordinate, player, roadList, vertexList);
	for(var i = 0; i<connectedVertices.length;i++){
		if(doesNotContainVertexAtCoordinates(visitedVertices,connectedVertices[i].coordinate)){  // Adds all unvisited vertices to a list to be processed
			newVertices.push(connectedVertices[i]);
		}
	}
	if(newVertices.length==0){
		return 0;
	}
	var maxSubRoad = 0;
	for(var j = 0 ;j<newVertices.length;j++){
		var testLength = longestRoad(newVertices[j], vertexList, roadList, player, visitedVertices); // Finds the longest road beginning at each of the unvisited vertices
		if(testLength>maxSubRoad){
			maxSubRoad = testLength;
		}
	}
	return 1 + maxSubRoad; // Returns the longest road
}

////////////////////////////////////////////////////////////////////////
/*                            HELPER FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* checkHexSettled
 * Given a hex, checks to see if the hex has been settled by players other than the current player.
 */

function checkHexSettled(hex, player, vertexList){
	var borderVertices = vertices(hex.coordinate);
	for (var i = 0; i<borderVertices.length; i++){
		var vert = findVertex(vertexList, borderVertices[i]);
		if(vert.structure>0 && vert.playerID != player.id){
			return true;
		}
	}
	return false;
}

/* getConnectedVertices
 * Given vector coordinates, their owning player, and lists of roads and vertices,
 * returns a list of the adjacent vertices connected to the given coordinates by roads
 * owned by the player.
 */

function getConnectedVertices(coords, player, roadList, vertexList){
	var connectedVertices = [];
	var neighbors = getVertexNeighbors(coords, vertexList); // Gets the vertices that neighbor the given coordinates
	for (var i = 0; i<neighbors.length;i++){
		var testRoad = findRoad(roadList, neighbors[i], coords);
		if(testRoad.playerID == player.id){
			connectedVertices.push(findVertex(vertexList,neighbors[i])); // Checks which neighboring vertices are connected by player-owned roads
		}
	}
	return connectedVertices;
}

/* checkAdjacentPlayerRoads
 * Given a pair of vector coordinates and a player,
 * checks if that player has roads adjacent to one of the coordinates.
 * Returns true if so, false otherwise.
 */

function checkAdjacentPlayerRoads(coords1, coords2, player, roadList, vertexList) {
	var testCoords1 = getVertexNeighbors(coords1, vertexList);
	for (var i = 0; i < testCoords1.length; i++) {
		var road1 = findRoad(roadList, coords1, testCoords1[i]); // Checks the vertices adjacent to the first coordinate for player roads
		if (road1 != undefined) {
			if (road1.playerID == player.id) {
				return true;
			}
		}
	}
	var testCoords2 = getVertexNeighbors(coords2, vertexList);
	for (i = 0; i < testCoords2.length; i++) {
		var road2 = findRoad(roadList, coords2, testCoords2[i]); // Checks the vertices adjacent to the second coordinate for player roads
		if (road2 != undefined) {
			if (road2.playerID == player.id) {
				return true;
			}
		}
	}
	return false;
}
/* getVertexNeighbors
 * Given a vector and a list of vertices, returns a list of its three neighboring vertices.
 */

function getVertexNeighbors(coords, vertexList){
	var neighbor0;
	var neighbor1;
	var neighbor2;
	if(coords.y%2==0){
		neighbor0 = findVertex(vertexList, new Vector(coords.x,coords.y+1));
		neighbor1 = findVertex(vertexList, new Vector(coords.x-1,coords.y+1));
		neighbor2 = findVertex(vertexList, new Vector(coords.x,coords.y-1));
	}
	else{
		neighbor0 = findVertex(vertexList, new Vector(coords.x,coords.y+1));
		neighbor1 = findVertex(vertexList, new Vector(coords.x+1,coords.y-1));
		neighbor2 = findVertex(vertexList, new Vector(coords.x, coords.y-1));
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

/* resourceGeneration
 * Given an integer representing a dice roll, the list of players, and both the tile and vertex lists,
 * allocates resources to the appropriate players.
 */

function resourceGeneration(diceRoll, playerList, vertexList, hexList, robber){
	for(var i = 0;i<hexList.length;i++){
		if(hexList[i].token == diceRoll && hexList[i] != robber.hex){ // Checks if the hex is the correct number
			var tileVerticesCoordinates = vertices(hexList[i].coordinate);
			var tileVertices = [];
			for(var j = 0; j<tileVerticesCoordinates.length;j++){
				tileVertices.push(findVertex(vertexList,tileVerticesCoordinates[j])); // Gathers the relevant vertices
			}
			for(var l=0;l<tileVertices.length;l++){
				var currNeighbor = tileVertices[l];
				if(currNeighbor.structure>0){
					var receivingPlayer = getPlayers(currNeighbor.playerID, playerList)[0]; // Awards the correct resource to a player if they own a neighboring vertex
					if(hexList[i].resource != Resource.Desert){	
						addResource(receivingPlayer.resources, hexList[i].resource, currNeighbor.structure);
					}
				}
			}
		}
	}
}

/* initSettlementResources
 * When a settlement is built in the initialization phase,
 * awards one of each neighboring resource to the owning player.
 */

function initSettlementResources(coords, hexList, player){
	var resourceHexCoords = adjacentHexes(coords);
	for(var i = 0; i<resourceHexCoords.length;i++){
		var hex = findHex(resourceHexCoords[i], hexList); // For every adjacent hex, provides the player one of that hex's resource
		if(hex != undefined && hex.resource != Resource.Desert){
			addResource(player.resources, hex.resource, 1);
		}
	}
}

