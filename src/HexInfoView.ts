import * as BoardState from "./BoardState"
import * as View from "./View"
import * as Grid from "./Grid"
import * as Canvas from "./Canvas"
export interface DisplayHexInfo extends View.Message<"DisplayHexInfo"> {
    hex:BoardState.Position.Hex;
    position:Grid.Point;
}
export type HideHexInfo = View.BlankMessage<"HideHexInfo">;

export class HexInfoView extends View.ClientView<Canvas.AdjustTranslation|DisplayHexInfo|HideHexInfo,null> {
    types:string[] = ["AdjustTranslation","DisplayHexInfo","HideHexInfo"];
    display:JQuery;
    constructor() {
        super();
        this.display = this.makeHexInfoViewDisplay();
        this.hide();
        $("#userInterface").prepend(this.display);
    }
    onMessage(message:Canvas.AdjustTranslation | DisplayHexInfo | HideHexInfo) {
        switch(message.type) {
            case "AdjustTranslation":
                this.translate(message.translation);
                break;
            case "DisplayHexInfo":
                this.showHex(message.hex,message.position);
                break;
            case "HideHexInfo":
                this.hide();
                break;
        }
    }
    makeHexInfoViewDisplay() {
        var self = this;
        let res =  $("<div id=hexInfoView>" +
        "<div class=content>" +
        "<div class=resourceDisplay></div>" +
        "<div class=terrainDisplay></div>" +
        "<div class=tokenDisplay></div>" +
        "<div class=closeDisplay>" +
        "<button> X </button>" + 
        "</div>" +
        "</div>" +
        "</div>");
        $(".closeDisplay",res).click(function(){self.hide()});
        return res;
    }
    resetPosition(){
        this.display.offset({top:0,left:0});
    }
    hide() {
        this.resetPosition();
        this.display.hide();
    }
    show(position:Grid.Point) {
        this.display.show();
        this.resetPosition();
        var pos = this.display.position();
        pos.top = position.y - pos.top;
        pos.left = position.x - pos.left;
        this.display.offset(pos);
    }
    showHex(hex:BoardState.Position.Hex,position:Grid.Point) {
        $(".terrainDisplay",this.display).html("Terrain: " + BoardState.getResourceTerrainName(hex.resource));
        $(".resourceDisplay",this.display).html("Resource: " + BoardState.getResourceName(hex.resource));
        $(".tokenDisplay",this.display).html("Token: " + hex.token);
        this.show(position);
    }
    translate(translation:Grid.Vector) {
        var pos = this.display.position();
        pos.top = translation.y + pos.top;
        pos.left = translation.x + pos.left;
        this.display.offset(pos);
    }
}
