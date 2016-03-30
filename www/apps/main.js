define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:

    var game = require('./Game');
    var gameM = require('./GameMethods');
    var boardstate = require('./BoardState');
    var canvas = require('./Canvas');
    var dice = require('./Dice');
    var animation = require('./Animation');
    var grid = require('./Grid');
    var hitbox = require('./Hitbox');
    var mouse = require('./Mouse');
    var player = require('./Player');
    var resource = require('./Resource');
    var robber = require('./Robber');
    var structrender = require('./StructureRenderer');
    var action = require('./Action');
    var uiController = require('./UserInterfaceJScript')
    function main() {
        canvas = document.getElementById('board');
        if(canvas.getContext) {
                ctx = canvas.getContext('2d');
                var myGame = new CatanGame(50,ctx);
                //setUpUi(game.buffer.ui)//FIX THIS TODO
                // game.setupUIBuffer(game.Buffer.UI);
                setupUIBuffer(myGame.buffer.UI);
                runGame(myGame,13);
        } else {
            console.log("browser unsupported")
        }
    }
    main();

});
