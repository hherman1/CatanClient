//the main function


requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts/helper',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        main: '../main'
    }
});

// Start the main app logic.
requirejs(['Animation', 'BoardState', 'Canvas', 'Dice','Game','Grid','Hitbox','MouseEvent','Resource','Road','Robber','Settlement','Settler'],
  function   (an, bs, canvas, d, ga, gr, hi, me, res, roa, rob, settlement, settler) {

});


function test() {
        return "lol"
}
function main() {
        canvas = document.getElementById('board');
        if(canvas.getContext) {
                ctx = canvas.getContext('2d');
                drawTitle(ctx);
                initGame(ctx);
        } else {
            console.log("browser unsupported")
        }
}
