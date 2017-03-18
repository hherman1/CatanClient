/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//define(['Grid','Constants'],function(Grid,Constants) { 

Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
var Constants = __webpack_require__(4);
////////////////////////////////////////////////////////////////////////
/*                               DATA TYPES                           */
////////////////////////////////////////////////////////////////////////
// var Phase = {
//     Init: 0,
//     Normal: 1
// };
var Phase;
(function (Phase) {
    Phase[Phase["Init"] = 0] = "Init";
    Phase[Phase["Normal"] = 1] = "Normal";
})(Phase = exports.Phase || (exports.Phase = {}));
exports.ClosenessToWerewolf = {
    Vampires: "No",
    Mack: "Pretty Sad",
    Carsten: "Actually a Werewolf",
    Dingo: "require.js"
};
var SubPhase;
(function (SubPhase) {
    SubPhase[SubPhase["Building"] = 0] = "Building";
    SubPhase[SubPhase["Trading"] = 1] = "Trading";
    SubPhase[SubPhase["Robbing"] = 2] = "Robbing";
})(SubPhase = exports.SubPhase || (exports.SubPhase = {}));
;
var Rotation;
(function (Rotation) {
    Rotation[Rotation["Forwards"] = 0] = "Forwards";
    Rotation[Rotation["Backwards"] = 1] = "Backwards";
    Rotation[Rotation["None"] = 2] = "None";
})(Rotation = exports.Rotation || (exports.Rotation = {}));
;
var Structure;
(function (Structure) {
    Structure[Structure["Settlement"] = 0] = "Settlement";
    Structure[Structure["City"] = 1] = "City";
    Structure[Structure["Road"] = 2] = "Road";
})(Structure = exports.Structure || (exports.Structure = {}));
;
var Resource;
(function (Resource) {
    Resource[Resource["Lumber"] = 0] = "Lumber";
    Resource[Resource["Wool"] = 1] = "Wool";
    Resource[Resource["Ore"] = 2] = "Ore";
    Resource[Resource["Brick"] = 3] = "Brick";
    Resource[Resource["Grain"] = 4] = "Grain";
    Resource[Resource["Desert"] = 5] = "Desert";
})(Resource = exports.Resource || (exports.Resource = {}));
;
exports.BASE_RESOURCE_LIST = [Resource.Desert, Resource.Grain, Resource.Grain, Resource.Grain,
    Resource.Grain, Resource.Wool, Resource.Wool, Resource.Wool,
    Resource.Wool, Resource.Lumber, Resource.Lumber, Resource.Lumber,
    Resource.Lumber, Resource.Ore, Resource.Ore, Resource.Ore,
    Resource.Brick, Resource.Brick, Resource.Brick];
// var Board = function() {
//     this.hexes = [];
//     this.vertices = [];
//     this.roads = [];
//     this.robber = undefined;
// };
/* RegularHexBoard
 * This subversion of the board object is a standard hexagonal board.
 */
