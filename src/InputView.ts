import * as View from "./View"
import * as Input from "./Input"
import * as MouseView from "./MouseView"
import * as Mouse from "./Mouse"
import * as Touch from "./Touch"
import * as TouchView from "./TouchView"

export type RequestInputData = View.BlankMessage<"RequestInputData">
export interface InputData extends View.Message<"InputData"> {
    input:Input.Input|undefined
}
export class InputView extends View.ClientView<RequestInputData|MouseView.MouseData|TouchView.AggregateTouch,InputData|MouseView.RequestMouseData
    |TouchView.RequestAggregateTouch> {

    types:string[] = ["RequestInputData","MouseData","AggregateTouch"];

    mouseData:Mouse.Mouse|undefined
    touchData:Touch.Touch|undefined

    mouseView = new MouseView.MouseView($("#board")[0]);
    touchView = new TouchView.TouchView($("#board")[0]);

    constructor(protected messageDestination:View.Client<InputData,any>) {
        super();
    }
    onMessage(message:RequestInputData|MouseView.MouseData|TouchView.AggregateTouch) {
        switch(message.type) {
            case "RequestInputData":
                this.resetData();
                this.sendMessage({type:"RequestMouseData"},this.mouseView);
                this.sendMessage({type:"RequestAggregateTouch"},this.touchView);
                break;
            case "MouseData":
                this.mouseData = message.mouse;
                this.dataReceived();
                break;
            case "AggregateTouch":
                this.touchData = message.touch;
                this.dataReceived();
                break;
        }
    }
    resetData() {
        this.mouseData = undefined;
        this.touchData = undefined;
    }
    dataReceived() {
        var self = this;
        if(self.mouseData != null || self.touchData != null) {
            var data = Input.consolidateTouchAndMouse(self.touchData,self.mouseData);
            this.sendMessage({type:"InputData",input:data},this.messageDestination);
        }
    }

}
