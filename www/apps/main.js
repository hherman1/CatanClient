define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:

    var game = require('./Game');
    var gameM = require('./GameMethods');
    var boardstate = require('./BoardState');
    var constants = require('./Constants');
    var renderTree = require('./RenderTree');
    var canvas = require('./Canvas');
    var dice = require('./Dice');
    var animation = require('./Animation');
    var grid = require('./Grid');
    var hitbox = require('./Hitbox');
    var mouse = require('./Mouse');
    var player = require('./Player');
    //var resource = require('./Resource');
    var robber = require('./Robber');
    var structrender = require('./StructureRenderer');
    var action = require('./Action');
    var uiController = require('./UserInterfaceJScript');
    var uiViews = require('./View');
    var tradeOffers = require('./TradeOffer');
    function main() {
            var scale = 50;
            var framerate = 60;
            var secondTime = 1000;
            var interval = secondTime/framerate;
        canvas = document.getElementById('board');
        if(canvas.getContext) {
                resizeBoardDOM($(window).width(),$(window).height());
                ctx = canvas.getContext('2d');
                var canvasView = new CanvasView(ctx);
                var myGame = new CatanGame(50,canvasView);
                //setUpUi(game.buffer.ui)//FIX THIS TODO
                // game.setupUIBuffer(game.Buffer.UI);
                setUpUIViews(myGame);
                genPlayerTabs(myGame.gamestate.players);
                loadGame(myGame,function(){runGame(myGame,13);});
        } else {
            console.log("browser unsupported")
        }
    }
    main();

});
