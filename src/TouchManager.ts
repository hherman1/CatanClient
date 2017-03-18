import * as Touch from "./Touch"
export class TouchManager {
        touches:Touch.Touch[] = [];
        
        pruneTouches() {
                var self = this;
                self.touches = self.touches.filter(function(touch) {
                        return touch.isActive();
                });
        }
        step() {
                var self = this;
                self.touches.forEach(function(t) {
                        t.step();
                })
                self.pruneTouches();
        }
        startTouch(touch:Touch) {
                var self = this;
                var newtouch = new Touch.Touch;
                newtouch.startTouch(touch);
                self.touches.push(newtouch);
        }
        endTouch(touch:Touch) {
                var self = this;
                self.touches.forEach(function(t) {
                        t.endTouch(touch);
                })
        }
        moveTouch(touch:Touch) {
                var self = this;
                self.touches.forEach(function(t) {
                        t.moveTouch(touch);
                })
        }
        getAggregateTouch():Touch.Touch | undefined {
                var self = this;
                var out:Touch.Touch|undefined = undefined;
                self.touches.forEach(function(touch) {
                        if(out == null) {
                                out = touch;
                        } else {
                                out = Touch.mergeTouches(out,touch);
                        }
                })
                return out;
        }
}

