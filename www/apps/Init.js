define(['Constants'
       ,'BoardState'
       ,'View'
       ,'HexInfoView'
       ,'LongestRoadView'
       ,'PassView'
       ,'DiceRollView'
       ,'TradeView'
       ,'Game'
       ,'UserInterfaceJScript'
       ,'Load']
      ,function(Constants
               ,BoardState
               ,View
               ,HexInfoView
               ,LongestRoadView
               ,PassView
               ,DiceRollView
               ,TradeView
               ,Game
               ,UserInterfaceJScript
               ,Load) {
function makeUIViews(destination) {
        var views = [];
        views.push(new View.EndTurnView(destination));
        views.push(new View.UndoView(destination));
        views.push(new View.ResizeView(destination));
        views.push(new View.BuildChoiceView(BoardState.Structure.Road,destination));
        views.push(new View.BuildChoiceView(BoardState.Structure.Settlement,destination));
        views.push(new View.BuildChoiceView(BoardState.Structure.City,destination));
        views.push(new TradeView.TradeView(destination));
        views.push(new View.WinnerMessageView());
        views.push(new View.TimerMessageView());
        views.push(new LongestRoadView.LongestRoadView());
        views.push(new DiceRollView.DiceRollView(Constants.DICE_ROLL_DURATION
                                                ,Constants.DICE_ROLL_STEPS
                                                ,Constants.DICE_ROLL_MAX
                                                ,Constants.DICE_ROLL_MIN));
        views.push(new HexInfoView.HexInfoView());
        views.push(new PassView.PassView(destination));
        return views;
}
function prepareGame(game) {
        Game.makeBoard(game);
        var views = new View.Message.Forwarder(makeUIViews(game));
        views.addChild(new CanvasView(ctx));
        game.views = views;
        game.setUpHitboxes();
        UserInterfaceJScript.genPlayerTabs(game.gamestate.players);
        Game.makeBoard(game);
        Game.renderGame(game,null); // Initial render with no highlight.
}
function main() {
        canvas = document.getElementById('board');
        if(canvas.getContext) {
                View.resizeBoardDOM($(window).width(),$(window).height());
                ctx = canvas.getContext('2d');
                var myGame = new CatanGame(Constants.GAME_DEFAULT_SCALE);
                Load.loadGame(myGame,function(){
                        prepareGame(myGame);
                        Game.runGame(myGame,Constants.GAME_STEP_INTERVAL);
                });
        } else {
                alert("Browser must support HTML Canvas");
        }
}

return {main:main}

});
