////////////////////////////////////////////////////////////////////////
/*                               DATA TYPES                           */
////////////////////////////////////////////////////////////////////////

Phase = {
    Init: 0,
    Normal: 1,
    Trading: 2
};

Rotation = {
        Forwards: 0,
        Backwards: 1,
        None: 2
};

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

////////////////////////////////////////////////////////////////////////
/*                             CONSTRUCTORS                           */
////////////////////////////////////////////////////////////////////////

/* Board
 * The baseline board object encapsulates a hex list, a vertex list, and a road list, as well as a robber object (implementation forthcoming)
 */

Board = function() {
    this.hexes = [];
    this.vertices = [];
    this.roads = [];
    this.robber = undefined;
};

/* RegularHexBoard
 * This subversion of the board object is a standard hexagonal board.
 */

RegularHexBoard = function(width, resourceList, tokenList) {
    Board.call(this);
    this.hexes = buildRegularHexFramework(width, resourceList, tokenList);
    this.vertices = buildVertexFramework(this.hexes);
    this.roads = buildRoadFramework(this.vertices);
    var desertIndex = undefined;
    for(var i=0;i<this.hexes.size;i++){
        if(this.hexes[i].resource == Resource.Desert){
            desertIndex = i;
        }
    }
    this.robber = new Robber(this.hexes[desertIndex]);
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

        Vertex : function(structure, coordinate, playerID){
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

        Hex : function(resource, token, coordinate){
            this.type = Position.Type.Hex;
            this.resource=resource;
            this.token=token;
            this.coordinate=coordinate;
        }
};

////////////////////////////////////////////////////////////////////////
/*                     BOARD BUILDING FUNCTIONS                       */
////////////////////////////////////////////////////////////////////////

/*Returns the name of the resource: Lumber : 0,
Wool : 1,
Ore : 2,
Brick : 3,
Grain : 4,
Desert : 5
*/
function getResourceName(resource) {
        switch(resource) {
            case Resource.Wool:
              return "Wool";
            case Resource.Ore:
              return "Ore";
            case Resource.Lumber:
              return "Lumber";
            case Resource.Brick:
              return "Brick";
            case Resource.Grain:
              return "Grain";
            case Resource.Desert:
              return "Produces Nothing";

  }
}

function getResourceTerrainName(resource) {
        switch(resource) {
            case Resource.Wool:
              return "Pasture";
            case Resource.Ore:
              return "Mountains";
            case Resource.Lumber:
              return "Forest";
            case Resource.Brick:
              return "Hills";
            case Resource.Grain:
              return "Fields";
            case Resource.Desert:
              return "Desert";

  }
}

// Functions concerned with creating the board objects

/* buildRegularHexFramework
 * Builds a list of hex objects representing a hexagonal board of width 'width' in the middle (e.g. a standard 4-player catan board
 * would have a width of 5)
 * The tokens and resources of the hexes are randomly generated from the provided resource and token lists.
 */

function buildRegularHexFramework(width, resourceList, tokenList){
    var hexList = [];
    shuffle(resourceList);
    shuffle(tokenList);
    for(i=0-Math.floor(width/2);i<Math.ceil(width/2);i++){ // Cycles through columns
        yShift = generateYShift(width,i);
        for(j=0;j<width-Math.abs(i);j++){ // Cycles through rows
            var res = resourceList.pop(); // Assigns a random resource to the hex
            if(res==Resource.Desert){  // Sets robber's initial position to desert
                var tok = 7;
            }
            else{
                var tok = tokenList.pop(); // Assigns a random token to the hex
            }
            var coords = new Vector(i, j+yShift); // Determines coordinates of the hex
            hexList.push(new Position.Hex(res,tok,coords)); // Creates and adds the hex
        }
    }
    return hexList;
}

/* buildVertexFramework
 * Given a list of hex objects, creates a list of vertices corresponding to those hexes
 */

function buildVertexFramework(hexList){
    var vertexFrame = [];
    for(var i=0;i<hexList.length;i++){
        var coordList = vertices(hexList[i].coordinate); // Gets the coordinates of the vertices of a hex
        for(j=0;j<coordList.length;j++){
            testVector = coordList[j];
            if(doesNotContainVertexAtCoordinates(vertexFrame,testVector)) { // Ensures the vertex hasn't been created yet
                vertexFrame.push(new Position.Vertex(Structure.Empty, coordList[j], 0)); // Creates and adds the vertex
            }
        }
    }
    return vertexFrame;
}

/* buildRoadFramework
 * Given a list of vertices, creates a corresponding list of roads.
 */

function buildRoadFramework(vertexList){
    var roadList = [];
    for (i=0;i<vertexList.length;i++){
        var coordList = getVertexNeighbors(vertexList[i].coordinate,vertexList); // Finds vertices neighboring the given vertex
        for (j=0;j<coordList.length;j++){
            var testRoad = new Position.Road(Structure.Empty,vertexList[i].coordinate,coordList[j], 0);
            if(doesNotContainRoad(roadList,testRoad)){ // Ensures a road between these vertices hasn't already been created
                roadList.push(testRoad); // Creates and adds the road
            }
        }
    }
    return roadList;
}

////////////////////////////////////////////////////////////////////////
/*                         FINDER FUNCTIONS                           */
////////////////////////////////////////////////////////////////////////

// Functions concerned with finding structures in a list according to coordinates

function findHex(coords, hexList){
    for(var i = 0; i<hexList.length; i++){
        if(vectorEquals(hexList[i].coordinate, coords)){
            return hexList[i];
        }
    }
}

function findVertex(vertexList,coordinate) {
    return findVertices(vertexList,coordinate)[0];
}

function findVertices(vertexList,coordinate) {
    return vertexList.filter(function(v) {return vectorEquals(v.coordinate,coordinate)});
}

function findRoad(roadList, coord1, coord2){
    for(i = 0; i<roadList.length;i++){
        if(compareTwoCoordPositions(roadList[i].coord1,roadList[i].coord2, coord1, coord2)){
            return roadList[i];
        }
    }
}

////////////////////////////////////////////////////////////////////////
/*                         CLONING FUNCTIONS                          */
////////////////////////////////////////////////////////////////////////

// Functions concerned with cloning the various board state objects

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
    return new Position.Vertex(vertex.structure,vertex.coordinate,vertex.playerID);
}

