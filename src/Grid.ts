/* Vector object:
 * {x: int, y: int}
 *
 */

 //This is a test line. Please delete it when you find it!
 //

export interface Vector {
        x:number,
        y:number
}
export interface Point extends Vector{};
// export interface Point extends Vector {};
export interface Mat2 {
        0: {
                0:number,
                1:number
        },
        1: {
                0:number,
                1:number
        }
}

export var unitY = unitVector(Math.PI/3)



export function dotProduct(v1:Vector,v2:Vector):number {
        return sum(piecewiseTimes(v1,v2))
}

export function sum(v:Vector) {
        return v.x + v.y
}

export function ident(v:number):Vector {
        return {x:v,y:v}
}
export function identX(x:number):Vector {
        return {x:x,y:0}
}
export function identY(y:number):Vector {
        return {x:0,y:y}
}
export function setX(x:number,c:Vector):Vector {
        c.x = x;
        return c
}
export function setY(c:Vector,y:number):Vector {
        c.y = y;
        return c
}


export function vectorEquals(vector1:Vector, vector2:Vector){
    return (vector1.x == vector2.x)&&(vector1.y==vector2.y)
}

export function add(c1:Vector,c2:Vector):Vector {
        return {x:c1.x + c2.x,
                y:c1.y + c2.y}
}
export function subtract(c1:Vector,c2:Vector):Vector {
        return add(c1,times(-1,c2));
}
export function times(s:number,c:Vector):Vector {
        return piecewiseTimes(ident(s),c)
}

export function piecewiseTimes(c1:Vector,c2:Vector):Vector {
        return {x:c1.x*c2.x,
                y:c1.y*c2.y}
}

export function center(vector:Vector):Vector {
    return times(0.5,vector);
}

export function norm(vector:Vector) {
        return Math.sqrt(vector.x*vector.x + vector.y*vector.y)
}

export function unitVector(theta:number):Vector {
        return {x:Math.cos(theta),y:Math.sin(theta)}
}
export function rotationMatrix(theta:number):Mat2 {
        return {
                0:{
                        0:Math.cos(theta),
                        1:-Math.sin(theta)
                },
                1:{
                        0:Math.sin(theta),
                        1:Math.cos(theta)
                }
        }
}
export function multiplyMatrix(mat:Mat2,vec:Vector):Vector {
        return {
                x:mat[0][0] * vec.x + mat[0][1] * vec.y,
                y:mat[1][0] * vec.x + mat[1][1] * vec.y
        }
}

export function even(n:number) {
        return n%2 == 0
}

export function vertexNeighbors(vertex:Vector) {
        if(even(vertex.y)) {
            return [add({x:0,y:1},vertex),
                    add({x:-1,y:1},vertex),
                    add({x:0,y:-1},vertex)]
        } else {
            return [add({x:0,y:1},vertex),
                    add({x:0,y:-1},vertex),
                    add({x:1,y:-1},vertex)]
        }
}

export function vertices(hexCoords:Vector) {
        return [piecewiseTimes({x:1,y:2},hexCoords)
                ,add(identY(1),piecewiseTimes({x:1,y:2},hexCoords))
                ,add(identX(1),piecewiseTimes({x:1,y:2},hexCoords))
                ,add({x:1,y:-1},piecewiseTimes({x:1,y:2},hexCoords))
                ,add({x:1,y:-2},piecewiseTimes({x:1,y:2},hexCoords))
                ,add(identY(-1),piecewiseTimes({x:1,y:2},hexCoords))]
}

export function adjacentHexes(vertCoords:Vector){
    var hexCoords:Vector[] = [];
    if(vertCoords.y%2==0){
        hexCoords.push({x:vertCoords.x,y:vertCoords.y/2});
        hexCoords.push({x:vertCoords.x-1,y: vertCoords.y/2});
        hexCoords.push({x:vertCoords.x-1,y: vertCoords.y/2+1});
    }
    else{
        hexCoords.push({x:vertCoords.x,y:Math.floor(vertCoords.y/2)});
        hexCoords.push({x:vertCoords.x,y:(vertCoords.y+1/2)});
        hexCoords.push({x:vertCoords.x-1,y:(vertCoords.y+1/2)});
    }
    return hexCoords;


}

export function neighbours(hexcoords:Vector) {
    return[ add({x:0,y:1},hexcoords),
            add({x:1,y:0},hexcoords),
            add({x:1,y:-1},hexcoords),
            add({x:0,y:-1},hexcoords),
            add({x:-1,y:0},hexcoords),
            add({x:-1,y:1},hexcoords)]
}



export function hexPoints(coords:Vector,radius:number) {
    var out = [];
    out.push(add(identX(-radius),coords));
    out.push(add(times(-radius,unitY),coords));
    out.push(add(piecewiseTimes({x:radius,y:-radius},
                                unitY),
                 coords));
    out.push(add(identX(radius),coords));
    out.push(add(times(radius,unitY),coords));
    out.push(add(piecewiseTimes({x:-radius,y:radius},
                                unitY),
                 coords));
    return out
}

export function hexToWorld(hexcoords:Vector,side:number) {
    return piecewiseTimes({x:Math.cos(Math.PI/6)*side*2,y:2*-side*Math.sin(Math.PI/3)},fromHex(hexcoords))
}
export function vertexToWorld(vcoords:Vector,side:number) {
    return add({x:-side*Math.sin(Math.PI/3),y:-side/2},
              piecewiseTimes({x:side,y:-side},fromVertex(vcoords)))

}




export function fromVertex(vcoords:Vector) {
    var yunits = times(Math.ceil(vcoords.y/2),{x:Math.cos(Math.PI/6),y:Math.sin(Math.PI/6)});
    var regunits = 2*Math.floor(vcoords.y/2) * Math.sin(Math.PI/6);
    var xdelta = 2*vcoords.x*Math.cos(Math.PI/6)
    return add({x:xdelta,y:regunits},yunits);
}

export function fromHex(hexcoords:Vector) {
    return add(identX(hexcoords.x),
                     times(hexcoords.y,unitY))
}
