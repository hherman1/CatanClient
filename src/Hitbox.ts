// define(['Grid','Transform','BoardState'],function(Grid,Transform,BoardState) {

import * as Grid from "./Grid"
import * as Transform from "./Transform"
import * as BoardState from "./BoardState"

/* Hitbox Object
 * {center:vector,
 *  dimension:vector, - Positive values
 *  data: any
 *  }
 *
 *  Hitcircle
 *  {center:vector,
 *  radius:int,
 *  data:any
 *  }
 */
export type Hitbox = HitboxBox | HitboxCircle
export interface HitboxBox  {
	kind:"box";
	center:Grid.Point;
	dimension:Grid.Vector;
	data:BoardState.Position.Any;
	rotation:number;
}

export interface HitboxCircle  {
	kind:"circle";
	center:Grid.Point;
	radius:number;
	data:BoardState.Position.Any;
}
// export function isHitboxBox(hb:Hitbox): hb is HitboxBox {
//         return (<HitboxBox>hb).rotation !== undefined;
// }
export function isHit(hitbox: Hitbox,loc:Grid.Point) {
	switch(hitbox.kind) {
		case "box":
			var t = Grid.multiplyMatrix(Grid.rotationMatrix(-hitbox.rotation)
							,Grid.add(loc,Grid.times(-1,hitbox.center)));
			return (t.x <= hitbox.dimension.x && t.y <= hitbox.dimension.y
				&& t.x >= -hitbox.dimension.x && t.y >= -hitbox.dimension.y)
		case "circle":
			return (Grid.norm(Grid.add(Grid.times(-1,loc),hitbox.center)) < hitbox.radius)
	}
}

//Will crash if vertex/road cant be found
export function getHitboxStructure(vertices:BoardState.Position.Vertex[],roads:BoardState.Position.Road[],box: Hitbox) {
	switch(box.data.type) {
		case BoardState.Position.Type.Vertex:
			return (BoardState.requireVertex(vertices,box.data.coordinate)).structure;
		case BoardState.Position.Type.Road:
			return (BoardState.findRoad(roads,box.data.coord1,box.data.coord2)).structure;
	}
}

//testBox = new Hitbox.Box(hexToWorld(new Vector(1,1),50),new Vector(10,10),new Vector (0,1),Math.PI/3)

//testBox2 = new Hitbox.Box(new Vector(300,200),new Vector(50,200),new Vector (0,1),Math.PI/6)

export function transformHitlist(boxes:Hitbox[],trans:Transform.Transform) {
	return boxes.map(function(box){return transformHitbox(box,trans)})
}
export function transformHitbox(box:Hitbox,trans:Transform.Transform):Hitbox {
	switch(box.kind) {
		case "box":
			return {kind:"box",
				center:Transform.transform(box.center,trans),
				dimension:Grid.times(trans.scale,box.dimension),
				data:box.data,
				rotation:box.rotation}
		case "circle":
			return {kind:"circle",
				center:Transform.transform(box.center,trans),
				radius:trans.scale * box.radius,
				data:box.data}
	}

}


export function genHitboxes(vertices:BoardState.Position.Vertex[],roads:BoardState.Position.Road[],hexes:BoardState.Position.Hex[],side:number):Hitbox[] { 
	return (<Hitbox[]>genVertexBoxes(vertices,side))
		.concat(genHexBoxes(hexes,side))
		.concat(genRoadBoxes(roads,side));
}

export function genHexBoxes(hexes:BoardState.Position.Hex[],side:number):HitboxCircle[] {
	return hexes.map(function(hc) {
		return <HitboxCircle>{
			kind:"circle",
			center:Grid.hexToWorld(hc.coordinate,side),
			radius:side/(2*Math.tan(Math.PI/6)),
			data:hc
		};
	})
}

export function genVertexBoxes(vertices:BoardState.Position.Vertex[],side:number) {
	return vertices.map(function(vertex) {
		return <HitboxCircle>{
			kind:"circle",
			center:Grid.vertexToWorld(vertex.coordinate,side),
			radius:side/4,
			data:vertex
		}
	})
}
export function genRoadBoxes(roads:BoardState.Position.Road[],side:number) {
	return roads.map(function(r) {return genRoadBox(r,side)});
}

export function genRoadBox(road:BoardState.Position.Road,side:number) {
	var w1 = Grid.vertexToWorld(road.coord1,side);
	var w2 = Grid.vertexToWorld(road.coord2,side);
	var cost = Grid.dotProduct({x:1,y:0},Grid.add(w1,Grid.times(-1,w2)))/(side);
	if (cost < -1) {
		cost = -1;
	} else if (cost > 1) {
		cost = 1;
	}
	var diff = Grid.add(w1,Grid.times(-1,w2));
	var rotation = Math.atan(diff.y/diff.x);
	var center = Grid.times(0.5,Grid.add(w1,w2));
	return <HitboxBox>{
			kind:"box",
			center:center,
			dimension:{x:side/2,y:side/3},
			data:road,
			rotation:rotation
	}
}




export function updateCenter(box:Hitbox,f: (arg:Grid.Vector) => Grid.Vector ) {
    box.center = f(box.center);
    return box
}

export function getHits(hitList:Hitbox[],coord:Grid.Vector) {
    return hitList.filter(function(box) {
	    return isHit(box,coord)
    })
}

export function topRight(box:HitboxBox) {
	return Grid.add(box.center,box.dimension)
}
export function bottomLeft(box:HitboxBox) {
	return Grid.add(box.center,Grid.times(-1,box.dimension))
}

export function boxCorners(box:HitboxBox) {
	var t =  [box.dimension
		 ,Grid.piecewiseTimes({x:1,y:-1},box.dimension)
		 ,Grid.piecewiseTimes({x:-1,y:-1},box.dimension)
		 ,Grid.piecewiseTimes({x:-1,y:1},box.dimension)
		 ]
	return t.map(function(p) {
	    return Grid.add(box.center,Grid.multiplyMatrix(Grid.rotationMatrix(box.rotation),p));
	})
}