function makeRegularHexBoard(width, resourceList, tokenList) {
    var hexes = buildRegularHexFramework(width, resourceList, tokenList);
    var vertices = buildVertexFramework(hexes);
    var roads = buildRoadFramework(vertices);
    var desertIndex = -1;
    for (var i = 0; i < hexes.length; i++) {
        if (hexes[i].resource == Resource.Desert) {
            desertIndex = i;
        }
    }
    var robber = { hex: hexes[desertIndex], moved: false };
    return {
        hexes: hexes,
        vertices: vertices,
        roads: roads,
        robber: robber
    };
    ;
}
exports.makeRegularHexBoard = makeRegularHexBoard;
// var Robber = function(hex, moved) {
//   this.hex = hex;
//     this.moved = moved;
// }
var Position;
(function (Position) {
    var Type;
    (function (Type) {
        Type[Type["Vertex"] = 0] = "Vertex";
        Type[Type["Road"] = 1] = "Road";
        Type[Type["Hex"] = 2] = "Hex";
    })(Type = Position.Type || (Position.Type = {}));
    function makeRoad(structure, coord1, coord2, playerID) {
        return {
            type: Type.Road,
            structure: structure,
            coord1: coord1,
            coord2: coord2,
            playerID: playerID
        };
    }
    Position.makeRoad = makeRoad;
    // Hex : function(resource, token, coordinate){
    //     this.type = Position.Type.Hex;
    //     this.resource=resource;
    //     this.token=token;
    //     this.coordinate=coordinate;
    // }
})(Position = exports.Position || (exports.Position = {}));
;
////////////////////////////////////////////////////////////////////////
/*                     BOARD BUILDING FUNCTIONS                       */
////////////////////////////////////////////////////////////////////////
function getStructureName(structure) {
    switch (structure) {
        case Structure.Road:
            return "Road";
        case Structure.Settlement:
            return "Settlement";
        case Structure.City:
            return "City";
    }
}
exports.getStructureName = getStructureName;
;
/*Returns the name of the resource
*/
function getResourceName(resource) {
    switch (resource) {
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
exports.getResourceName = getResourceName;
function getResourceTerrainName(resource) {
    switch (resource) {
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
exports.getResourceTerrainName = getResourceTerrainName;
// Functions concerned with creating the board objects
/* buildRegularHexFramework
 * Builds a list of hex objects representing a hexagonal board of width 'width' in the middle (e.g. a standard 4-player catan board
 * would have a width of 5)
 * The tokens and resources of the hexes are randomly generated from the provided resource and token lists.
 */
function buildRegularHexFramework(width, resourceList, tokenList) {
    var hexList = [];
    for (var i = 0 - Math.floor(width / 2); i < Math.ceil(width / 2); i++) {
        var yShift = generateYShift(width, i);
        for (var j = 0; j < width - Math.abs(i); j++) {
            //At several points here we assume that the various lists have not run out; fails silently otherwise
            if (resourceList.length <= 0 || tokenList.length <= 0) {
                throw "out of resources or tokens";
            }
            var res = resourceList.pop(); // Assigns a random resource to the hex
            var tok = undefined;
            if (res == Resource.Desert) {
                tok = 0;
            }
            else {
                tok = tokenList.pop(); // Assigns a random token to the hex
            }
            var coords = { x: i, y: j + yShift }; // Determines coordinates of the hex
            hexList.push({ type: Position.Type.Hex, resource: res, token: tok, coordinate: coords }); // Creates and adds the hex
        }
    }
    return hexList;
}
exports.buildRegularHexFramework = buildRegularHexFramework;
/* buildVertexFramework
 * Given a list of hex objects, creates a list of vertices corresponding to those hexes
 */
function buildVertexFramework(hexList) {
    var vertexFrame = [];
    for (var i = 0; i < hexList.length; i++) {
        var coordList = Grid.vertices(hexList[i].coordinate); // Gets the coordinates of the vertices of a hex
        for (var j = 0; j < coordList.length; j++) {
            var testVector = coordList[j];
            if (doesNotContainVertexAtCoordinates(vertexFrame, testVector)) {
                vertexFrame.push({ type: Position.Type.Vertex, structure: undefined, coordinate: coordList[j], playerID: 0 }); // Creates and adds the vertex
            }
        }
    }
    return vertexFrame;
}
exports.buildVertexFramework = buildVertexFramework;
/* buildRoadFramework
 * Given a list of vertices, creates a corresponding list of roads.
 */
function buildRoadFramework(vertexList) {
    var roadList = [];
    for (var i = 0; i < vertexList.length; i++) {
        var coordList = getVertexNeighbors(vertexList[i].coordinate, vertexList); // Finds vertices neighboring the given vertex
        for (var j = 0; j < coordList.length; j++) {
            var testRoad = { type: Position.Type.Road, structure: undefined, coord1: vertexList[i].coordinate, coord2: coordList[j], playerID: 0 };
            if (doesNotContainRoad(roadList, testRoad)) {
                roadList.push(testRoad); // Creates and adds the road
            }
        }
    }
    return roadList;
}
exports.buildRoadFramework = buildRoadFramework;
////////////////////////////////////////////////////////////////////////
/*                         FINDER FUNCTIONS                           */
////////////////////////////////////////////////////////////////////////
// Functions concerned with finding structures in a list according to coordinates
function requireHex(coords, hexList) {
    var out = findHex(coords, hexList);
    if (out === undefined)
        throw "Could not find hex";
    else
        return out;
}
exports.requireHex = requireHex;
function findHex(coords, hexList) {
    for (var i = 0; i < hexList.length; i++) {
        if (Grid.vectorEquals(hexList[i].coordinate, coords)) {
            return hexList[i];
        }
    }
}
exports.findHex = findHex;
function requireVertex(vertexList, coordinate) {
    var out = findVertex(vertexList, coordinate);
    if (out === undefined) {
        throw "Could not find vertex";
    }
    else {
        return out;
    }
}
exports.requireVertex = requireVertex;
function findVertex(vertexList, coordinate) {
    return findVertices(vertexList, coordinate)[0];
}
exports.findVertex = findVertex;
function findVertices(vertexList, coordinate) {
    return vertexList.filter(function (v) { return Grid.vectorEquals(v.coordinate, coordinate); });
}
exports.findVertices = findVertices;
function requireRoad(roadList, coord1, coord2) {
    for (var i = 0; i < roadList.length; i++) {
        if (compareTwoCoordPositions(roadList[i].coord1, roadList[i].coord2, coord1, coord2)) {
            return roadList[i];
        }
    }
    throw "Road not found";
}
exports.requireRoad = requireRoad;
////////////////////////////////////////////////////////////////////////
/*                         CLONING FUNCTIONS                          */
////////////////////////////////////////////////////////////////////////
// Functions concerned with cloning the various board state objects
function cloneBoard(board) {
    var newBoard;
    var hexes = board.hexes.map(cloneHex);
    var vertices = board.vertices.map(cloneVertex);
    var roads = board.roads.map(cloneRoad);
    var robber = cloneRobber(board.robber);
    return {
        hexes: hexes,
        vertices: vertices,
        roads: roads,
        robber: robber
    };
}
exports.cloneBoard = cloneBoard;
function cloneRoad(road) {
    return { type: Position.Type.Road, structure: road.structure, coord1: road.coord1, coord2: road.coord2, playerID: road.playerID };
}
exports.cloneRoad = cloneRoad;
function cloneVertex(vertex) {
    return { type: Position.Type.Vertex, structure: vertex.structure, coordinate: vertex.coordinate, playerID: vertex.playerID };
}
exports.cloneVertex = cloneVertex;
function cloneHex(hex) {
    return { type: Position.Type.Hex, resource: hex.resource, token: hex.token, coordinate: hex.coordinate };
}
exports.cloneHex = cloneHex;
function cloneRobber(robber) {
    return { hex: cloneHex(robber.hex) };
}
exports.cloneRobber = cloneRobber;
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
exports.shuffle = shuffle;
function notEqualPositionCoordinatesFilter(posA) {
    return function (posB) {
        return !equalPositionCoordinates(posA, posB);
    };
}
exports.notEqualPositionCoordinatesFilter = notEqualPositionCoordinatesFilter;
function equalPositionCoordinates(positionA, positionB) {
    if (positionA.type != positionB.type) {
        return false;
    }
    switch (positionA.type) {
        case Position.Type.Road:
            return compareRoadPositions(positionA, positionB);
        case Position.Type.Vertex:
            return Grid.vectorEquals(positionA.coordinate, positionB.coordinate);
    }
}
exports.equalPositionCoordinates = equalPositionCoordinates;
/* getPrice
 * Given a structure, returns a resource list representing the structure's cost.
 * Resource lists are stored as length 5 arrays, wherein each index represents a specific resource
 */
function getPrice(structure) {
    switch (structure) {
        case Structure.Road:
            return Constants.ROAD_COST;
        case Structure.Settlement:
            return Constants.SETTLEMENT_COST;
        case Structure.City:
            return Constants.CITY_COST;
    }
}
exports.getPrice = getPrice;
function getReward(struct) {
    switch (struct) {
        case Structure.City:
            return 2;
        case Structure.Settlement:
            return 1;
    }
}
exports.getReward = getReward;
/* generateYShift
 * Helper function to be used in building a regular Hex Framework. Determines where
 * each y-column should begin, given the x coordinate of the column and the width of the board overall.
 * For example, the lowest y-value of the first column of a standard catan hex board begins is 0, whereas
 * the lowest y-value of the last column would be -2.
 */
function generateYShift(width, xcoord) {
    if (xcoord >= 0) {
        return 0 - Math.floor(width / 2);
    }
    else {
        return 0 - Math.floor(width / 2) - xcoord;
    }
}
exports.generateYShift = generateYShift;
/* doesNotContainVertexAtCoordinates
 * Takes a list of vertices and a vector and checks that none of the vertices are at the vector's coordinates
 */
function doesNotContainVertexAtCoordinates(vertexList, coordinate) {
    for (var count = 0; count < vertexList.length; count++) {
        if (Grid.vectorEquals(coordinate, vertexList[count].coordinate)) {
            return false;
        }
    }
    return true;
}
exports.doesNotContainVertexAtCoordinates = doesNotContainVertexAtCoordinates;
/* getVertexNeighbors
 * Given a list of vertices and a vector coordinates, returns all members of the vertexList that neighbor the given coordinates
 */
function getVertexNeighbors(coordinate, vertexList) {
    return Grid.vertexNeighbors(coordinate)
        .map(function (v) { return findVertex(vertexList, v); })
        .filter(function (v) { return typeof v !== "undefined"; })
        .map(function (v) { return v.coordinate; });
}
exports.getVertexNeighbors = getVertexNeighbors;
/* doesNotContainRoad
 * Takes a list of roads and a single road, and ensures that none of the roads in the road list have the same coordinates as the given road
 */
function doesNotContainRoad(roadList, road) {
    for (var count = 0; count < roadList.length; count++) {
        if (compareRoadPositions(road, roadList[count])) {
            return false;
        }
    }
    return true;
}
exports.doesNotContainRoad = doesNotContainRoad;
/* compareRoadPositions
 * Returns true if the two roads occupy the same position.
 */
function compareRoadPositions(road1, road2) {
    return compareTwoCoordPositions(road1.coord1, road1.coord2, road2.coord1, road2.coord2);
}
exports.compareRoadPositions = compareRoadPositions;
/* compareTwoCoordPositions
 * Used for comparing the positions of structures, such as roads, that have two discrete coordinates.
 * Returns true if the first two coordinates are identical to the second two
 */
function compareTwoCoordPositions(object1coord1, object1coord2, object2coord1, object2coord2) {
    return (Grid.vectorEquals(object1coord1, object2coord1) && Grid.vectorEquals(object1coord2, object2coord2))
        || (Grid.vectorEquals(object1coord1, object2coord2) && Grid.vectorEquals(object1coord2, object2coord1));
}
exports.compareTwoCoordPositions = compareTwoCoordPositions;
//TODO: Comment
// Returns true for phase switch
function getInitStructureLimit(rotation) {
    switch (rotation) {
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
exports.getInitStructureLimit = getInitStructureLimit;
function cloneResources(resources) {
    var out = [];
    out[Resource.Lumber] = resources[Resource.Lumber];
    out[Resource.Wool] = resources[Resource.Wool];
    out[Resource.Ore] = resources[Resource.Ore];
    out[Resource.Brick] = resources[Resource.Brick];
    out[Resource.Grain] = resources[Resource.Grain];
    return out;
}
exports.cloneResources = cloneResources;
function getResource(resources, resource) {
    return resources[resource];
}
exports.getResource = getResource;
function addResource(resources, resource, amount) {
    resources[resource] += amount;
    return resources;
}
exports.addResource = addResource;
function addResources(store, adder) {
    adder.forEach(function (val, resource) {
        addResource(store, resource, val);
    });
}
exports.addResources = addResources;
function subtractResources(pos, neg) {
    neg.forEach(function (val, resource) {
        addResource(pos, resource, -1 * val);
    });
    return pos;
}
exports.subtractResources = subtractResources;
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* Vector object:
 * {x: int, y: int}
 *
 */

Object.defineProperty(exports, "__esModule", { value: true });
;
exports.unitY = unitVector(Math.PI / 3);
function dotProduct(v1, v2) {
    return sum(piecewiseTimes(v1, v2));
}
exports.dotProduct = dotProduct;
function sum(v) {
    return v.x + v.y;
}
exports.sum = sum;
function ident(v) {
    return { x: v, y: v };
}
exports.ident = ident;
function identX(x) {
    return { x: x, y: 0 };
}
exports.identX = identX;
function identY(y) {
    return { x: 0, y: y };
}
exports.identY = identY;
function setX(x, c) {
    c.x = x;
    return c;
}
exports.setX = setX;
function setY(c, y) {
    c.y = y;
    return c;
}
exports.setY = setY;
function vectorEquals(vector1, vector2) {
    return (vector1.x == vector2.x) && (vector1.y == vector2.y);
}
exports.vectorEquals = vectorEquals;
function add(c1, c2) {
    return { x: c1.x + c2.x,
        y: c1.y + c2.y };
}
exports.add = add;
function subtract(c1, c2) {
    return add(c1, times(-1, c2));
}
exports.subtract = subtract;
function times(s, c) {
    return piecewiseTimes(ident(s), c);
}
exports.times = times;
function piecewiseTimes(c1, c2) {
    return { x: c1.x * c2.x,
        y: c1.y * c2.y };
}
exports.piecewiseTimes = piecewiseTimes;
function center(vector) {
    return times(0.5, vector);
}
exports.center = center;
function norm(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}
exports.norm = norm;
function unitVector(theta) {
    return { x: Math.cos(theta), y: Math.sin(theta) };
}
exports.unitVector = unitVector;
function rotationMatrix(theta) {
    return {
        0: {
            0: Math.cos(theta),
            1: -Math.sin(theta)
        },
        1: {
            0: Math.sin(theta),
            1: Math.cos(theta)
        }
    };
}
exports.rotationMatrix = rotationMatrix;
function multiplyMatrix(mat, vec) {
    return {
        x: mat[0][0] * vec.x + mat[0][1] * vec.y,
        y: mat[1][0] * vec.x + mat[1][1] * vec.y
    };
}
exports.multiplyMatrix = multiplyMatrix;
function even(n) {
    return n % 2 == 0;
}
exports.even = even;
function vertexNeighbors(vertex) {
    if (even(vertex.y)) {
        return [add({ x: 0, y: 1 }, vertex),
            add({ x: -1, y: 1 }, vertex),
            add({ x: 0, y: -1 }, vertex)];
    }
    else {
        return [add({ x: 0, y: 1 }, vertex),
            add({ x: 0, y: -1 }, vertex),
            add({ x: 1, y: -1 }, vertex)];
    }
}
exports.vertexNeighbors = vertexNeighbors;
function vertices(hexCoords) {
    return [piecewiseTimes({ x: 1, y: 2 }, hexCoords),
        add(identY(1), piecewiseTimes({ x: 1, y: 2 }, hexCoords)),
        add(identX(1), piecewiseTimes({ x: 1, y: 2 }, hexCoords)),
        add({ x: 1, y: -1 }, piecewiseTimes({ x: 1, y: 2 }, hexCoords)),
        add({ x: 1, y: -2 }, piecewiseTimes({ x: 1, y: 2 }, hexCoords)),
        add(identY(-1), piecewiseTimes({ x: 1, y: 2 }, hexCoords))];
}
exports.vertices = vertices;
function adjacentHexes(vertCoords) {
    var hexCoords = [];
    if (vertCoords.y % 2 == 0) {
        hexCoords.push({ x: vertCoords.x, y: vertCoords.y / 2 });
        hexCoords.push({ x: vertCoords.x - 1, y: vertCoords.y / 2 });
        hexCoords.push({ x: vertCoords.x - 1, y: vertCoords.y / 2 + 1 });
    }
    else {
        hexCoords.push({ x: vertCoords.x, y: Math.floor(vertCoords.y / 2) });
        hexCoords.push({ x: vertCoords.x, y: (vertCoords.y + 1) / 2 });
        hexCoords.push({ x: vertCoords.x - 1, y: (vertCoords.y + 1) / 2 });
    }
    return hexCoords;
}
exports.adjacentHexes = adjacentHexes;
function neighbours(hexcoords) {
    return [add({ x: 0, y: 1 }, hexcoords),
        add({ x: 1, y: 0 }, hexcoords),
        add({ x: 1, y: -1 }, hexcoords),
        add({ x: 0, y: -1 }, hexcoords),
        add({ x: -1, y: 0 }, hexcoords),
        add({ x: -1, y: 1 }, hexcoords)];
}
exports.neighbours = neighbours;
function hexPoints(coords, radius) {
    var out = [];
    out.push(add(identX(-radius), coords));
    out.push(add(times(-radius, exports.unitY), coords));
    out.push(add(piecewiseTimes({ x: radius, y: -radius }, exports.unitY), coords));
    out.push(add(identX(radius), coords));
    out.push(add(times(radius, exports.unitY), coords));
    out.push(add(piecewiseTimes({ x: -radius, y: radius }, exports.unitY), coords));
    return out;
}
exports.hexPoints = hexPoints;
function hexToWorld(hexcoords, side) {
    return piecewiseTimes({ x: Math.cos(Math.PI / 6) * side * 2, y: 2 * -side * Math.sin(Math.PI / 3) }, fromHex(hexcoords));
}
exports.hexToWorld = hexToWorld;
function vertexToWorld(vcoords, side) {
    return add({ x: -side * Math.sin(Math.PI / 3), y: -side / 2 }, piecewiseTimes({ x: side, y: -side }, fromVertex(vcoords)));
}
exports.vertexToWorld = vertexToWorld;
function fromVertex(vcoords) {
    var yunits = times(Math.ceil(vcoords.y / 2), { x: Math.cos(Math.PI / 6), y: Math.sin(Math.PI / 6) });
    var regunits = 2 * Math.floor(vcoords.y / 2) * Math.sin(Math.PI / 6);
    var xdelta = 2 * vcoords.x * Math.cos(Math.PI / 6);
    return add({ x: xdelta, y: regunits }, yunits);
}
exports.fromVertex = fromVertex;
function fromHex(hexcoords) {
    return add(identX(hexcoords.x), times(hexcoords.y, exports.unitY));
}
exports.fromHex = fromHex;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BoardState = __webpack_require__(0);
//Players are assigned an ID number from 1-4. Vertices with no constructions are assigned to
//team 0. The ID is used for the purposes of identification
//and automatic color selection. All other values are initialized to zero.
var Colors;
(function (Colors) {
    Colors[Colors["Red"] = 0] = "Red";
    Colors[Colors["Orange"] = 1] = "Orange";
    Colors[Colors["Blue"] = 2] = "Blue";
    Colors[Colors["Green"] = 3] = "Green";
    Colors[Colors["White"] = 4] = "White";
})(Colors = exports.Colors || (exports.Colors = {}));
exports.PlayerColors = [Colors.Blue, Colors.Green, Colors.Red, Colors.Orange, Colors.White]; //Player Colors will be consistently assigned
function getColor(colorNum) {
    switch (colorNum) {
        case Colors.Blue:
            return "rgb(0,147,208)";
        case Colors.Green:
            return 'rgb(98,161,25)';
        case Colors.Red:
            return 'rgb(186, 36, 65)';
        case Colors.Orange:
            return 'rgb(255, 127, 42)';
        case Colors.White:
            return 'rgb(255,255,255)';
    }
}
exports.getColor = getColor;
function getHighlight(colorNum) {
    switch (colorNum) {
        case Colors.Blue:
            return "rgba(85, 153, 255,0.5)";
        case Colors.Green:
            return 'rgba(255, 255, 255,0.5)';
        case Colors.Red:
            return 'rgba(255, 0, 0,0.5)';
        case Colors.Orange:
            return 'rgba(255, 127, 42,0.5)';
    }
}
exports.getHighlight = getHighlight;
var Player = (function () {
    function Player(id) {
        this.id = id;
        this.settlementCount = 0;
        this.roadCount = 0;
        this.cityCount = 0;
        this.firstSettlementsCoords = [];
        //Player owned resources
        this.resources = [];
        this.resources[BoardState.Resource.Lumber] = 0;
        this.resources[BoardState.Resource.Wool] = 0;
        this.resources[BoardState.Resource.Ore] = 0;
        this.resources[BoardState.Resource.Brick] = 0;
        this.resources[BoardState.Resource.Grain] = 0;
        //Color assigned
        this.color = exports.PlayerColors[id - 1];
        //Player victory points
        this.vicPoints = 0;
        this.hasSeenBuildInstruction = false;
    }
    return Player;
}());
exports.Player = Player;
function clonePlayer(player) {
    var out = new Player(player.id);
    out.resources = BoardState.cloneResources(player.resources);
    out.color = player.color;
    out.vicPoints = player.vicPoints;
    out.settlementCount = player.settlementCount;
    out.roadCount = player.roadCount;
    out.cityCount = player.cityCount;
    out.firstSettlementsCoords = player.firstSettlementsCoords;
    return out;
}
exports.clonePlayer = clonePlayer;
function getPlayerColor(id, playerList) {
    return getPlayers(id, playerList)[0].color;
}
exports.getPlayerColor = getPlayerColor;
function getPlayerColors(playerList) {
    var out = [];
    playerList.forEach(function (player) {
        out[player.id] = player.color;
    });
    return out;
}
exports.getPlayerColors = getPlayerColors;
function getPlayers(id, playerList) {
    return playerList.filter(function (player) { return player.id == id; });
}
exports.getPlayers = getPlayers;
function getPlayer(id, playerList) {
    return getPlayers(id, playerList)[0];
}
exports.getPlayer = getPlayer;
function getPlayersResources(player) {
    return player.resources;
}
exports.getPlayersResources = getPlayersResources;
function genPlayers(num) {
    var out = [];
    for (var i = 0; i < num; i++) {
        out.push(new Player(i + 1));
    }
    return out;
}
exports.genPlayers = genPlayers;
function getStoredPlayers() {
    var numPlayers = localStorage.getItem("numPlayers");
    if (numPlayers === null) {
        throw "numPlayers not set";
    }
    return parseInt(numPlayers);
}
exports.getStoredPlayers = getStoredPlayers;
function requirePlayer(id, players) {
    var out = players.filter(function (player) { return player.id == id; })[0];
    if (out === undefined) {
        throw "Not found";
    }
    return out;
}
exports.requirePlayer = requirePlayer;
function getPlayerIDs(players) {
    return players.map(function (player) { return player.id; });
}
exports.getPlayerIDs = getPlayerIDs;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//Concept:
//There are messages and clients. Clients send and receive messages.
// UIViews are Clients which interact with the UI (typically the DOM).
//
//Purpose:
// This is a generalization of the UI pattern we've used so far,
// to make it much easier to manage our UI.
//

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BoardState = __webpack_require__(0);
var Distributor = (function () {
    function Distributor() {
        this.observers = {};
    }
    Distributor.prototype.distribute = function (message, sender) {
        // sender.distributeMessage(message,this.observers[message.type]);
        this.getObservers(message.type).forEach(function (observer) {
            observer.onMessage(message, sender);
        });
    };
    Distributor.prototype.getObservers = function (type) {
        var out = this.observers[type];
        if (out === undefined) {
            this.observers[type] = [];
            return [];
        }
        else {
            return out;
        }
    };
    Distributor.prototype.subscribe = function (type, client) {
        if (this.observers[type] === undefined) {
            this.observers[type] = [];
        }
        return this.observers[type].push(client);
    };
    return Distributor;
}());
exports.Distributor = Distributor;
var Client = (function () {
    function Client() {
    }
    Client.prototype.sendMessage = function (message, destination) {
        destination.onMessage(message, this);
    };
    // distributeMessage(message:O,destinations:Client<O,any>[]) {
    //     destinations.forEach((dest) => this.sendMessage(message,dest));
    // }
    Client.prototype.subscribe = function (dist) {
        var self = this;
        this.types.forEach(function (type) {
            dist.subscribe(type, self); // should be safe in this case.
        });
    };
    return Client;
}());
exports.Client = Client;
var DistributedClient = (function (_super) {
    __extends(DistributedClient, _super);
    function DistributedClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DistributedClient.prototype.distribute = function (message) {
        this.distributor.distribute(message, this);
    };
    return DistributedClient;
}(Client));
exports.DistributedClient = DistributedClient;
var Forwarder = (function (_super) {
    __extends(Forwarder, _super);
    function Forwarder(children) {
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
    }
    Forwarder.prototype.onMessage = function (message, sender) {
        this.children.forEach(function (child) {
            child.onMessage(message, sender);
        });
    };
    return Forwarder;
}(Client));
exports.Forwarder = Forwarder;
// function sendMessage<M extends Message<any>>(message:M,destination:Client<M>) {
//         destination.onMessage(message);
// }
// function respond<M extends Message<any>,R extends Message<M>>(received:R,outgoing:M) {
//         sendMessage<M>(outgoing,received.sender);
// }
var ClientView = (function (_super) {
    __extends(ClientView, _super);
    function ClientView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClientView;
}(Client));
exports.ClientView = ClientView;
var ParentClientView = (function (_super) {
    __extends(ParentClientView, _super);
    function ParentClientView(children) {
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
    }
    ParentClientView.prototype.subscribe = function (dist) {
        _super.prototype.subscribe.call(this, dist);
        this.children.forEach(function (child) {
            child.subscribe(dist);
        });
    };
    return ParentClientView;
}(ClientView));
exports.ParentClientView = ParentClientView;
var ClientViewSendOnly = (function (_super) {
    __extends(ClientViewSendOnly, _super);
    function ClientViewSendOnly() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = [];
        return _this;
    }
    ClientViewSendOnly.prototype.onMessage = function (message) { };
    return ClientViewSendOnly;
}(ClientView));
exports.ClientViewSendOnly = ClientViewSendOnly;
var a = new ClientViewSendOnly();
var b = new ClientViewSendOnly();
var EndTurnView = (function (_super) {
    __extends(EndTurnView, _super);
    function EndTurnView(messageDestination) {
        var _this = _super.call(this) || this;
        _this.messageDestination = messageDestination;
        _this.types = ["DisableEndTurnButton", "EnableEndTurnButton"];
        _this.setupButton();
        _this.disable();
        return _this;
    }
    EndTurnView.prototype.disable = function () {
        this.getButton().prop("disabled", true);
    };
    EndTurnView.prototype.enable = function () {
        this.getButton().prop("disabled", false);
    };
    EndTurnView.prototype.getButton = function () {
        return $("#endTurnButton");
    };
    EndTurnView.prototype.setupButton = function () {
        var self = this;
        $("#endTurnButton").on('click', function () {
            self.sendMessage({ type: "EndTurn" }, self.messageDestination);
        });
    };
    EndTurnView.prototype.onMessage = function (message) {
        switch (message.type) {
            case "DisableEndTurnButton":
                this.disable();
                break;
            case "EnableEndTurnButton":
                this.enable();
                break;
        }
    };
    return EndTurnView;
}(ClientView));
exports.EndTurnView = EndTurnView;
// newMessageType("BuildChoice",function(sender,structure) {
//         this.structure = structure;
// });
var BuildChoiceView = (function (_super) {
    __extends(BuildChoiceView, _super);
    function BuildChoiceView(structure, messageDestination) {
        var _this = _super.call(this) || this;
        var self = _this;
        $(".buildChoice[structure=" + BoardState.getStructureName(structure) + "]").click(function () {
            self.sendMessage({ type: "BuildChoice", data: structure }, messageDestination);
        });
        return _this;
    }
    return BuildChoiceView;
}(ClientViewSendOnly));
exports.BuildChoiceView = BuildChoiceView;
var UndoView = (function (_super) {
    __extends(UndoView, _super);
    function UndoView(messageDestination) {
        var _this = _super.call(this) || this;
        _this.messageDestination = messageDestination;
        var self = _this;
        $("#undoButton").on('click', function () {
            self.sendMessage({ type: "Undo" }, messageDestination);
        });
        return _this;
    }
    return UndoView;
}(ClientViewSendOnly));
exports.UndoView = UndoView;
//The following views work with resizing the board
function resizeBoardDOM(width, height) {
    $("#board").attr("width", width);
    $("#board").attr("height", height);
}
exports.resizeBoardDOM = resizeBoardDOM;
function resizeGame() {
    resizeBoardDOM($("#game").width(), $("#game").height());
}
var ResizeView = (function (_super) {
    __extends(ResizeView, _super);
    function ResizeView(messageDestination) {
        var _this = _super.call(this) || this;
        var self = _this;
        $(window).resize(function () {
            resizeGame();
            self.sendMessage({ type: "Resize" }, messageDestination);
        });
        return _this;
    }
    return ResizeView;
}(ClientViewSendOnly));
exports.ResizeView = ResizeView;
//View for when a player wins the game
var WinnerMessageView = (function (_super) {
    __extends(WinnerMessageView, _super);
    function WinnerMessageView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ["WinnerMessage"];
        return _this;
    }
    WinnerMessageView.prototype.onMessage = function (message) {
        localStorage.setItem('winner', message.winner + "");
        window.location.href = "./result.html"; //goes to the results page
    };
    return WinnerMessageView;
}(ClientView));
exports.WinnerMessageView = WinnerMessageView;
//View that contains a timer and phase message. The timer displays the total current game length
//and the phase message indicates what stage of the game the players are in (init = game start,
//building = building, etc)
var TimerMessageView = (function (_super) {
    __extends(TimerMessageView, _super);
    function TimerMessageView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ["PhaseMessage"];
        return _this;
    }
    TimerMessageView.prototype.onMessage = function (message) {
        if (message.phase == BoardState.Phase.Init) {
            $("#phaseMessage").html("GAME START");
            $("#phaseMessageHolder").attr("phase", "init");
        }
        else if (message.subPhase == BoardState.SubPhase.Building) {
            $("#phaseMessage").html("BUILDING");
            $("#phaseMessageHolder").attr("phase", "normal");
        }
        else if (message.subPhase == BoardState.SubPhase.Trading) {
            $("#phaseMessage").html("TRADING");
            $("#phaseMessageHolder").attr("phase", "trading");
        }
        else if (message.subPhase == BoardState.SubPhase.Robbing) {
            $("#phaseMessage").html("ROBBIN'");
            $("#phaseMessageHolder").attr("phase", "robbing");
        }
        else {
            throw ("Err: TimerMessageView not getting a proper phase or subphase");
            //console.log(message.subPhase);
        }
    };
    return TimerMessageView;
}(ClientView));
exports.TimerMessageView = TimerMessageView;
var InstructionsMessageView = (function (_super) {
    __extends(InstructionsMessageView, _super);
    function InstructionsMessageView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ["PhaseMessage", "InitBuilt"];
        return _this;
    }
    InstructionsMessageView.prototype.onMessage = function (message) {
        switch (message.type) {
            case "PhaseMessage":
                if (message.phase == BoardState.Phase.Init) {
                    $("#instructions").html("Place 1 settlement and 1 adjoining road, then click 'End Turn'").show();
                }
                else if (message.subPhase == BoardState.SubPhase.Building) {
                    $("#instructions").html("Use your resources to build roads, houses or cities").show().delay(5000).fadeOut(1000);
                }
                else if (message.subPhase == BoardState.SubPhase.Robbing) {
                    $("#instructions").html("Place the robber on a tile of your choice").show().delay(12000).fadeOut(3000);
                }
                else if (message.subPhase == BoardState.SubPhase.Trading) {
                    $("#instructions").html("").hide();
                }
                break;
            case "InitBuilt":
                $("#instructions").fadeOut(1000);
                break;
        }
    };
    return InstructionsMessageView;
}(Client));
exports.InstructionsMessageView = InstructionsMessageView;
//Used to display instructions that helps to guide the player through the game.
// var InstructionsMessageView = function() {
//     Client.call(this,function(message){
//         switch(message.type) {
//             case Type.PhaseMessage:
//             case Type.InitBuilt:
//                 $("#instructions").fadeOut(1000);
//                 break;
//         }
//     });
// } 


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
////////////////////////////////////////////////////////////////////////
/*                           RUNTIME SETUP                            */
////////////////////////////////////////////////////////////////////////

Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_DEFAULT_SCALE = 50;
exports.GAME_FRAME_RATE = 60;
exports.GAME_SECOND_DURATION = 1000;
exports.GAME_STEP_INTERVAL = exports.GAME_SECOND_DURATION / exports.GAME_FRAME_RATE;
////////////////////////////////////////////////////////////////////////
/*                           VICTORY POINTS                           */
////////////////////////////////////////////////////////////////////////
exports.VPS_REQUIRED_FOR_WIN = 10; // Victory Points a player must have to win the game - default is 10
exports.LONGEST_ROAD_VPS = 2; // Victory Points awarded for the longest road - default is 2
exports.SETTLEMENT_VPS = 1; // Victory Points awarded per settlement - default is 1
exports.CITY_VPS = 2; // Victory Points awarded per city - default is 2
exports.ROAD_VPS = 0; // Victory Points awarded per road - default is 0
////////////////////////////////////////////////////////////////////////
/*                         BOARD GENERATION                           */
////////////////////////////////////////////////////////////////////////
exports.BASE_TOKEN_LIST = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]; // The baseline Catan token list for a standard board - note that this list should have at least 18 values
/* 25 development cards
14 Soldiers/Knights (I'll call them Knights from now on)
5 Victory Points.
2 Road Building Cards.
2 Monopoly Cards.
2 Year of Plenty Cards
*/ // to work with standard Catan - values greater than 12 or less than 2 will not be rolled
//export let BASE_DEVELOPMENT_CARDS_LIST = [];
////////////////////////////////////////////////////////////////////////
/*                         STRUCTURE PRICES                           */
////////////////////////////////////////////////////////////////////////
/* Resource costs are stored as five element arrays - each index of the array represents a different resource;
 * and the number at that index represents the number of that resource.
 * ________________
 * Resource | Index
 * Lumber   | 0
 * Wool     | 1
 * Ore      | 2
 * Brick    | 3
 * Grain    | 4
 * ________________
 *
 * For example, [0,0,3,0,2] would correspond to 3 Ore, 2 Grain - the default price of a city
 */
exports.ROAD_COST = [1, 0, 0, 1, 0]; // Cost of a road - default is [1,0,0,1,0] (1 Lumber, 1 Brick)
exports.SETTLEMENT_COST = [1, 1, 0, 1, 1]; // Cost of a settlement - default is [1,1,0,1,1] (1 Lumber, 1 Wool, 1 Brick, 1 Grain)
exports.CITY_COST = [0, 0, 3, 0, 2]; // Cost of a city - default is [0,0,3,0,2] (3 Ore, 2 Grain)
////////////////////////////////////////////////////////////////////////
/*                      INIT BUILD REQUIREMENTS                       */
////////////////////////////////////////////////////////////////////////
exports.FIRST_TURN_HOUSES_AND_ROADS = 1;
exports.SECOND_TURN_HOUSES_AND_ROADS = 2;
////////////////////////////////////////////////////////////////////////
/*                         DICE VIEW CONSTANTS                        */
////////////////////////////////////////////////////////////////////////
exports.DICE_ROLL_DURATION = 5000;
exports.DICE_ROLL_STEPS = 100;
exports.DICE_ROLL_MAX = 6;
exports.DICE_ROLL_MIN = 1;
////////////////////////////////////////////////////////////////////////
/*                            BANK CONSTANTS                          */
////////////////////////////////////////////////////////////////////////
exports.BANKABLE_RESOURCE_COUNT = 4;
////////////////////////////////////////////////////////////////////////
/*                           MOUSE CONSTANTS                          */
////////////////////////////////////////////////////////////////////////
exports.MAX_CLICK_MOVEMENT = 4;
exports.MAX_TAP_MOVEMENT = 7;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// define(['Constants','Grid','BoardState','Player']
//       ,function(Constants,Grid,BoardState,Player) {
var Constants = __webpack_require__(4);
var Grid = __webpack_require__(1);
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
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
function checkRoadLegality(vertexList, coords1, coords2, player, roadList) {
    if (BoardState.requireRoad(roadList, coords1, coords2).structure !== undefined) {
        return false; // Ensures no road already exists at those coordinates
    }
    var vertex1 = BoardState.requireVertex(vertexList, coords1);
    var vertex2 = BoardState.requireVertex(vertexList, coords2);
    if (vertex1.playerID == player.id || vertex2.playerID == player.id) {
        return true;
    }
    else {
        return checkAdjacentPlayerRoads(coords1, coords2, player, roadList, vertexList); // Returns true if the player has roads adjacent to either end of the intended road
    }
}
exports.checkRoadLegality = checkRoadLegality;
/* checkSettlementLegality
 * Given the vector of the intended settlement, a player wishing to build the settlement, and a
 * list of vertex objects, checks if a settlement can be built on said vertex by that player.
 */
function checkSettlementLegality(coords, player, vertexList, roadList) {
    var vert = BoardState.requireVertex(vertexList, coords);
    if (!checkAdjacentPlayerRoads(coords, coords, player, roadList, vertexList)) {
        return false;
    }
    if (vert.structure !== undefined) {
        return false;
    }
    var neighborList = getVertexNeighbors(coords, vertexList);
    for (var i = 0; i < neighborList.length; i++) {
        if (neighborList[i].structure !== undefined) {
            return false;
        }
    }
    return true;
}
exports.checkSettlementLegality = checkSettlementLegality;
/* checkCityLegality
 * Given the vector of the intended city and a player wishing to build it,
 * checks if a city can be built.
 */
function checkCityLegality(coords, player, vertexList) {
    var vert = BoardState.findVertices(vertexList, coords)[0];
    if (vert.structure != 1) {
        return false;
    }
    if (vert.playerID != player.id) {
        return false;
    }
    return true;
}
exports.checkCityLegality = checkCityLegality;
////////////////////////////////////////////////////////////////////////
/*                  INITIALIZATION LEGALITY FUNCTIONS                 */
////////////////////////////////////////////////////////////////////////
/* checkInitSettlementLegality
 * Given a vector and a list of vertex objects, checks if the building of a settlement
 * at those coordinates during the initialization phase is legal
 */
function checkInitSettlementLegality(coords, vertexList) {
    var vert = BoardState.requireVertex(vertexList, coords);
    if (vert.structure !== undefined) {
        return false;
    }
    var neighborList = getVertexNeighbors(coords, vertexList);
    for (var i = 0; i < neighborList.length; i++) {
        if (neighborList[i].structure !== undefined) {
            return false;
        }
    }
    return true;
}
exports.checkInitSettlementLegality = checkInitSettlementLegality;
/* checkInitRoadLegality
 * Given a pair of vectors, a list of vertex objects, a list of road objects, and a player,
 * checks if the building of a settlement at those coordinates during the initialization phase
 * by that player is legal.
 */
function checkInitRoadLegality(coords1, coords2, player, vertexList, roadList) {
    if (BoardState.requireRoad(roadList, coords1, coords2).playerID != 0) {
        return false;
    }
    var vertex1 = BoardState.requireVertex(vertexList, coords1);
    var vertex2 = BoardState.requireVertex(vertexList, coords2);
    return vertex1.playerID == player.id || vertex2.playerID == player.id; // Ensures the road is adjacent to a player settlement
}
exports.checkInitRoadLegality = checkInitRoadLegality;
////////////////////////////////////////////////////////////////////////
/*                   ROBBING LEGALITY FUNCTIONS                       */
////////////////////////////////////////////////////////////////////////
function checkRobbingLegality(robber, coords, hexList) {
    var hex = BoardState.requireHex(coords, hexList);
    if (hex == robber.hex) {
        return false;
    }
    return true;
}
exports.checkRobbingLegality = checkRobbingLegality;
////////////////////////////////////////////////////////////////////////
/*                     VICTORY POINT FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////
/* longestRoad
 * Given a starting vertex, a list of vertices, a list of roads, and a player, recursively finds
 * the longest road stemming from the initial vertex
 */
function longestRoad(vert, vertexList, roadList, player, visitedVertices) {
    visitedVertices.push(vert); // Adds the current vertex to the vertices that have been visited
    var newVertices = [];
    var connectedVertices = getConnectedVertices(vert.coordinate, player, roadList, vertexList);
    for (var i = 0; i < connectedVertices.length; i++) {
        if (BoardState.doesNotContainVertexAtCoordinates(visitedVertices, connectedVertices[i].coordinate)) {
            newVertices.push(connectedVertices[i]);
        }
    }
    if (newVertices.length == 0) {
        return 0;
    }
    var maxSubRoad = 0;
    var maxSubRoad2 = 0;
    for (var j = 0; j < newVertices.length; j++) {
        var testLength = longestRoad(newVertices[j], vertexList, roadList, player, visitedVertices); // Finds the longest road beginning at each of the unvisited vertices
        if (testLength > maxSubRoad) {
            maxSubRoad = testLength;
        }
        else if (testLength > maxSubRoad2) {
            maxSubRoad2 = testLength;
        }
    }
    if (vert == visitedVertices[0] && newVertices.length > 1) {
        return maxSubRoad + maxSubRoad2 + 2;
    }
    return 1 + maxSubRoad; // Returns the longest road
}
exports.longestRoad = longestRoad;
////////////////////////////////////////////////////////////////////////
/*                            HELPER FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////
/* checkHexSettled
 * Given a hex, checks to see if the hex has been settled by players other than the current player.
 */
function checkHexSettled(hex, player, vertexList) {
    var borderVertices = Grid.vertices(hex.coordinate);
    for (var i = 0; i < borderVertices.length; i++) {
        var vert = BoardState.requireVertex(vertexList, borderVertices[i]);
        if (vert.structure && vert.playerID != player.id) {
            return true;
        }
    }
    return false;
}
exports.checkHexSettled = checkHexSettled;
/* getConnectedVertices
 * Given vector coordinates, their owning player, and lists of roads and vertices,
 * returns a list of the adjacent vertices connected to the given coordinates by roads
 * owned by the player.
 */
function getConnectedVertices(coords, player, roadList, vertexList) {
    var connectedVertices = [];
    var neighbors = getVertexNeighbors(coords, vertexList); // Gets the vertices that neighbor the given coordinates
    for (var i = 0; i < neighbors.length; i++) {
        var testRoad = BoardState.requireRoad(roadList, neighbors[i].coordinate, coords);
        if (testRoad.playerID == player.id) {
            connectedVertices.push(neighbors[i]); // Checks which neighboring vertices are connected by player-owned roads
        }
    }
    return connectedVertices;
}
exports.getConnectedVertices = getConnectedVertices;
/* checkAdjacentPlayerRoads
 * Given a pair of vector coordinates and a player,
 * checks if that player has roads adjacent to one of the coordinates.
 * Returns true if so, false otherwise.
 */
function checkAdjacentPlayerRoads(coords1, coords2, player, roadList, vertexList) {
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
exports.checkAdjacentPlayerRoads = checkAdjacentPlayerRoads;
/* getVertexNeighbors
 * Given a vector and a list of vertices, returns a list of its three neighboring vertices.
 */
function getVertexNeighbors(coords, vertexList) {
    var neighbors = [];
    if (coords.y % 2 == 0) {
        neighbors[0] = BoardState.findVertex(vertexList, { x: coords.x, y: coords.y + 1 });
        neighbors[1] = BoardState.findVertex(vertexList, { x: coords.x - 1, y: coords.y + 1 });
        neighbors[2] = BoardState.findVertex(vertexList, { x: coords.x, y: coords.y - 1 });
    }
    else {
        neighbors[0] = BoardState.findVertex(vertexList, { x: coords.x, y: coords.y + 1 });
        neighbors[1] = BoardState.findVertex(vertexList, { x: coords.x + 1, y: coords.y - 1 });
        neighbors[2] = BoardState.findVertex(vertexList, { x: coords.x, y: coords.y - 1 });
    }
    var realNeighbors = [];
    neighbors.forEach(function (neighbor) {
        if (neighbor !== undefined) {
            realNeighbors.push(neighbor);
        }
    });
    return realNeighbors;
}
exports.getVertexNeighbors = getVertexNeighbors;
////////////////////////////////////////////////////////////////////////
/*                          RESOURCE FUNCTIONS                        */
////////////////////////////////////////////////////////////////////////
/* resourceGeneration
 * Given an integer representing a dice roll, the list of players, and both the tile and vertex lists,
 * allocates resources to the appropriate players.
 */
function resourceGeneration(diceRoll, playerList, vertexList, hexList, robber) {
    for (var i = 0; i < hexList.length; i++) {
        if (hexList[i].token == diceRoll && hexList[i] != robber.hex) {
            var tileVerticesCoordinates = Grid.vertices(hexList[i].coordinate);
            var tileVertices = [];
            for (var j = 0; j < tileVerticesCoordinates.length; j++) {
                tileVertices.push(BoardState.requireVertex(vertexList, tileVerticesCoordinates[j])); // Gathers the relevant vertices
            }
            for (var l = 0; l < tileVertices.length; l++) {
                var currNeighbor = tileVertices[l];
                if (currNeighbor.structure !== undefined) {
                    var receivingPlayer = Player.getPlayers(currNeighbor.playerID, playerList)[0]; // Awards the correct resource to a player if they own a neighboring vertex
                    currNeighbor.structure;
                    if (hexList[i].resource != BoardState.Resource.Desert) {
                        currNeighbor.structure;
                        BoardState.addResource(receivingPlayer.resources, hexList[i].resource, BoardState.getReward(currNeighbor.structure));
                    }
                }
            }
        }
    }
}
exports.resourceGeneration = resourceGeneration;
/* initSettlementResources
 * When a settlement is built in the initialization phase,
 * awards one of each neighboring resource to the owning player.
 */
function initSettlementResources(coords, hexList, player) {
    var resourceHexCoords = Grid.adjacentHexes(coords);
    for (var i = 0; i < resourceHexCoords.length; i++) {
        var hex = BoardState.findHex(resourceHexCoords[i], hexList); // For every adjacent hex, provides the player one of that hex's resource
        if (hex !== undefined && hex.resource != BoardState.Resource.Desert) {
            BoardState.addResource(player.resources, hex.resource, 1);
        }
    }
}
exports.initSettlementResources = initSettlementResources;
function checkPlayerWin(player) {
    if (player.vicPoints >= Constants.VPS_REQUIRED_FOR_WIN) {
        console.log("WONN");
        return true;
    }
    return false;
}
exports.checkPlayerWin = checkPlayerWin;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
var Transform = __webpack_require__(7);
//SETTLEMENT
//
//
var images = {
    Loaded: {
        Settlements: [],
        Cities: [],
        Roads: [],
        Resources: [],
        ResourceSymbols: [],
        Robber: undefined,
        LongestRoad: undefined,
    },
    Settlements: [],
    Cities: [],
    Roads: [],
    Resources: [],
    ResourceSymbols: [],
    Robber: "",
    LongestRoad: ""
};
// let images:Images = {
//     Loaded: {
//         Settlements:[]
//     }
// };
images.Robber = '../graphics/swiper.svg';
images.Loaded.Robber = loadImage(images.Robber);
images.LongestRoad = '../graphics/longestroad.svg';
images.Loaded.LongestRoad = loadImage(images.LongestRoad);
images.Settlements[Player.Colors.Red] = '../graphics/reds.svg';
images.Settlements[Player.Colors.Orange] = '../graphics/oranges.svg';
images.Settlements[Player.Colors.Blue] = '../graphics/blues.svg';
images.Settlements[Player.Colors.Green] = '../graphics/whites.svg';
images.Settlements[Player.Colors.White] = '../graphics/buildingcosts.svg';
images.Loaded.Settlements = images.Settlements.map(loadImage);
images.Cities[Player.Colors.Red] = '../graphics/redc.svg';
images.Cities[Player.Colors.Orange] = '../graphics/orangec.svg';
images.Cities[Player.Colors.Blue] = '../graphics/bluec.svg';
images.Cities[Player.Colors.Green] = '../graphics/whitec.svg';
images.Cities[Player.Colors.White] = '../graphics/buildingcostc.svg';
images.Loaded.Cities = images.Cities.map(loadImage);
images.Roads[Player.Colors.Red] = '../graphics/redr.svg';
images.Roads[Player.Colors.Orange] = '../graphics/oranger.svg';
images.Roads[Player.Colors.Blue] = '../graphics/bluer.svg';
images.Roads[Player.Colors.Green] = '../graphics/whiter.svg';
images.Roads[Player.Colors.White] = '../graphics/buildingcostr.svg';
images.Loaded.Roads = images.Roads.map(loadImage);
//'http://upload.wikimedia.org/wikipedia/commons/5/57/Pine_forest_in_Estonia.jpg';
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Lumber] = '../graphics/forest.png';
//'http://s0.geograph.org.uk/geophotos/01/95/58/1955803_c2ba5c1a.jpg';
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Grain] = '../graphics/field.svg';
//'https://upload.wikimedia.org/wikipedia/commons/d/d3/Sheep_pasture_-_geograph.org.uk_-_462124.jpg';
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Wool] = '../graphics/pasture.svg';
//'https://c2.staticflickr.com/4/3891/15098151722_ff47b2b841_b.jpg';
//quarry: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Bethesda-Mine-07367u.jpg';
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Ore] = '../graphics/quarry.png';
//'https://c2.staticflickr.com/6/5325/7097453311_4108c089f3_b.jpg'
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Brick] = '../graphics/hills.svg';
//"https://upload.wikimedia.org/wikipedia/commons/b/bd/Morocco_Africa_Flickr_Rosino_December_2005_84514010.jpg
//labeled for noncommercial reuse
images.Resources[BoardState.Resource.Desert] = '../graphics/desert.svg';
images.Loaded.Resources = images.Resources.map(loadImage);
images.ResourceSymbols[BoardState.Resource.Lumber] = '../graphics/WOODS.svg';
images.ResourceSymbols[BoardState.Resource.Grain] = '../graphics/wheatsymbol.svg';
images.ResourceSymbols[BoardState.Resource.Wool] = '../graphics/WOOL.svg';
images.ResourceSymbols[BoardState.Resource.Ore] = '../graphics/oresymbol.svg';
images.ResourceSymbols[BoardState.Resource.Brick] = '../graphics/bricksymbol.svg';
images.Loaded.ResourceSymbols = images.ResourceSymbols.map(loadImage);
function getGameImages() {
    return images.Loaded;
}
exports.getGameImages = getGameImages;
function getLoadedImages() {
    var out = [];
    if (images.Loaded.LongestRoad && images.Loaded.Robber) {
        out = out.concat(images.Loaded.Cities, images.Loaded.LongestRoad, images.Loaded.Resources, images.Loaded.ResourceSymbols, images.Loaded.Roads, images.Loaded.Robber, images.Loaded.Settlements);
    }
    return out;
}
exports.getLoadedImages = getLoadedImages;
function loadImage(src) {
    var out = new Image();
    out.src = src;
    return out;
}
exports.loadImage = loadImage;
function drawRoad(coordinateA, coordinateB, color, ctx) {
    var worldA = Grid.vertexToWorld(coordinateA, 1); //vertexToWorld(coordinateA,side);
    var worldB = Grid.vertexToWorld(coordinateB, 1); //vertexToWorld(coordinateB,side);
    ctx.beginPath();
    ctx.moveTo(worldA.x, worldA.y);
    ctx.lineTo(worldB.x, worldB.y);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#000000";
    ctx.save();
    Transform.resetTransform(ctx);
    ctx.stroke();
    ctx.restore();
    ctx.lineTo(worldB.x, worldB.y);
    ctx.lineWidth = 5;
    ctx.strokeStyle = Player.getColor(color);
    ctx.save();
    Transform.resetTransform(ctx);
    ctx.stroke();
    ctx.restore();
}
exports.drawRoad = drawRoad;
function drawBuilding(coordinate, structure, color, side, ctx) {
    var worldCoord = Grid.vertexToWorld(coordinate, side);
    ctx.drawImage(getBuildingImg(structure, color), worldCoord.x - side / 2, worldCoord.y - side / 2, side, side * 0.75); //need to adjust width and height of the building rendered...right now its set to w=side and h=side*0.75
}
exports.drawBuilding = drawBuilding;
function drawStructure(structure, color, side, ctx) {
    ctx.drawImage(getBuildingImg(structure, color), -side / 2, -side / 2, side, side * 0.75); //need to adjust width and height of the building rendered...right now its set to w=side and h=side*0.75
}
exports.drawStructure = drawStructure;
/* drawRobber
 * Given coordinates, scale and a context, draws the image of the robber.
 */
