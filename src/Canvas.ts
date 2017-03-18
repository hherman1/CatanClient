//MouseView ?
import * as Grid from "./Grid"
import * as Transform from "./Transform"
import * as Player from "./Player"
import * as BoardState from "./BoardState"
import * as Hitbox from "./Hitbox"
import * as CanvasMethods from "./CanvasMethods"
import * as RenderTree from "./RenderTree"
import * as Animation from "./Animation"
import * as View from "./View"
import * as GameState from "./GameState"

/*
* CANVAS.JS
*Canvas.js contains functions to draw/render objects onto the window.
*/

export interface Graphics {
    renderedHexes:HTMLImageElement|HTMLCanvasElement,
    animations:Animation.Animation[],
    transform:Transform.Transform
}
export function drawHexes(gamestate:GameState.GameState,scale:number,ctx:CanvasRenderingContext2D) {
    var tree = new RenderTree.ScaleNode(scale);
    tree.addChildren(RenderTree.makeHexNodes(gamestate.board.hexes, gamestate.board.robber));
    RenderTree.drawNode(tree,ctx);
}


export function generateHexCanvas(gamestate:GameState.GameState,scale:number) {
    var $canvas = $("<canvas></canvas>");
    $canvas.attr("width","1000");
    $canvas.attr("height","1000");
    var ctx = (<HTMLCanvasElement>$canvas[0]).getContext("2d");
    if(!ctx) {
        throw "could not get rendering context"
    }
    ctx.translate(500,500);
    drawHexes(gamestate,scale,ctx);
    return <HTMLCanvasElement>$canvas[0];
}

export interface RenderGameCanvas  extends View.Message<"RenderGameCanvas"> {
    gamestate:GameState.GameState,
    highlight:BoardState.Position.Road | BoardState.Position.Vertex | undefined,
    graphics:Graphics,
    side:number
}
export interface AdjustTranslation extends View.Message<"AdjustTranslation"> {
    translation:Grid.Vector
}
export interface AdjustScale extends View.Message<"AdjustScale"> {
    adjustment:number;
}
export interface RequestHits extends View.Message<"RequestHits"> {
    coordinate:Grid.Point
}
export interface SetHitboxes extends View.Message<"SetHitboxes"> {
    hitboxes:Hitbox.Hitbox[]
}
export interface HitsData extends View.Message<"HitsData"> {
    hits:Hitbox.Hitbox[]
}

type Incoming = RenderGameCanvas | AdjustScale | AdjustTranslation | SetHitboxes | RequestHits
export class CanvasRenderView extends View.ClientView<Incoming,HitsData> {
    types:string[] = ["RenderGameCanvas","AdjustScale","AdjustTranslation","SetHitboxes","RequestHits"]
    transform:Transform.Transform;
    hitboxes:Hitbox.Hitbox[] = [];
    constructor(protected ctx:CanvasRenderingContext2D) {
        super();
        var self = this;
        self.ctx = ctx;
        this.transform = {
            translation: Grid.center({x:ctx.canvas.width,y:ctx.canvas.height}),
            scale: 1
        };
    }
    onMessage(message:Incoming,sender:View.Client<any,Incoming>) {
        switch(message.type) {
            case "RenderGameCanvas":
                redraw(message.gamestate
                    ,message.highlight
                    ,message.graphics
                    ,this.transform
                    ,message.side
                    ,this.ctx);
            break;
            case "AdjustTranslation":
                this.transform.translation = Grid.add(this.transform.translation
                    ,message.translation);
            break;
            case "AdjustScale":
                this.transform.scale = CanvasMethods.newScale(message.adjustment
                    ,this.transform.scale);
            break;
            case "SetHitboxes":
                this.hitboxes = message.hitboxes;
            break;
            case "RequestHits":
                var hitlist = Hitbox.transformHitlist(this.hitboxes,this.transform);
                var hits = Hitbox.getHits(hitlist,message.coordinate);
                this.sendMessage({type:"HitsData",hits:hits},sender)
                break;
        }
    }
}

export function redraw(gamestate:GameState.GameState,highlight:BoardState.Position.Vertex | BoardState.Position.Road | undefined,
    graphics:Graphics,transform:Transform.Transform,side:number,ctx:CanvasRenderingContext2D) {
    var colorMap = Player.getPlayerColors(gamestate.players);
    var currentPlayerColor = colorMap[gamestate.currentPlayer.id];
    
    var hexes = gamestate.board.hexes;
    var roads = gamestate.board.roads;
    var vertices = gamestate.board.vertices;
    
    if(highlight !== undefined) {
        switch(highlight.type) {
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
    renderTree.addChild(new RenderTree.RadialGradientNode(side*20,"#77B2EB","blue"));
    renderTree.addChild(new RenderTree.CenteredImageNode(graphics.renderedHexes));
    
    var scaled = new RenderTree.ScaleNode(side);
    scaled.addChildren(RenderTree.makeRoadNodes(roads,colorMap));
    scaled.addChildren(RenderTree.makeVertexNodes(vertices,colorMap));
    renderTree.addChild(scaled);
    RenderTree.drawNode(renderTree,ctx);
    
    graphics.animations = Animation.pruneAnimations(graphics.animations);
    if(graphics.animations.length > 0)  {
        Animation.drawAnims(graphics.animations,graphics.transform,ctx);
    }
}

