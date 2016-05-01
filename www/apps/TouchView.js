define(['jquery','View','TouchManager'],function($,View,TouchManager) {
        View.Message.newMessageType("RequestAggregateTouch",function(){});
        View.Message.newMessageType("AggregateTouch",function(sender,touch) {
                this.touch=touch;
        });

        var TouchView = function(listen) {
                var self = this;
                self.touchManager = new TouchManager.TouchManager();
                self.touchStarts = [];
                self.touchEnds = [];
                self.touchMoves = [];
                $(listen).on('touchstart',function(e){
                        e.preventDefault();
                        self.touchStarts.push(e.originalEvent)
                });
                $(listen).on('touchend',function(e){
                        e.preventDefault();
                        self.touchEnds.push(e.originalEvent)
                });
                $(listen).on('touchmove',function(e){
                        e.preventDefault();
                        self.touchMoves.push(e.originalEvent)
                });
                View.ClientView.call(self,function(message) {
                        if(message.hasType("RequestAggregateTouch")) {
                                self.processBuffers();
                                self.flushBuffers();
                                View.respond(message
                                            ,new View.Message.AggregateTouch(self
                                                                       ,self.touchManager.getAggregateTouch()));
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
                self.touchManager.step();
                actOnChangedTouchesFrom(self.touchStarts,function(t){self.touchManager.startTouch(t)});
                actOnChangedTouchesFrom(self.touchEnds,function(t){self.touchManager.endTouch(t)});
                actOnChangedTouchesFrom(self.touchMoves,function(t){self.touchManager.moveTouch(t)});
        }

        return {
                TouchView:TouchView,
        }
});
