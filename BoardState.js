//Global Variables

nodeRowSize = [3,4,4,5,5,6,6,5,5,4,4,3];
baseResourceList = ["d", "w", "w", "w", "w", "s", "s", "s", "s", "l", "l", "l", "l",
"o", "o", "o", "b", "b", "b"];
baseValueList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
tileRowSize = [3,4,5,4,3];

/* Node Object
 * {settled:integer (0 indicates none, 1 indicates settlement, 2 indicates city),
 * team:integer(0 indicates none, numbered 1 through 4 otherwise),
 * coords:array(first value is frame y-coord, 2nd is frame x-coord)}
 */

function makeNode(settled, team, coords){
	return {settled:settled, team:team, coords:coords}
}

/* getNeighbors takes in a node on a catan board and returns a list of its 2-3 neighbors.
 * This function will likely be used in checking building legality.
 */

function getNeighbors(node, board){
	neighbor1 = [node.coords[0] - 1, node.coords[1]];
	neighbor2 = [node.coords[0] + 1, node.coords[1]];
	if(node.coords[0]>=6){
		if(node.coords[0]%2==0){
			neighbor3 = [node.coords[0] + 1, node.coords[1] - 1];
		}
		else{
			neighbor3 = [node.coords[0] - 1, node.coords[1] + 1];
		}
	}
	else{
		if(node.coords[0]%2==0){
			neighbor3 = [node.coords[0] + 1, node.coords[1] + 1];
		}
		else{
			neighbor3 = [node.coords[0] - 1, node.coords[1] - 1];
		}
	}
	var neighborList = [];
	if(neighbor1[0]>11 || neighbor1[0]<0 || neighbor1[1]<0 || neighbor1[1]>=nodeRowSize[neighbor1[0]]){
		neighborList.push(neighbor2);
		neighborList.push(neighbor3);
	}
	else if(neighbor2[0]>11 || neighbor2[0]<0 || neighbor2[1]<0 || neighbor2[1]>=nodeRowSize[neighbor2[0]]){
		neighborList.push(neighbor3);
		neighborList.push(neighbor1);
	}
	else if(neighbor3[0]>11 || neighbor3[0]<0 || neighbor3[1]<0 || neighbor3[1]>=nodeRowSize[neighbor3[0]]){
		neighborList.push(neighbor1);
		neighborList.push(neighbor2);
	}
	else{
		neighborList.push(neighbor1);
		neighborList.push(neighbor2);
		neighborList.push(neighbor3);
	}
	return neighborList
}

/* Board Framework
 * Returns a two dimensional array of all the nodes in the catan board.
 * The first array represents the 12 rows of nodes, while each array within this
 * array stores three to six nodes, depending on the size of the row.
 */


function buildNodeFramework(){
	frame = [[],[],[],[],[],[],[],[],[],[],[],[]];
	for(i = 0;i<12;i++){
		for(j=0;j<nodeRowSize[i];j++){
			frame[i].push(makeNode(0,0,[i,j]));
		}
	}
	return frame
}

/* getNode
 * given a pair of coordinates and a board, returns the node on the board.
 */

function getNode(ycoord, xcoord, board){
	node = board[ycoord][xcoord]
	return node
}
	
/* Tile Object
 * {resource:"w" (wheat), "s" (sheep), "o" ore, "b" (brick), "l" (lumber), "d" (desert),
 * num: integer from 2 to 12, excluding 7},
 * nodes: array of the coordinates of 6 bordering nodes, the first representing the one
 * at the peak and cycling clockwise thereafter,
 * coords: array containing coordinates of the hex(ycoord, xcoord), 
 */

function makeTile(resource, num, nodes, ycoord, xcoord){
	return {resource:resource, num:num, nodes:nodes, ycoord:ycoord, xcoord:xcoord}
}

/* calculateBorderNodes(ycoord, xcoord)
 * Returns an array of the coordinates of the six nodes that border
 * a hex tile at a location coords. The first pair of the coordinates refers to the
 * node above the tile, and the list proceeds clockwise thereafter.
 */

function calculateBorderNodes(ycoord, xcoord){
	if(ycoord<3){
		node0 = [ycoord*2,xcoord];
		node1 = [ycoord*2+1,xcoord+1];
		node2 = [ycoord*2+2,xcoord+1];
		node3 = [ycoord*2+3,xcoord+1];
		node4 = [ycoord*2+2,xcoord];
		node5 = [ycoord*2+1,xcoord];
	}
	else{
		node0 = [ycoord*2,xcoord+1];
		node1 = [ycoord*2+1,xcoord+1];
		node2 = [ycoord*2+2,xcoord+1];
		node3 = [ycoord*2+3,xcoord];
		node4 = [ycoord*2+2,xcoord];
		node5 = [ycoord*2+1,xcoord];
	}
	return [node0, node1, node2, node3, node4, node5]
}

/* Tile Framework
 * Returns a two dimensional array of all the tiles on the Catan Board.
 * The first array represents the 5 rows of nodes, while the arrays within the first
 * array contains the tiles for each row.
 */

function buildTileFramework(){
	frame = [[],[],[],[],[]];
	for(i = 0;i<5;i++){
		for(j=0;j<tileRowSize[i];j++){
			res = baseResourceList.pop();
			if(res == "d"){
				num = 0;
			}
			else{
				num = baseValueList.pop();
			}
			nodeList = calculateBorderNodes([i,j]);
			newTile = makeTile(res,num,nodeList, i,j);
			frame[i].push(newTile);
		}
	}
	return frame;
}

/* Road Object
 * Roads will be stored in a list
 * {node1:size 2 array of the coordinates of the first node of the road (y-coord first),
 * node2:size 2 array of the coordinates of the second node of the road (y-coord first),
 * team: integer from 1 to 4, according to team}
 */

function makeRoad(node1, node2, team){
	return {node1:node1, node2:node2, team:team}
}