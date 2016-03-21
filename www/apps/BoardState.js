//Data Types

Board = function() {
        this.hexes = [];
        this.vertices = [];
        this.roads = [];
}

RegularHexBoard = function(width) {
        Board.call(this);
        this.hexes = buildRegularHexFramework(width);
        this.vertices = buildVertexFramework(this.hexes);
        this.roads = buildRoadFramework(this.vertices);
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
}

Position = {
        Type: {
                Vertex: 0,
                Road: 1,
                Hex: 2
        },
        /* Road Object
         * Roads will be stored in a list
         * {coord1:vector object storing x and y coordinate,
         * coord2:vector object storing x and y coordinate,
         * player: integer from 1 to 4, according to player}
         */

        Road: function(structure, coord1, coord2, playerID){
            this.type = Position.Type.Road;
            this.structure = structure;
            this.coord1=coord1;
            this.coord2=coord2;
            this.playerID=playerID;
        },

        /* Vertex Object
         * {settled:integer (0 indicates none, 1 indicates settlement, 2 indicates city), see Structure
         * player:integer(0 indicates none, numbered 1 through 4 otherwise)}
         */

        Vertex : function(structure, playerID,coordinate){
            this.type = Position.Type.Vertex;
            this.structure=structure;
            this.playerID=playerID;
            this.coordinate=coordinate;
        },

        /* Hex Object
         * {resource:"w" (wheat), "s" (sheep), "o" ore, "b" (brick), "l" (lumber), "d" (desert),
         * num: integer from 2 to 12, 7 indicating robber
         * coordiantes: vector object containing hex's coordinate.}
         */

        Hex : function(resource, token, coordinate){
            this.type = Position.Type.Hex;
            this.resource=resource;
            this.token=token;
            this.coordinate=coordinate;
        },
}


baseResourceList =
    [Resource.Desert, Resource.Grain, Resource.Grain, Resource.Grain,
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
        return newBoard;
}

function cloneRoad(road) {
        return new Position.Road(road.structure,road.coord1,road.coord2,road.playerID);
}

function cloneVertex(vertex){
        return new Position.Vertex(vertex.structure,vertex.playerID,vertex.coordinate);
}

function cloneHex(hex)  {
        return new Position.Hex(hex.resource,hex.token,hex.coordinate);
}


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
 * Function builds a list of hex objects
 * This represents a regular hexagonal board - that is to say, like a normal
 * catan board - with a width at the highest point of width.
 */

function buildRegularHexFramework(width){
	var tileFrame = [];
	resList = baseResourceList.slice();
	tokList = baseTokenList.slice();
	shuffle(resList);
	shuffle(tokList);
	for(i=0-Math.floor(width/2);i<Math.ceil(width/2);i++){
		yShift = generateYShift(width,i);
		for(j=0;j<width-Math.abs(i);j++){
			res = resList.pop();
			if(res==Resource.Desert){
				tok = 7;
			}
			else{
				tok = tokList.pop();
			}
			coords = new Vector(i, j+yShift);
			tileFrame.push(new Position.Hex(res,tok,coords));
		}
	}
	return tileFrame;
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
				vertexFrame.push(new Position.Vertex(Structure.Empty, null, coordList[j]));
			}
		}
	}
	return vertexFrame;
}
function checkForSameVector(vertexList, vector){
	for(count = 0; count<vertexList.length;count++){
		if(compareVectors(vector,vertexList[count].coordinate)){
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
        return vertices.filter(function(v) {return compareVectors(v.coordinate,coordinate)});
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
            var testRoad = new Position.Road(Structure.Empty,vertexFrame[i].coordinate,coordList[j], null);
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
    return undefined;
} //TODO: Scope out above getVertex/getVertices functions, alter syntax accordingly

/* compareRoadPositions
 * returns true if the two roads occupy the same position.
 */

function compareRoadPositions(road1, road2){
    return compareTwoCoordPositions(road1.coord1, road1.coord2,road2.coord1,road2.coord2);
}

function compareTwoCoordPositions(road1coord1, road1coord2, road2coord1, road2coord2){
    if((compareVectors(road1coord1,road2coord1)&&compareVectors(road1coord2,road2coord2))||
        (compareVectors(road1coord1,road2coord2)&&compareVectors(road1coord2,road2coord1))){
        return true;
    }
    return false;
}
