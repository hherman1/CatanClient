


Action = {
        Type: {
                BuildRoad: 0,
                BuildSettlement: 1,
                BuildCity: 2
        },
        BuildRoad : function(player,vertA,vertB) {
                this.type = Action.Type.BuildRoad;
                this.player = player;
                this.vertA = vertA;
                this.vertB = vertB;
        },
        BuildSettlement : function(player,vert) {
                this.type = Action.Type.BuildSettlement;
                this.player = player;
                this.vert = vert;
        },
        BuildCity : function(player,vert) {
                this.type = Action.Type.BuildCity;
                this.player = player;
                this.vert = vert;
        }
}

validateAction = function(action,gamestate) {
    switch(action.type) {
            case Action.Type.BuildRoad:
                    console.log("Road built");
                    break;
            case Action.Type.BuildSettlement:
                    console.log("Settlement built");
                    break;
            case Action.Type.BuildCity:
                    console.log("City Built");
                    break;
    }

}


