import * as Grid from "./Grid"
import * as Mouse from "./Mouse"
import * as Touch from "./Touch"

export interface Input {
    pos:Grid.Point,
    clicked:boolean,
    dragging:boolean,
    movement:Grid.Vector,
    scroll:Grid.Vector
}

export function fromMouse(mouse:Mouse.Mouse):Input {
    return mouse;
}
export function fromTouch(touch:Touch.Touch):Input {
    return {
        pos:touch.pos,
        clicked:touch.clicked,
        dragging:touch.dragging,
        movement:Grid.times(-1,touch.movement),
        scroll:{x:0,y:0}
    };  
}

export function consolidateTouchAndMouse(touch:Touch.Touch|undefined,mouse:Mouse.Mouse|undefined) {
    if(touch!==undefined && touch.isActive()) {
        return fromTouch(touch);
    } 
    else if(mouse!==undefined) {
        return fromMouse(mouse);
    }
}
