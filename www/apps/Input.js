define(['Grid','Mouse','Touch',],function(Grid,Mouse,Touch) {

var Input = function() {
        this.pos = new Grid.Vector(-1,-1);
        this.clicked = 0; // has the mouse just clicked
        this.dragging = 0; // is the mouse dragging
        this.movement = new Grid.Vector(0,0);
        this.scroll = new Grid.Vector(0,0);
}

function fromMouse(mouse) {
        var out = new Input();
        out.pos = mouse.pos;
        out.clicked = mouse.clicked;
        out.dragging = mouse.dragging;
        out.movement = mouse.movement;
        out.scroll = mouse.scroll;
        return out;
}
function fromTouch(touch) {
        var out = new Input();
        out.pos = touch.pos;
        out.clicked = touch.clicked;
        out.dragging = touch.dragging;
        out.movement = Grid.times(-1,touch.movement);
        out.scroll = new Grid.Vector(0,0);
        return out;
}

function consolidateTouchAndMouse(touch,mouse) {
        if(touch.isActive()) {
                return fromTouch(touch);
        } else {
                return fromMouse(mouse);
        }
}

return {
        Input:Input,
        fromMouse:fromMouse,
        consolidateTouchAndMouse:consolidateTouchAndMouse,
}
});
