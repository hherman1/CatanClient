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
	console.log()
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

function buildSettlement(vert, player){
	vert.settled=1;
	vert.player=player.id;
	for(i = 0;i<player.settledVertices.length;i++){
		testVert = player.settledVertices[i];
		if(testVert.x == newVert.x && testVert.y == newVert.y){
			return;
		}
	player.settledVertices.push(makeVector(vert.x,vert.y));
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
	// Needs to add test for settled neighbors
	return true;
}

/* Given a vertes and a player, identifies said vertex as having a city belonging to that player,
 * and adds it to the player's settledVertices list if it isn't there.
 */

function buildCity(vert, player){
	vert.settled = 2;
	vert.player=player.id;
	newVert = makeVector(vert.x,vert.y);
	for(i = 0;i<player.settledVertices.length;i++){
		testVert = player.settledVertices[i];
		if(testVert.x == newVert.x && testVert.y == newVert.y) {
			return;
		}
	}
	player.settledVertices.push(makeVector(vert.x,vert.y));
}}

/* Given a vertex and a player, checks if a settlement can be built on said vertex by that player.
 */

function checkCityLegality(vert, player){
	if(vert.settled != 1 || vert.player != player.id) {
		return false;
	}
	return true;
}