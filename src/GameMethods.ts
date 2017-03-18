// define(['Constants','Grid','BoardState','Player']
//       ,function(Constants,Grid,BoardState,Player) {
import * as Constants from "./Constants"
import * as Grid from "./Grid"
import * as BoardState from "./BoardState"
import * as Player from "./Player"

//Hi guys.
type RoadList = BoardState.Position.Road[];
type VertexList = BoardState.Position.Vertex[];
type HexList = BoardState.Position.Hex[];

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

export function checkRoadLegality(vertexList:VertexList, coords1:Grid.Point, coords2:Grid.Point, player:Player.Player, roadList:RoadList){
	if(BoardState.requireRoad(roadList,coords1,coords2).structure !== undefined){
		return false; // Ensures no road already exists at those coordinates
	}
	var vertex1 = BoardState.requireVertex(vertexList,coords1);
	var vertex2 = BoardState.requireVertex(vertexList,coords2);
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

export function checkSettlementLegality(coords:Grid.Point, player:Player.Player, vertexList:VertexList, roadList:RoadList){
	var vert = BoardState.requireVertex(vertexList,coords);
	if(!checkAdjacentPlayerRoads(coords, coords, player, roadList, vertexList)){ // Checks if the player has roads next to the planned settlement
		return false;
	}
	if(vert.structure !== undefined){ // Ensures the vertex isn't already settled
		return false;
	}
	var neighborList = getVertexNeighbors(coords, vertexList);
	for(var i=0;i<neighborList.length;i++){
		if(neighborList[i].structure !== undefined){ // Ensures the adjacent vertices aren't already settled
			return false;
		}
	}
	return true;
}

/* checkCityLegality
 * Given the vector of the intended city and a player wishing to build it,
 * checks if a city can be built.
 */

export function checkCityLegality(coords:Grid.Point, player:Player.Player, vertexList:VertexList){
	var vert = BoardState.findVertices(vertexList,coords)[0];
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

export function checkInitSettlementLegality(coords:Grid.Point, vertexList:VertexList){
	var vert = BoardState.requireVertex(vertexList, coords);
	if(vert.structure !== undefined){ // Ensures the vertex isn't already settled
		return false;
	}
	var neighborList = getVertexNeighbors(coords, vertexList);
	for(var i=0;i<neighborList.length;i++){
		if(neighborList[i].structure !== undefined){ // Ensures the neighboring vertices aren't already settled
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

export function checkInitRoadLegality(coords1:Grid.Point, coords2:Grid.Point, player:Player.Player, vertexList:VertexList, roadList:RoadList){
	if(BoardState.requireRoad(roadList,coords1,coords2).playerID!=0){ // Ensures there isn't already a road at the intended coordinates
		return false;
	}
	var vertex1 = BoardState.requireVertex(vertexList,coords1);
	var vertex2 = BoardState.requireVertex(vertexList,coords2);
    return vertex1.playerID==player.id || vertex2.playerID==player.id; // Ensures the road is adjacent to a player settlement
}

////////////////////////////////////////////////////////////////////////
/*                   ROBBING LEGALITY FUNCTIONS                       */
////////////////////////////////////////////////////////////////////////

export function checkRobbingLegality(robber:BoardState.Robber, coords:Grid.Point, hexList:HexList){
	var hex = BoardState.requireHex(coords, hexList);
	if(hex == robber.hex){
		return false;
	}
	return true;

}

////////////////////////////////////////////////////////////////////////
/*                     VICTORY POINT FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* longestRoad
 * Given a starting vertex, a list of vertices, a list of roads, and a player, recursively finds
 * the longest road stemming from the initial vertex
 */




export function longestRoad(vert:BoardState.Position.Vertex, vertexList:VertexList, roadList:RoadList, 
player:Player.Player, visitedVertices:VertexList){
	visitedVertices.push(vert); // Adds the current vertex to the vertices that have been visited
	var newVertices = [];
	var connectedVertices = getConnectedVertices(vert.coordinate, player, roadList, vertexList);
	for(var i = 0; i<connectedVertices.length;i++){
		if(BoardState.doesNotContainVertexAtCoordinates(visitedVertices,connectedVertices[i].coordinate)){  // Adds all unvisited vertices to a list to be processed
			newVertices.push(connectedVertices[i]);
		}
	}
	if(newVertices.length==0){
		return 0;
	}
	var maxSubRoad = 0;
	var maxSubRoad2 = 0;
	for(var j = 0 ;j<newVertices.length;j++){
		var testLength = longestRoad(newVertices[j], vertexList, roadList, player, visitedVertices); // Finds the longest road beginning at each of the unvisited vertices
		if(testLength>maxSubRoad){
			maxSubRoad = testLength;
		}
		else if(testLength>maxSubRoad2){
			maxSubRoad2 = testLength;
		}
	}
	if (vert == visitedVertices[0] && newVertices.length > 1){
			return maxSubRoad + maxSubRoad2 + 2;
		}
	return 1 + maxSubRoad; // Returns the longest road
}

////////////////////////////////////////////////////////////////////////
/*                            HELPER FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* checkHexSettled
 * Given a hex, checks to see if the hex has been settled by players other than the current player.
 */

export function checkHexSettled(hex:BoardState.Position.Hex, player:Player.Player, vertexList:VertexList){
	var borderVertices = Grid.vertices(hex.coordinate);
	for (var i = 0; i<borderVertices.length; i++){
		var vert = BoardState.requireVertex(vertexList, borderVertices[i]);
		if(vert.structure && vert.playerID != player.id){
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

export function getConnectedVertices(coords:Grid.Point, player:Player.Player, roadList:RoadList, vertexList:VertexList){
	var connectedVertices = [];
	var neighbors = getVertexNeighbors(coords, vertexList); // Gets the vertices that neighbor the given coordinates
	for (var i = 0; i<neighbors.length;i++){
		var testRoad = BoardState.requireRoad(roadList, neighbors[i].coordinate, coords);
		if(testRoad.playerID == player.id){
			connectedVertices.push(neighbors[i]); // Checks which neighboring vertices are connected by player-owned roads
		}
	}
	return connectedVertices;
}

/* checkAdjacentPlayerRoads
 * Given a pair of vector coordinates and a player,
 * checks if that player has roads adjacent to one of the coordinates.
 * Returns true if so, false otherwise.
 */

export function checkAdjacentPlayerRoads(coords1:Grid.Point, coords2:Grid.Point, player:Player.Player, roadList:RoadList, vertexList:VertexList) {
	var testVertices1 = getVertexNeighbors(coords1, vertexList);
	for (var i = 0; i < testVertices1.length; i++) {
		var road1 = BoardState.requireRoad(roadList, coords1, testVertices1[i].coordinate); // Checks the vertices adjacent to the first coordinate for player roads
		if (road1 != undefined) {
			if (road1.playerID == player.id) {
				return true;
			}
		}
	}
	var testVertices2 = getVertexNeighbors(coords2, vertexList);
	for (i = 0; i < testVertices2.length; i++) {
		var road2 = BoardState.requireRoad(roadList, coords2, testVertices2[i].coordinate); // Checks the vertices adjacent to the second coordinate for player roads
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

export function getVertexNeighbors(coords:Grid.Point, vertexList:VertexList):BoardState.Position.Vertex[]{
    var neighbors:(BoardState.Position.Vertex|undefined)[] = [];
	if(coords.y%2==0){
		neighbors[0] = BoardState.findVertex(vertexList, {x:coords.x,y:coords.y+1});
		neighbors[1] = BoardState.findVertex(vertexList, {x:coords.x-1,y:coords.y+1});
		neighbors[2] = BoardState.findVertex(vertexList, {x:coords.x,y:coords.y-1});
	}
	else{
		neighbors[0] = BoardState.findVertex(vertexList, {x:coords.x,y:coords.y+1});
		neighbors[1] = BoardState.findVertex(vertexList, {x:coords.x+1,y:coords.y-1});
		neighbors[2] = BoardState.findVertex(vertexList, {x:coords.x,y: coords.y-1});
	}
    let realNeighbors:BoardState.Position.Vertex[] = [];
    neighbors.forEach((neighbor) => {
        if(neighbor!== undefined) {
            realNeighbors.push(neighbor);
        }
    })

	return realNeighbors;
}

////////////////////////////////////////////////////////////////////////
/*                          RESOURCE FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////

/* resourceGeneration
 * Given an integer representing a dice roll, the list of players, and both the tile and vertex lists,
 * allocates resources to the appropriate players.
 */

export function resourceGeneration(diceRoll:number, playerList:Player.Player[], vertexList:VertexList, hexList:HexList, robber:BoardState.Robber){
	for(var i = 0;i<hexList.length;i++){
		if(hexList[i].token == diceRoll && hexList[i] != robber.hex){ // Checks if the hex is the correct number
			var tileVerticesCoordinates = Grid.vertices(hexList[i].coordinate);
			var tileVertices = [];
			for(var j = 0; j<tileVerticesCoordinates.length;j++){
				tileVertices.push(BoardState.requireVertex(vertexList,tileVerticesCoordinates[j])); // Gathers the relevant vertices
			}
			for(var l=0;l<tileVertices.length;l++){
				var currNeighbor = tileVertices[l];
				if(currNeighbor.structure !== undefined){
					var receivingPlayer = Player.getPlayers(currNeighbor.playerID, playerList)[0]; // Awards the correct resource to a player if they own a neighboring vertex
                    currNeighbor.structure
                    if(hexList[i].resource != BoardState.Resource.Desert){
                                                currNeighbor.structure	
						BoardState.addResource(receivingPlayer.resources, hexList[i].resource, BoardState.getReward(currNeighbor.structure));
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

export function initSettlementResources(coords:Grid.Point, hexList:HexList, player:Player.Player){
	var resourceHexCoords = Grid.adjacentHexes(coords);
	for(var i = 0; i<resourceHexCoords.length;i++){
		var hex = BoardState.findHex(resourceHexCoords[i], hexList); // For every adjacent hex, provides the player one of that hex's resource
		if(hex !== undefined && hex.resource != BoardState.Resource.Desert){
			BoardState.addResource(player.resources, hex.resource, 1);
		}
	}
}

export function checkPlayerWin(player:Player.Player){
    if(player.vicPoints>=Constants.VPS_REQUIRED_FOR_WIN){
       console.log("WONN");
        return true;
    }
    return false;
}

