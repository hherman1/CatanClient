define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:


    var types = require("./Types");
    var view = require('./View');
    var game = require('./Game');
    var gameM = require('./GameMethods');
    var boardstate = require('./BoardState');
    var constants = require('./Constants');
    var renderTree = require('./RenderTree');
    var canvas = require('./Canvas');
    var animation = require('./Animation');
    var grid = require('./Grid');
    var hitbox = require('./Hitbox');
    var mouse = require('./Mouse');
    var player = require('./Player');
    var robber = require('./Robber');
    var structrender = require('./StructureRenderer');
    var action = require('./Action');
    var uiController = require('./UserInterfaceJScript');
    var tradeOffers = require('./TradeOffer');
    var tradeViews = require('./TradeView');
    var longestroadview = require('./LongestRoadView');
    var dicerollview = require('./DiceRollView');
    var hexView = require('./HexInfoView');
    function main() {
        canvas = document.getElementById('board');
        if(canvas.getContext) {
                resizeBoardDOM($(window).width(),$(window).height());
                ctx = canvas.getContext('2d');
                var myGame = new CatanGame(GAME_DEFAULT_SCALE);
                var views = new View.Message.Forwarder(makeUIViews(myGame));
                views.addChild(new CanvasView(ctx));
                myGame.views = views;
                myGame.setUpHitboxes();
                genPlayerTabs(myGame.gamestate.players);
                loadGame(myGame,function(){runGame(myGame,GAME_STEP_INTERVAL);});
        } else {
                alert("Browser must support HTML Canvas");
        }
    }
    main();

});
