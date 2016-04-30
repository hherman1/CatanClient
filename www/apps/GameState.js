define(['BoardState','Player','TradeOffer'],function(BoardState,Player,TradeOffer) {
var GameState = function() {
        this.board = new BoardState.Board();
        this.phase = BoardState.Phase.Init;
        this.subPhase = BoardState.SubPhase.Building;
        this.rotation = BoardState.Rotation.Forwards;
        this.players = [];
        this.tradeoffers = [];
        this.currentPlayerID = null;
        this.longestRoad = 0;
        this.longestRoadPlayer = null;
}
function cloneGameState(gameState) {
        var out = new GameState();
        out.board = BoardState.cloneBoard(gameState.board);
        out.players = gameState.players.map(Player.clonePlayer);
        out.currentPlayerID = gameState.currentPlayerID;
        out.phase = gameState.phase;
        out.subPhase = gameState.subPhase;
        out.rotation = gameState.rotation;
        out.tradeoffers = gameState.tradeoffers.map(TradeOffer.cloneTradeOffer);
        out.longestRoad = gameState.longestRoad;
        out.longestRoadPlayer = gameState.longestRoadPlayer;
        return out;
}
//Takes in game and returns what the index is of the current player in players
function currentPlayerListIndex(gamestate){
        var out = undefined;
        gamestate.players.every(function(p,i) {
                if(p.id == gamestate.currentPlayerID) {
                        out = i;
                        return false;
                }
                return true;
        });
        return out;
}

function nextPlayer(gamestate) {
        gamestate.currentPlayerID = BoardState.getNextPlayer(gamestate);
}
function getNextPlayer(gamestate){
      var currentPlayerIndex = currentPlayerListIndex(gamestate);
      var out = null;
        switch(gamestate.rotation) {
                case BoardState.Rotation.Forwards:
        //get current player index and then increase it by one and set the global player to this calculated player
                      var next = (currentPlayerIndex+1) % (gamestate.players.length);
                      out = gamestate.players[next].id;//Moves to next player
                      break;
                case BoardState.Rotation.Backwards:
                      var next = (currentPlayerIndex-1) % (gamestate.players.length);
                      out = gamestate.players[next].id;//Moves to next player
                      break;
                case BoardState.Rotation.None:
                      out = gamestate.players[currentPlayerIndex].id;
        }
        return out;
}
function getCurrentPlayer(gamestate) {
        return Player.getPlayers(gamestate.currentPlayerID,gamestate.players)[0];
}
function updateLongestRoad(gameState){
    var player = GameState.getCurrentPlayer(gameState);
    for(var i =0; i<player.firstSettlementsCoords.length;i++){
        var testLength = longestRoad(findVertex(gameState.board.vertices, player.firstSettlementsCoords[i]), gameState.board.vertices, gameState.board.roads, player, []);
        if(testLength>gameState.longestRoad && testLength >= 5){
            console.log("Longest road changed");
            gameState.longestRoad = testLength;
            if(gameState.longestRoadPlayer != null) {
                gameState.longestRoadPlayer.vicPoints -= LONGEST_ROAD_VPS;
            }
            gameState.longestRoadPlayer = player;
            gameState.longestRoadPlayer.vicPoints += LONGEST_ROAD_VPS;
        }
    }
}
function updateGamePhase(gamestate) {
        if(gamestate.phase == Phase.Init) {
                if(gamestate.rotation == Rotation.Backwards) {
                        if(gamestate.players[0].id == gamestate.currentPlayerID) {
                                gamestate.rotation = Rotation.Forwards;
                                gamestate.phase = Phase.Normal;
                                return true;
                        }
                } else if(gamestate.rotation == Rotation.None) {
                        gamestate.rotation = Rotation.Backwards;
                        return false;
                } else if(last(gamestate.players).id == gamestate.currentPlayerID) {
                        gamestate.rotation = Rotation.None;
                        return false;
                }
        }
}
function validateEndTurn(teststate) {
        switch(teststate.phase){
            case BoardState.Phase.Init:
                var currentPlayer = GameState.getCurrentPlayer();
                if (currentPlayer.roadCount == BoardState.getInitStructureLimit(teststate.rotation) &&
                    currentPlayer.settlementCount == BoardState.getInitStructureLimit(teststate.rotation)){
                    console.log("End turn valid");
                    return true;
                }
                break;
            case BoardState.Phase.Normal:
                return true;
        }
        return false;
}
return {
        GameState:GameState,
        currentPlayerListIndex:currentPlayerListIndex,
        nextPlayer:nextPlayer,
        getNextPlayer:getNextPlayer,
        getCurrentPlayer:getCurrentPlayer,
        updateLongestRoad:updateLongestRoad,
        updateGamePhase:updateGamePhase,
        validateEndTurn:validateEndTurn,
}
