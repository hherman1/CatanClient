//define(['Grid','Constants'],function(Grid,Constants) { 

import * as Grid from "./Grid"
import * as Constants from "./Constants"

////////////////////////////////////////////////////////////////////////
/*                               DATA TYPES                           */
////////////////////////////////////////////////////////////////////////

// var Phase = {
//     Init: 0,
//     Normal: 1
// };
export enum Phase {
    Init,
    Normal
}

export var ClosenessToWerewolf = {
    Vampires: "No",
    Mack: "Pretty Sad",
    Carsten: "Actually a Werewolf",
    Dingo: "require.js"
};


export enum SubPhase {
    Building,
    Trading,
    Robbing
};

export enum Rotation {
        Forwards,
        Backwards,
        None
};

export enum Structure {
        Settlement,
        City,
        Road
};

export enum Resource {
        Lumber,
        Wool,
        Ore,
        Brick,
        Grain,
        Desert
};

export var BASE_RESOURCE_LIST = // The baseline Catan resource list for a standard board - note that this list should have at least 19 elements to work with standard Catan
    [Resource.Desert,  Resource.Grain, Resource.Grain, Resource.Grain,
        Resource.Grain, Resource.Wool, Resource.Wool, Resource.Wool,
        Resource.Wool, Resource.Lumber, Resource.Lumber, Resource.Lumber,
        Resource.Lumber, Resource.Ore, Resource.Ore, Resource.Ore,
        Resource.Brick, Resource.Brick, Resource.Brick]

////////////////////////////////////////////////////////////////////////
/*                             CONSTRUCTORS                           */
////////////////////////////////////////////////////////////////////////

/* Board
 * The baseline board object encapsulates a hex list, a vertex list, and a road list, as well as a robber object (implementation forthcoming)
 */

export interface Board {
    hexes:Position.Hex[],
    vertices:Position.Vertex[],
    roads:Position.Road[],
    robber:Robber // location
}

// var Board = function() {
//     this.hexes = [];
//     this.vertices = [];
//     this.roads = [];
//     this.robber = undefined;
// };

/* RegularHexBoard
 * This subversion of the board object is a standard hexagonal board.
 */

export function makeRegularHexBoard(width:number,resourceList:Resource[],tokenList:number[]):Board {

    let hexes = buildRegularHexFramework(width, resourceList, tokenList);
    let vertices = buildVertexFramework(hexes);
    let roads = buildRoadFramework(vertices);
    var desertIndex = -1;
    for(var i=0;i<hexes.length;i++){
        if(hexes[i].resource == Resource.Desert){
            desertIndex = i;
        }
    }
    let robber = {hex:hexes[desertIndex],moved: false};
    return   {
        hexes:hexes,
        vertices:vertices,
        roads:roads,
        robber:robber
    };;
}

// var RegularHexBoard = function(width, resourceList, tokenList) {
//     Board.call(this);
//     this.hexes = buildRegularHexFramework(width, resourceList, tokenList);
//     this.vertices = buildVertexFramework(this.hexes);
//     this.roads = buildRoadFramework(this.vertices);
//     var desertIndex = undefined;
//     for(var i=0;i<this.hexes.length;i++){
//         if(this.hexes[i].resource == Resource.Desert){
//             desertIndex = i;
//         }
//     }
//     this.robber = new Robber(this.hexes[desertIndex], false);
// };

/* Robber
 * A constructor for the robber object. Takes a hex (positional argument) and a boolean indicating whether the Robber has just moved or not.
 */

export interface Robber {
    hex:Position.Hex
}
// var Robber = function(hex, moved) {
//   this.hex = hex;
//     this.moved = moved;
// }

export namespace Position {
        export type Any = Road | Vertex | Hex;
        export enum Type {
                Vertex,
                Road,
                Hex
        }
        /* Road
         * Roads are stored in a list in the board object
         * structure: set to 1 if a structure (i.e. a road) is present on this road position, 0 otherwise
         * coord1: vector representing the coordinates of the first end of the road
         * coord2: vector representing the coordinates of the second end of the road
         * playerID: number from 1 to 4 indicating owner of the road - set to 0 if the road has not been built on
         */

         export interface Road {
             type:Type.Road,
            structure?:Structure.Road,
            coord1:Grid.Vector,
            coord2:Grid.Vector,
            playerID:number
         }
         export function makeRoad(structure:Structure.Road|undefined,coord1:Grid.Vector,coord2:Grid.Vector,playerID:number):Road {
             return {
                 type:Type.Road,
                 structure:structure,
                 coord1:coord1,
                 coord2:coord2,
                 playerID:playerID
             }
         }
        // Road: function(structure, coord1, coord2, playerID){
        //     this.type = Position.Type.Road;
        //     this.structure = structure;
        //     this.coord1=coord1;
        //     this.coord2=coord2;
        //     this.playerID=playerID;
        // },

