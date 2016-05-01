define(['jquery','View','Input','MouseView','TouchView']
      ,function($,View,Input,MouseView,TouchView) {

        View.Message.newMessageType("RequestInputData",function(){});
        View.Message.newMessageType("InputData",function(sender,input){
            this.sender = sender;
            this.input = input;
        });
        var InputView = function(messageDestination) {
                var self = this;
                self.messageDestination = messageDestination;

                self.mouseData = null;
                self.touchData = null;

                self.mouseView = new MouseView.MouseView($("#board")[0]);
                self.touchView = new TouchView.TouchView($("#board")[0]);

                View.ClientView.call(self,function(message) {
                        switch(message.type) {
                                case View.Message.Type.RequestInputData:
                                        self.resetData();
                                        View.sendMessage(new View.Message.RequestMouseData(self),self.mouseView);
                                        View.sendMessage(new View.Message.RequestAggregateTouch(self),self.touchView);
                                        break;
                                case View.Message.Type.MouseData:
                                        self.mouseData = {data:message.mouse};
                                        self.dataReceived();
                                        break;
                                case View.Message.Type.AggregateTouch:
                                        self.touchData = {data:message.touch};
                                        self.dataReceived();
                                        break;
                        }
                });
        }
        InputView.prototype.resetData = function() {
                this.mouseData = null;
                this.touchData = null;
        }
        InputView.prototype.dataReceived = function() {
                var self = this;
                if(self.mouseData != null && self.touchData != null) {
                        var data = Input.consolidateTouchAndMouse(self.touchData.data,self.mouseData.data);
                        View.sendMessage(new View.Message.InputData(self,data),self.messageDestination);
                }
        }
        return {
                InputView:InputView,
        }
});
