//File contains requisite methods for modifying the state of the game, e.g. construction,
//road connectivity checking, legality checking, etc.

function testGameMethodFunctions(){
	testBoard = buildRegularHexFramework(5);
	testVertices = buildVertexFramework(testBoard);
	console.log(testVertices);
	p1 = player(1);
	p2 = player(2);
	playList = [p1,p2];
	buildSettlement(testVertices[[2,-1]],p1)
	buildRoad(makeVector(0,0),makeVector(0,1),p1);
	buildRoad(makeVector(0,0),makeVector(1,0),p1);

	buildRoad(makeVector(0,2),makeVector(0,1),p2);
	console.log(checkRoadLegality(testVertices,makeVector(0,2),makeVector(0,1),p1, playList));
	console.log("should be false");
	console.log(checkRoadLegality(testVertices,makeVector(0,2),makeVector(0,1),p2, playList));
	console.log("should be false");
	console.log(checkRoadLegality(testVertices,makeVector(0,2),makeVector(1,1),p1, playList));
	console.log("should be false");
	console.log(checkRoadLegality(testVertices,makeVector(1,1),makeVector(0,1),p1, playList));
	console.log("should be true");
	console.log(checkRoadLegality(testVertices,makeVector(2,-1),makeVector(2,0),p1, playList));
	console.log("should be true");
	buildRoad(makeVector(2,-1),makeVector(2,0),p1);
	console.log(checkSettlementLegality(makeVector(2,0),p1,testVertices));
	console.log("should be false");
	buildRoad(makeVector(2,0), makeVector(3,0),p1);
	console.log(checkSettlementLegality(makeVector(3,0),p1,testVertices));
	console.log("should be true");
	buildSettlement(testVertices[[2,-1]],p1);
}
//WORK ON THIS!!

/* buildRoad
 * Given a pair of vector coordinates and a player, creates a road object
 * at the given coordinates, and adds it to the player's road list.
 */

function buildRoad(vert1, vert2, player){
	newRoad = makeRoad(vert1, vert2, player.id);
	player.roadList.push(newRoad);
}

/* checkRoadLegality
 * Given a list of vertex objects, two vector objects representing the two vertices
 * the road will travel between, and the player who wishes to build the road,
 * will return a boolean indicating the legality of the construction.
 */

function checkRoadLegality(vertexFrame, coords1, coords2, player, playerList){
	if(checkConflictingRoads(coords1,coords2,playerList)){
		return false;
	}
	vertex1 = vertexFrame[[coords1.x,coords1.y]];
	vertex2 = vertexFrame[[coords2.x,coords2.y]];
	if((vertex1.settled>0 && vertex1.player==player.id)||
		(vertex2.settled>0 && vertex2.player==player.id)){
		return true;
	}
	else{
		return checkAdjacentPlayerRoads(coords1,coords2,player);
	}
}

/* Given a pair of vector coordinates and a player,
 * checks if that player has roads adjacent to one of the coordinates.
 * Returns true if so, false otherwise.
 */

function checkAdjacentPlayerRoads(coords1, coords2, player){
	for(i=0;i<player.roadList.length;i++){
			other1 = player.roadList[i].coord1;
			other2 = player.roadList[i].coord2;
			if(compareVectors(coords1,other1)||compareVectors(coords1,other2)
				||compareVectors(coords2,other1)||compareVectors(coords2,other2)){
				return true;
			}
		}
		return false;
}

/* Given a pair of coordinates and a list of the in game players,
 * checks if there already exists a road between the given coordinates.
 * Returns true if so, false otherwise.
 */

function checkConflictingRoads(coords1, coords2, playerList){
	testRoad = makeRoad(coords1, coords2, 0);
	for(i = 0; i<playerList.length;i++){
		for(j=0; j<playerList[i].roadList.length;j++){

			if(compareRoadPositions(testRoad,playerList[i].roadList[j])){
				return true;
			}
		}
	}
	return false;
}

/* Given a vertex and a player, identifies said vertex as having a settlement belonging to that player,
 * and adds it to the player's settledVertices list.
 */

function buildSettlement(vert, player) {
	console.log("this is the vert" + vertexToWorld(vert, 50).x + " " + vertexToWorld(vert, 50).y);
	vert.settled = 1;
	vert.player = player.id;
	modifyResources(player, Resource.Brick, -1);
	modifyResources(player, Resource.Lumber, -1);
	modifyResources(player, Resource.Wool, -1);
	modifyResources(player, Resource.Grain, -1);
	for (i = 0; i < player.settledVertices.length; i++) {
		testVert = player.settledVertices[i];
		if (testVert.x == newVert.x && testVert.y == newVert.y) {
			return;
		}
		player.settledVertices.push(makeVector(vert.x, vert.y));
		// drawBuilding(vert, player.playerColor, 50, ctx);

	}
}

/* Given a vertex, a player, and a vertex frame, checks if a settlement can be built on said vertex by that player.
 */

function checkSettlementLegality(vert, player, vertexFrame){
	coords = makeVector(vert.x,vert.y);
	if(!checkAdjacentPlayerRoads(coords, coords, player)){
		return false;
	}
	if(vert.settled>0){
		return false;
	}
	if(player.grainCount == 0 || player.woolCount == 0 || player.brickCount == 0 || player.lumberCount ==0){
		return false;
	}
	neighborList = getVertexNeighbors(vert, vertexFrame);
	console.log(neighborList);
	for(i=0;i<neighborList.length;i++){
		if(neighborList[i].settled>0){
			return false;
		}
	}
	return true;
}

/* Given a vertes and a player, identifies said vertex as having a city belonging to that player,
 * and adds it to the player's settledVertices list if it isn't there.
 */

function buildCity(vert, player){
	vert.settled = 2;
	vert.player=player.id;
	modifyResources(player, Resource.Grain, -2);
	modifyResources(player, Resource.Ore, -3);
	newVert = makeVector(vert.x,vert.y);
	for(i = 0;i<player.settledVertices.length;i++){
		testVert = player.settledVertices[i];
		if(testVert.x == newVert.x && testVert.y == newVert.y) {
			return;
		}
	}
	player.settledVertices.push(makeVector(vert.x,vert.y));
}

/* Given a vertex and a player, checks if a settlement can be built on said vertex by that player.
 */

function checkCityLegality(vert, player){
	if(vert.settled != 1 || vert.player != player.id) {
		return false;
	}
	if(player.oreCount<3 && player.grainCount<2){
		return false;
	}
	return true;
}

/* Given a vertex and it's board, returns a list of its three neighbors.
 */

function getVertexNeighbors(vert, vertexFrame){
	if(vert.y%2==0){
		neighbor0 = vertexFrame[[vert.x,vert.y+1]];
		neighbor1 = vertexFrame[[vert.x-1,vert.y+1]];
		neighbor2 = vertexFrame[[vert.x,vert.y-1]];
	}
	else{
		neighbor0 = vertexFrame[[vert.x,vert.y+1]];
		neighbor1 = vertexFrame[[vert.x+1,vert.y-1]];
		neighbor2 = vertexFrame[[vert.x, vert.y-1]];
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
				if(currNeighbor.settled>0){
					var receivingPlayer = getPlayer(currNeighbor.player, playerList); // TODO: Clear up player assignment
					addResources(receivingPlayer, tileFrame[i].resource, currNeighbor.settled);
				}
			}
		}
	}
}