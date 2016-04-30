define(['View'
       ,'HexInfoView'
       ,'LongestRoadView'
       ,'PassView']
      ,function(View
               ,HexInfoView
               ,LongestRoadView
               ,PassView) {
function makeUIViews(destination) {
        var views = [];
        views.push(new View.EndTurnView(destination));
        views.push(new View.UndoView(destination));
        views.push(new View.ResizeView(destination));
        views.push(new View.BuildChoiceView(Structure.Road,destination));
        views.push(new View.BuildChoiceView(Structure.Settlement,destination));
        views.push(new View.BuildChoiceView(Structure.City,destination));
        views.push(new View.TradeView(destination));
        views.push(new View.WinnerMessageView());
        views.push(new View.TimerMessageView());
        views.push(new LongestRoadView.LongestRoadView());
        views.push(new DiceRollView(DICE_ROLL_DURATION,DICE_ROLL_STEPS,DICE_ROLL_MAX,DICE_ROLL_MIN));
        views.push(new HexInfoView.HexInfoView());
        views.push(new PassView.PassView(destination));
        return views;
}

return {makeUIViews:makeUIViews}

});
