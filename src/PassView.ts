import * as View from "./View"

export type PassViewClosed = View.BlankMessage<"PassViewClosed">
export interface OpenPassView extends View.Message<"OpenPassView"> {
    playerID:number
}
export class PassView extends View.ClientView<OpenPassView, PassViewClosed> {
    types:string[] = ["OpenPassView"]
    DOM:JQuery;
    constructor(protected messageDestination:View.Client<PassViewClosed,any>) {
        super();
        let self = this;
        self.DOM = $("#passGame");
        self.hide();
        $("button",self.DOM).click(function(){
                self.hide();
                self.sendMessage({type:"PassViewClosed"},self.messageDestination);
        });
    }
    hide() {
        this.DOM.hide();
    }
    display(playerID:number) {
        $(".playerNumber",this.DOM).html(playerID.toString());
        this.DOM.show();
    }
    onMessage(message:OpenPassView) {
        this.display(message.playerID);
    }
}