
requirejs.config({
    baseUrl: './apps/',
    paths: {
        jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min",
    }
});

define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:


        /*
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
    var hexView = require('./PassView');
    main();

    */
    Init = require("./Init");
    Init.main();
//    console.log(Grid.rotationMatrix(15)); 
});
