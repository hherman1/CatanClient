
View.Message.newMessageType("PassViewClosed",function(){});
View.Message.newMessageType("OpenPassView",function(sender,playerID){
    this.playerID = playerID;
});

PassView = function(messageDestination) {
        var self = this;
        self.messageDestination = messageDestination;
        self.DOM = $("#passGame");
        self.hide();
        $("button",self.DOM).click(function(){
                self.hide();
                sendMessage(new View.Message.PassViewClosed(self),self.messageDestination);
        });
        ClientView.call(self,function(message) {
                if(message.hasType("OpenPassView")) {
                        self.display(message.playerID);
                }
        });
}
PassView.prototype.hide = function() {
        this.DOM.hide();
}
PassView.prototype.display = function(playerID) {
        $(".playerNumber",this.DOM).html(playerID);
        this.DOM.show();
}
