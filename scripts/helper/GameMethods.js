//File contains requisite methods for modifying the state of the game, e.g. construction, 
//road connectivity checking, legality checking, etc.

function testResourceFunctions(){
	testBoard = [makeHexObject("w", 5, makeVector(0,0)), makeHexObject("s", 5, makeVector(1,0)), 
	makeHexObject("b", 3, makeVector(0,1))];
	testVertices = buildVertexFramework(testBoard);
	console.log(testVertices);
	p1 = player(1);
	p2 = player(2);
	playList = [p1,p2];
	testVertices[[2,-1]].settled=1;
	testVertices[[2,-1]].player=1;
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
				console.log("check adjacent player roads returned true");
				return true;
			}
		}
		console.log("check adjacent player roads returned false");
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
				console.log("check conflicting roads returned true");
				return true;
			}
		}
	}
	console.log("check conflicting roads returned false");
	return false;
}