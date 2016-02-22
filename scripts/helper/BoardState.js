//Global Variables

baseResourceList = ["d", "w", "w", "w", "w", "s", "s", "s", "s", "l", "l", "l", "l",
"o", "o", "o", "b", "b", "b"];
baseTokenList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

/* Vertex Object
 * {settled:integer (0 indicates none, 1 indicates settlement, 2 indicates city),
 * team:integer(0 indicates none, numbered 1 through 4 otherwise)}
 */

function makeVertex(settled, team){
	return {settled:settled, team:team}
}

/* Hex Object
 * {resource:"w" (wheat), "s" (sheep), "o" ore, "b" (brick), "l" (lumber), "d" (desert),
 * num: integer from 2 to 12, 7 indicating robber
 * coordiantes: vector object containing hex's coordinates.}
 */

function makeHexObject(resource, token, coordinates){   //TODO: Naming Conventions?
	return {resource:resource, token:token, coordinates:coordinates}
}

/* buildRegularHexFramework
 * Function builds a dictionary, the keys of which are hex coordinates(contained in arrays -
 * the first value is the x coordinate, the second the y) and the values of which are
 * hex objects. This represents a regular hexagonal board - that is to say, like a normal
 * catan board - with a width at the highest point of width.
 */

function buildRegularHexFramework(width){
	var tileFrame = [];
	resList = shuffle(baseResourceList);
	tokList = shuffle(baseTokenList);
	for(i=0-Math.floor(width/2);i<Math.ceil(width/2);i++){
		yShift = generateYShift(width,i);
		for(j=0;j<width-Math.abs(i);j++){
			res = resList.pop();
			if(res=="d"){
				tok = 7;
			}
			else{
				tok = tokList.pop();
			}
			coords = makeVector(i, j+yShift);
			tileFrame.push(makeHexObject(res,tok,coords));
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
		return 0-Math.floor(width/2)
	}
	else{
		return 0-Math.floor(width/2)-xcoord
	}
}

/* Road Object
 * Roads will be stored in a list
 * {node1:size 2 array of the coordinates of the first node of the road (y-coord first),
 * node2:size 2 array of the coordinates of the second node of the road (y-coord first),
 * team: integer from 1 to 4, according to team}
 */

function makeRoad(vertex1, vertex2, team){
	return {vertex1:node1, vertex2:node2, team:team}
}
