import * as Grid from "./Grid"
import * as BoardState from "./BoardState"
import * as Transform from "./Transform"
import * as StructureRenderer from "./StructureRenderer"
import * as CanvasMethods from "./CanvasMethods"
import * as Player from "./Player"


export abstract class Node {
    abstract draw(ctx:CanvasRenderingContext2D):void;
    children:Node[] = [];
    addChild(child:Node) {addChild(child,this)};
    addChildren(children:Node[]) {addChildren(children,this)};
}

export function addChild(childNode:Node,parentNode:Node) {
    parentNode.children.push(childNode);
}
export function addChildren(children:Node[],parentNode:Node) {
    parentNode.children = parentNode.children.concat(children);
}


export class BlankNode extends Node {
    draw(){};
}

export class CenteredImageNode extends Node {
    constructor(protected img:HTMLImageElement|HTMLCanvasElement) {
        super();
        this.addChild(new ImageNode(img));
    }
    draw(ctx:CanvasRenderingContext2D) {
        ctx.translate(-1/2 * this.img.width,-1/2 * this.img.height);
    }
}

export class ImageNode extends Node{
    constructor(protected img:HTMLImageElement|HTMLCanvasElement) {super()}
    draw(ctx:CanvasRenderingContext2D){ctx.drawImage(this.img,0,0);};
}

export class TransformNode extends Node {
    constructor(protected transform:Transform.Transform) {super()}
   draw(ctx:CanvasRenderingContext2D) {
        Transform.setTransform(this.transform,ctx);
    };
}

export class ScaleNode extends Node {
    constructor(protected scale:number) {super()}
    draw(ctx:CanvasRenderingContext2D) {
        ctx.scale(this.scale,this.scale);
    }
}

export class RadialGradientNode extends Node{
    constructor(protected radius:number,protected startColor:string,protected endColor:string) {super()}
    draw(ctx:CanvasRenderingContext2D) {
        var gradient = ctx.createRadialGradient(0,0,0
        ,0,0,this.radius);
        gradient.addColorStop(0,this.startColor);
        gradient.addColorStop(1,this.endColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.radius,-this.radius,2*this.radius,2*this.radius);
    }
}

export class HexNode extends Node {
    constructor(protected hex:BoardState.Position.Hex, protected robbed:boolean) { 
        super()
        this.addChild(new TokenNode(hex.token, robbed, .015));
    }
    draw(ctx:CanvasRenderingContext2D) {
        drawHex(this.hex,ctx);
    };
}

export class TokenNode extends Node{
    constructor(protected token:number, protected  robbed:boolean, protected scale:number) { super() }
    draw(ctx:CanvasRenderingContext2D) {
        ctx.scale(this.scale,this.scale);
        drawToken(this.token, this.robbed, ctx);
    };
}

export class RoadNode extends Node {
    constructor(protected road:BoardState.Position.Road, protected colorMap:Player.Colors[]) { super() }
    draw(ctx:CanvasRenderingContext2D) {
        StructureRenderer.drawRoad(this.road.coord1,this.road.coord2,this.colorMap[this.road.playerID],ctx);
    };
}
export class StructureNode extends Node {
    constructor(protected vertex:BoardState.Position.Vertex,protected colorMap:Player.Colors[]) { super() }
    draw(ctx:CanvasRenderingContext2D) {
        var worldCoordinate = Grid.vertexToWorld(this.vertex.coordinate,1);
        ctx.translate(worldCoordinate.x,worldCoordinate.y);
        if(this.vertex.structure !== undefined) {
            StructureRenderer.drawStructure(this.vertex.structure,this.colorMap[this.vertex.playerID],1,ctx);
        }
    };
}



export function drawNode(node:Node,ctx:CanvasRenderingContext2D) {
    node.draw(ctx);
    ctx.save();
    node.children.map(function(child) {
        ctx.restore();
        ctx.save();
        drawNode(child,ctx);
    });
    ctx.restore();
}

export function makeHexNodes(hexes:BoardState.Position.Hex[], robber:BoardState.Robber) {
    return hexes.map(function(hex) {
        if(robber.hex == hex){
            return new HexNode(hex, true);
        }
        else {
            return new HexNode(hex, false);
        }
    })
}
export function makeRoadNodes(roads:BoardState.Position.Road[],colorMap:Player.Colors[]) {
    return roads.filter(function(road) {
        return road.structure == BoardState.Structure.Road;
    })
    .map(function(road) {
        return new RoadNode(road,colorMap);
    });
}
export function makeVertexNodes(vertices:BoardState.Position.Vertex[],colorMap:Player.Colors[]) {
    return vertices.map(function(vertex) {
        return new StructureNode(vertex,colorMap);
    });
}

export function drawHex(hex:BoardState.Position.Hex,ctx:CanvasRenderingContext2D) {
    var worldCoord = Grid.hexToWorld(hex.coordinate,1);
    ctx.translate(worldCoord.x,worldCoord.y);
    var tileImage = StructureRenderer.getResourceImage(hex.resource); //get the source path for the hexagon's terrain image
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "#D9B5A0";
    CanvasMethods.hexPath(1,ctx);
    ctx.fill();
    ctx.save();
    Transform.resetTransform(ctx);
    ctx.stroke();
    ctx.restore();
    CanvasMethods.drawHexImage(tileImage, ctx);
    
}

export function drawToken(token:number, robbed:boolean, ctx:CanvasRenderingContext2D){
    ctx.beginPath();
    ctx.strokeStyle="black"; //draw a black border for the number
    ctx.lineWidth=1; //with width 1
    ctx.fillStyle="beige"; //fill color of the token
    ctx.arc(0,0, 20, 0, 2*Math.PI); //draw the token circle
    ctx.save();
    Transform.resetTransform(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    if (robbed) {
        StructureRenderer.drawRobber(0,0,50,ctx);
    }
    else{
        if (token == 6 || token == 8){
            ctx.fillStyle="red";
        }
        else{
            ctx.fillStyle="black";
        }
        
        ctx.font = "24px Times New Roman";
        if (token > 9){
            ctx.fillText(String(token),-11,6);
        }
        else{
            ctx.fillText(String(token),-6,6);
        }
    }
    
}
    

