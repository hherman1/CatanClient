import * as View from "./View"
import * as StructureRenderer from "./StructureRenderer"
export interface SetLongestRoadID extends View.Message<"SetLongestRoadID"> {
    longestRoadID:number
}

export class LongestRoadView extends View.ClientView<SetLongestRoadID,null> {
    types:string[] = ["SetLongestRoadID"]
    protected longestRoadID = -1;
    onMessage(message:SetLongestRoadID) {
        this.longestRoadID = message.longestRoadID;
        this.update();
    }
    longestRoadElement() {
        let img = StructureRenderer.getGameImages().LongestRoad;
        if(img) {
            return $("<div id=longestRoad><span>Longest Road Settler</span> </div>").prepend(img);
        } else {
            throw "longest road image not loaded"
        }
    }
    removeLongestRoadDOM() {
        $("#longestRoad").remove();
    }
    getPlayerTab() {
        return $("div.playerDiv[player="+this.longestRoadID+"]");
    }
    update() {
        this.removeLongestRoadDOM();
        this.getPlayerTab().append(this.longestRoadElement());
    }
}

