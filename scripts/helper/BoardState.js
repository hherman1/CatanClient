//Global Variables

Resource = {
        Lumber : 0,
        Wool : 1,
        Ore : 2,
        Brick : 3,
        Grain : 4,
        Desert : 5
}

baseResourceList = [Resource.Desert, Resource.Grain, Resource.Grain, Resource.Grain, Resource.Grain, Resource.Wool, Resource.Wool, Resource.Wool, Resource.Wool, Resource.Lumber, Resource.Lumber, Resource.Lumber, Resource.Lumber, Resource.Ore, Resource.Ore, Resource.Ore, Resource.Brick, Resource.Brick, Resource.Brick];
baseTokenList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

/* Vertex Object
 * {settled:integer (0 indicates none, 1 indicates settlement, 2 indicates city),
 * player:integer(0 indicates none, numbered 1 through 4 otherwise)}
 */

Vertex = function(settled, player,coordinate){
	this.settled=settled; 
    this.player=player;
    this.coordinate=coordinate;
}

/* Hex Object
 * {resource:"w" (wheat), "s" (sheep), "o" ore, "b" (brick), "l" (lumber), "d" (desert),
 * num: integer from 2 to 12, 7 indicating robber
 * coordiantes: vector object containing hex's coordinate.}
 */

HexObject = function(resource, token, coordinate){
    this.resource=resource; 
    this.token=token; 
    this.coordinate=coordinate;
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
			tileFrame.push(new HexObject(res,tok,coords));
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
 	var vertexFrame = {};                        //Switch to list - necessary?
 	for(i=0;i<tileFrame.length;i++){
 		coordList = vertices(tileFrame[i].coordinate);
 		for(j=0;j<coordList.length;j++){
 			vertex = coordList[j];
 			vertexFrame[[vertex.x,vertex.y]] = new Vertex(0,0,vertex.x,vertex.y);
 		}
 	}
 	return vertexFrame;
 }

/* Road Object
 * Roads will be stored in a list
 * {coord1:vector object storing x and y coordinate,
 * coord2:vector object storing x and y coordinate,
 * player: integer from 1 to 4, according to player}
 */

Road = new function(coord1, coord2, player){
	this.coord1=coord1;
    this.coord2=coord2; 
    this.player=player;
}

/* compareRoadPositions
 * returns true if the two roads occupy the same position.
 */

function compareRoadPositions(road1, road2){
	if((compareVectors(road1.coord1,road2.coord1)&&compareVectors(road1.coord2,road2.coord2))||
		(compareVectors(road1.coord1,road2.coord2)&&compareVectors(road1.coord2,road2.coord1))){
		return true;
	}
	return false;

}
