//Data Types
Phase = {               
    Init: 0,
    Normal: 1
}
Rotation = {
        Forwards: 0,
        Backwards: 1,
        None: 2,
}

Board = function() {
        this.hexes = [];
        this.vertices = [];
        this.roads = [];
        this.robber = undefined;
}

RegularHexBoard = function(width, resourceList, tokenList) {
        Board.call(this);
        this.hexes = buildRegularHexFramework(width, baseResourceList.slice(), baseTokenList.slice());
        this.vertices = buildVertexFramework(this.hexes);
        this.roads = buildRoadFramework(this.vertices);
        var desertIndex = undefined;
        for(var i=0;i<this.hexes.size;i++){
            if(this.hexes[i].resource == Resource.Desert){
                desertIndex = i;
            }
        }
        this.robber = new Robber(this.hexes[desertIndex]);
}

Structure = {
        Empty: 0,
        Settlement: 1,
        City: 2,
        Road: 3
};

Resource = {
        Lumber : 0,
        Wool : 1,
        Ore : 2,
        Brick : 3,
        Grain : 4,
        Desert : 5
};

Position = {
        Type: {
                Vertex: 0,
                Road: 1,
                Hex: 2
        },
        /* Road
         * Roads are stored in a list in the board object
         * structure: set to 1 if a structure (i.e. a road) is present on this road position, 0 otherwise
         * coord1: vector representing the coordinates of the first end of the road
         * coord2: vector representing the coordinates of the second end of the road
         * playerID: number from 1 to 4 indicating owner of the road - set to 0 if the road has not been built on
         */

        Road: function(structure, coord1, coord2, playerID){
            this.type = Position.Type.Road;
            this.structure = structure;
            this.coord1=coord1;
            this.coord2=coord2;
            this.playerID=playerID;
        },

        /* Vertex Object
         * Vertices are stored in a list in the board object
         * structure: set to 1 if there is a settlement on this vertex, 2 if there is a city, and 0 otherwise
         * playerID: number from 1 to 4 indicating owner of the vertex - set to 0 if the vertex has not been built on
         * coordinate: vector representing the coordinates of the vector on the vector grid
         */

        Vertex : function(structure, playerID,coordinate){
            this.type = Position.Type.Vertex;
            this.structure=structure;
            this.playerID=playerID;
            this.coordinate=coordinate;
        },

        /* Hex Object
         * Hexes are stored in a list in the board object
         * resource: number from 0 to 5 indicating the resource of the tile (resource correspondences are stored in the Resource data type)
         * token: number from 2 to 12, not including 7, representing the number that must be rolled to yield resources form the tile
         * coordinate: vector representing the coordinates of the hex on the hex grid
         */

        Hex : function(resource, token, coordinate, robber){
            this.type = Position.Type.Hex;
            this.resource=resource;
            this.token=token;
            this.coordinate=coordinate;
            this.robber = robber
        }
};

function notEqualPositionCoordinatesFilter(posA) {
        return function(posB) {
                return !equalPositionCoordinates(posA,posB);
        }
}

function equalPositionCoordinates(positionA,positionB) {
        if(positionA.type != positionB.type) {
                return false;
        }
        switch(positionA.type) {
                case Position.Type.Road:
                        return compareRoadPositions(positionA,positionB);
                case Position.Type.Vertex:
                        return vectorEquals(positionA.coordinate,positionB.coordinate);
        }
}


baseResourceList =
    [Resource.Desert,  Resource.Grain, Resource.Grain, Resource.Grain,
     Resource.Grain, Resource.Wool, Resource.Wool, Resource.Wool,
     Resource.Wool, Resource.Lumber, Resource.Lumber, Resource.Lumber,
     Resource.Lumber, Resource.Ore, Resource.Ore, Resource.Ore,
     Resource.Brick, Resource.Brick, Resource.Brick];

baseTokenList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];


function cloneBoard(board) {
        var newBoard = new Board();
        newBoard.hexes = board.hexes.map(cloneHex);
        newBoard.vertices = board.vertices.map(cloneVertex);
        newBoard.roads = board.roads.map(cloneRoad);
        newBoard.robber = cloneRobber(board.robber);
        return newBoard;
}

function cloneRoad(road) {
        return new Position.Road(road.structure,road.coord1,road.coord2,road.playerID);
}

function cloneVertex(vertex){
        return new Position.Vertex(vertex.structure,vertex.playerID,vertex.coordinate);
}

function cloneHex(hex)  {
        return new Position.Hex(hex.resource,hex.token,hex.coordinate,hex.robber);
}

function cloneRobber(robber){
    return new Robber(robber.hex);
}

/* getPrice
 * Given a structure, returns a resource list representing the structure's cost.
 * Resource lists are stored as length 5 arrays, wherein each index represents a specific resource
 */

function getPrice(structure) {
        var resources = [];
        resources[Resource.Lumber] = 0;
        resources[Resource.Wool] = 0;
        resources[Resource.Ore] = 0;
        resources[Resource.Brick] = 0;
        resources[Resource.Grain] = 0;
        switch(structure) {
                case Structure.Road:
                        resources[Resource.Brick] = 1;
                        resources[Resource.Lumber] = 1;
                        break;
                case Structure.Settlement: 
                        resources[Resource.Brick] = 1;
                        resources[Resource.Lumber] = 1;
                        resources[Resource.Grain] = 1;
                        resources[Resource.Wool] = 1;
                        break;
                case Structure.City:
                        resources[Resource.Grain] = 2;
                        resources[Resource.Ore] = 3;
                        break;
        }
        return resources;
}


