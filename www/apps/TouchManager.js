define(['Touch'],function(Touch) {
        var TouchManager = function() {
                var self = this;
                self.touches = [];
        }
        TouchManager.prototype.pruneTouches = function() {
                var self = this;
                self.touches = self.touches.filter(function(touch) {
                        return touch.isActive();
                });
        }
        TouchManager.prototype.step = function() {
                var self = this;
                self.touches.forEach(function(t) {
                        t.step();
                })
                self.pruneTouches();
        }
        TouchManager.prototype.startTouch = function(touch) {
                var self = this;
                var newtouch = new Touch.Touch;
                newtouch.startTouch(touch);
                self.touches.push(newtouch);
        }
        TouchManager.prototype.endTouch = function(touch) {
                var self = this;
                self.touches.forEach(function(t) {
                        t.endTouch(touch);
                })
        }
        TouchManager.prototype.moveTouch = function(touch) {
                var self = this;
                self.touches.forEach(function(t) {
                        t.moveTouch(touch);
                })
        }
        TouchManager.prototype.getAggregateTouch = function() {
                var self = this;
                var out = null;
                self.touches.forEach(function(touch) {
                        if(out == null) {
                                out = touch;
                        } else {
                                out = Touch.mergeTouches(out,touch);
                        }
                })
                return out;
        }
        return {
                TouchManager:TouchManager
        }
});