        /* Vertex Object
         * Vertices are stored in a list in the board object
         * structure: set to 1 if there is a settlement on this vertex, 2 if there is a city, and 0 otherwise
         * playerID: number from 1 to 4 indicating owner of the vertex - set to 0 if the vertex has not been built on
         * coordinate: vector representing the coordinates of the vector on the vector grid
         */
         export interface Vertex {
             type:Type.Vertex,
            structure?:Structure.Settlement | Structure.City,
            coordinate:Grid.Vector,
            playerID:number
         }
        // Vertex : function(structure, coordinate, playerID){
        //     this.type = Position.Type.Vertex;
        //     this.structure=structure;
        //     this.playerID=playerID;
        //     this.coordinate=coordinate;
        // },

        /* Hex Object
         * Hexes are stored in a list in the board object
         * resource: number from 0 to 5 indicating the resource of the tile (resource correspondences are stored in the Resource data type)
         * token: number from 2 to 12, not including 7, representing the number that must be rolled to yield resources form the tile
         * coordinate: vector representing the coordinates of the hex on the hex grid
         */

         export interface Hex{
             type:Type.Hex,
             resource:Resource,
             token:number,
             coordinate:Grid.Vector
         }
        // Hex : function(resource, token, coordinate){
        //     this.type = Position.Type.Hex;
        //     this.resource=resource;
        //     this.token=token;
        //     this.coordinate=coordinate;
        // }
};

////////////////////////////////////////////////////////////////////////
/*                     BOARD BUILDING FUNCTIONS                       */
////////////////////////////////////////////////////////////////////////

