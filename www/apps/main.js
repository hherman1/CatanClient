define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    //var messages = require('./messages');

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
    // Load library/vendor modules using
    // full IDs, like:
    //var print = require('print');

    //print(messages.getHello());
    // function test() {
    //         return "lol"
    // }
    // function main() {
    //         canvas = document.getElementById('board');
    //         if(canvas.getContext) {
    //                 ctx = canvas.getContext('2d');
    //                 drawTitle(ctx);
    //                 initGame(ctx);
    //         } else {
    //             console.log("browser unsupported")
    //         }
    // }

});
