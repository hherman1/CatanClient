/// <reference path="declarations/jquery.d.ts" />

import * as View from "./View"
import * as TouchManager from "./TouchManager"
import * as Touch from "./Touch"

export type RequestAggregateTouch = View.BlankMessage<"RequestAggregateTouch">
export interface AggregateTouch extends View.Message<"AggregateTouch"> {
        touch:Touch.Touch|undefined
}

export class TouchView extends View.ClientView<RequestAggregateTouch,AggregateTouch> {
        types:string[] = ["RequestAggregateTouch"];
        touchManager = new TouchManager.TouchManager();
        touchStarts:TouchEvent[] = [];
        touchEnds:TouchEvent[] = [];
        touchMoves:TouchEvent[] = [];
        constructor(listen:HTMLElement) {
                super();
                var self = this;
                $(listen).on('touchstart',function(e){
                        e.preventDefault();
                        self.touchStarts.push(<TouchEvent>e.originalEvent)
                });
                $(listen).on('touchend',function(e){
                        e.preventDefault();
                        self.touchEnds.push(<TouchEvent>e.originalEvent)
                });
                $(listen).on('touchmove',function(e){
                        e.preventDefault();
                        self.touchMoves.push(<TouchEvent>e.originalEvent)
                });
        }
        onMessage(message:RequestAggregateTouch,sender:View.Client<any,RequestAggregateTouch>) {
                this.processBuffers();
                this.flushBuffers();
                this.sendMessage({type:"AggregateTouch",touch:this.touchManager.getAggregateTouch()},sender);
        }

        actOnChangedTouchesFrom(buffer:TouchEvent[],f:(t:Touch)=>void) {
                buffer.forEach(function(e) {
                        var touches = e.changedTouches
                        for(var i =0; i < touches.length; i++) {
                                f(touches[i]);
                        };
                });
        }
        flushBuffers() {
                var self = this;
                self.touchStarts.length = 0;
                self.touchEnds.length = 0;
                self.touchMoves.length = 0;
        }
        processBuffers() {
                var self = this;
                self.touchManager.step();
                self.actOnChangedTouchesFrom(self.touchStarts,function(t){self.touchManager.startTouch(t)});
                self.actOnChangedTouchesFrom(self.touchEnds,function(t){self.touchManager.endTouch(t)});
                self.actOnChangedTouchesFrom(self.touchMoves,function(t){self.touchManager.moveTouch(t)});
        }
}

