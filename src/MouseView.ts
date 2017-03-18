import * as Mouse from "./Mouse"
import * as View from "./View"

function logger<T>(log:T[]) {
    return function(x:T) {
        log.push(x);
    }
}

function initMouseBuffer(elem:HTMLElement,buffer:Mouse.MouseBuffer) {
        // elem instead of document is more reliable, but is unpleasant.
    document.addEventListener("mousemove",logger(buffer.mouseMoves));
    elem.addEventListener("mousedown",logger(buffer.mouseDowns));
    elem.addEventListener("wheel",logger(buffer.mouseScrolls));
    document.addEventListener("mouseup",logger(buffer.mouseUps));
}
function flushMouseEvents(mousebuffer:Mouse.MouseBuffer) {
    mousebuffer.mouseMoves.length = 0;
    mousebuffer.mouseDowns.length = 0;
    mousebuffer.mouseUps.length = 0;
    mousebuffer.mouseScrolls.length = 0;
}

export type RequestMouseData = View.BlankMessage<"RequestMouseData">
export interface MouseData extends View.Message<"MouseData"> {
    mouse:Mouse.Mouse
}
export class MouseView extends View.ClientView<RequestMouseData,MouseData> {
    types:["RequestMouseData"]
    mouseEventBuffer:Mouse.MouseBuffer = {
        mouseDowns:[],
        mouseMoves:[],
        mouseScrolls:[],
        mouseUps:[]
    }
    mouse:Mouse.Mouse = {
        button:0,
        clicked:false,
        down:false,
        downPos:undefined,
        dragging:false,
        movement:{x:0,y:0},
        pos:{x:0,y:0},
        scroll:{x:0,y:0}
    };
    constructor(listener:HTMLElement) {
        super();
        initMouseBuffer(listener,this.mouseEventBuffer);
    }
    onMessage(message:RequestMouseData,sender:View.Client<any,RequestMouseData>) {
        this.mouse = Mouse.processMouseBuffer(this.mouse,this.mouseEventBuffer);
        flushMouseEvents(this.mouseEventBuffer);
        this.sendMessage({type:"MouseData",mouse:this.mouse},sender);
    }
}
