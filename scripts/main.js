
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