function drawRobber(x, y, z, ctx) {
    var robber = getRobberImg();
    if (robber) {
        ctx.drawImage(robber, x - 30, y - (z * 0.75), z * 1.2, z * 1.5);
    }
}
exports.drawRobber = drawRobber;
function getRobberImg() {
    return images.Loaded.Robber;
}
exports.getRobberImg = getRobberImg;
function getBuildingImg(settletype, playerColor) {
    //still needs work...i will have to spend some time resizing these photos somehow
    switch (settletype) {
        case BoardState.Structure.Settlement:
            return images.Loaded.Settlements[playerColor];
        case BoardState.Structure.City:
            return images.Loaded.Cities[playerColor];
        case BoardState.Structure.Road:
            return images.Loaded.Roads[playerColor];
    }
}
exports.getBuildingImg = getBuildingImg;
function getResourceImage(resourceType) {
    return images.Loaded.Resources[resourceType];
}
exports.getResourceImage = getResourceImage;
function getResourceSymbolImages() {
    return images.Loaded.ResourceSymbols;
}
exports.getResourceSymbolImages = getResourceSymbolImages;
function getResourceSymbolImage(resource) {
    return images.Loaded.ResourceSymbols[resource];
}
exports.getResourceSymbolImage = getResourceSymbolImage;
//wood image src: https://static.pexels.com/photos/5766/wood-fireplace-horizontal.jpg
//bricks image src: https://pixabay.com/static/uploads/photo/2013/07/25/12/07/bricks-167072_960_720.jpg
//wool image src: http://s0.geograph.org.uk/geophotos/02/40/15/2401511_d55c4dac.jpg
//grain image src: https://c1.staticflickr.com/5/4038/4525119513_1ec891529b_b.jpg
//ore image src: https://upload.wikimedia.org/wikipedia/commons/5/52/Gold-Quartz-273364.jpg


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
function inverseTransform(v, trans) {
    return Grid.times((1 / trans.scale), Grid.add(Grid.times(-1, trans.translation), v));
}
exports.inverseTransform = inverseTransform;
function transform(v, trans) {
    return Grid.add(trans.translation, Grid.times(trans.scale, v));
}
exports.transform = transform;
function setTransform(transform, ctx) {
    ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.translation.x, transform.translation.y);
}
exports.setTransform = setTransform;
function resetTransform(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
exports.resetTransform = resetTransform;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
var Transform = __webpack_require__(7);
var CanvasMethods = __webpack_require__(9);
var Animation = (function () {
    function Animation() {
    }
    return Animation;
}());
exports.Animation = Animation;
var MultiFrameAnimation = (function (_super) {
    __extends(MultiFrameAnimation, _super);
    function MultiFrameAnimation(totalFrames) {
        var _this = _super.call(this) || this;
        _this.totalFrames = totalFrames;
        _this.frame = 0;
        return _this;
    }
    MultiFrameAnimation.prototype.draw = function (ctx, transform) {
        this.frame++;
        this.drawFrame(ctx, transform, this.frame, this.totalFrames);
    };
    MultiFrameAnimation.prototype.isOver = function () {
        return (this.frame >= this.totalFrames - 1);
    };
    return MultiFrameAnimation;
}(Animation));
exports.MultiFrameAnimation = MultiFrameAnimation;
function makeMultiFrameAnimation(drawFrame, totalFrames) {
    return new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.drawFrame = function (ctx, transform, frame, totalFrames) {
            drawFrame(ctx, transform, frame, totalFrames);
        };
        return class_1;
    }(MultiFrameAnimation))(totalFrames);
}
exports.makeMultiFrameAnimation = makeMultiFrameAnimation;
var MultiPhaseAnimation = (function (_super) {
    __extends(MultiPhaseAnimation, _super);
    function MultiPhaseAnimation(anims) {
        var _this = _super.call(this) || this;
        _this.anims = anims;
        _this.currentAnim = 0;
        return _this;
    }
    Object.defineProperty(MultiPhaseAnimation.prototype, "current", {
        get: function () {
            return this.anims[this.currentAnim];
        },
        enumerable: true,
        configurable: true
    });
    MultiPhaseAnimation.prototype.isOver = function () {
        return this.currentAnim >= this.anims.length;
    };
    MultiPhaseAnimation.prototype.draw = function (ctx, transform) {
        this.current.draw(ctx, transform);
        if (this.current.isOver()) {
            this.currentAnim++;
        }
    };
    return MultiPhaseAnimation;
}(Animation));
exports.MultiPhaseAnimation = MultiPhaseAnimation;
//Draws both animations simultaneously
//Draws background while not isOver
//whole animation isOver when main isOver
var Auxiliary = (function (_super) {
    __extends(Auxiliary, _super);
    function Auxiliary(main, aux) {
        var _this = _super.call(this) || this;
        _this.main = main;
        _this.aux = aux;
        return _this;
    }
    Auxiliary.prototype.isOver = function () {
        return this.main.isOver();
    };
    Auxiliary.prototype.draw = function (ctx, transform) {
        this.main.draw(ctx, transform);
        if (!this.aux.isOver()) {
            this.aux.draw(ctx, transform);
        }
    };
    return Auxiliary;
}(Animation));
exports.Auxiliary = Auxiliary;
var Timing;
(function (Timing) {
    //f(0) = 0, f(1) = 1;
    Timing.linear = function (t) {
        return t;
    };
    //f(0) = 0, f(1) = 1, f'(1) = 0
    Timing.quadratic = function (t) {
        return -Math.pow(t, 2) + 2 * t;
    };
    //A quadratic function which sums to 1 for any discrete sum from k=0 to n
    //t = k/n
    Timing.quadraticFixedDiscreteSum = function (t, n) {
        var c = 6 * n / ((1 + n) * (-1 + 4 * n));
        return c * Timing.quadratic(t);
    };
    //f(0) = 0, f(1) = 1, f'(0) = d
    Timing.quadraticInitialDerivative = function (t, d) {
        return (1 - d) * Math.pow(t, 2) + d * t;
    };
    // A cubic function f with f' = 0 at the start and end of the period t in [0,1]
    Timing.cubic = function (t) {
        return (-2 * Math.pow(t, 3) + 3 * Math.pow(t, 2));
    };
    //A cubic function which sums to 1 for any discrete sum from k=0 to n
    //t = k/n
    Timing.cubicFixedDiscreteSum = function (t, n) {
        return (2 / (1 + n)) * Timing.cubic(t);
    };
    // a quartic f with f' = 0 and f = {0,1,0} at {0,1/2,1} 
    Timing.quartic = function (t) {
        return 16 * (Math.pow(t, 4)) - 32 * Math.pow(t, 3) + 16 * Math.pow(t, 2);
    };
    //see cubicFixedDiscreteSum
    Timing.quarticFixedDiscreteSum = function (t, n) {
        var c = 15 * Math.pow(n, 3) / (8 * (1 + n) * (-1 + n - Math.pow(n, 2) + Math.pow(n, 3)));
        return c * Timing.quartic(t);
    };
})(Timing = exports.Timing || (exports.Timing = {}));
var ClickCircle = (function (_super) {
    __extends(ClickCircle, _super);
    function ClickCircle(coordinate, radius, totalFrames) {
        var _this = _super.call(this, totalFrames) || this;
        _this.coordinate = coordinate;
        _this.radius = radius;
        return _this;
    }
    ClickCircle.prototype.drawFrame = function (ctx, transform, frame, totalFrames) {
        Transform.resetTransform(ctx);
        ctx.beginPath();
        var outerRadius = this.radius * Timing.quadraticInitialDerivative(frame / totalFrames, 0);
        var innerRadius = this.radius * Timing.linear(frame / totalFrames);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.arc(this.coordinate.x, this.coordinate.y, outerRadius, 0, 2 * Math.PI, false);
        ctx.arc(this.coordinate.x, this.coordinate.y, innerRadius, 0, 2 * Math.PI, true);
        ctx.fill();
    };
    return ClickCircle;
}(MultiFrameAnimation));
exports.ClickCircle = ClickCircle;
var XClick = (function (_super) {
    __extends(XClick, _super);
    function XClick(coordinate, radius, frames) {
        var _this = _super.call(this, frames) || this;
        _this.coordinate = coordinate;
        _this.radius = radius;
        var x = new (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_2.prototype.drawFrame = function (ctx, transform, frame, totalFrames) { };
            ;
            return class_2;
        }(MultiFrameAnimation))(1);
        return _this;
    }
    XClick.prototype.innerStyle = function (ctx) {
        ctx.strokeStyle = "rgba(255,0,0,0.8)";
        ctx.lineWidth = 7;
    };
    XClick.prototype.outerStyle = function (ctx) {
    };
    XClick.prototype.drawSegment = function (start, end, ctx) {
        CanvasMethods.linePath(start, end, ctx);
        this.outerStyle(ctx);
        ctx.stroke();
        this.innerStyle(ctx);
        ctx.stroke();
    };
    XClick.prototype.drawFrame = function (ctx, transform, frame, totalFrames) {
        //setTransform(transform,ctx);
        Transform.resetTransform(ctx);
        ctx.beginPath();
        var outerRadius = this.radius * Timing.quadraticInitialDerivative(frame / totalFrames, 4);
        var innerRadius = this.radius * Timing.cubic(frame / totalFrames);
        this.drawSegment(Grid.add(Grid.ident(outerRadius), this.coordinate), Grid.add(Grid.ident(innerRadius), this.coordinate), ctx);
        this.drawSegment(Grid.add(Grid.ident(-outerRadius), this.coordinate), Grid.add(Grid.ident(-innerRadius), this.coordinate), ctx);
        this.drawSegment(Grid.add({ x: -outerRadius, y: outerRadius }, this.coordinate), Grid.add({ x: -innerRadius, y: innerRadius }, this.coordinate), ctx);
        this.drawSegment(Grid.add({ x: outerRadius, y: -outerRadius }, this.coordinate), Grid.add({ x: innerRadius, y: -innerRadius }, this.coordinate), ctx);
        ctx.stroke();
    };
    return XClick;
}(MultiFrameAnimation));
exports.XClick = XClick;
var InfoBox = (function (_super) {
    __extends(InfoBox, _super);
    function InfoBox(coordinate, text, height, width, transitionFrames) {
        var _this = _super.call(this, []) || this;
        _this.coordinate = coordinate;
        _this.text = text;
        _this.height = height;
        _this.width = width;
        _this.transitionFrames = transitionFrames;
        _this.currentHeight = 0;
        _this.padding = 10;
        _this.anims = [makeMultiFrameAnimation(_this.drawResize(height), transitionFrames),
            makeMultiFrameAnimation(_this.drawResize(0), 100),
            makeMultiFrameAnimation(_this.drawResize(-height), transitionFrames)];
        var self = _this;
        return _this;
    }
    InfoBox.prototype.drawBox = function (text, ctx) {
        Transform.resetTransform(ctx);
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.coordinate.x, this.coordinate.y, this.width, this.currentHeight);
        ctx.fillStyle = "rgba(50,50,50,0.99)";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(this.coordinate.x, this.coordinate.y, this.width, this.currentHeight - this.padding);
        ctx.clip();
        ctx.fillStyle = "white";
        ctx.font = "11px sans-serif";
        CanvasMethods.wrapText(ctx, text, this.coordinate.x + this.padding, this.coordinate.y + this.padding, this.width - this.padding, 11);
        ctx.restore();
    };
    InfoBox.prototype.incrementResize = function (target, frame, frames) {
        this.currentHeight += target * Timing.quarticFixedDiscreteSum(frame / frames, frames);
    };
    InfoBox.prototype.drawResize = function (target) {
        var self = this;
        return function (ctx, transform, frame, frames) {
            self.incrementResize(target, frame, frames);
            self.drawBox(self.text, ctx);
        };
    };
    return InfoBox;
}(MultiPhaseAnimation));
exports.InfoBox = InfoBox;
function pruneAnimations(anims) {
    return anims.filter(function (anim) { return !(anim.isOver()); });
}
exports.pruneAnimations = pruneAnimations;
function drawAnims(anims, transform, ctx) {
    anims.forEach(function (anim) { anim.draw(ctx, transform); });
}
exports.drawAnims = drawAnims;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
function drawHexImage(image, ctx) {
    var w = Math.sqrt(Math.pow(1, 2) - Math.pow((1 / 2), 2));
    var x = -1 * w;
    var y = -1;
    var scale = 2;
    ctx.drawImage(image, x, y, scale - 6 / 25, scale);
}
exports.drawHexImage = drawHexImage;
function drawRect(coords, side, ctx) {
    ctx.fillRect(coords.x, coords.y, side, side);
}
exports.drawRect = drawRect;
function drawPath(verts, ctx) {
    ctx.beginPath();
    var start = verts[0];
    ctx.moveTo(start.x, start.y);
    verts.map(function (coord) {
        ctx.lineTo(coord.x, coord.y);
    });
    ctx.closePath();
}
exports.drawPath = drawPath;
function hexPath(side, ctx) {
    var verts = Grid.vertices({ x: 0, y: 0 }).map(function (c) {
        return Grid.vertexToWorld(c, side);
    });
    drawPath(verts, ctx);
}
exports.hexPath = hexPath;
function drawHexPoints(hexCoords, side, ctx) {
    var mappingFunction = function (coord) {
        drawVertex(coord, side, ctx);
    };
    var coordsList = Grid.vertices(hexCoords);
    coordsList.map(mappingFunction);
}
exports.drawHexPoints = drawHexPoints;
function drawVertex(vertexCoords, side, ctx) {
    var coords = Grid.vertexToWorld(vertexCoords, side);
    ctx.fillRect(coords.x, coords.y, 10, 10);
}
exports.drawVertex = drawVertex;
function linePath(start, end, ctx) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
}
exports.linePath = linePath;
// wrapText function from: http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    y += lineHeight;
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}
exports.wrapText = wrapText;
function newScale(delta, scale) {
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    function spec(x) {
        return sigmoid(x) + 0.5;
    }
    var out = scale + sigmoid(scale) / 2 * ((sigmoid(delta / 10) - 0.5) / 4);
    if (out < 0.5) {
        return 0.5;
    }
    else if (out > 1.5) {
        return 1.5;
    }
    else {
        return out;
    }
}
exports.newScale = newScale;
function clearCanvas(ctx) {
    var canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
exports.clearCanvas = clearCanvas;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//define(['Util','BoardState','Player'],function(Util,BoardState,Player){
var Util = __webpack_require__(16);
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
function cloneTradeOffer(offer) {
    return {
        tradeID: offer.tradeID,
        offerResources: BoardState.cloneResources(offer.offerResources),
        offererID: offer.offererID,
        requestResources: BoardState.cloneResources(offer.requestResources),
        targetID: offer.targetID
    };
}
exports.cloneTradeOffer = cloneTradeOffer;
function validateTradeOffer(players, trade) {
    return validateOffer(players, trade.offererID, trade.offerResources);
}
exports.validateTradeOffer = validateTradeOffer;
function filterValidTradeOffers(players, tradeoffers) {
    return tradeoffers.filter(function (trade) {
        return validateTradeOffer(players, trade);
    });
}
exports.filterValidTradeOffers = filterValidTradeOffers;
function validateOffer(players, offererID, offerResources) {
    return Player.getPlayersResources(Player.getPlayer(offererID, players))
        .every(function (val, resource) {
        return val >= offerResources[resource];
    });
}
exports.validateOffer = validateOffer;
function validateAccept(players, targetID, requestResources) {
    return validateOffer(players, targetID, requestResources);
}
exports.validateAccept = validateAccept;
function applyTrade(players, trade) {
    function transaction(playerID, addedResources, subtractedResources) {
        BoardState.subtractResources(Player.getPlayersResources(Player.getPlayer(playerID, players)), subtractedResources);
        BoardState.addResources(Player.getPlayersResources(Player.getPlayer(playerID, players)), addedResources);
    }
    transaction(trade.offererID, trade.requestResources, trade.offerResources);
    transaction(trade.targetID, trade.offerResources, trade.requestResources);
}
exports.applyTrade = applyTrade;
function getIncomingTrades(playerID, trades) {
    return trades.filter(function (trade) { return trade.targetID == playerID; });
}
exports.getIncomingTrades = getIncomingTrades;
function getTrades(tradeID, trades) {
    return trades.filter(function (trade) { return trade.tradeID == tradeID; });
}
exports.getTrades = getTrades;
function filterOutTrades(tradeID, trades) {
    return trades.filter(function (trade) { return trade.tradeID != tradeID; });
}
exports.filterOutTrades = filterOutTrades;
function filterOutIncomingTrades(playerID, trades) {
    return trades.filter(function (trade) {
        return trade.targetID != playerID;
    });
}
exports.filterOutIncomingTrades = filterOutIncomingTrades;
function validateTrade(players, trade) {
    return validateOffer(players, trade.offererID, trade.offerResources)
        && validateAccept(players, trade.targetID, trade.requestResources);
}
exports.validateTrade = validateTrade;
function nextTradeID(trades) {
    if (trades.length > 0) {
        return Util.last(trades).tradeID + 1;
    }
    else {
        return 0;
    }
}
exports.nextTradeID = nextTradeID;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Constants = __webpack_require__(4);
var BoardState = __webpack_require__(0);
var GameMethods = __webpack_require__(5);
function isBuildAction(action) {
    return ["BuildRoad", "BuildSettlement", "BuildCity"].indexOf(action.type) >= 0;
}
exports.isBuildAction = isBuildAction;
function getBuildActionStructure(action) {
    switch (action.type) {
        case "BuildRoad":
            return BoardState.Structure.Road;
        case "BuildSettlement":
            return BoardState.Structure.Settlement;
        case "BuildCity":
            return BoardState.Structure.City;
    }
}
exports.getBuildActionStructure = getBuildActionStructure;
function getPositionObject(action, playerID) {
    switch (action.type) {
        case "BuildRoad":
            return {
                type: BoardState.Position.Type.Road,
                coord1: action.coordinateA,
                coord2: action.coordinateB,
                structure: BoardState.Structure.Road,
                playerID: playerID
            };
        case "BuildSettlement":
            return {
                type: BoardState.Position.Type.Vertex,
                structure: BoardState.Structure.Settlement,
                coordinate: action.coordinate,
                playerID: playerID
            };
        // return new BoardState.Position.Vertex(BoardState.Structure.Settlement,action.coordinate, playerID);
        case "BuildCity":
            return {
                type: BoardState.Position.Type.Vertex,
                structure: BoardState.Structure.City,
                coordinate: action.coordinate,
                playerID: playerID
            };
    }
}
exports.getPositionObject = getPositionObject;
function validateBuildAction(action, gameState) {
    switch (action.type) {
        case "BuildRoad":
            return validateRoad(action.coordinateA, action.coordinateB, gameState);
        case "BuildSettlement":
            return validateSettlement(action.coordinate, gameState);
        case "BuildCity":
            return validateCity(action.coordinate, gameState);
    }
}
exports.validateBuildAction = validateBuildAction;
function validateRoad(coordinateA, coordinateB, gameState) {
    if (gameState.phase == BoardState.Phase.Normal && gameState.subPhase == BoardState.SubPhase.Building)
        return GameMethods.checkRoadLegality(gameState.board.vertices, coordinateA, coordinateB, gameState.currentPlayer, gameState.board.roads)
            && canAfford(BoardState.getPrice(BoardState.Structure.Road), gameState.currentPlayer);
    else if (gameState.phase == BoardState.Phase.Init)
        return (gameState.currentPlayer.roadCount < BoardState.getInitStructureLimit(gameState.rotation)
            && GameMethods.checkInitRoadLegality(coordinateA, coordinateB, gameState.currentPlayer, gameState.board.vertices, gameState.board.roads));
    return false;
}
function validateCity(coordinate, gameState) {
    if (gameState.phase == BoardState.Phase.Normal && gameState.subPhase == BoardState.SubPhase.Building)
        return (GameMethods.checkCityLegality(coordinate, gameState.currentPlayer, gameState.board.vertices))
            && canAfford(BoardState.getPrice(BoardState.Structure.City), gameState.currentPlayer);
    return false;
}
function validateSettlement(coordinate, gameState) {
    if (gameState.phase == BoardState.Phase.Init)
        return (gameState.currentPlayer.settlementCount < BoardState.getInitStructureLimit(gameState.rotation)
            && GameMethods.checkInitSettlementLegality(coordinate, gameState.board.vertices));
    else if (gameState.phase == BoardState.Phase.Normal && gameState.subPhase == BoardState.SubPhase.Building)
        return GameMethods.checkSettlementLegality(coordinate, gameState.currentPlayer, gameState.board.vertices, gameState.board.roads)
            && canAfford(BoardState.getPrice(BoardState.Structure.Settlement), gameState.currentPlayer);
    else
        return false;
}
function buildSettlement(coordinate, gameState) {
    var player = gameState.currentPlayer;
    var settlement = BoardState.requireVertex(gameState.board.vertices, coordinate);
    settlement.structure = BoardState.Structure.Settlement;
    settlement.playerID = gameState.currentPlayer.id;
    player.settlementCount++;
    player.vicPoints += Constants.SETTLEMENT_VPS;
    if (gameState.phase == BoardState.Phase.Init) {
        GameMethods.initSettlementResources(coordinate, gameState.board.hexes, player);
        player.firstSettlementsCoords.push(coordinate);
    }
    else {
        gameState.currentPlayer.resources = BoardState.subtractResources(gameState.currentPlayer.resources, BoardState.getPrice(BoardState.Structure.Settlement));
    }
}
function buildCity(coordinate, gameState) {
    var city = BoardState.requireVertex(gameState.board.vertices, coordinate);
    city.structure = BoardState.Structure.City;
    city.playerID = gameState.currentPlayer.id;
    gameState.currentPlayer.cityCount++;
    gameState.currentPlayer.settlementCount--;
    gameState.currentPlayer.vicPoints -= Constants.SETTLEMENT_VPS;
    gameState.currentPlayer.vicPoints += Constants.CITY_VPS;
    gameState.currentPlayer.resources = BoardState.subtractResources(gameState.currentPlayer.resources, BoardState.getPrice(BoardState.Structure.City));
}
function buildRoad(coordinateA, coordinateB, gameState) {
    var r = BoardState.requireRoad(gameState.board.roads, coordinateA, coordinateB);
    r.structure = BoardState.Structure.Road;
    r.playerID = gameState.currentPlayer.id;
    gameState.currentPlayer.roadCount++;
    gameState.currentPlayer.vicPoints += Constants.ROAD_VPS;
    if (gameState.phase == BoardState.Phase.Normal)
        gameState.currentPlayer.resources = BoardState.subtractResources(gameState.currentPlayer.resources, BoardState.getPrice(BoardState.Structure.Road));
}
function applyBuildAction(action, gameState) {
    switch (action.type) {
        case "BuildRoad":
            buildRoad(action.coordinateA, action.coordinateB, gameState);
            break;
        case "BuildCity":
            buildCity(action.coordinate, gameState);
            break;
        case "BuildSettlement":
            buildSettlement(action.coordinate, gameState);
            break;
    }
    return gameState;
}
exports.applyBuildAction = applyBuildAction;
function canAfford(cost, player) {
    return player.resources.every(function (e, i) {
        return e >= cost[i]; // kind of annoying that i have to do this
    });
}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//MouseView ?
var Grid = __webpack_require__(1);
var Player = __webpack_require__(2);
var BoardState = __webpack_require__(0);
var Hitbox = __webpack_require__(14);
var CanvasMethods = __webpack_require__(9);
var RenderTree = __webpack_require__(29);
var Animation = __webpack_require__(8);
var View = __webpack_require__(3);
function drawHexes(gamestate, scale, ctx) {
    var tree = new RenderTree.ScaleNode(scale);
    tree.addChildren(RenderTree.makeHexNodes(gamestate.board.hexes, gamestate.board.robber));
    RenderTree.drawNode(tree, ctx);
}
exports.drawHexes = drawHexes;
function generateHexCanvas(gamestate, scale) {
    var $canvas = $("<canvas></canvas>");
    $canvas.attr("width", "1000");
    $canvas.attr("height", "1000");
    var ctx = $canvas[0].getContext("2d");
    if (!ctx) {
        throw "could not get rendering context";
    }
    ctx.translate(500, 500);
    drawHexes(gamestate, scale, ctx);
    return $canvas[0];
}
exports.generateHexCanvas = generateHexCanvas;
var CanvasRenderView = (function (_super) {
    __extends(CanvasRenderView, _super);
    function CanvasRenderView(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.types = ["RenderGameCanvas", "AdjustScale", "AdjustTranslation", "SetHitboxes", "RequestHits"];
        _this.hitboxes = [];
        var self = _this;
        self.ctx = ctx;
        _this.transform = {
            translation: Grid.center({ x: ctx.canvas.width, y: ctx.canvas.height }),
            scale: 1
        };
        return _this;
    }
    CanvasRenderView.prototype.onMessage = function (message, sender) {
        switch (message.type) {
            case "RenderGameCanvas":
                redraw(message.gamestate, message.highlight, message.graphics, this.transform, message.side, this.ctx);
                break;
            case "AdjustTranslation":
                this.transform.translation = Grid.add(this.transform.translation, message.translation);
                break;
            case "AdjustScale":
                this.transform.scale = CanvasMethods.newScale(message.adjustment, this.transform.scale);
                break;
            case "SetHitboxes":
                this.hitboxes = message.hitboxes;
                break;
            case "RequestHits":
                var hitlist = Hitbox.transformHitlist(this.hitboxes, this.transform);
                var hits = Hitbox.getHits(hitlist, message.coordinate);
                this.sendMessage({ type: "HitsData", hits: hits }, sender);
                break;
        }
    };
    return CanvasRenderView;
}(View.ClientView));
exports.CanvasRenderView = CanvasRenderView;
function redraw(gamestate, highlight, graphics, transform, side, ctx) {
    var colorMap = Player.getPlayerColors(gamestate.players);
    var currentPlayerColor = colorMap[gamestate.currentPlayer.id];
    var hexes = gamestate.board.hexes;
    var roads = gamestate.board.roads;
    var vertices = gamestate.board.vertices;
    if (highlight !== undefined) {
        switch (highlight.type) {
            case BoardState.Position.Type.Road:
                roads = roads.filter(BoardState.notEqualPositionCoordinatesFilter(highlight))
                    .concat(highlight);
                break;
            case BoardState.Position.Type.Vertex:
                vertices = vertices.filter(BoardState.notEqualPositionCoordinatesFilter(highlight))
                    .concat(highlight);
                break;
        }
    }
    CanvasMethods.clearCanvas(ctx);
    var renderTree = new RenderTree.TransformNode(transform);
    renderTree.addChild(new RenderTree.RadialGradientNode(side * 20, "#77B2EB", "blue"));
    renderTree.addChild(new RenderTree.CenteredImageNode(graphics.renderedHexes));
    var scaled = new RenderTree.ScaleNode(side);
    scaled.addChildren(RenderTree.makeRoadNodes(roads, colorMap));
    scaled.addChildren(RenderTree.makeVertexNodes(vertices, colorMap));
    renderTree.addChild(scaled);
    RenderTree.drawNode(renderTree, ctx);
    graphics.animations = Animation.pruneAnimations(graphics.animations);
    if (graphics.animations.length > 0) {
        Animation.drawAnims(graphics.animations, graphics.transform, ctx);
    }
}
exports.redraw = redraw;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// define(['Util','BoardState','Player','TradeOffer','GameMethods','Constants']
//        ,function(Util,BoardState,Player,TradeOffer,GameMethods,Constants) {
var Util = __webpack_require__(16);
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
var TradeOffer = __webpack_require__(10);
var GameMethods = __webpack_require__(5);
var Constants = __webpack_require__(4);
function genRoll() {
    function rollDice() {
        var roll = Math.floor(Math.random() * 6) + 1;
        return roll;
    }
    return {
        left: rollDice(),
        right: rollDice()
    };
}
exports.genRoll = genRoll;
var GameState = (function () {
    function GameState(board, currentPlayer) {
        this.board = board;
        this.currentPlayer = currentPlayer;
        this.phase = BoardState.Phase.Init;
        this.subPhase = BoardState.SubPhase.Building;
        this.rotation = BoardState.Rotation.Forwards;
        this.players = [];
        this.tradeOffers = [];
        this.longestRoad = 0;
        this.longestRoadPlayer = undefined;
    }
    return GameState;
}());
exports.GameState = GameState;
function cloneGameState(gameState) {
    var out = new GameState(gameState.board, gameState.currentPlayer);
    out.longestRoadPlayer = gameState.longestRoadPlayer;
    out.players = gameState.players.map(Player.clonePlayer);
    out.phase = gameState.phase;
    out.subPhase = gameState.subPhase;
    out.rotation = gameState.rotation;
    out.tradeOffers = gameState.tradeOffers.map(TradeOffer.cloneTradeOffer);
    out.longestRoad = gameState.longestRoad;
    return out;
}
exports.cloneGameState = cloneGameState;
//Takes in game and returns what the index is of the current player in players
function currentPlayerListIndex(gamestate) {
    var out = undefined;
    gamestate.players.every(function (p, i) {
        if (p.id == gamestate.currentPlayer.id) {
            out = i;
            return false;
        }
        return true;
    });
    return out;
}
exports.currentPlayerListIndex = currentPlayerListIndex;
function nextPlayer(gamestate) {
    gamestate.currentPlayer = getNextPlayer(gamestate);
}
exports.nextPlayer = nextPlayer;
function getNextPlayer(gamestate) {
    var currentPlayerIndex = currentPlayerListIndex(gamestate);
    if (typeof currentPlayerIndex === "undefined") {
        throw "invalid state";
    }
    var out;
    switch (gamestate.rotation) {
        case BoardState.Rotation.Forwards:
            //get current player index and then increase it by one and set the global player to this calculated player
            var next = (currentPlayerIndex + 1) % (gamestate.players.length);
            return gamestate.players[next]; //Moves to next player
        case BoardState.Rotation.Backwards:
            var next = Math.max((currentPlayerIndex - 1) % (gamestate.players.length), 0);
            return gamestate.players[next]; //Moves to next player
        case BoardState.Rotation.None:
            return gamestate.players[currentPlayerIndex];
    }
}
exports.getNextPlayer = getNextPlayer;
function updateLongestRoad(gameState) {
    var player = gameState.currentPlayer;
    for (var i = 0; i < player.firstSettlementsCoords.length; i++) {
        var testLength = GameMethods.longestRoad(BoardState.requireVertex(gameState.board.vertices, player.firstSettlementsCoords[i]), gameState.board.vertices, gameState.board.roads, player, []);
        if (testLength > gameState.longestRoad && testLength >= 5) {
            console.log("Longest road changed");
            gameState.longestRoad = testLength;
            if (gameState.longestRoadPlayer != null) {
                gameState.longestRoadPlayer.vicPoints -= Constants.LONGEST_ROAD_VPS;
            }
            gameState.longestRoadPlayer = player;
            gameState.longestRoadPlayer.vicPoints += Constants.LONGEST_ROAD_VPS;
        }
    }
}
exports.updateLongestRoad = updateLongestRoad;
function updateGamePhase(gamestate, unupdatedCurrentPlayerID) {
    if (gamestate.phase == BoardState.Phase.Init) {
        if (gamestate.rotation == BoardState.Rotation.Backwards) {
            if (gamestate.players[0].id == unupdatedCurrentPlayerID) {
                gamestate.rotation = BoardState.Rotation.Forwards;
                gamestate.phase = BoardState.Phase.Normal;
                return true;
            }
        }
        else if (gamestate.rotation == BoardState.Rotation.None) {
            gamestate.rotation = BoardState.Rotation.Backwards;
            return false;
        }
        else if (Util.last(gamestate.players).id == gamestate.currentPlayer.id) {
            gamestate.rotation = BoardState.Rotation.None;
            return false;
        }
    }
}
exports.updateGamePhase = updateGamePhase;
function validateEndTurn(teststate) {
    switch (teststate.phase) {
        case BoardState.Phase.Init:
            var currentPlayer = teststate.currentPlayer;
            if (currentPlayer.roadCount == BoardState.getInitStructureLimit(teststate.rotation) &&
                currentPlayer.settlementCount == BoardState.getInitStructureLimit(teststate.rotation)) {
                console.log("End turn valid");
                return true;
            }
            break;
        case BoardState.Phase.Normal:
            return true;
    }
    return false;
}
exports.validateEndTurn = validateEndTurn;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// define(['Grid','Transform','BoardState'],function(Grid,Transform,BoardState) {

Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
var Transform = __webpack_require__(7);
var BoardState = __webpack_require__(0);
// export function isHitboxBox(hb:Hitbox): hb is HitboxBox {
//         return (<HitboxBox>hb).rotation !== undefined;
// }
function isHit(hitbox, loc) {
    switch (hitbox.kind) {
        case "box":
            var t = Grid.multiplyMatrix(Grid.rotationMatrix(-hitbox.rotation), Grid.add(loc, Grid.times(-1, hitbox.center)));
            return (t.x <= hitbox.dimension.x && t.y <= hitbox.dimension.y
                && t.x >= -hitbox.dimension.x && t.y >= -hitbox.dimension.y);
        case "circle":
            return (Grid.norm(Grid.add(Grid.times(-1, loc), hitbox.center)) < hitbox.radius);
    }
}
exports.isHit = isHit;
//Will crash if vertex/road cant be found
function getHitboxStructure(vertices, roads, box) {
    switch (box.data.type) {
        case BoardState.Position.Type.Vertex:
            return (BoardState.requireVertex(vertices, box.data.coordinate)).structure;
        case BoardState.Position.Type.Road:
            return (BoardState.requireRoad(roads, box.data.coord1, box.data.coord2)).structure;
    }
}
exports.getHitboxStructure = getHitboxStructure;
//testBox = new Hitbox.Box(hexToWorld(new Vector(1,1),50),new Vector(10,10),new Vector (0,1),Math.PI/3)
//testBox2 = new Hitbox.Box(new Vector(300,200),new Vector(50,200),new Vector (0,1),Math.PI/6)
function transformHitlist(boxes, trans) {
    return boxes.map(function (box) { return transformHitbox(box, trans); });
}
exports.transformHitlist = transformHitlist;
function transformHitbox(box, trans) {
    switch (box.kind) {
        case "box":
            return { kind: "box",
                center: Transform.transform(box.center, trans),
                dimension: Grid.times(trans.scale, box.dimension),
                data: box.data,
                rotation: box.rotation };
        case "circle":
            return { kind: "circle",
                center: Transform.transform(box.center, trans),
                radius: trans.scale * box.radius,
                data: box.data };
    }
}
exports.transformHitbox = transformHitbox;
function genHitboxes(vertices, roads, hexes, side) {
    return genVertexBoxes(vertices, side)
        .concat(genHexBoxes(hexes, side))
        .concat(genRoadBoxes(roads, side));
}
exports.genHitboxes = genHitboxes;
function genHexBoxes(hexes, side) {
    return hexes.map(function (hc) {
        return {
            kind: "circle",
            center: Grid.hexToWorld(hc.coordinate, side),
            radius: side / (2 * Math.tan(Math.PI / 6)),
            data: hc
        };
    });
}
exports.genHexBoxes = genHexBoxes;
function genVertexBoxes(vertices, side) {
    return vertices.map(function (vertex) {
        return {
            kind: "circle",
            center: Grid.vertexToWorld(vertex.coordinate, side),
            radius: side / 4,
            data: vertex
        };
    });
}
exports.genVertexBoxes = genVertexBoxes;
function genRoadBoxes(roads, side) {
    return roads.map(function (r) { return genRoadBox(r, side); });
}
exports.genRoadBoxes = genRoadBoxes;
function genRoadBox(road, side) {
    var w1 = Grid.vertexToWorld(road.coord1, side);
    var w2 = Grid.vertexToWorld(road.coord2, side);
    var cost = Grid.dotProduct({ x: 1, y: 0 }, Grid.add(w1, Grid.times(-1, w2))) / (side);
    if (cost < -1) {
        cost = -1;
    }
    else if (cost > 1) {
        cost = 1;
    }
    var diff = Grid.add(w1, Grid.times(-1, w2));
    var rotation = Math.atan(diff.y / diff.x);
    var center = Grid.times(0.5, Grid.add(w1, w2));
    return {
        kind: "box",
        center: center,
        dimension: { x: side / 2, y: side / 3 },
        data: road,
        rotation: rotation
    };
}
exports.genRoadBox = genRoadBox;
function updateCenter(box, f) {
    box.center = f(box.center);
    return box;
}
exports.updateCenter = updateCenter;
function getHits(hitList, coord) {
    return hitList.filter(function (box) {
        return isHit(box, coord);
    });
}
exports.getHits = getHits;
function topRight(box) {
    return Grid.add(box.center, box.dimension);
}
exports.topRight = topRight;
function bottomLeft(box) {
    return Grid.add(box.center, Grid.times(-1, box.dimension));
}
exports.bottomLeft = bottomLeft;
function boxCorners(box) {
    var t = [box.dimension,
        Grid.piecewiseTimes({ x: 1, y: -1 }, box.dimension),
        Grid.piecewiseTimes({ x: -1, y: -1 }, box.dimension),
        Grid.piecewiseTimes({ x: -1, y: 1 }, box.dimension)
    ];
    return t.map(function (p) {
        return Grid.add(box.center, Grid.multiplyMatrix(Grid.rotationMatrix(box.rotation), p));
    });
}
exports.boxCorners = boxCorners;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="declarations/jquery.d.ts" />

Object.defineProperty(exports, "__esModule", { value: true });
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
var StructureRenderer = __webpack_require__(6);
//This function adds the functionality for the slide up build menu information---------
$(document).ready(function () {
    $("#bottomLeftDisplay").click(function () {
        var rBar = $('#bottomLeftDisplay');
        if (rBar.attr("panel") == "Down") {
            rBar.attr("panel", "Up");
        }
        else {
            rBar.attr("panel", "Down");
        }
    });
});
//This function adds the drop down functionality for the playerTabs class--------------
$(document).ready(function () {
    $(".playerInfo").hide();
    $(".playerDiv").click(function (e) {
        //$(parent(ee.target())).slideToggle("slow");
        $(".playerInfo", $(this)).slideToggle("down");
    });
});
//Clock for the bottom right display----------------------------------------------------
//Used help from this website for the clock: http://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
var ClockView = (function () {
    function ClockView(id) {
        this.id = id;
        this.initTime = new Date().getMilliseconds();
        var _clock = document.getElementById(id);
        if (_clock === null) {
            throw "no clock";
        }
        this.clock = _clock;
        var hoursSpan = this.clock.querySelector('.hours');
        var minutesSpan = this.clock.querySelector('.minutes');
        var secondsSpan = this.clock.querySelector('.seconds');
        if (hoursSpan && minutesSpan && secondsSpan) {
            this.hoursSpan = hoursSpan;
            this.minutesSpan = minutesSpan;
            this.secondsSpan = secondsSpan;
        }
        else {
            throw "Error";
        }
        var timeinterval = setInterval(this.updateClock.bind(this), 1000);
        // var currentTime = setInterval(function(){
        //     var t = getTimeElapsed();
        //     clock.innerHTML = t.hours + ':' + t.minutes + ':' + t.seconds;
        // },1000);
    }
    ClockView.prototype.getTimeElapsed = function () {
        var t = new Date().getMilliseconds() - this.initTime;
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        return { seconds: seconds, minutes: minutes, hours: hours };
    };
    ;
    ClockView.prototype.updateClock = function () {
        var t = this.getTimeElapsed();
        this.hoursSpan.innerHTML = ('00' + t.hours).slice(-2);
        this.minutesSpan.innerHTML = ('00' + t.minutes).slice(-2);
        this.secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    };
    return ClockView;
}());
$(document).ready(function () {
    console.log("wtf?");
    var cv = new ClockView("clock");
});
function genPlayerTabs(players) {
    var container = getPlayerTabsContainer();
    var template = getPlayerTabTemplate();
    var colorMap = Player.getPlayerColors(players);
    $(container).append(players.map(function (player) {
        return newPlayerTab(player, colorMap[player.id], template);
    }));
    updateUIInfoTopBar(players, undefined);
}
exports.genPlayerTabs = genPlayerTabs;
function getPlayerTabTemplate() {
    return $("#playerTabTemplate");
}
exports.getPlayerTabTemplate = getPlayerTabTemplate;
function newPlayerTab(player, color, template) {
    var out = $(template).clone(true);
    setTabPlayerID(out, player.id);
    setTabPlayerImages(out, color);
    $(out).removeAttr("id");
    $(".playerName", $(out)).css("background-color", Player.getColor(color));
    return out;
}
exports.newPlayerTab = newPlayerTab;
function getPlayerTabsContainer() {
    return $("#playerTabs");
}
exports.getPlayerTabsContainer = getPlayerTabsContainer;
function getPlayerTab(num) {
    return $(".playerDiv[player=" + num + "]");
}
exports.getPlayerTab = getPlayerTab;
function getPlayerName(num) {
    return $(".playerName[player=" + num + "]");
}
exports.getPlayerName = getPlayerName;
function setTabPlayerID(tab, playerID) {
    $(tab).attr("player", playerID);
    $(".playerNumber", tab).html(playerID.toString());
}
exports.setTabPlayerID = setTabPlayerID;
function setTabPlayerImages(tab, color) {
    $(".settlementPic", tab).append(StructureRenderer.getBuildingImg(BoardState.Structure.Settlement, color));
    $(".cityPic", tab).append(StructureRenderer.getBuildingImg(BoardState.Structure.City, color));
    $(".roadPic", tab).append(StructureRenderer.getBuildingImg(BoardState.Structure.Road, color));
}
exports.setTabPlayerImages = setTabPlayerImages;
//Sets the structure info for a player. Takes in a player number (1,2,3,4), structure and amount
function setStructureVal(playerTab, structure, amount) {
    $(".playerStructureQuantity[structure=" + structure + "]", playerTab).html(amount.toString());
}
exports.setStructureVal = setStructureVal;
//Sets the victory points for the player. Takes in a number
function setVictoryPointsVal(playerTab, amount) {
    $(".playerPoints", playerTab).html(amount.toString());
}
exports.setVictoryPointsVal = setVictoryPointsVal;
//Methods to change resource quantities---------------------------------------------------
//Sets the resource amount for the player. Takes in a resource ("Lumber","Wool", etc) and an amount to be set at
function setResourceVal(resource, amount) {
    $("[resource=" + resource + "]>.resourceValue").html(amount.toString());
}
exports.setResourceVal = setResourceVal;
//Sets the roll value display for the player. Takes in a number
function setRollVal(amount) {
    $("#rollValue").html(amount.toString());
}
exports.setRollVal = setRollVal;
//Tests
//setResourceVal
// function
function updateUIInfo(players, currentPlayerID) {
    updateUIInfoTopBar(players, currentPlayerID);
    var currentPlayer = Player.getPlayers(currentPlayerID, players)[0];
    updateResourceBar(currentPlayer);
}
exports.updateUIInfo = updateUIInfo;
function updateUIInfoTopBar(players, currentPlayerID) {
    players.map(function (player) {
        var playerName = getPlayerName(player.id);
        var playerTab = getPlayerTab(player.id);
        $(playerTab).attr("active", (currentPlayerID == player.id).toString());
        setVictoryPointsVal(playerTab, player.vicPoints);
        setStructureVal(playerTab, "Road", player.roadCount);
        setStructureVal(playerTab, "Settlement", player.settlementCount);
        setStructureVal(playerTab, "City", player.cityCount);
    });
}
exports.updateUIInfoTopBar = updateUIInfoTopBar;
function updateResourceBar(player) {
    setResourceVal("Lumber", player.resources[BoardState.Resource.Lumber]);
    setResourceVal("Grain", player.resources[BoardState.Resource.Grain]);
    setResourceVal("Wool", player.resources[BoardState.Resource.Wool]);
    setResourceVal("Ore", player.resources[BoardState.Resource.Ore]);
    setResourceVal("Brick", player.resources[BoardState.Resource.Brick]);
}
exports.updateResourceBar = updateResourceBar;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function last(list) {
    return list[list.length - 1];
}
exports.last = last;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//This file is responsible for setting up and preparing the game for use. It makes the UI
//views, prepares the game with players and a board and starts the game.

Object.defineProperty(exports, "__esModule", { value: true });
var Constants = __webpack_require__(4);
var BoardState = __webpack_require__(0);
var View = __webpack_require__(3);
var Canvas = __webpack_require__(12);
var UserInterfaceJScript = __webpack_require__(15);
var InputView = __webpack_require__(23);
var DiceRollView = __webpack_require__(19);
var TradeView = __webpack_require__(34);
var PassView = __webpack_require__(28);
var HexInfoView = __webpack_require__(21);
var LongestRoadView = __webpack_require__(25);
var Game = __webpack_require__(20);
var Load = __webpack_require__(24);
function makeDistributor(destination, ctx) {
    var dist = new View.Distributor();
    (new View.EndTurnView(destination)).subscribe(dist);
    (new View.UndoView(destination)).subscribe(dist);
    (new View.ResizeView(destination)).subscribe(dist);
    (new View.BuildChoiceView(BoardState.Structure.Road, destination)).subscribe(dist);
    (new View.BuildChoiceView(BoardState.Structure.Settlement, destination)).subscribe(dist);
    (new View.BuildChoiceView(BoardState.Structure.City, destination)).subscribe(dist);
    (new TradeView.TradeView(destination)).subscribe(dist);
    (new View.WinnerMessageView()).subscribe(dist);
    (new View.TimerMessageView()).subscribe(dist);
    (new LongestRoadView.LongestRoadView()).subscribe(dist);
    (new DiceRollView.DiceRollView(Constants.DICE_ROLL_DURATION, Constants.DICE_ROLL_STEPS, Constants.DICE_ROLL_MAX, Constants.DICE_ROLL_MIN)).subscribe(dist);
    (new HexInfoView.HexInfoView()).subscribe(dist);
    (new PassView.PassView(destination)).subscribe(dist);
    (new InputView.InputView(destination)).subscribe(dist);
    (new View.InstructionsMessageView()).subscribe(dist);
    (new Canvas.CanvasRenderView(ctx)).subscribe(dist);
    return dist;
}
function makeGame(dist) {
    var game = new Game.CatanGame(Constants.GAME_DEFAULT_SCALE, dist);
    Game.makeBoard(game);
    return game;
}
function prepareGame(game) {
    game.setUpHitboxes();
    UserInterfaceJScript.genPlayerTabs(game.gameState.players);
    Game.makeBoard(game);
    Game.renderGame(game, undefined); // Initial render with no highlight.
}
function main() {
    var canvas = document.getElementById('board');
    if (canvas.getContext) {
        View.resizeBoardDOM($(window).width(), $(window).height());
        var ctx = canvas.getContext('2d');
        if (ctx === null) {
            throw "could not create render context";
        }
        var game_1 = makeGame(new View.Distributor());
        var dist = makeDistributor(game_1, ctx);
        game_1.distributor = dist;
        Load.loadGame(function () {
            prepareGame(game_1);
            game_1.run(Constants.GAME_STEP_INTERVAL);
        });
    }
    else {
        alert("Browser must support HTML Canvas");
    }
}
exports.main = main;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//There appears to be a lot of cruft here that could be removed

Object.defineProperty(exports, "__esModule", { value: true });
var Constants = __webpack_require__(4);
var BoardState = __webpack_require__(0);
var RobberMethods = __webpack_require__(30);
var GameMethods = __webpack_require__(5);
var GameState = __webpack_require__(13);
var Player = __webpack_require__(2);
var Build = __webpack_require__(11);
var TradeOffer = __webpack_require__(10);
function validateRobbing(coordinate, gamestate) {
    if (gamestate.phase == BoardState.Phase.Normal && gamestate.subPhase == BoardState.SubPhase.Robbing)
        return GameMethods.checkRobbingLegality(gamestate.board.robber, coordinate, gamestate.board.hexes);
    else
        return false;
}
exports.validateRobbing = validateRobbing;
function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
function validateAction(action, gameState) {
    if (Build.isBuildAction(action)) {
        return Build.validateBuildAction(action, gameState);
    }
    else {
        switch (action.type) {
            case "RobHex":
                return validateRobbing(action.coordinate, gameState);
            case "EndTurn":
                return validateEndTurn(gameState);
            case "NewGame":
                return true;
            case "BankTrade":
                return validateBankTrade(action, gameState);
            case "PlayerTrade":
                return validatePlayerTrade(action, gameState);
            case "EndTradePhase":
                return validateEndTradePhase(gameState);
            default:
                assertNever(action);
        }
    }
}
exports.validateAction = validateAction;
function flushActions(actions) {
    actions.length = 0;
}
exports.flushActions = flushActions;
function replayActions(actions) {
    var initial = actions[0];
    if (!isNewGame(initial)) {
        throw "cannot replay log";
    }
    return applyActions(actions, newGame(initial));
}
exports.replayActions = replayActions;
function applyActions(actions, gameState) {
    actions.forEach(function (action) {
        gameState = applyAction(action, gameState);
    });
    return gameState;
}
exports.applyActions = applyActions;
//Must perform validations first
function applyAction(action, gameState) {
    if (Build.isBuildAction(action)) {
        return Build.applyBuildAction(action, gameState);
    }
    else {
        switch (action.type) {
            case "RobHex":
                var hex = BoardState.requireHex(action.coordinate, gameState.board.hexes);
                RobberMethods.moveRobber(gameState.board.robber, hex);
                RobberMethods.robHex(hex, gameState.currentPlayer, gameState.board.vertices, gameState.players);
                gameState.subPhase = BoardState.SubPhase.Trading;
                console.log("Robbed");
                return gameState;
            case "EndTurn":
                applyEndTurn(action.roll, gameState);
                return gameState;
            case "NewGame":
                return newGame(action);
            case "BankTrade":
                return applyBankTrade(action, gameState);
            case "PlayerTrade":
                return applyPlayerTrade(action, gameState);
            case "EndTradePhase":
                return applyEndTradePhase(gameState);
            default:
                assertNever(action);
                throw "unreachable code";
        }
    }
}
exports.applyAction = applyAction;
function genPotentialAction(box) {
    switch (box.data.type) {
        case BoardState.Position.Type.Road:
            return { type: "BuildRoad", coordinateA: box.data.coord1, coordinateB: box.data.coord2 };
        case BoardState.Position.Type.Vertex:
            if (box.data.structure === undefined) {
                return { type: "BuildSettlement", coordinate: box.data.coordinate };
            }
            else {
                return { type: "BuildSettlement", coordinate: box.data.coordinate };
            }
        case BoardState.Position.Type.Hex:
            return { type: "RobHex", coordinate: box.data.coordinate };
    }
}
exports.genPotentialAction = genPotentialAction;
function isNewGame(action) {
    return action.type == "NewGame";
}
function newGame(action) {
    var players = Player.genPlayers(action.numPlayers);
    var gameState = new GameState.GameState(BoardState.makeRegularHexBoard(action.width, action.resourceList.slice(), action.tokenList.slice()), players[0]);
    gameState.players = players;
    return gameState;
}
exports.newGame = newGame;
function validateEndTurn(gameState) {
    return GameState.validateEndTurn(gameState);
}
exports.validateEndTurn = validateEndTurn;
function applyEndTurn(roll, gameState) {
    GameState.updateLongestRoad(gameState);
    gameState.tradeOffers = TradeOffer.filterOutIncomingTrades(gameState.currentPlayer.id, gameState.tradeOffers);
    var unupdatedCurrentPlayerID = gameState.currentPlayer.id;
    GameState.nextPlayer(gameState);
    GameState.updateGamePhase(gameState, unupdatedCurrentPlayerID);
    if (gameState.phase == BoardState.Phase.Normal) {
        GameMethods.resourceGeneration(roll.left + roll.right, gameState.players, gameState.board.vertices, gameState.board.hexes, gameState.board.robber);
        if (roll.left + roll.right == 7) {
            gameState.subPhase = BoardState.SubPhase.Robbing;
        }
        else {
            gameState.subPhase = BoardState.SubPhase.Trading;
        }
    }
    gameState.tradeOffers = TradeOffer.filterValidTradeOffers(gameState.players, gameState.tradeOffers);
}
exports.applyEndTurn = applyEndTurn;
function validateBankTrade(action, gameState) {
    return gameState.subPhase == BoardState.SubPhase.Trading
        && gameState.currentPlayer.resources[action.tradein] >= Constants.BANKABLE_RESOURCE_COUNT;
}
exports.validateBankTrade = validateBankTrade;
function applyBankTrade(action, gameState) {
    gameState.currentPlayer.resources[action.receive]++;
    gameState.currentPlayer.resources[action.tradein] -= Constants.BANKABLE_RESOURCE_COUNT;
    return gameState;
}
exports.applyBankTrade = applyBankTrade;
function toTradeOffer(action) {
    return {
        tradeID: -1,
        offerResources: action.offer,
        offererID: action.initiator,
        requestResources: action.receive,
        targetID: action.target
    };
}
exports.toTradeOffer = toTradeOffer;
function fromTradeOffer(trade) {
    return {
        type: "PlayerTrade",
        initiator: trade.offererID,
        offer: trade.offerResources,
        receive: trade.requestResources,
        target: trade.targetID
    };
}
exports.fromTradeOffer = fromTradeOffer;
function validatePlayerTrade(action, gameState) {
    return gameState.subPhase == BoardState.SubPhase.Trading
        && TradeOffer.validateTrade(gameState.players, toTradeOffer(action));
}
function applyPlayerTrade(action, gameState) {
    TradeOffer.applyTrade(gameState.players, toTradeOffer(action));
    return gameState;
}
function validateEndTradePhase(gameState) {
    return gameState.subPhase == BoardState.SubPhase.Trading;
}
function applyEndTradePhase(gameState) {
    gameState.subPhase = BoardState.SubPhase.Building;
    return gameState;
}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//This file is used for our dice roll animation and functionality.
var View = __webpack_require__(3);
var Animation = __webpack_require__(8);
var DiceRollView = (function (_super) {
    __extends(DiceRollView, _super);
    function DiceRollView(duration, steps, max, min) {
        var _this = _super.call(this) || this;
        _this.duration = duration;
        _this.steps = steps;
        _this.max = max;
        _this.min = min;
        _this.types = ["RollDice"];
        _this.step = 0;
        return _this;
    }
    DiceRollView.prototype.genNum = function () {
        return Math.round(Math.random() * (this.max - this.min) + this.min);
    };
    DiceRollView.prototype.getLeftBox = function () {
        return $("#rollValue1");
    };
    DiceRollView.prototype.getRightBox = function () {
        return $("#rollValue2");
    };
    DiceRollView.prototype.setBoxes = function (left, right) {
        this.getLeftBox().html(left);
        this.getRightBox().html(right);
    };
    DiceRollView.prototype.regenBoxes = function () {
        this.setBoxes(this.genNum().toString(), this.genNum().toString());
    };
    DiceRollView.prototype.animateDiceRoll = function (targetRoll) {
        var self = this;
        var deltaTime = self.duration * Animation.Timing.quadraticFixedDiscreteSum(self.step / self.steps, self.steps);
        self.step++;
        if (self.step >= self.steps) {
            self.setBoxes(targetRoll.left.toString(), targetRoll.right.toString());
        }
        else {
            self.regenBoxes();
            setTimeout(this.animateDiceRoll.bind(this), deltaTime, targetRoll);
        }
    };
    DiceRollView.prototype.startAnimation = function (target) {
        this.step = 0;
        this.animateDiceRoll(target);
    };
    DiceRollView.prototype.onMessage = function (message) {
        this.startAnimation(message.targetRoll);
    };
    return DiceRollView;
}(View.ClientView));
exports.DiceRollView = DiceRollView;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = __webpack_require__(4);
var TradeOffer = __webpack_require__(10);
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
var GameMethods = __webpack_require__(5);
var GameState = __webpack_require__(13);
var Hitbox = __webpack_require__(14);
var Animation = __webpack_require__(8);
var View = __webpack_require__(3);
var Canvas = __webpack_require__(12);
var UserInterfaceJScript = __webpack_require__(15);
var Action = __webpack_require__(18);
var BuildAction = __webpack_require__(11);
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                    UTILITY FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                  FUNCTIONS THAT DON'T FIT                                        */
//////////////////////////////////////////////////////////////////////////////////////////////////////
function getMaxPositionHit(hits) {
    var max = undefined;
    hits.map(function (h) {
        if (max == null) {
            max = h;
        }
        if (h.data.type < max.data.type) {
            max = h;
        }
    });
    return max;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                       GAME FUNCTIONS                                             */
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Reference = function(data) {
//         return {data:data}
// }
function makeGraphics() {
    return {
        animations: [],
        transform: { translation: { x: 0, y: 0 }, scale: 1 },
        renderedHexes: $("<canvas></canvas>")[0]
    };
}
var Server = (function () {
    function Server() {
        this.roll = {
            left: 0,
            right: 0
        };
        // endTurn(actionsToBeValidated:Action.AnyAction[]) {
        //     Action.applyActions(actionsToBeValidated, this.gameState);//Applies pending actions to server gamestate
        //     Action.flushActions(actionsToBeValidated);//Flushes the pending actions
        //     GameState.updateLongestRoad(this.gameState);
        //     this.gameState.tradeOffers = TradeOffer.filterOutIncomingTrades(this.gameState.currentPlayer.id, this.gameState.tradeOffers);
        //     var unupdatedCurrentPlayerID = this.gameState.currentPlayer.id;
        //     GameState.nextPlayer(this.gameState);
        //     GameState.updateGamePhase(this.gameState, unupdatedCurrentPlayerID);
        //     if(this.gameState.phase == BoardState.Phase.Normal) {
        //         this.roll.left = rollDice();
        //         this.roll.right = rollDice();
        //         GameMethods.resourceGeneration(this.roll.left + this.roll.right, this.gameState.players, this.gameState.board.vertices, this.gameState.board.hexes, this.gameState.board.robber);
        //         if (this.roll.left + this.roll.right == 7) {
        //             this.gameState.subPhase = BoardState.SubPhase.Robbing;
        //         }
        //         else {
        //             this.gameState.subPhase = BoardState.SubPhase.Trading;
        //         }
        //     }
        //     this.gameState.tradeOffers = TradeOffer.filterValidTradeOffers(this.gameState.players,this.gameState.tradeOffers);
        // }
    }
    Server.prototype.newGame = function (width, resourceList, tokenList, numPlayers) {
        var players = Player.genPlayers(numPlayers);
        this.gameState = new GameState.GameState(BoardState.makeRegularHexBoard(width, resourceList, tokenList), players[0]);
        this.gameState.players = players;
    };
    Server.prototype.addPlayer = function (player) {
        this.gameState.players.push(player);
    };
    Server.prototype.getState = function () {
        return this.gameState;
    };
    Server.prototype.getRoll = function () {
        return this.roll;
    };
    return Server;
}());
function isTradeViewMessage(message) {
    return message.type == "MakeOffer"
        || message.type == "AcceptTrade"
        || message.type == "RequestGameState"
        || message.type == "RequestAcceptValidations"
        || message.type == "RequestIncomingTrades"
        || message.type == "TradeViewClosed";
}
function isBankMessage(message) {
    return message.type === "RequestBankableResources"
        || message.type === "TradeWithBank";
}
function isDataMessage(message) {
    return message.type == "InputData" || message.type == "HitsData";
}
var CatanGame = (function (_super) {
    __extends(CatanGame, _super);
    function CatanGame(side, distributor) {
        var _this = _super.call(this) || this;
        _this.side = side;
        _this.distributor = distributor;
        _this.types = [];
        _this.graphics = makeGraphics(); //new Graphics();
        _this.log = [];
        _this.actions = []; //new Reference([]);
        _this.hits = [];
        _this.inbox = [];
        _this.processing = [];
        var newGame = {
            numPlayers: Player.getStoredPlayers(),
            tokenList: BoardState.shuffle(Constants.BASE_TOKEN_LIST.slice()),
            resourceList: BoardState.shuffle(BoardState.BASE_RESOURCE_LIST.slice()),
            type: "NewGame",
            width: 5
        };
        _this.log.push(newGame);
        _this.gameState = Action.newGame(newGame);
        _this.lastReplay = Action.replayActions(_this.log);
        return _this;
    }
    CatanGame.prototype.setUpHitboxes = function () {
        var x = 1;
        this.distributor.distribute({
            type: "SetHitboxes",
            hitboxes: Hitbox.genHitboxes(this.gameState.board.vertices, this.gameState.board.roads, this.gameState.board.hexes, this.side)
        }, this);
    };
    CatanGame.prototype.onMessage = function (message) {
        this.inbox.push(message);
    };
    //send a message to all game views indicating if it is the first time playing; 
    //updates first-time storage data
    CatanGame.prototype.processFirstTime = function () {
        var firstTime = localStorage.getItem("first-time-playing");
        this.distribute({ type: "FirstTimePlaying", firstTime: firstTime === null || firstTime == 'true' });
        localStorage.setItem("first-time-playing", "false");
    };
    //call only once
    CatanGame.prototype.run = function (frameDuration) {
        this.processFirstTime();
        window.setInterval(this.gameStep.bind(this), frameDuration);
    };
    CatanGame.prototype.pushAnimation = function (animation) {
        this.graphics.animations.push(animation);
    };
    CatanGame.prototype.refreshPhaseViews = function () {
        this.updatePhaseLabel();
        switch (this.lastReplay.subPhase) {
            case BoardState.SubPhase.Building:
                this.distribute({ type: "EnableEndTurnButton" });
                break;
            case BoardState.SubPhase.Trading:
                this.distribute({ type: "DisableEndTurnButton" });
                this.displayTrade();
                break;
            default:
                this.distribute({ type: "DisableEndTurnButton" });
                break;
        }
    };
    CatanGame.prototype.processWinner = function () {
        for (var i = 0; i < this.gameState.players.length; i++) {
            //   console.log(game.gamestate.players[i]);
            if (GameMethods.checkPlayerWin(this.gameState.players[i])) {
                var winner = this.gameState.players[i];
                console.log(winner.id); //we see the player info of the winner
                console.log(this.gameState.players[i] + "wins");
                //console.log("donefdsf");
                this.distribute({ type: "WinnerMessage", winner: winner.id });
                //window.location.href = "www/result.html"; //goes to the results page
                //document.getElementById('winner').value = winner; //i'm trying to save the winner info to pass it into the results html page but this doesn't work
            }
        }
    };
    CatanGame.prototype.endTurn = function () {
        //let endTurn:Action.EndTurn = {type:"EndTurn",roll:GameState.genRoll()}
        var endTurn = { type: "EndTurn", roll: { left: 3, right: 4 } };
        Action.applyActions(this.actions, this.gameState); //Applies pending actions to server gamestate
        this.log = this.log.concat(this.actions);
        this.log.push(endTurn);
        Action.flushActions(this.actions); //Flushes the pending actions
        Action.applyAction(endTurn, this.gameState);
        Action.applyAction(endTurn, this.lastReplay);
        updateLongestRoadView(this);
        if (this.gameState.phase == BoardState.Phase.Normal)
            this.distribute({ type: "RollDice", targetRoll: endTurn.roll });
        // this.lastReplay = Action.replayActions(this.log);
        this.refreshPhaseViews();
        this.processWinner();
        this.processCanEnd();
        renderGame(this, undefined);
    };
    CatanGame.prototype.sendIncomingTrades = function () {
        var incomingTrades = TradeOffer.getIncomingTrades(this.gameState.currentPlayer.id, this.gameState.tradeOffers);
        this.distribute({ type: "SetIncomingTrades", trades: incomingTrades });
    };
    CatanGame.prototype.sendAcceptValidations = function () {
        var incomingTrades = TradeOffer.getIncomingTrades(this.gameState.currentPlayer.id, this.gameState.tradeOffers);
        var self = this;
        incomingTrades.forEach(function (trade) {
            self.distribute({
                type: "AcceptValidation",
                tradeID: trade.tradeID,
                validation: TradeOffer.validateAccept(self.gameState.players, trade.targetID, trade.requestResources)
            });
        });
    };
    CatanGame.prototype.updatePhaseLabel = function () {
        this.distribute({ type: "PhaseMessage", phase: this.gameState.phase, subPhase: this.gameState.subPhase });
    };
    CatanGame.prototype.displayTrade = function () {
        this.distribute({ type: "DisplayTradeView" });
    };
    CatanGame.prototype.processBankMessage = function (message) {
        switch (message.type) {
            case "RequestBankableResources":
                this.distribute({ type: "BankableResources", bankResources: bankableResources(this.gameState) });
                break;
            case "TradeWithBank":
                var bankTrade = {
                    type: "BankTrade",
                    tradein: message.offerResource,
                    receive: message.requestResource
                };
                if (Action.validateAction(bankTrade, this.lastReplay)) {
                    this.log.push(bankTrade);
                    Action.applyAction(bankTrade, this.gameState);
                    Action.applyAction(bankTrade, this.lastReplay);
                    UserInterfaceJScript.updateUIInfo(this.gameState.players, this.gameState.currentPlayer.id);
                }
                this.refreshTradeWindow();
                //tradeWithBank(this.gameState,message.offerResource,message.requestResource);
                break;
        }
    };
    CatanGame.prototype.refreshTradeWindow = function () {
        this.distribute({ type: "GameState", gameState: this.gameState });
        this.distribute({ type: "BankableResources", bankResources: bankableResources(this.gameState) });
    };
    CatanGame.prototype.processTradeViewMessage = function (message) {
        var trade;
        switch (message.type) {
            case "MakeOffer":
                trade = getOfferFromMessage(message, TradeOffer.nextTradeID(this.gameState.tradeOffers), this.gameState.currentPlayer.id);
                if (TradeOffer.validateTradeOffer(this.gameState.players, trade)) {
                    this.gameState.tradeOffers.push(trade);
                }
                else {
                    if (this.input)
                        this.pushAnimation(new Animation.XClick(this.input.pos, 15, 10));
                }
                break;
            case "AcceptTrade":
                trade = TradeOffer.getTrades(message.tradeID, this.gameState.tradeOffers)[0];
                if (TradeOffer.validateTrade(this.gameState.players, trade)) {
                    var tradeAction = Action.fromTradeOffer(trade);
                    this.log.push(tradeAction);
                    Action.applyAction(tradeAction, this.gameState);
                    Action.applyAction(tradeAction, this.lastReplay);
                    this.gameState.tradeOffers = TradeOffer.filterOutTrades(trade.tradeID, this.gameState.tradeOffers);
                    UserInterfaceJScript.updateUIInfo(this.gameState.players, this.gameState.currentPlayer.id);
                }
                break;
            case "RequestGameState":
                this.distribute({ type: "GameState", gameState: this.gameState });
                break;
            case "RequestAcceptValidations":
                this.sendAcceptValidations();
                break;
            case "RequestIncomingTrades":
                this.sendIncomingTrades();
                break;
            case "TradeViewClosed":
                // this.gameState.subPhase = BoardState.SubPhase.Building;
                // this.testState = GameState.cloneGameState(this.gameState);
                var action = { type: "EndTradePhase" };
                if (Action.validateAction(action, this.gameState)) {
                    this.log.push(action);
                    Action.applyAction(action, this.gameState);
                    Action.applyAction(action, this.lastReplay);
                }
                UserInterfaceJScript.updateUIInfo(this.gameState.players, this.gameState.currentPlayer.id);
                this.refreshPhaseViews();
        }
    };
    CatanGame.prototype.processDataMessage = function (message) {
        switch (message.type) {
            case "InputData":
                this.input = message.input;
                break;
            case "HitsData":
                this.hits = message.hits;
                break;
        }
    };
    CatanGame.prototype.processMessage = function (message) {
        if (isTradeViewMessage(message)) {
            this.processTradeViewMessage(message);
        }
        else if (isBankMessage(message)) {
            this.processBankMessage(message);
        }
        else if (isDataMessage(message)) {
            this.processDataMessage(message);
        }
        else {
            switch (message.type) {
                case "EndTurn":
                    if (Action.validateEndTurn(this.lastReplay)) {
                        this.distribute({
                            type: "OpenPassView",
                            playerID: GameState.getNextPlayer(this.gameState).id
                        });
                    }
                    break;
                case "PassViewClosed":
                    this.endTurn();
                    break;
                case "Undo":
                    this.actions.pop();
                    this.lastReplay = Action.replayActions(this.log.concat(this.actions));
                    renderGame(this, undefined);
                    break;
                case "Resize":
                    renderGame(this, undefined);
                    break;
            }
        }
    };
    CatanGame.prototype.processMessages = function (messages) {
        var _this = this;
        // let self = this;
        messages.forEach(function (message) {
            _this.processMessage(message);
        });
    };
    CatanGame.prototype.processInbox = function () {
        this.processing = this.inbox.slice();
        flushInbox(this.inbox);
        this.processMessages(this.processing); //Processes information from the UI in buffer
        flushInbox(this.processing);
    };
    CatanGame.prototype.processCanEnd = function () {
        if (GameState.validateEndTurn(this.lastReplay)) {
            this.distribute({ type: "EnableEndTurnButton" });
        }
        else {
            this.distribute({ type: "DisableEndTurnButton" });
        }
    };
    CatanGame.prototype.gameStep = function () {
        var shouldRedraw = false;
        var highlight = undefined;
        this.distribute({ type: "RequestInputData" });
        this.processInbox();
        if (this.input) {
            this.distribute({ type: "RequestHits", coordinate: this.input.pos });
            this.processInbox();
            var maxHit = getMaxPositionHit(this.hits);
            var potentialAction;
            if (maxHit === undefined) {
                potentialAction = undefined;
            }
            else {
                potentialAction = Action.genPotentialAction(maxHit);
            }
            if (this.hits.length != 0 || this.graphics.animations.length != 0) {
                shouldRedraw = true;
            }
            if (this.input.dragging) {
                //                View.sendMessage(new View.Message.HideHexInfo(game),game.views);
                this.distribute({ type: "AdjustTranslation", translation: this.input.movement });
                shouldRedraw = true;
            }
            if (this.input.scroll.y != 0) {
                this.distribute({ type: "HideHexInfo" });
                this.distribute({ type: "AdjustScale", adjustment: this.input.scroll.y });
                shouldRedraw = true;
            }
            if (potentialAction != null) {
                if (Action.validateAction(potentialAction, this.lastReplay)) {
                    if (BuildAction.isBuildAction(potentialAction)) {
                        highlight = BuildAction.getPositionObject(potentialAction, this.lastReplay.currentPlayer.id);
                        shouldRedraw = true;
                    }
                }
            }
            if (this.input.clicked) {
                var drawCircle = true;
                var robberMoved = false;
                shouldRedraw = true;
                if (maxHit != null && maxHit.data.type == BoardState.Position.Type.Hex) {
                    this.distribute({ type: "DisplayHexInfo", hex: maxHit.data, position: this.input.pos });
                }
                if (potentialAction !== undefined) {
                    if (Action.validateAction(potentialAction, this.lastReplay)) {
                        if (this.gameState.phase == BoardState.Phase.Init) {
                            this.distribute({ type: "InitBuilt" });
                        }
                        if (potentialAction.type == "RobHex") {
                            robberMoved = true;
                            this.log.push(potentialAction);
                            Action.applyAction(potentialAction, this.lastReplay);
                            Action.applyAction(potentialAction, this.gameState);
                        }
                        else {
                            this.actions.push(potentialAction);
                            Action.applyAction(potentialAction, this.lastReplay);
                        }
                        this.refreshPhaseViews();
                        this.processCanEnd();
                    }
                    else {
                        this.pushAnimation(new Animation.XClick(this.input.pos, 15, 10));
                        drawCircle = false;
                    }
                }
                if (drawCircle) {
                    this.pushAnimation(new Animation.ClickCircle(this.input.pos, 10, 10));
                }
                if (robberMoved) {
                    makeBoard(this);
                }
            }
        }
        if (shouldRedraw) {
            renderGame(this, highlight);
        }
    };
    return CatanGame;
}(View.DistributedClient));
exports.CatanGame = CatanGame;
function bankableResources(gameState) {
    var currentPlayer = gameState.currentPlayer;
    var out = [];
    currentPlayer.resources.forEach(function (amount, resource) {
        if (amount >= Constants.BANKABLE_RESOURCE_COUNT) {
            out.push(resource);
        }
    });
    return out;
}
function tradeWithBank(gamestate, offerResource, requestResource) {
    var currentPlayer = gamestate.currentPlayer;
    if (currentPlayer.resources[offerResource] >= Constants.BANKABLE_RESOURCE_COUNT) {
        currentPlayer.resources[requestResource] += 1;
        currentPlayer.resources[offerResource] -= Constants.BANKABLE_RESOURCE_COUNT;
    }
}
function getOfferFromMessage(message, tradeID, offererID) {
    return {
        offerResources: message.offerResources,
        offererID: offererID,
        requestResources: message.requestResources,
        targetID: message.targetID,
        tradeID: tradeID
    };
}
function renderGame(game, positionHighlight) {
    game.distribute({
        type: "RenderGameCanvas",
        gamestate: game.lastReplay,
        highlight: positionHighlight,
        graphics: game.graphics,
        side: game.side
    });
    //drawHitboxes(hitlist,hits,game.ctx);
    UserInterfaceJScript.updateUIInfo(game.lastReplay.players, game.lastReplay.currentPlayer.id);
}
exports.renderGame = renderGame;
/* checkPlayerWin
* Given a player, checks whether or not they have met the victory conditions
*/
function updateLongestRoadView(game) {
    if (game.gameState.longestRoadPlayer != null) {
        game.distribute({ type: "SetLongestRoadID", longestRoadID: game.gameState.longestRoadPlayer.id });
    }
}
function storeBoardImage(graphics, gamestate, side) {
    graphics.renderedHexes = Canvas.generateHexCanvas(gamestate, side);
}
function makeBoard(game) {
    storeBoardImage(game.graphics, game.lastReplay, game.side);
}
exports.makeBoard = makeBoard;
function flushInbox(inbox) {
    inbox.length = 0;
}
////////////////////////////
//end of module 


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BoardState = __webpack_require__(0);
var View = __webpack_require__(3);
var HexInfoView = (function (_super) {
    __extends(HexInfoView, _super);
    function HexInfoView() {
        var _this = _super.call(this) || this;
        _this.types = ["AdjustTranslation", "DisplayHexInfo", "HideHexInfo"];
        _this.display = _this.makeHexInfoViewDisplay();
        _this.hide();
        $("#userInterface").prepend(_this.display);
        return _this;
    }
    HexInfoView.prototype.onMessage = function (message) {
        switch (message.type) {
            case "AdjustTranslation":
                this.translate(message.translation);
                break;
            case "DisplayHexInfo":
                this.showHex(message.hex, message.position);
                break;
            case "HideHexInfo":
                this.hide();
                break;
        }
    };
    HexInfoView.prototype.makeHexInfoViewDisplay = function () {
        var self = this;
        var res = $("<div id=hexInfoView>" +
            "<div class=content>" +
            "<div class=resourceDisplay></div>" +
            "<div class=terrainDisplay></div>" +
            "<div class=tokenDisplay></div>" +
            "<div class=closeDisplay>" +
            "<button> X </button>" +
            "</div>" +
            "</div>" +
            "</div>");
        $(".closeDisplay", res).click(function () { self.hide(); });
        return res;
    };
    HexInfoView.prototype.resetPosition = function () {
        this.display.offset({ top: 0, left: 0 });
    };
    HexInfoView.prototype.hide = function () {
        this.resetPosition();
        this.display.hide();
    };
    HexInfoView.prototype.show = function (position) {
        this.display.show();
        this.resetPosition();
        var pos = this.display.position();
        pos.top = position.y - pos.top;
        pos.left = position.x - pos.left;
        this.display.offset(pos);
    };
    HexInfoView.prototype.showHex = function (hex, position) {
        $(".terrainDisplay", this.display).html("Terrain: " + BoardState.getResourceTerrainName(hex.resource));
        $(".resourceDisplay", this.display).html("Resource: " + BoardState.getResourceName(hex.resource));
        $(".tokenDisplay", this.display).html("Token: " + hex.token);
        this.show(position);
    };
    HexInfoView.prototype.translate = function (translation) {
        var pos = this.display.position();
        pos.top = translation.y + pos.top;
        pos.left = translation.x + pos.left;
        this.display.offset(pos);
    };
    return HexInfoView;
}(View.ClientView));
exports.HexInfoView = HexInfoView;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
function fromMouse(mouse) {
    return mouse;
}
exports.fromMouse = fromMouse;
function fromTouch(touch) {
    return {
        pos: touch.pos,
        clicked: touch.clicked,
        dragging: touch.dragging,
        movement: Grid.times(-1, touch.movement),
        scroll: { x: 0, y: 0 }
    };
}
exports.fromTouch = fromTouch;
function consolidateTouchAndMouse(touch, mouse) {
    if (touch !== undefined && touch.isActive()) {
        return fromTouch(touch);
    }
    else if (mouse !== undefined) {
        return fromMouse(mouse);
    }
}
exports.consolidateTouchAndMouse = consolidateTouchAndMouse;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var View = __webpack_require__(3);
var Input = __webpack_require__(22);
var MouseView = __webpack_require__(27);
var TouchView = __webpack_require__(33);
var InputView = (function (_super) {
    __extends(InputView, _super);
    function InputView(messageDestination) {
        var _this = _super.call(this) || this;
        _this.messageDestination = messageDestination;
        _this.types = ["RequestInputData", "MouseData", "AggregateTouch"];
        _this.mouseView = new MouseView.MouseView($("#board")[0]);
        _this.touchView = new TouchView.TouchView($("#board")[0]);
        return _this;
    }
    InputView.prototype.onMessage = function (message) {
        switch (message.type) {
            case "RequestInputData":
                this.resetData();
                this.sendMessage({ type: "RequestMouseData" }, this.mouseView);
                this.sendMessage({ type: "RequestAggregateTouch" }, this.touchView);
                break;
            case "MouseData":
                this.mouseData = message.mouse;
                this.dataReceived();
                break;
            case "AggregateTouch":
                this.touchData = message.touch;
                this.dataReceived();
                break;
        }
    };
    InputView.prototype.resetData = function () {
        this.mouseData = undefined;
        this.touchData = undefined;
    };
    InputView.prototype.dataReceived = function () {
        var self = this;
        if (self.mouseData != null || self.touchData != null) {
            var data = Input.consolidateTouchAndMouse(self.touchData, self.mouseData);
            this.sendMessage({ type: "InputData", input: data }, this.messageDestination);
        }
    };
    return InputView;
}(View.ClientView));
exports.InputView = InputView;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
var StructureRenderer = __webpack_require__(6);
// function flattenDictionary<T>(dictionary:T[]) {
//         var out:T[] = [];
//         Object.keys(dictionary).forEach(function(k) {
//                 out.push(dictionary[k]);
//         });
//         return out;
// }
function flattenJQuery(selectors) {
    var out = $();
    selectors.forEach(function (s) {
        out = out.add(s);
    });
    return out;
}
exports.flattenJQuery = flattenJQuery;
function genResourceSymbolImages() {
    var images = StructureRenderer.getResourceSymbolImages();
    return $(images).clone().toArray();
}
exports.genResourceSymbolImages = genResourceSymbolImages;
function addResourceSymbolImages(images) {
    function addToResource(resource, image) {
        $("[resource=" + resource + "]").append(image);
    }
    addToResource(BoardState.Resource.Lumber, images[BoardState.Resource.Lumber]);
    addToResource(BoardState.Resource.Grain, images[BoardState.Resource.Grain]);
    addToResource(BoardState.Resource.Wool, images[BoardState.Resource.Wool]);
    addToResource(BoardState.Resource.Ore, images[BoardState.Resource.Ore]);
    addToResource(BoardState.Resource.Brick, images[BoardState.Resource.Brick]);
}
exports.addResourceSymbolImages = addResourceSymbolImages;
function addStructureIcons(images) {
    function addStructureImage(structure, image) {
        var structureName = BoardState.getStructureName(structure);
        $("[structure=" + structureName + "] .structureImage").append(image);
    }
    ;
    addStructureImage(BoardState.Structure.Settlement, images[BoardState.Structure.Settlement]);
    addStructureImage(BoardState.Structure.City, images[BoardState.Structure.City]);
    addStructureImage(BoardState.Structure.Road, images[BoardState.Structure.Road]);
}
exports.addStructureIcons = addStructureIcons;
function genStructureIcons() {
    function genIcon(structure) {
        return $(StructureRenderer.getBuildingImg(structure, Player.Colors.White)).clone().toArray()[0];
    }
    var x;
    var out = [];
    out[BoardState.Structure.Settlement] = genIcon(BoardState.Structure.Settlement);
    out[BoardState.Structure.City] = genIcon(BoardState.Structure.City);
    out[BoardState.Structure.Road] = genIcon(BoardState.Structure.Road);
    return out;
}
exports.genStructureIcons = genStructureIcons;
function addCostImages(images) {
    function addCostImagesForStructure(structure) {
        var imgs = images[structure];
        var structureName = BoardState.getStructureName(structure);
        $("[structure=" + structureName + "] .choiceReqs").append(imgs);
    }
    ;
    addCostImagesForStructure(BoardState.Structure.Settlement);
    addCostImagesForStructure(BoardState.Structure.City);
    addCostImagesForStructure(BoardState.Structure.Road);
}
exports.addCostImages = addCostImages;
function genCostImages() {
    function genCostImagesFromResources(resources) {
        var out = [];
        resources.forEach(function (count, resource) {
            var img = StructureRenderer.getResourceSymbolImage(resource);
            for (var i = 0; i < count; i++) {
                out.push(img);
            }
        });
        return $(out).clone().toArray();
    }
    ;
    var out = [];
    out[BoardState.Structure.Road] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.Road));
    out[BoardState.Structure.Settlement] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.Settlement));
    out[BoardState.Structure.City] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.City));
    return out;
}
exports.genCostImages = genCostImages;
function gameImageCount() {
    return StructureRenderer.getLoadedImages().length;
}
exports.gameImageCount = gameImageCount;
function addUIImages(structureIcons, costImages, resourceSymbolImages) {
    addStructureIcons(structureIcons);
    addCostImages(costImages);
    addResourceSymbolImages(resourceSymbolImages);
}
exports.addUIImages = addUIImages;
//take regular array
function numComplete(images) {
    var out = 0;
    images.forEach(function (i) { out += i.complete ? 1 : 0; });
    return out;
}
exports.numComplete = numComplete;
function loadGame(callback) {
    var structureIcons = genStructureIcons();
    var costImages = genCostImages();
    var resourceSymbolImages = genResourceSymbolImages();
    var gameImages = StructureRenderer.getLoadedImages(); // array
    $("#loader").append(gameImages);
    addUIImages(structureIcons, costImages, resourceSymbolImages);
    var images = $.merge($("img").toArray(), gameImages);
    var numLoadedImages = numComplete(images);
    ;
    var totalImages = images.length;
    var loaded = false;
    function checkLoaded() {
        numLoadedImages = numComplete(images);
        $("#loaded").css("width", 100 * numLoadedImages / totalImages + "%");
        if (numLoadedImages == totalImages && !loaded) {
            loaded = true;
            callback();
            setTimeout(function () {
                $("#loading-screen").fadeOut(300);
            }, 1000);
        }
        else if (numLoadedImages > totalImages) {
            numComplete([]);
            console.log(images.length);
            throw "What";
        }
    }
    function periodicallyCheckLoaded() {
        if (!loaded) {
            checkLoaded();
            setTimeout(periodicallyCheckLoaded, 1000);
        }
    }
    $(images).load(function () {
        checkLoaded();
    });
    periodicallyCheckLoaded();
}
exports.loadGame = loadGame;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var View = __webpack_require__(3);
var StructureRenderer = __webpack_require__(6);
var LongestRoadView = (function (_super) {
    __extends(LongestRoadView, _super);
    function LongestRoadView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = ["SetLongestRoadID"];
        _this.longestRoadID = -1;
        return _this;
    }
    LongestRoadView.prototype.onMessage = function (message) {
        this.longestRoadID = message.longestRoadID;
        this.update();
    };
    LongestRoadView.prototype.longestRoadElement = function () {
        var img = StructureRenderer.getGameImages().LongestRoad;
        if (img) {
            return $("<div id=longestRoad><span>Longest Road Settler</span> </div>").prepend(img);
        }
        else {
            throw "longest road image not loaded";
        }
    };
    LongestRoadView.prototype.removeLongestRoadDOM = function () {
        $("#longestRoad").remove();
    };
    LongestRoadView.prototype.getPlayerTab = function () {
        return $("div.playerDiv[player=" + this.longestRoadID + "]");
    };
    LongestRoadView.prototype.update = function () {
        this.removeLongestRoadDOM();
        this.getPlayerTab().append(this.longestRoadElement());
    };
    return LongestRoadView;
}(View.ClientView));
exports.LongestRoadView = LongestRoadView;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Constants = __webpack_require__(4);
var Grid = __webpack_require__(1);
function processMouseBuffer(mouse, mousebuffer) {
    mouse.clicked = false;
    mouse.movement.x = 0;
    mouse.movement.y = 0;
    mouse.scroll.x = 0;
    mouse.scroll.y = 0;
    if (mousebuffer.mouseScrolls.length > 0) {
        //var wheel = collapseWheelEvents(mousebuffer.mouseScrolls);
        mousebuffer.mouseScrolls.forEach(function (scroll) {
            mouse.scroll.x += scroll.deltaX;
            mouse.scroll.y += scroll.deltaY;
        });
        //mouse.scroll = {x:wheel.deltaX,y:wheel.deltaY};
    }
    if (mousebuffer.mouseMoves.length > 0) {
        mousebuffer.mouseMoves.forEach(function (mouseMove) {
            mouse.pos = getCoords(mouseMove);
            mouse.movement.x += mouseMove.movementX;
            mouse.movement.y += mouseMove.movementY;
        });
        // updateMouse(mouse,collapseMousemoveEvents(mousebuffer.mouseMoves));
    }
    if (mousebuffer.mouseDowns.length > 0) {
        if (!mouse.down) {
            mouse.downPos = mouse.pos;
        }
        mouse.down = true;
    }
    if (mouse.down && mouse.downPos && Grid.norm(Grid.subtract(mouse.pos, mouse.downPos)) > Constants.MAX_CLICK_MOVEMENT) {
        // mouse.click = 0;
        mouse.dragging = true;
    }
    if (mousebuffer.mouseUps.length > 0) {
        if (mouse.down && !mouse.dragging) {
            mouse.clicked = true;
        }
        mouse.dragging = false;
        if (mouse.down) {
            // mouse.clicked = 1;
            mouse.down = false;
            mouse.downPos = undefined;
        }
    }
    return mouse;
}
exports.processMouseBuffer = processMouseBuffer;
function updateMouse(mouse, evt) {
    mouse.pos = getCoords(evt);
    mouse.button = evt.button;
    mouse.movement.x = evt.movementX;
    mouse.movement.y = evt.movementY;
}
function getCoords(evt) {
    return { x: evt.offsetX, y: evt.offsetY };
}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Mouse = __webpack_require__(26);
var View = __webpack_require__(3);
function logger(log) {
    return function (x) {
        log.push(x);
    };
}
function initMouseBuffer(elem, buffer) {
    // elem instead of document is more reliable, but is unpleasant.
    document.addEventListener("mousemove", logger(buffer.mouseMoves));
    elem.addEventListener("mousedown", logger(buffer.mouseDowns));
    elem.addEventListener("wheel", logger(buffer.mouseScrolls));
    document.addEventListener("mouseup", logger(buffer.mouseUps));
}
function flushMouseEvents(mousebuffer) {
    mousebuffer.mouseMoves.length = 0;
    mousebuffer.mouseDowns.length = 0;
    mousebuffer.mouseUps.length = 0;
    mousebuffer.mouseScrolls.length = 0;
}
var MouseView = (function (_super) {
    __extends(MouseView, _super);
    function MouseView(listener) {
        var _this = _super.call(this) || this;
        _this.mouseEventBuffer = {
            mouseDowns: [],
            mouseMoves: [],
            mouseScrolls: [],
            mouseUps: []
        };
        _this.mouse = {
            button: 0,
            clicked: false,
            down: false,
            downPos: undefined,
            dragging: false,
            movement: { x: 0, y: 0 },
            pos: { x: 0, y: 0 },
            scroll: { x: 0, y: 0 }
        };
        initMouseBuffer(listener, _this.mouseEventBuffer);
        return _this;
    }
    MouseView.prototype.onMessage = function (message, sender) {
        this.mouse = Mouse.processMouseBuffer(this.mouse, this.mouseEventBuffer);
        flushMouseEvents(this.mouseEventBuffer);
        this.sendMessage({ type: "MouseData", mouse: this.mouse }, sender);
    };
    return MouseView;
}(View.ClientView));
exports.MouseView = MouseView;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var View = __webpack_require__(3);
var PassView = (function (_super) {
    __extends(PassView, _super);
    function PassView(messageDestination) {
        var _this = _super.call(this) || this;
        _this.messageDestination = messageDestination;
        _this.types = ["OpenPassView"];
        var self = _this;
        self.DOM = $("#passGame");
        self.hide();
        $("button", self.DOM).click(function () {
            self.hide();
            self.sendMessage({ type: "PassViewClosed" }, self.messageDestination);
        });
        return _this;
    }
    PassView.prototype.hide = function () {
        this.DOM.hide();
    };
    PassView.prototype.display = function (playerID) {
        $(".playerNumber", this.DOM).html(playerID.toString());
        this.DOM.show();
    };
    PassView.prototype.onMessage = function (message) {
        this.display(message.playerID);
    };
    return PassView;
}(View.ClientView));
exports.PassView = PassView;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
var BoardState = __webpack_require__(0);
var Transform = __webpack_require__(7);
var StructureRenderer = __webpack_require__(6);
var CanvasMethods = __webpack_require__(9);
var Node = (function () {
    function Node() {
        this.children = [];
    }
    Node.prototype.addChild = function (child) { addChild(child, this); };
    ;
    Node.prototype.addChildren = function (children) { addChildren(children, this); };
    ;
    return Node;
}());
exports.Node = Node;
function addChild(childNode, parentNode) {
    parentNode.children.push(childNode);
}
exports.addChild = addChild;
function addChildren(children, parentNode) {
    parentNode.children = parentNode.children.concat(children);
}
exports.addChildren = addChildren;
var BlankNode = (function (_super) {
    __extends(BlankNode, _super);
    function BlankNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlankNode.prototype.draw = function () { };
    ;
    return BlankNode;
}(Node));
exports.BlankNode = BlankNode;
var CenteredImageNode = (function (_super) {
    __extends(CenteredImageNode, _super);
    function CenteredImageNode(img) {
        var _this = _super.call(this) || this;
        _this.img = img;
        _this.addChild(new ImageNode(img));
        return _this;
    }
    CenteredImageNode.prototype.draw = function (ctx) {
        ctx.translate(-1 / 2 * this.img.width, -1 / 2 * this.img.height);
    };
    return CenteredImageNode;
}(Node));
exports.CenteredImageNode = CenteredImageNode;
var ImageNode = (function (_super) {
    __extends(ImageNode, _super);
    function ImageNode(img) {
        var _this = _super.call(this) || this;
        _this.img = img;
        return _this;
    }
    ImageNode.prototype.draw = function (ctx) { ctx.drawImage(this.img, 0, 0); };
    ;
    return ImageNode;
}(Node));
exports.ImageNode = ImageNode;
var TransformNode = (function (_super) {
    __extends(TransformNode, _super);
    function TransformNode(transform) {
        var _this = _super.call(this) || this;
        _this.transform = transform;
        return _this;
    }
    TransformNode.prototype.draw = function (ctx) {
        Transform.setTransform(this.transform, ctx);
    };
    ;
    return TransformNode;
}(Node));
exports.TransformNode = TransformNode;
var ScaleNode = (function (_super) {
    __extends(ScaleNode, _super);
    function ScaleNode(scale) {
        var _this = _super.call(this) || this;
        _this.scale = scale;
        return _this;
    }
    ScaleNode.prototype.draw = function (ctx) {
        ctx.scale(this.scale, this.scale);
    };
    return ScaleNode;
}(Node));
exports.ScaleNode = ScaleNode;
var RadialGradientNode = (function (_super) {
    __extends(RadialGradientNode, _super);
    function RadialGradientNode(radius, startColor, endColor) {
        var _this = _super.call(this) || this;
        _this.radius = radius;
        _this.startColor = startColor;
        _this.endColor = endColor;
        return _this;
    }
    RadialGradientNode.prototype.draw = function (ctx) {
        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, this.startColor);
        gradient.addColorStop(1, this.endColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.radius, -this.radius, 2 * this.radius, 2 * this.radius);
    };
    return RadialGradientNode;
}(Node));
exports.RadialGradientNode = RadialGradientNode;
var HexNode = (function (_super) {
    __extends(HexNode, _super);
    function HexNode(hex, robbed) {
        var _this = _super.call(this) || this;
        _this.hex = hex;
        _this.robbed = robbed;
        _this.addChild(new TokenNode(hex.token, robbed, .015));
        return _this;
    }
    HexNode.prototype.draw = function (ctx) {
        drawHex(this.hex, ctx);
    };
    ;
    return HexNode;
}(Node));
exports.HexNode = HexNode;
var TokenNode = (function (_super) {
    __extends(TokenNode, _super);
    function TokenNode(token, robbed, scale) {
        var _this = _super.call(this) || this;
        _this.token = token;
        _this.robbed = robbed;
        _this.scale = scale;
        return _this;
    }
    TokenNode.prototype.draw = function (ctx) {
        ctx.scale(this.scale, this.scale);
        drawToken(this.token, this.robbed, ctx);
    };
    ;
    return TokenNode;
}(Node));
exports.TokenNode = TokenNode;
var RoadNode = (function (_super) {
    __extends(RoadNode, _super);
    function RoadNode(road, colorMap) {
        var _this = _super.call(this) || this;
        _this.road = road;
        _this.colorMap = colorMap;
        return _this;
    }
    RoadNode.prototype.draw = function (ctx) {
        StructureRenderer.drawRoad(this.road.coord1, this.road.coord2, this.colorMap[this.road.playerID], ctx);
    };
    ;
    return RoadNode;
}(Node));
exports.RoadNode = RoadNode;
var StructureNode = (function (_super) {
    __extends(StructureNode, _super);
    function StructureNode(vertex, colorMap) {
        var _this = _super.call(this) || this;
        _this.vertex = vertex;
        _this.colorMap = colorMap;
        return _this;
    }
    StructureNode.prototype.draw = function (ctx) {
        var worldCoordinate = Grid.vertexToWorld(this.vertex.coordinate, 1);
        ctx.translate(worldCoordinate.x, worldCoordinate.y);
        if (this.vertex.structure !== undefined) {
            StructureRenderer.drawStructure(this.vertex.structure, this.colorMap[this.vertex.playerID], 1, ctx);
        }
    };
    ;
    return StructureNode;
}(Node));
exports.StructureNode = StructureNode;
function drawNode(node, ctx) {
    node.draw(ctx);
    ctx.save();
    node.children.map(function (child) {
        ctx.restore();
        ctx.save();
        drawNode(child, ctx);
    });
    ctx.restore();
}
exports.drawNode = drawNode;
function makeHexNodes(hexes, robber) {
    return hexes.map(function (hex) {
        if (robber.hex == hex) {
            return new HexNode(hex, true);
        }
        else {
            return new HexNode(hex, false);
        }
    });
}
exports.makeHexNodes = makeHexNodes;
function makeRoadNodes(roads, colorMap) {
    return roads.filter(function (road) {
        return road.structure == BoardState.Structure.Road;
    })
        .map(function (road) {
        return new RoadNode(road, colorMap);
    });
}
exports.makeRoadNodes = makeRoadNodes;
function makeVertexNodes(vertices, colorMap) {
    return vertices.map(function (vertex) {
        return new StructureNode(vertex, colorMap);
    });
}
exports.makeVertexNodes = makeVertexNodes;
function drawHex(hex, ctx) {
    var worldCoord = Grid.hexToWorld(hex.coordinate, 1);
    ctx.translate(worldCoord.x, worldCoord.y);
    var tileImage = StructureRenderer.getResourceImage(hex.resource); //get the source path for the hexagon's terrain image
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "#D9B5A0";
    CanvasMethods.hexPath(1, ctx);
    ctx.fill();
    ctx.save();
    Transform.resetTransform(ctx);
    ctx.stroke();
    ctx.restore();
    CanvasMethods.drawHexImage(tileImage, ctx);
}
exports.drawHex = drawHex;
function drawToken(token, robbed, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "black"; //draw a black border for the number
    ctx.lineWidth = 1; //with width 1
    ctx.fillStyle = "beige"; //fill color of the token
    ctx.arc(0, 0, 20, 0, 2 * Math.PI); //draw the token circle
    ctx.save();
    Transform.resetTransform(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    if (robbed) {
        StructureRenderer.drawRobber(0, 0, 50, ctx);
    }
    else {
        if (token == 6 || token == 8) {
            ctx.fillStyle = "red";
        }
        else {
            ctx.fillStyle = "black";
        }
        ctx.font = "24px Times New Roman";
        if (token > 9) {
            ctx.fillText(String(token), -11, 6);
        }
        else {
            ctx.fillText(String(token), -6, 6);
        }
    }
}
exports.drawToken = drawToken;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grid = __webpack_require__(1);
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
// File contains methods dealing with the construction and actions of the robber
/* moveRobber
 * Given a hex, updates the robber's hex position
 */
function moveRobber(robber, hex) {
    robber.hex = hex;
}
exports.moveRobber = moveRobber;
/* robHex
 * Given a hex, a robbing player, a list of vertices and a list of players,
 * steals a random resource from a random opposing player on the hex that the robber is moving to
 */
function robHex(hex, player, vertexList, playerList) {
    var affectedVertices = Grid.vertices(hex.coordinate);
    var affectedPlayers = [];
    for (var i = 0; i < 6; i++) {
        var vert = BoardState.requireVertex(vertexList, affectedVertices[i]);
        if (vert.playerID > 0 && vert.playerID != player.id) {
            affectedPlayers.push(vert.playerID); // Checks each vertex around the hex for opposing players, adding them to a list
        }
    }
    if (affectedPlayers.length == 0) {
        return;
    }
    var randomNum = Math.floor(Math.random() * affectedPlayers.length);
    robPlayer(player, Player.getPlayer(affectedPlayers[randomNum], playerList)); // Robs a random player from those affected
}
exports.robHex = robHex;
/* robPlayer
 * Given a receiving (robbing) player, and a losing (robbed) player, takes one random resource from the
 * losing player and gives it to the receiving player.
 */
function robPlayer(receivingPlayer, losingPlayer) {
    var num = 0;
    var resource = undefined;
    for (var i = 0; i < 5; i++) {
        num += losingPlayer.resources[i]; // num equals total number of resources the losing player has
    }
    if (num == 0) {
        return;
    }
    num -= Math.round(Math.random() * num); // A random number is subtracted from num
    for (var i = 0; i < 5; i++) {
        num -= losingPlayer.resources[i]; // The number the player has of each resource is subtracted, until num reaches 0
        if (num <= 0) {
            resource = i; // has more of are more likely to be robbed
            break;
        }
    }
    receivingPlayer.resources[i]++;
    losingPlayer.resources[i]--;
}
exports.robPlayer = robPlayer;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Constants = __webpack_require__(4);
var Grid = __webpack_require__(1);
var GameTouch = (function () {
    function GameTouch() {
        this.id = undefined;
        this.pos = { x: -1, y: -1 };
        this.down = false;
        this.click = false; // could the mouse be clicking
        this.clicked = false; // has the mouse just clicked
        this.dragging = false; // is the mouse dragging
        this.movement = { x: 0, y: 0 };
    }
    // scroll:Grid.Vector = {x:0,y:0};
    GameTouch.prototype.isActive = function () {
        return this.clicked || this.id != null;
    };
    GameTouch.prototype.step = function () {
        var self = this;
        if (self.id == null) {
            self.clicked = false;
        }
        self.movement = Grid.ident(0);
    };
    GameTouch.prototype.startTouch = function (newtouch) {
        if (this.id == null) {
            this.id = newtouch.identifier;
            this.pos = browserTouchPos(newtouch);
            this.click = true;
            this.down = true;
            this.clicked = false;
            this.dragging = false;
            this.movement = Grid.ident(0);
        }
    };
    ;
    GameTouch.prototype.endTouch = function (newtouch) {
        if (this.id == newtouch.identifier) {
            this.id = undefined;
            this.pos = browserTouchPos(newtouch);
            this.down = false;
            if (this.click) {
                this.clicked = true; // has the mouse just clicked
            }
            this.click = false; // could the mouse be clicking
            this.dragging = false; // is the mouse dragging
            this.movement = { x: 0, y: 0 };
            // this.scroll = {x:0,y:0};
        }
    };
    GameTouch.prototype.moveTouch = function (newtouch) {
        if (newtouch.identifier == this.id) {
            if (this.down) {
                this.movement = Grid.subtract(this.pos, browserTouchPos(newtouch));
            }
            else {
                this.down = true;
                this.movement = Grid.ident(0);
            }
            this.pos = browserTouchPos(newtouch);
            if (Grid.norm(this.movement) < Constants.MAX_TAP_MOVEMENT) {
                this.click = true;
            }
            else {
                this.click = false;
                this.dragging = true;
            }
        }
        return this;
    };
    ;
    return GameTouch;
}());
exports.Touch = GameTouch;
function browserTouchPos(touch) {
    return { x: touch.clientX, y: touch.clientY };
}
;
function mergeTouches(touchA, touchB) {
    var out = new GameTouch();
    out.id = touchA.id || touchB.id;
    out.dragging = touchA.dragging || touchB.dragging;
    out.clicked = touchA.clicked && touchB.clicked;
    out.down = false;
    out.click = false;
    out.pos = Grid.times(0.5, Grid.add(touchA.pos, touchB.pos));
    out.movement = Grid.add(touchA.movement, touchB.movement);
    return out;
}
exports.mergeTouches = mergeTouches;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Touch = __webpack_require__(31);
var TouchManager = (function () {
    function TouchManager() {
        this.touches = [];
    }
    TouchManager.prototype.pruneTouches = function () {
        var self = this;
        self.touches = self.touches.filter(function (touch) {
            return touch.isActive();
        });
    };
    TouchManager.prototype.step = function () {
        var self = this;
        self.touches.forEach(function (t) {
            t.step();
        });
        self.pruneTouches();
    };
    TouchManager.prototype.startTouch = function (touch) {
        var self = this;
        var newtouch = new Touch.Touch;
        newtouch.startTouch(touch);
        self.touches.push(newtouch);
    };
    TouchManager.prototype.endTouch = function (touch) {
        var self = this;
        self.touches.forEach(function (t) {
            t.endTouch(touch);
        });
    };
    TouchManager.prototype.moveTouch = function (touch) {
        var self = this;
        self.touches.forEach(function (t) {
            t.moveTouch(touch);
        });
    };
    TouchManager.prototype.getAggregateTouch = function () {
        var self = this;
        var out = undefined;
        self.touches.forEach(function (touch) {
            if (out == null) {
                out = touch;
            }
            else {
                out = Touch.mergeTouches(out, touch);
            }
        });
        return out;
    };
    return TouchManager;
}());
exports.TouchManager = TouchManager;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="declarations/jquery.d.ts" />

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var View = __webpack_require__(3);
var TouchManager = __webpack_require__(32);
var TouchView = (function (_super) {
    __extends(TouchView, _super);
    function TouchView(listen) {
        var _this = _super.call(this) || this;
        _this.types = ["RequestAggregateTouch"];
        _this.touchManager = new TouchManager.TouchManager();
        _this.touchStarts = [];
        _this.touchEnds = [];
        _this.touchMoves = [];
        var self = _this;
        $(listen).on('touchstart', function (e) {
            e.preventDefault();
            self.touchStarts.push(e.originalEvent);
        });
        $(listen).on('touchend', function (e) {
            e.preventDefault();
            self.touchEnds.push(e.originalEvent);
        });
        $(listen).on('touchmove', function (e) {
            e.preventDefault();
            self.touchMoves.push(e.originalEvent);
        });
        return _this;
    }
    TouchView.prototype.onMessage = function (message, sender) {
        this.processBuffers();
        this.flushBuffers();
        this.sendMessage({ type: "AggregateTouch", touch: this.touchManager.getAggregateTouch() }, sender);
    };
    TouchView.prototype.actOnChangedTouchesFrom = function (buffer, f) {
        buffer.forEach(function (e) {
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                f(touches[i]);
            }
            ;
        });
    };
    TouchView.prototype.flushBuffers = function () {
        var self = this;
        self.touchStarts.length = 0;
        self.touchEnds.length = 0;
        self.touchMoves.length = 0;
    };
    TouchView.prototype.processBuffers = function () {
        var self = this;
        self.touchManager.step();
        self.actOnChangedTouchesFrom(self.touchStarts, function (t) { self.touchManager.startTouch(t); });
        self.actOnChangedTouchesFrom(self.touchEnds, function (t) { self.touchManager.endTouch(t); });
        self.actOnChangedTouchesFrom(self.touchMoves, function (t) { self.touchManager.moveTouch(t); });
    };
    return TouchView;
}(View.ClientView));
exports.TouchView = TouchView;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//This file handles trading within the game. It contains many messages which helps the game
//logic communicate with the trade view.
var BoardState = __webpack_require__(0);
var Player = __webpack_require__(2);
var View = __webpack_require__(3);
var ActiveView;
(function (ActiveView) {
    ActiveView[ActiveView["None"] = 0] = "None";
    ActiveView[ActiveView["FirstWindow"] = 1] = "FirstWindow";
    ActiveView[ActiveView["SecondWindow"] = 2] = "SecondWindow";
})(ActiveView || (ActiveView = {}));
;
var TradeView = (function (_super) {
    __extends(TradeView, _super);
    function TradeView(messageDestination) {
        var _this = _super.call(this, []) || this;
        _this.messageDestination = messageDestination;
        _this.types = ["DisplayTradeView"];
        var self = _this;
        self.activeView = ActiveView.None;
        $(".tradeoffer-screen button.closeWindow").click(function () {
            self.nextWindow();
        });
        self.incomingTradesView = new IncomingTradesView(messageDestination);
        self.makeOfferView = new MakeOfferView(messageDestination);
        self.bankTradingView = new BankTradingView(messageDestination);
        _this.children = [_this.incomingTradesView, _this.makeOfferView, _this.bankTradingView]; // here
        return _this;
    }
    TradeView.prototype.nextWindow = function () {
        switch (this.activeView) {
            case ActiveView.None:
                this.activeView = ActiveView.FirstWindow;
                $("#firstTradeWindow").show();
                this.incomingTradesView.display();
                this.makeOfferView.hide();
                this.bankTradingView.hide();
                break;
            case ActiveView.FirstWindow:
                this.activeView = ActiveView.SecondWindow;
                $("#firstTradeWindow").hide();
                this.incomingTradesView.hide();
                $("#secondTradeWindow").show();
                this.makeOfferView.display();
                this.bankTradingView.display();
                break;
            case ActiveView.SecondWindow:
                this.activeView = ActiveView.None;
                $("#secondTradeWindow").hide();
                this.incomingTradesView.hide();
                this.makeOfferView.hide();
                this.bankTradingView.hide();
                this.sendMessage({ type: "TradeViewClosed" }, this.messageDestination);
                break;
        }
    };
    TradeView.prototype.setMessageDestination = function (destination) {
        this.messageDestination = destination;
        this.incomingTradesView.messageDestination = destination;
        this.makeOfferView.messageDestination = destination;
    };
    TradeView.prototype.getActiveView = function () {
        switch (this.activeView) {
            case ActiveView.None:
                return null;
            case ActiveView.FirstWindow:
                return this.incomingTradesView;
            case ActiveView.SecondWindow:
                return this.makeOfferView;
        }
    };
    TradeView.prototype.onMessage = function (message) {
        this.nextWindow();
    };
    return TradeView;
}(View.ParentClientView));
exports.TradeView = TradeView;
var BankTradingView = (function (_super) {
    __extends(BankTradingView, _super);
    function BankTradingView(messageDestination) {
        var _this = _super.call(this) || this;
        _this.messageDestination = messageDestination;
        _this.types = ["BankableResources"];
        _this.setBankableResources = function (bankResources) {
            var self = this;
            self.clearBankableResources();
            if (bankResources.length == 0) {
                self.disable();
            }
            else {
                self.enable();
            }
            bankResources.forEach(function (resource) {
                $("#offer-resources-bank>select").append(self.newBankOption(resource));
            });
        };
        var self = _this;
        $("#bankTradeConfirmButton").click(function () {
            self.trade();
            self.display();
        });
        return _this;
    }
    BankTradingView.prototype.onMessage = function (message) {
        this.setBankableResources(message.bankResources);
    };
    BankTradingView.prototype.display = function () {
        this.sendMessage({ type: "RequestBankableResources" }, this.messageDestination);
    };
    BankTradingView.prototype.clearBankableResources = function () {
        $("#offer-resources-bank>select").empty();
    };
    BankTradingView.prototype.hide = function () {
        this.clearBankableResources();
    };
    BankTradingView.prototype.newBankOption = function (resource) {
        return $("<option value=" + resource + "> " + BoardState.getResourceName(resource) + "</option>");
    };
    BankTradingView.prototype.getOfferResource = function () {
        return parseInt($("#offer-resources-bank>select").val());
    };
    BankTradingView.prototype.getRequestResource = function () {
        return parseInt($("#request-resources-bank>select").val());
    };
    BankTradingView.prototype.trade = function () {
        this.sendMessage({
            type: "TradeWithBank",
            offerResource: this.getOfferResource(),
            requestResource: this.getRequestResource()
        }, this.messageDestination);
    };
    BankTradingView.prototype.disable = function () {
        $("#bankTradeConfirmButton").prop("disabled", true);
    };
    BankTradingView.prototype.enable = function () {
        $("#bankTradeConfirmButton").prop("disabled", false);
    };
    return BankTradingView;
}(View.ClientView));
exports.BankTradingView = BankTradingView;
var IncomingTradesView = (function (_super) {
    __extends(IncomingTradesView, _super);
    function IncomingTradesView(messageDestination) {
        var _this = _super.call(this) || this;
        _this.messageDestination = messageDestination;
        _this.types = ["SetIncomingTrades", "AcceptValidation"];
        var self = _this;
        self.incomingTradeTemplate = $('#templateTradeOffer');
        $("#incomingTrades>#reject-all").click(self.clearOffers);
        return _this;
    }
    IncomingTradesView.prototype.clearOffers = function () {
        $("#incomingTrades>#offers").empty();
    };
    IncomingTradesView.prototype.hide = function () {
        this.clearOffers();
    };
    ;
    IncomingTradesView.prototype.newDOMTradeDisplay = function () {
        return $("<table class=trade>" +
            "<tr>" +
            "<th></th>" +
            "<th>Lumber</th>" +
            "<th>Wool</th>" +
            "<th>Ore</th>" +
            "<th>Brick</th>" +
            "<th>Grain</th>" +
            "</tr>" +
            "<tr offer>" +
            "<th> Offer </th>" +
            "<td resource=" + BoardState.Resource.Lumber + ">0</td>" +
            "<td resource=" + BoardState.Resource.Wool + ">0</td>" +
            "<td resource=" + BoardState.Resource.Ore + ">0</td>" +
            "<td resource=" + BoardState.Resource.Brick + ">0</td>" +
            "<td resource=" + BoardState.Resource.Grain + ">0</td>" +
            "</tr>" +
            "<tr request>" +
            "<th> Request </th>" +
            "<td resource=" + BoardState.Resource.Lumber + ">0</td>" +
            "<td resource=" + BoardState.Resource.Wool + ">0</td>" +
            "<td resource=" + BoardState.Resource.Ore + ">0</td>" +
            "<td resource=" + BoardState.Resource.Brick + ">0</td>" +
            "<td resource=" + BoardState.Resource.Grain + ">0</td>" +
            "</tr>" +
            "</table>");
    };
    IncomingTradesView.prototype.setTradeDisplay = function (display, trade) {
        trade.offerResources.forEach(function (amount, resource) {
            $("tr[offer]>td[resource=" + resource + "]", display).html(amount.toString());
        });
        trade.requestResources.forEach(function (amount, resource) {
            $("tr[request]>td[resource=" + resource + "]", display).html(amount.toString());
        });
    };
    IncomingTradesView.prototype.newTradeDOM = function (trade) {
        var out = this.newDOMTradeDisplay();
        this.setTradeDisplay(out, trade);
        return out;
    };
    IncomingTradesView.prototype.newDOMTradeOffer = function (trade) {
        var self = this;
        var out = this.incomingTradeTemplate.clone();
        out.removeAttr('id');
        out.attr('tradeID', trade.tradeID);
        $(".offerer", out).html('From: Player ' + trade.offererID);
        $(".details", out).append(this.newTradeDOM(trade));
        $("button.acceptOffer", out).click(function () {
            self.sendMessage({ type: "AcceptTrade", tradeID: trade.tradeID }, self.messageDestination);
            out.remove();
        });
        $("button.rejectOffer", out).click(function () {
            out.remove();
        });
        return out;
    };
    IncomingTradesView.prototype.display = function () {
        this.sendMessage({ type: "RequestIncomingTrades" }, this.messageDestination);
        this.sendMessage({ type: "RequestAcceptValidations" }, this.messageDestination);
    };
    IncomingTradesView.prototype.joinJQueryArray = function (arr) {
        var out = [];
        arr.forEach(function (e) {
            out = $.merge(out, [e]);
        });
        return out;
    };
    IncomingTradesView.prototype.displayIncomingTrades = function (trades) {
        var self = this;
        var DOMOffers = this.joinJQueryArray(trades.map(function (trade) {
            return self.newDOMTradeOffer(trade);
        }));
        $("#incomingTrades>#offers").append(DOMOffers);
        $("#incomingTrades>#offers .tradeOffer").append($("<br />"));
    };
    IncomingTradesView.prototype.processAcceptValidation = function (message) {
        $("#incomingTrades>#offers>div.tradeOffer[tradeID=" + message.tradeID + "] button.acceptOffer").prop("disabled", !message.validation);
    };
    IncomingTradesView.prototype.onMessage = function (message) {
        switch (message.type) {
            case "SetIncomingTrades":
                this.displayIncomingTrades(message.trades);
                break;
            case "AcceptValidation":
                this.processAcceptValidation(message);
                break;
        }
    };
    ;
    return IncomingTradesView;
}(View.ClientView));
exports.IncomingTradesView = IncomingTradesView;
var MakeOfferView = (function (_super) {
    __extends(MakeOfferView, _super);
    function MakeOfferView(messageDestination) {
        var _this = _super.call(this) || this;
        _this.messageDestination = messageDestination;
        _this.types = ["GameState"];
        _this.display = function () {
            this.sendMessage({ type: "RequestGameState" }, this.messageDestination);
        };
        var self = _this;
        $("#resetOffer").click(function () {
            self.resetResources();
        });
        $("#makeOffer").click(function () {
            self.makeOffer();
            self.resetResources();
        });
        return _this;
    }
    MakeOfferView.prototype.newTargetOption = function (id) {
        return $("<option value=" + id + "> Player " + id + " </option>");
    };
    MakeOfferView.prototype.hide = function () {
        this.resetResources();
        this.clearTargets();
    };
    MakeOfferView.prototype.resetResources = function () {
        $("#offerCreator input.resource-input[resource]").val(0);
    };
    MakeOfferView.prototype.clearTargets = function () {
        $("select#targetPlayer").empty();
    };
    MakeOfferView.prototype.makeOffer = function () {
        var offerResources = this.getResources($("#offer-resources"));
        var requestResources = this.getResources($("#request-resources"));
        var targetID = parseInt($("select#targetPlayer").val());
        this.sendMessage({ type: "MakeOffer", targetID: targetID, offerResources: offerResources, requestResources: requestResources }, this.messageDestination);
    };
    MakeOfferView.prototype.getResources = function (par) {
        var out = [];
        out[BoardState.Resource.Lumber] = this.getVal(par, BoardState.Resource.Lumber);
        out[BoardState.Resource.Wool] = this.getVal(par, BoardState.Resource.Wool);
        out[BoardState.Resource.Ore] = this.getVal(par, BoardState.Resource.Ore);
        out[BoardState.Resource.Brick] = this.getVal(par, BoardState.Resource.Brick);
        out[BoardState.Resource.Grain] = this.getVal(par, BoardState.Resource.Grain);
        return out;
    };
    MakeOfferView.prototype.getVal = function (par, resource) {
        return Math.round(parseFloat($("input.resource-input[resource=" + BoardState.getResourceName(resource) + "]", par).val()));
    };
    MakeOfferView.prototype.setupInputCorrection = function (resources) {
        $("input.resource-input[resource]").attr("max", 99);
        $("#offer-resources input.resource-input[resource=Lumber]").attr("max", resources[BoardState.Resource.Lumber]);
        $("#offer-resources input.resource-input[resource=Wool]").attr("max", resources[BoardState.Resource.Wool]);
        $("#offer-resources input.resource-input[resource=Ore]").attr("max", resources[BoardState.Resource.Ore]);
        $("#offer-resources input.resource-input[resource=Brick]").attr("max", resources[BoardState.Resource.Brick]);
        $("#offer-resources input.resource-input[resource=Grain]").attr("max", resources[BoardState.Resource.Grain]);
        $("input.resource-input[resource]").change(function (ev) {
            var valFloat = parseFloat($(ev.target).val());
            var val = Math.round(valFloat);
            var max = Math.round(parseFloat($(ev.target).attr("max")));
            var min = Math.round(parseFloat($(ev.target).attr("min")));
            if (isNaN(val)) {
                $(ev.target).val(min);
            }
            else {
                if (val != valFloat) {
                    $(ev.target).val(val);
                }
                if (val > max) {
                    $(ev.target).val(max);
                }
                else if (val < min) {
                    $(ev.target).val(min);
                }
            }
        });
    };
    MakeOfferView.prototype.displayOfferDesigner = function (gamestate) {
        var self = this;
        Player.getPlayerIDs(gamestate.players).forEach(function (id) {
            if (id != gamestate.currentPlayer.id) {
                $("select#targetPlayer").append(self.newTargetOption(id));
            }
        });
        this.setupInputCorrection(Player.getPlayersResources(gamestate.currentPlayer));
    };
    MakeOfferView.prototype.onMessage = function (message) {
        this.hide();
        this.displayOfferDesigner(message.gameState);
    };
    return MakeOfferView;
}(View.ClientView));
exports.MakeOfferView = MakeOfferView;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="declarations/jquery.d.ts" />

Object.defineProperty(exports, "__esModule", { value: true });
var Init_1 = __webpack_require__(17);
// import * as JQuery from "jquery"
// requirejs.config({
//     baseUrl: './apps/',
//     paths: {
//         jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min",
//     }
// });
// require(["https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"], function($:any) { 
$(document).ready(function () {
    console.log("webpack is sht");
    Init_1.main();
});
// })
// require(['jquery'], function ($:any) {
//     $(document).ready(() => {
//         main();
//     });
// }); 


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map