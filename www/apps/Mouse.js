define(['Constants','Grid'],function(Constants,Grid) {


var Mouse = function() {
        this.pos = new Grid.Vector(-1,-1);
        this.button = -1;
        this.click = 0; // could the mouse be clicking
        this.clicked = 0; // has the mouse just clicked
        this.dragging = 0; // is the mouse dragging
        this.movement = new Grid.Vector(0,0);
        this.scroll = new Grid.Vector(0,0);
}



function processMouseBuffer(mouse,mousebuffer) {
        mouse.clicked = 0;
        mouse.movement.x = 0;
        mouse.movement.y = 0;
        mouse.scroll.x = 0;
        mouse.scroll.y = 0;
        if(mousebuffer.mousescrolls.length > 0) {
                var wheel = collapseWheelEvents(mousebuffer.mousescrolls);
                mouse.scroll = new Grid.Vector(wheel.deltaX,wheel.deltaY);
        }
        if(mousebuffer.mousemoves.length > 0) {
                updateMouse(mouse,collapseMousemoveEvents(mousebuffer.mousemoves));
        }
        if (mousebuffer.mousedowns.length > 0) {
                mouse.click = 1;
        }
        if (mouse.click && Grid.norm(mouse.movement) > Constants.MAX_CLICK_MOVEMENT) {
                mouse.click = 0;
                mouse.dragging = 1;
        }
        if (mousebuffer.mouseups.length > 0) {
                mouse.dragging = 0;
                if(mouse.click) {
                        mouse.clicked = 1;
                        mouse.click = 0;
                }
        }
        return mouse
}

function updateMouse(mouse,evt) {
        mouse.pos = getCoords(evt);

        mouse.button = evt.button;

        mouse.movement.x = evt.movementX;
        mouse.movement.y = evt.movementY;

}



function getCoords(evt) {
    return new Grid.Vector(evt.offsetX,evt.offsetY);
}

function collapseMousemoveEvents(evts) {
    out = evts.pop();
    evts.forEach(function(evt) {
            out.movementX += evt.movementX;
            out.movementY += evt.movementY;
    })
    return out;
}
function collapseWheelEvents(evts) {
    out = evts.pop();
    evts.forEach(function(evt) {
            out.deltaX += evt.deltaX;
            out.deltaY += evt.deltaY;
    })
    return out;
}


return {
        Mouse:Mouse,
        processMouseBuffer:processMouseBuffer,
}

});
