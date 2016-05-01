define(['Mouse','View'],function(Mouse,View) {

var MouseBuffer = function() {
        this.mousemoves=[];
        this.mousedowns = [];
        this.mouseups = [];
        this.mousescrolls = [];
}
function mouseEventSaver(mousebuffer) {
        return (function(evt) {
            evt.preventDefault();
            mousebuffer.push(evt);
        })
}

function initMouseBuffer(elem,buffer) {
        // elem instead of document is more reliable, but is unpleasant.
    document.addEventListener("mousemove",mouseEventSaver(buffer.mousemoves));
    elem.addEventListener("mousedown",mouseEventSaver(buffer.mousedowns));
    elem.addEventListener("wheel",mouseEventSaver(buffer.mousescrolls));
    document.addEventListener("mouseup",mouseEventSaver(buffer.mouseups));
}
function flushMouseEvents(mousebuffer) {
    mousebuffer.mousemoves.length = 0;
    mousebuffer.mousedowns.length = 0;
    mousebuffer.mouseups.length = 0;
}

View.Message.newMessageType("RequestMouseData",function() {});
View.Message.newMessageType("MouseData",function(sender,mouse) {
        this.mouse = mouse;
});
var MouseView = function(canvas) {
        var self = this;
        self.mouseEventBuffer = new MouseBuffer();
        initMouseBuffer(canvas,self.mouseEventBuffer);
        self.mouse = new Mouse.Mouse()
        View.Message.Client.call(self, function(message) {
                if(message.type == View.Message.Type.RequestMouseData) {
                        self.mouse = Mouse.processMouseBuffer(self.mouse,self.mouseEventBuffer);
                        flushMouseEvents(self.mouseEventBuffer);
                        View.respond(message,new View.Message.MouseData(self,self.mouse));
                }
        });
}

return { MouseView:MouseView}
});
