import * as Constants from "./Constants"
import * as Grid from "./Grid"

export interface Mouse {
    pos:Grid.Point;
    button:number;
    down:boolean; // is mouse1 currently down
    downPos:Grid.Point | undefined;
    clicked:boolean;
    dragging:boolean;
    movement:Grid.Vector;
    scroll:Grid.Vector;
    
}
// var Mouse = function() {
    //         this.pos = new Grid.Vector(-1,-1);
    //         this.button = -1;
    //         this.click = 0; // could the mouse be clicking
    //         this.clicked = 0; // has the mouse just clicked
    //         this.dragging = 0; // is the mouse dragging
    //         this.movement = new Grid.Vector(0,0);
    //         this.scroll = new Grid.Vector(0,0);
    // }
    
export interface MouseBuffer {
    mouseMoves:MouseEvent[];
    mouseDowns: MouseEvent[];
    mouseUps: MouseEvent[];
    mouseScrolls: WheelEvent[];
}

export function processMouseBuffer(mouse:Mouse,mousebuffer:MouseBuffer) {
    mouse.clicked = false;
    mouse.movement.x = 0;
    mouse.movement.y = 0;
    mouse.scroll.x = 0;
    mouse.scroll.y = 0;
    if(mousebuffer.mouseScrolls.length > 0) {
        //var wheel = collapseWheelEvents(mousebuffer.mouseScrolls);
        mousebuffer.mouseScrolls.forEach(function(scroll) {
            mouse.scroll.x += scroll.deltaX;
            mouse.scroll.y += scroll.deltaY;
        })
        //mouse.scroll = {x:wheel.deltaX,y:wheel.deltaY};
    }
    if(mousebuffer.mouseMoves.length > 0) {
        mousebuffer.mouseMoves.forEach(function(mouseMove) {
            mouse.pos = getCoords(mouseMove);
            mouse.movement.x += mouseMove.movementX;
            mouse.movement.y += mouseMove.movementY;
        })
        // updateMouse(mouse,collapseMousemoveEvents(mousebuffer.mouseMoves));
    }
    if (mousebuffer.mouseDowns.length > 0) {
        if(!mouse.down) {
            mouse.downPos = mouse.pos;
        }
        mouse.down = true;
    }
    if (mouse.down && mouse.downPos && Grid.norm(Grid.subtract(mouse.pos,mouse.downPos)) > Constants.MAX_CLICK_MOVEMENT) {
        // mouse.click = 0;
        mouse.dragging = true;
    }
    if (mousebuffer.mouseUps.length > 0) {
        if(mouse.down && !mouse.dragging) {
            mouse.clicked = true;
        }
        mouse.dragging = false;
        if(mouse.down) {
            // mouse.clicked = 1;
            mouse.down = false;
            mouse.downPos = undefined;
        }
    }
    return mouse
}

function updateMouse(mouse:Mouse,evt:MouseEvent) {
    mouse.pos = getCoords(evt);
    
    mouse.button = evt.button;
    
    mouse.movement.x = evt.movementX;
    mouse.movement.y = evt.movementY;
    
}



function getCoords(evt:MouseEvent):Grid.Point {
    return {x:evt.offsetX,y:evt.offsetY};
}
    