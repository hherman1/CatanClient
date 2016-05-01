define(['View','StructureRenderer'],function(View,StructureRenderer){
View.Message.newMessageType("SetLongestRoadID",function(sender,longestRoadID) {
        this.longestRoadID = longestRoadID;
});

var LongestRoadView = function(longestRoadID) {
        var self = this;
        self.longestRoadID = longestRoadID;

        View.ClientView.call(self,function(message) {
                switch(message.type) {
                        case View.Message.Type.SetLongestRoadID:
                                self.longestRoadID = message.longestRoadID;
                                self.update();
                                break;
                }
        });

}

LongestRoadView.prototype.longestRoadElement = function() {
        return $("<div id=longestRoad><span>Longest Road Settler</span> </div>").prepend(StructureRenderer.Images.Loaded.LongestRoad);
}
LongestRoadView.prototype.removeLongestRoadDOM = function() {
        $("#longestRoad").remove();
}
LongestRoadView.prototype.getPlayerTab = function() {
        return $("div.playerDiv[player="+this.longestRoadID+"]");
}
LongestRoadView.prototype.update = function() {
        this.removeLongestRoadDOM();
        this.getPlayerTab().append(this.longestRoadElement);
}

return {LongestRoadView:LongestRoadView}

});
