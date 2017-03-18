//This file is responsible for setting up and preparing the game for use. It makes the UI
//views, prepares the game with players and a board and starts the game.

import * as Constants from "./Constants"
import * as BoardState from "./BoardState"
import * as View from "./View"
import * as Canvas from "./Canvas"
import * as UserInterfaceJScript from "./UserInterfaceJScript"

import * as InputView from "./InputView"

import * as DiceRollView from "./DiceRollView"
import * as TradeView from "./TradeView"
import * as PassView from "./PassView"

import * as HexInfoView from "./HexInfoView"

import * as LongestRoadView from "./LongestRoadView"

import * as Game from "./Game"
import * as Load from "./Load"


function makeDistributor(destination:View.Client<any,any>,ctx:CanvasRenderingContext2D):View.Distributor {
    let dist = new View.Distributor();
    (new View.EndTurnView(destination)).subscribe(dist);
    (new View.UndoView(destination)).subscribe(dist);
    (new View.ResizeView(destination)).subscribe(dist);
    (new View.BuildChoiceView(BoardState.Structure.Road,destination)).subscribe(dist);
    (new View.BuildChoiceView(BoardState.Structure.Settlement,destination)).subscribe(dist);
    (new View.BuildChoiceView(BoardState.Structure.City,destination)).subscribe(dist);
    (new TradeView.TradeView(destination)).subscribe(dist);
    (new View.WinnerMessageView()).subscribe(dist);
    (new View.TimerMessageView()).subscribe(dist);
    (new LongestRoadView.LongestRoadView()).subscribe(dist);
    (new DiceRollView.DiceRollView(Constants.DICE_ROLL_DURATION,
                                Constants.DICE_ROLL_STEPS,
                                Constants.DICE_ROLL_MAX,
                                Constants.DICE_ROLL_MIN)).subscribe(dist);

    (new HexInfoView.HexInfoView()).subscribe(dist); 
    (new PassView.PassView(destination)).subscribe(dist);
    (new InputView.InputView(destination)).subscribe(dist);
    (new View.InstructionsMessageView()).subscribe(dist);
    (new Canvas.CanvasRenderView(ctx)).subscribe(dist);
   
    return dist;
}
function makeGame(dist:View.Distributor):Game.CatanGame {
    let game = new Game.CatanGame(Constants.GAME_DEFAULT_SCALE,dist);
    Game.makeBoard(game);
    return game;
}
function prepareGame(game:Game.CatanGame) {
    game.setUpHitboxes();
    UserInterfaceJScript.genPlayerTabs(game.gameState.players);
    Game.makeBoard(game);
    Game.renderGame(game,undefined); // Initial render with no highlight.
}
export function main() {
        let canvas = <HTMLCanvasElement> document.getElementById('board');
        if(canvas.getContext) {
                View.resizeBoardDOM($(window).width(),$(window).height());
                let ctx = canvas.getContext('2d');
                if(ctx === null) {
                    throw "could not create render context"
                }
                let game = makeGame(new View.Distributor());
                let dist = makeDistributor(game,ctx);
                game.distributor = dist;
                Load.loadGame(function(){
                        prepareGame(game);
                        game.run(Constants.GAME_STEP_INTERVAL);
                });
        } else {
                alert("Browser must support HTML Canvas");
        }
}
