import * as Constants from "./Constants"
import * as Grid from "./Grid"
export {GameTouch as Touch}
class GameTouch {
        id:number|undefined = undefined;
        pos:Grid.Point = {x:-1,y:-1};
        down:boolean = false;
        click:boolean = false; // could the mouse be clicking
        clicked:boolean = false; // has the mouse just clicked
        dragging:boolean = false; // is the mouse dragging
        movement:Grid.Vector = {x:0,y:0};
        // scroll:Grid.Vector = {x:0,y:0};
        
        isActive() {
                return this.clicked || this.id != null;
        }
        step() {
                var self = this;
                if(self.id == null) {
                        self.clicked = false;
                }
                self.movement = Grid.ident(0);
        }
        startTouch(newtouch:Touch) {
                if(this.id == null) {
                        this.id = newtouch.identifier;
                        this.pos = browserTouchPos(newtouch);
                        this.click = true;
                        this.down = true;
                        this.clicked = false;
                        this.dragging = false;
                        this.movement = Grid.ident(0);
                }
        };
        endTouch(newtouch:Touch){
                if(this.id == newtouch.identifier) {
                        this.id = undefined;
                        this.pos = browserTouchPos(newtouch);
                        this.down = false;
                        if(this.click) {
                                this.clicked = true; // has the mouse just clicked
                        }
                        this.click = false; // could the mouse be clicking
                        this.dragging = false; // is the mouse dragging
                        this.movement = {x:0,y:0};
                        // this.scroll = {x:0,y:0};
                }
        }
        moveTouch(newtouch:Touch) {
                if(newtouch.identifier == this.id) {
                        if(this.down) {
                                this.movement = Grid.subtract(this.pos,browserTouchPos(newtouch));
                        } else {
                                this.down = true;
                                this.movement = Grid.ident(0)
                        }
                        this.pos = browserTouchPos(newtouch);
                        
                        if(Grid.norm(this.movement) < Constants.MAX_TAP_MOVEMENT) {
                                this.click = true;
                        } else  {
                                this.click = false;
                                this.dragging = true;
                        }
                }
                return this;
        };
}
function browserTouchPos(touch:Touch) {
        return <Grid.Point>{x:touch.clientX,y:touch.clientY};
};
export function mergeTouches(touchA:GameTouch,touchB:GameTouch) {
        var out = new GameTouch();
        out.id = touchA.id || touchB.id;
        out.dragging = touchA.dragging || touchB.dragging;
        out.clicked = touchA.clicked && touchB.clicked;
        out.down = false;
        out.click = false;
        out.pos = Grid.times(0.5,Grid.add(touchA.pos,touchB.pos));
        out.movement = Grid.add(touchA.movement,touchB.movement);
        return out;
}