export function getStructureName(structure:Structure):string {
        switch(structure) {
                case Structure.Road:
                        return "Road";
                case Structure.Settlement:
                        return "Settlement";
                case Structure.City:
                        return "City";
        }
};
/*Returns the name of the resource
*/
export function getResourceName(resource:Resource):string {
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

export function getResourceTerrainName(resource:Resource):string {
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

export function buildRegularHexFramework(width:number, resourceList:Resource[], tokenList:number[]){
    var hexList:Position.Hex[] = [];    
    for(var i=0-Math.floor(width/2);i<Math.ceil(width/2);i++){ // Cycles through columns
        var yShift = generateYShift(width,i);
        for(var j=0;j<width-Math.abs(i);j++){ // Cycles through rows
            //At several points here we assume that the various lists have not run out; fails silently otherwise
            if(resourceList.length <= 0 || tokenList.length <= 0) {
                throw "out of resources or tokens"
            }
            var res = <Resource>resourceList.pop(); // Assigns a random resource to the hex
            var tok = undefined;
            if(res==Resource.Desert){  // Sets robber's initial position to desert
                tok = 0;
            }
            else{
                tok = <number>tokenList.pop(); // Assigns a random token to the hex
            }
            var coords:Grid.Vector = {x:i, y:j+yShift}; // Determines coordinates of the hex
            hexList.push({type:Position.Type.Hex,resource:res,token:tok,coordinate:coords}); // Creates and adds the hex
        }
    }
    return hexList;
}

/* buildVertexFramework
 * Given a list of hex objects, creates a list of vertices corresponding to those hexes
 */

export function buildVertexFramework(hexList:Position.Hex[]){
    var vertexFrame:Position.Vertex[] = [];
    for(var i=0;i<hexList.length;i++){
        var coordList = Grid.vertices(hexList[i].coordinate); // Gets the coordinates of the vertices of a hex
        for(var j=0;j<coordList.length;j++){
            var testVector = coordList[j];
            if(doesNotContainVertexAtCoordinates(vertexFrame,testVector)) { // Ensures the vertex hasn't been created yet
                vertexFrame.push({type:Position.Type.Vertex,structure:undefined, coordinate:coordList[j], playerID:0}); // Creates and adds the vertex
            }
        }
    }
    return vertexFrame;
}

/* buildRoadFramework
 * Given a list of vertices, creates a corresponding list of roads.
 */

export function buildRoadFramework(vertexList:Position.Vertex[]){
    var roadList = [];
    for (var i=0;i<vertexList.length;i++){
        var coordList = getVertexNeighbors(vertexList[i].coordinate,vertexList); // Finds vertices neighboring the given vertex
        for (var j=0;j<coordList.length;j++){
            var testRoad:Position.Road = {type:Position.Type.Road,structure:undefined,coord1:vertexList[i].coordinate,coord2:coordList[j], playerID:0};
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

export function requireHex(coords:Grid.Vector, hexList:Position.Hex[]){
    let out = findHex(coords,hexList);
    if(out === undefined)
        throw "Could not find hex"
    else
        return out;
}

export function findHex(coords:Grid.Vector, hexList:Position.Hex[]){
    for(var i = 0; i<hexList.length; i++){
        if(Grid.vectorEquals(hexList[i].coordinate, coords)){
            return hexList[i];
        }
    }
}

export function requireVertex(vertexList:Position.Vertex[],coordinate:Grid.Vector): Position.Vertex {
    let out = findVertex(vertexList,coordinate);
    if(out === undefined) {
        throw "Could not find vertex";
    } else {
        return out;
    }
}
export function findVertex(vertexList:Position.Vertex[],coordinate:Grid.Vector): Position.Vertex | undefined {
    return findVertices(vertexList,coordinate)[0];
}

export function findVertices(vertexList:Position.Vertex[],coordinate:Grid.Vector) {
    return vertexList.filter(function(v) {return Grid.vectorEquals(v.coordinate,coordinate)});
}

export function requireRoad(roadList:Position.Road[], coord1:Grid.Vector, coord2:Grid.Vector):Position.Road {
    for(var i = 0; i<roadList.length;i++){
        if(compareTwoCoordPositions(roadList[i].coord1,roadList[i].coord2, coord1, coord2)){
            return roadList[i];
        }
    }
    throw "Road not found"
}

////////////////////////////////////////////////////////////////////////
/*                         CLONING FUNCTIONS                          */
////////////////////////////////////////////////////////////////////////

// Functions concerned with cloning the various board state objects

export function cloneBoard(board:Board):Board {
    let newBoard:Board;
    let hexes = board.hexes.map(cloneHex);
    let vertices = board.vertices.map(cloneVertex);
    let roads = board.roads.map(cloneRoad);
    let robber = cloneRobber(board.robber);
    return {
        hexes:hexes,
        vertices:vertices,
        roads:roads,
        robber:robber
    };
}

export function cloneRoad(road:Position.Road):Position.Road {
    return {type:Position.Type.Road,structure:road.structure,coord1:road.coord1,coord2:road.coord2,playerID:road.playerID};
}

export function cloneVertex(vertex:Position.Vertex):Position.Vertex{
    return {type:Position.Type.Vertex,structure:vertex.structure,coordinate:vertex.coordinate,playerID:vertex.playerID};
}

export function cloneHex(hex:Position.Hex):Position.Hex  {
    return {type:Position.Type.Hex,resource:hex.resource,token:hex.token,coordinate:hex.coordinate};
}

export function cloneRobber(robber:Robber):Robber {
    return {hex:cloneHex(robber.hex)};
}

////////////////////////////////////////////////////////////////////////
/*                          HELPER FUNCTIONS                          */
////////////////////////////////////////////////////////////////////////

//function to shuffle up the number tokens
//Source: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array:any[]) {
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

export function notEqualPositionCoordinatesFilter(posA:Position.Any) {
        return function(posB:Position.Any) {
                return !equalPositionCoordinates(posA,posB);
        }
}

export function equalPositionCoordinates(positionA:Position.Any,positionB:Position.Any) {
        if(positionA.type != positionB.type) {
                return false;
        }
        switch(positionA.type) {
                case Position.Type.Road:
                        return compareRoadPositions(positionA,<Position.Road>positionB);
                case Position.Type.Vertex:
                        return Grid.vectorEquals(positionA.coordinate,(<Position.Vertex>positionB).coordinate);
        }
}

/* getPrice
 * Given a structure, returns a resource list representing the structure's cost.
 * Resource lists are stored as length 5 arrays, wherein each index represents a specific resource
 */

export function getPrice(structure:Structure) {
        switch(structure) {
                case Structure.Road:
                        return Constants.ROAD_COST;
                case Structure.Settlement:
                        return Constants.SETTLEMENT_COST;
                case Structure.City:
                        return Constants.CITY_COST;
        }
} 
export function getReward(struct:Structure.City | Structure.Settlement) {
    switch(struct) {
        case Structure.City:
            return 2;
        case Structure.Settlement:
            return 1;
    }
}

/* generateYShift
 * Helper function to be used in building a regular Hex Framework. Determines where
 * each y-column should begin, given the x coordinate of the column and the width of the board overall.
 * For example, the lowest y-value of the first column of a standard catan hex board begins is 0, whereas
 * the lowest y-value of the last column would be -2.
 */

export function generateYShift(width:number, xcoord:number){
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

export function doesNotContainVertexAtCoordinates(vertexList:Position.Vertex[], coordinate:Grid.Vector){
	for(var count = 0; count<vertexList.length;count++){
		if(Grid.vectorEquals(coordinate,vertexList[count].coordinate)){
			return false;
		}
	}
	return true;
}

/* getVertexNeighbors
 * Given a list of vertices and a vector coordinates, returns all members of the vertexList that neighbor the given coordinates
 */
export function getVertexNeighbors(coordinate:Grid.Vector,vertexList:Position.Vertex[]) {
        return Grid.vertexNeighbors(coordinate)
                .map(function(v) {return findVertex(vertexList,v)})
                .filter(function(v) {return typeof v !== "undefined"})
                .map(function(v) {return (<Position.Vertex>v).coordinate})
}

/* doesNotContainRoad
 * Takes a list of roads and a single road, and ensures that none of the roads in the road list have the same coordinates as the given road
 */

export function doesNotContainRoad(roadList:Position.Road[], road:Position.Road){
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

export function compareRoadPositions(road1:Position.Road, road2:Position.Road){
    return compareTwoCoordPositions(road1.coord1, road1.coord2,road2.coord1,road2.coord2);
}

/* compareTwoCoordPositions
 * Used for comparing the positions of structures, such as roads, that have two discrete coordinates.
 * Returns true if the first two coordinates are identical to the second two
 */

export function compareTwoCoordPositions(object1coord1:Grid.Vector, object1coord2:Grid.Vector, object2coord1:Grid.Vector, object2coord2:Grid.Vector){
    return  (Grid.vectorEquals(object1coord1,object2coord1) && Grid.vectorEquals(object1coord2,object2coord2))
      || (Grid.vectorEquals(object1coord1,object2coord2) && Grid.vectorEquals(object1coord2,object2coord1));
}

//TODO: Comment
// Returns true for phase switch


export function getInitStructureLimit(rotation:Rotation) {
        switch(rotation) {
                case Rotation.Forwards:
                        return Constants.FIRST_TURN_HOUSES_AND_ROADS;
                case Rotation.Backwards:
                        return Constants.SECOND_TURN_HOUSES_AND_ROADS;
                case Rotation.None:
                        return Constants.FIRST_TURN_HOUSES_AND_ROADS;
                default:
                        return Constants.SECOND_TURN_HOUSES_AND_ROADS;
        }
}

export function cloneResources(resources:number[]) {
        var out = [];
        out[Resource.Lumber] = resources[Resource.Lumber];
        out[Resource.Wool] = resources[Resource.Wool];
        out[Resource.Ore] = resources[Resource.Ore];
        out[Resource.Brick] = resources[Resource.Brick];
        out[Resource.Grain] = resources[Resource.Grain];
        return out;
}


export function getResource(resources:number[],resource:Resource):number {
        return resources[resource];
}

export function addResource(resources:number[], resource:Resource, amount:number){
        resources[resource] += amount;
        return resources;
}

export function addResources(store:number[],adder:number[]) {
        adder.forEach(function(val,resource:Resource) {
                addResource(store,resource,val);
        });
}

export function subtractResources(pos:number[],neg:number[]) {
        neg.forEach(function(val,resource:Resource) {
                addResource(pos,resource,-1 * val);
        });
        return pos;
}
// return {
//         Phase:Phase,
//         ClosenessToWerewolf:ClosenessToWerewolf,
//         SubPhase:SubPhase,
//         Rotation:Rotation,
//         Structure:Structure,
//         Resource:Resource,
//         Board:Board,
//         RegularHexBoard:RegularHexBoard,
//         Robber:Robber,
//         Position:Position,
//         getStructureName:getStructureName,
//         getResourceName:getResourceName,
//         getResourceTerrainName:getResourceTerrainName,
//         buildRegularHexFramework:buildRegularHexFramework,
//         buildVertexFramework:buildVertexFramework,
//         buildRoadFramework:buildRoadFramework,
//         doesNotContainVertexAtCoordinates:doesNotContainVertexAtCoordinates,
//         findHex:findHex,
//         findVertex:findVertex,
//         findVertices:findVertices,
//         findRoad:findRoad,
//         cloneBoard:cloneBoard,
//         notEqualPositionCoordinatesFilter:notEqualPositionCoordinatesFilter,
//         equalPositionCoordinates:equalPositionCoordinates,
//         getPrice:getPrice,
//         generateYShift:generateYShift,
//         getVertexNeighbors:getVertexNeighbors,
//         compareRoadPositions:compareRoadPositions,
//         compareTwoCoordPositions:compareTwoCoordPositions,
//         getInitStructureLimit:getInitStructureLimit,
//         cloneResources:cloneResources,
//         getResource:getResource,
//         addResource:addResource,
//         addResources:addResources,
//         subtractResources:subtractResources,
//         BASE_RESOURCE_LIST: BASE_RESOURCE_LIST,
// }
// });
