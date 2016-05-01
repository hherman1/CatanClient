define(['Constants','Grid'],function(Constants,Grid) {
        var Touch = function() {
                this.id = null;
                this.pos = new Grid.Vector(-1,-1);
                this.down = false;
                this.click = false; // could the mouse be clicking
                this.clicked = false; // has the mouse just clicked
                this.dragging = false; // is the mouse dragging
                this.movement = new Grid.Vector(0,0);
        };
        function browserTouchPos(touch) {
                return new Grid.Vector(touch.clientX,touch.clientY);
        };
        Touch.prototype.isActive = function() {
                return this.clicked || this.id != null;
        }
        Touch.prototype.step = function() {
                var self = this;
                if(self.id == null) {
                        self.clicked = false;
                }
                self.movement = Grid.ident(0);
        }
        Touch.prototype.startTouch = function(newtouch) {
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
        Touch.prototype.endTouch = function(newtouch){
                if(this.id == newtouch.identifier) {
                        this.id = null;
                        this.pos = browserTouchPos(newtouch);
                        this.down = false;
                        if(this.click) {
                                this.clicked = true; // has the mouse just clicked
                        }
                        this.click = false; // could the mouse be clicking
                        this.dragging = false; // is the mouse dragging
                        this.movement = new Grid.Vector(0,0);
                        this.scroll = new Grid.Vector(0,0);
                }
        }
        Touch.prototype.moveTouch = function(newtouch) {
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
        function mergeTouches(touchA,touchB) {
                var out = new Touch();
                out.id = touchA.id || touchB.id;
                out.dragging = touchA.dragging || touchB.dragging;
                out.clicked = touchA.clicked && touchB.clicked;
                out.down = null;
                out.click = null;
                out.pos = Grid.times(0.5,Grid.add(touchA.pos,touchB.pos));
                out.movement = Grid.add(touchA.movement,touchB.movement);
                return out;
        }
        return{
                Touch:Touch,
                mergeTouches:mergeTouches,
        }

});
