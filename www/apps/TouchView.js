define(['jquery','View','Touch'],function($,View,Touch) {
        View.Message.newMessageType("RequestTouchData",function(){});
        View.Message.newMessageType("TouchData",function(sender,touch) {
                this.touch=touch;
        });

        var TouchView = function(listen) {
                var self = this;
                self.touch = new Touch.Touch();
                self.touchStarts = [];
                self.touchEnds = [];
                self.touchMoves = [];
                $(listen).on('touchstart',function(e){self.touchStarts.push(e.originalEvent)});
                $(listen).on('touchend',function(e){self.touchEnds.push(e.originalEvent)});
                $(listen).on('touchmove',function(e){self.touchMoves.push(e.originalEvent)});
                View.ClientView.call(self,function(message) {
                        if(message.hasType("RequestTouchData")) {
                                self.processBuffers();
                                self.flushBuffers();
                                View.respond(message,new View.Message.TouchData(self,self.touch));
                        }
                });
        }
        function actOnChangedTouchesFrom(buffer,f) {
                buffer.forEach(function(e) {
                        var touches = e.changedTouches
                        for(var i =0; i < touches.length; i++) {
                                f(touches[i]);
                        };
                });
        }
        TouchView.prototype.flushBuffers = function() {
                var self = this;
                self.touchStarts.length = 0;
                self.touchEnds.length = 0;
                self.touchMoves.length = 0;
        }
        TouchView.prototype.processBuffers = function() {
                var self = this;
                self.touch.step();
                actOnChangedTouchesFrom(self.touchStarts,function(t){self.touch.startTouch(t)});
                actOnChangedTouchesFrom(self.touchEnds,function(t){self.touch.endTouch(t)});
                actOnChangedTouchesFrom(self.touchMoves,function(t){self.touch.moveTouch(t)});
        }

        return {
                TouchView:TouchView,
        }
});