function cloneHex(hex)  {
    return new Position.Hex(hex.resource,hex.token,hex.coordinate);
}

function cloneRobber(robber){
    return new Robber(robber.hex);
}

////////////////////////////////////////////////////////////////////////
/*                          HELPER FUNCTIONS                          */
////////////////////////////////////////////////////////////////////////

//function to shuffle up the number tokens
//Source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

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

/* getPrice
 * Given a structure, returns a resource list representing the structure's cost.
 * Resource lists are stored as length 5 arrays, wherein each index represents a specific resource
 */

function getPrice(structure) {
        switch(structure) {
                case Structure.Road:
                        return ROAD_COST;
                case Structure.Settlement:
                        return SETTLEMENT_COST;
                case Structure.City:
                        return CITY_COST;
        }
}

/* generateYShift
 * Helper function to be used in building a regular Hex Framework. Determines where
 * each y-column should begin, given the x coordinate of the column and the width of the board overall.
 * For example, the lowest y-value of the first column of a standard catan hex board begins is 0, whereas
 * the lowest y-value of the last column would be -2.
 */

function generateYShift(width, xcoord){
	if(xcoord>=0){
		return 0-Math.floor(width/2);
	}
	else{
		return 0-Math.floor(width/2)-xcoord;
	}
}

/* doesNotContainVertexAtCoordinates
 * Takes a list of vertices and a vector and checks that none of the vertices are at the vector's coordinates
 */

function doesNotContainVertexAtCoordinates(vertexList, coordinate){
	for(var count = 0; count<vertexList.length;count++){
		if(vectorEquals(coordinate,vertexList[count].coordinate)){
			return false;
		}
	}
	return true;
}

/* getVertexNeighbors
 * Given a list of vertices and a vector coordinates, returns all members of the vertexList that neighbor the given coordinates
 */

function getVertexNeighbors(coordinate,vertexList) {
        return vertexNeighbors(coordinate)
                .map(function(v) {return findVertex(vertexList,v)})
                .filter(function(v) {return v != undefined})
                .map(function(v) {return v.coordinate})
}


/* doesNotContainRoad
 * Takes a list of roads and a single road, and ensures that none of the roads in the road list have the same coordinates as the given road
 */

function doesNotContainRoad(roadList, road){
    for(var count = 0; count<roadList.length;count++){
        if(compareRoadPositions(road,roadList[count])){
            return false;
        }
    }
    return true;
}

/* compareRoadPositions
 * Returns true if the two roads occupy the same position.
 */

function compareRoadPositions(road1, road2){
    return compareTwoCoordPositions(road1.coord1, road1.coord2,road2.coord1,road2.coord2);
}

/* compareTwoCoordPositions
 * Used for comparing the positions of structures, such as roads, that have two discrete coordinates.
 * Returns true if the first two coordinates are identical to the second two
 */

function compareTwoCoordPositions(object1coord1, object1coord2, object2coord1, object2coord2){
    if((vectorEquals(object1coord1,object2coord1)&&vectorEquals(object1coord2,object2coord2))||
        (vectorEquals(object1coord1,object2coord2)&&vectorEquals(object1coord2,object2coord1))){
        return true;
    }
    return false;
}

//TODO: Comment

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