/* buildRegularHexFramework
 * Builds a list of hex objects representing a hexagonal board of width 'width' in the middle (e.g. a standard 4-player catan board
 * would have a width of 5
 * Among the
 */

function buildRegularHexFramework(width, resList, tokList){
	var tileFrame = [];
	shuffle(resList);
	shuffle(tokList);
	for(i=0-Math.floor(width/2);i<Math.ceil(width/2);i++){
		yShift = generateYShift(width,i);
		for(j=0;j<width-Math.abs(i);j++){
			var res = resList.pop();
			if(res==Resource.Desert){
				var tok = 7;
                var robber = true;
			}
			else{
				var tok = tokList.pop();
                var robber = false;
			}
			var coords = new Vector(i, j+yShift);
			tileFrame.push(new Position.Hex(res,tok,coords,robber));
		}
	}
	return tileFrame;
}

function getHex(coords, hexFrame){
    for(var i = 0; i<hexFrame.length; i++){
        if(vectorEquals(hexFrame[i].coordinate, coords)){
            return hexFrame[i];
        }
    }
}


/* Helper function to be used in building a regular Hex Framwork. Determines where
 * each diagonal y-column should begin.
 *
 */

function generateYShift(width, xcoord){
	if(xcoord>=0){
		return 0-Math.floor(width/2);
	}
	else{
		return 0-Math.floor(width/2)-xcoord;
	}
}


/* buildVertexFramework
 * Given a list of hex objects, generates a dictionary of vertex objects for the game.
 * Different vertices are not recognized as discrete objects, so the keys have to be
 * size 2 arrays.
 */


function buildVertexFramework(tileFrame){
	var vertexFrame = [];
	for(i=0;i<tileFrame.length;i++){
		var coordList = vertices(tileFrame[i].coordinate);
		for(j=0;j<coordList.length;j++){
			testVector = coordList[j];
			if(checkForSameVector(vertexFrame,testVector)) {
				//console.log("works");
				vertexFrame.push(new Position.Vertex(Structure.Empty, 0, coordList[j]));
			}
		}
	}
	return vertexFrame;
}
function checkForSameVector(vertexList, vector){
	for(var count = 0; count<vertexList.length;count++){
		if(vectorEquals(vector,vertexList[count].coordinate)){
			return false;
		}
	}
	return true;
}

/* Given vector coordinates and a list of vertex objects, returns the vertex at said coordinates.
*/
function getVertex(vertices,coordinate) {
        return getVertices(vertices,coordinate)[0];
}
function getVertices(vertices,coordinate) {
        return vertices.filter(function(v) {return vectorEquals(v.coordinate,coordinate)});
}

function getVertexNeighbors(coordinate,frame) {
        return vertexNeighbors(coordinate)
                .map(function(v) {return getVertex(frame,v)})
                .filter(function(v) {return v != undefined})
                .map(function(v) {return v.coordinate})
}

function buildRoadFramework(vertexFrame){
    var roadFrame = [];
    for (i=0;i<vertexFrame.length;i++){
        var coordList = getVertexNeighbors(vertexFrame[i].coordinate,vertexFrame);
        for (j=0;j<coordList.length;j++){
            var testRoad = new Position.Road(Structure.Empty,vertexFrame[i].coordinate,coordList[j], 0);
            if(!checkForSameRoad(roadFrame,testRoad)){
                roadFrame.push(testRoad);
            }
        }
    }
    return roadFrame;
}

function checkForSameRoad(roadList, road){
    for(count = 0; count<roadList.length;count++){
        if(compareRoadPositions(road,roadList[count])){
            return true;
        }
    }
    return false;
}

function getRoad(roadList, coord1, coord2){
    for(i = 0; i<roadList.length;i++){
        if(compareTwoCoordPositions(roadList[i].coord1,roadList[i].coord2, coord1, coord2)){
            return roadList[i];
        }
    }
}
/* compareRoadPositions
 * returns true if the two roads occupy the same position.
 */

function compareRoadPositions(road1, road2){
    return compareTwoCoordPositions(road1.coord1, road1.coord2,road2.coord1,road2.coord2);
}

function compareTwoCoordPositions(road1coord1, road1coord2, road2coord1, road2coord2){
    if((vectorEquals(road1coord1,road2coord1)&&vectorEquals(road1coord2,road2coord2))||
        (vectorEquals(road1coord1,road2coord2)&&vectorEquals(road1coord2,road2coord1))){
        return true;
    }
    return false;
}

function updateGamePhase(gamestate) {
        if(gamestate.phase == Phase.Init) {
                if(gamestate.rotation == Rotation.Backwards) {
                        if(gamestate.players[0].id == gamestate.currentPlayerID) {
                                gamestate.rotation = Rotation.Forwards;
                                gamestate.phase = Phase.Normal;
                        }
                } else if(gamestate.rotation == Rotation.None) {
                        gamestate.rotation = Rotation.Backwards;
                } else if(last(gamestate.players).id == gamestate.currentPlayerID) {
                        gamestate.rotation = Rotation.None;
                }
        }
}
