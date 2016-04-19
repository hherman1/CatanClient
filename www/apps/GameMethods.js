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

function checkRoadLegality(vertexFrame, coords1, coords2, player, roadList){
	if(findRoad(roadList,coords1,coords2).playerID>0){
		return false; // Ensures no road already exists at those coordinates
	}
	vertex1 = findVertices(vertexFrame,coords1)[0];
	vertex2 = findVertices(vertexFrame,coords2)[0];
	if(vertex1.playerID==player.id || vertex2.playerID==player.id){ // Checks for player settlements at either end of the intended road
		return true;
	}
	else{
		return checkAdjacentPlayerRoads(coords1,coords2,player,roadList, vertexFrame); // Returns true if the player has roads adjacent to either end of the intended road
	}
}

/* checkSettlementLegality
 * Given the vector of the intended settlement, a player wishing to build the settlement, and a
 * list of vertex objects, checks if a settlement can be built on said vertex by that player.
 */

function checkSettlementLegality(coords, player, vertexFrame, roadList){
	var vert = findVertex(vertexFrame,coords);
	if(!checkAdjacentPlayerRoads(coords, coords, player, roadList, vertexFrame)){ // Checks if the player has roads next to the planned settlement
		return false;
	}
	if(vert.structure>0){ // Ensures the vertex isn't already settled
		return false;
	}
	neighborList = getVertexNeighbors(coords, vertexFrame);
	for(i=0;i<neighborList.length;i++){
		if(findVertex(vertexFrame, neighborList[i]).structure>0){ // Ensures the adjacent vertices aren't already settled
			return false;
		}
	}
	return true;
}

/* checkCityLegality
 * Given the vector of the intended city and a player wishing to build it,
 * checks if a city can be built.
 */

function checkCityLegality(coords, player, vertexFrame){
	var vert = findVertices(vertexFrame,coords)[0];
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

function checkInitSettlementLegality(coords, vertexFrame){
	var vert = findVertex(vertexFrame, coords);
	if(vert.structure>0){ // Ensures the vertex isn't already settled
		return false;
	}
	neighborList = getVertexNeighbors(coords, vertexFrame);
	for(i=0;i<neighborList.length;i++){
		if(findVertex(vertexFrame, neighborList[i]).structure>0){ // Ensures the neighboring vertices aren't already settled
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

function checkInitRoadLegality(coords1, coords2, player, vertexFrame, roadList){
	if(findRoad(roadList,coords1,coords2).playerID!=0){ // Ensures there isn't already a road at the intended coordinates
		return false;
	}
	vertex1 = findVertices(vertexFrame,coords1)[0];
	vertex2 = findVertices(vertexFrame,coords2)[0];
    return vertex1.playerID==player.id || vertex2.playerID==player.id; // Ensures the road is adjacent to a player settlement
}

////////////////////////////////////////////////////////////////////////
/*                     VICTORY POINT FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* longestRoad
 * Given a starting vertex, a list of vertices, a list of roads, and a player, recursively finds
 * the longest road stemming from the initial vertex
 */

function longestRoad(vert, vertices, roadList, player, visitedVertices){
	visitedVertices.push(vert); // Adds the current vertex to the vertices that have been visited
	var newVertices = [];
	var connectedVertices = getConnectedVertices(vert.coordinate, player, roadList, vertices);
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
		var testLength = longestRoad(newVertices[j], vertices, roadList, player, visitedVertices); // Finds the longest road beginning at each of the unvisited vertices
		if(testLength>maxSubRoad){
			maxSubRoad = testLength;
		}
	}
	return 1 + maxSubRoad; // Returns the longest road
}

////////////////////////////////////////////////////////////////////////
/*                            HELPER FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* getConnectedVertices
 * Given vector coordinates, their owning player, and lists of roads and vertices,
 * returns a list of the vertices conneccted to the given coordinates by roads
 * owned by the player.
 */

function getConnectedVertices(coords, player, roadList, vertices){
	var connectedVertices = [];
	var neighbors = getVertexNeighbors(coords, vertices); // Gets the vertices that neighbor the given coordinates
	for (var i = 0; i<neighbors.length;i++){
		var testRoad = findRoad(roadList, neighbors[i], coords);
		if(testRoad.playerID == player.id){
			connectedVertices.push(findVertex(vertices,neighbors[i])); // Checks which neighboring vertices are connected by player-owned roads
		}
	}
	return connectedVertices;
}

/* checkAdjacentPlayerRoads
 * Given a pair of vector coordinates and a player,
 * checks if that player has roads adjacent to one of the coordinates.
 * Returns true if so, false otherwise.
 */



function checkAdjacentPlayerRoads(coords1, coords2, player, roadList, vertices) {
	var testCoords1 = getVertexNeighbors(coords1, vertices);
	for (var i = 0; i < testCoords1.length; i++) {
		var road1 = findRoad(roadList, coords1, testCoords1[i]); // Checks the vertices adjacent to the first coordinate for player roads
		if (road1 != undefined) {
			if (road1.playerID == player.id) {
				return true;
			}
		}
	}
	var testCoords2 = getVertexNeighbors(coords2, vertices);
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

function getVertexNeighbors(coords, vertexFrame){
	if(coords.y%2==0){
		neighbor0 = findVertex(vertexFrame, new Vector(coords.x,coords.y+1));
		neighbor1 = findVertex(vertexFrame, new Vector(coords.x-1,coords.y+1));
		neighbor2 = findVertex(vertexFrame, new Vector(coords.x,coords.y-1));
	}
	else{
		neighbor0 = findVertex(vertexFrame, new Vector(coords.x,coords.y+1));
		neighbor1 = findVertex(vertexFrame, new Vector(coords.x+1,coords.y-1));
		neighbor2 = findVertex(vertexFrame, new Vector(coords.x, coords.y-1));
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

function resourceGeneration(diceRoll, playerList, vertexFrame, tileFrame){
	for(var i = 0;i<tileFrame.length;i++){
		if(tileFrame[i].token == diceRoll){ // Checks if the hex is the correct number
			var tileVerticesCoordinates = vertices(tileFrame[i].coordinate);
			var tileVertices = [];
			for(var j = 0; j<tileVerticesCoordinates.length;j++){
				tileVertices.push(findVertex(vertexFrame,tileVerticesCoordinates[j])); // Gathers the relevant vertices
			}
			for(var l=0;l<tileVertices.length;l++){
				var currNeighbor = tileVertices[l];
				if(currNeighbor.structure>0){
					var receivingPlayer = getPlayers(currNeighbor.playerID, playerList)[0]; // Awards the correct resource to a player if they own a neighboring vertex
					addResource(receivingPlayer.resources, tileFrame[i].resource, currNeighbor.structure);
				}
			}
		}
	}
}

/* initSettlementResources
 * When a settlement is built in the initialization phase,
 * awards one of each neighboring resource to the owning player.
 */

function initSettlementResources(settlementCoords, tileFrame, player){
	var resourceHexCoords = adjacentHexes(settlementCoords);
	for(var i = 0; i<resourceHexCoords.length;i++){
		var hex = findHex(resourceHexCoords[i], tileFrame); // Provides one research for each adjacent hex
		if(hex != undefined){
			addResource(player.resources, hex.resource, 1);
		}
	}
}

