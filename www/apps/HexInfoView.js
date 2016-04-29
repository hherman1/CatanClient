
View.Message.newMessageType("DisplayHexInfo",function(sender,hex,position){
        this.hex = hex;
        this.position = position;
});
View.Message.newMessageType("HideHexInfo",function(){});

HexInfoView = function() {
        var self = this;
        self.display = self.makeHexInfoViewDisplay();
        self.hide();
        $("#userInterface").prepend(self.display);
        ClientView.call(self,function(message) {
                switch(message.type) {
                        case View.Message.Type.AdjustTranslation:
                                self.translate(message.translation);
                                break;
                        case View.Message.Type.DisplayHexInfo:
                                self.showHex(message.hex,message.position);
                                break;
                        case View.Message.Type.HideHexInfo:
                                self.hide();
                                break;
                }
        });
}
HexInfoView.prototype.makeHexInfoViewDisplay = function() {
        var self = this;
        res =  $("<div id=hexInfoView>" +
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
HexInfoView.prototype.resetPosition = function(){
        this.display.offset({top:0,left:0});
}
HexInfoView.prototype.hide = function() {
        this.resetPosition();
        this.display.hide();
}
HexInfoView.prototype.show = function(position) {
        this.display.show();
        this.resetPosition();
        var pos = this.display.position();
        pos.top = position.y - pos.top;
        pos.left = position.x - pos.left;
        this.display.offset(pos);
}
HexInfoView.prototype.showHex = function(hex,position) {
        $(".terrainDisplay",this.display).html("Terrain: " + getResourceTerrainName(hex.resource));
        $(".resourceDisplay",this.display).html("Resource: " + getResourceName(hex.resource));
        $(".tokenDisplay",this.display).html("Token: " + hex.token);
        this.show(position);
}
HexInfoView.prototype.translate = function(translation) {
        var pos = this.display.position();
        pos.top = translation.y + pos.top;
        pos.left = translation.x + pos.left;
        this.display.offset(pos);
}
