define(['Grid'],function(Grid) {

function drawHexImage(image, ctx){
        var w = Math.sqrt(Math.pow(1,2)-Math.pow((1/2),2));
        var x = -1 * w;
        var y = -1;
        var scale = 2;
        ctx.drawImage(image, x, y, scale - 6/25, scale);
}

function drawRect(coords,side,ctx) {
        ctx.fillRect(coords.x,coords.y,side,side)
}

function drawPath(verts,ctx) {
        ctx.beginPath()
        var start = verts[0]
        ctx.moveTo(start.x,start.y)
        verts.map(function(coord) {
               ctx.lineTo(coord.x,coord.y);
        });
        ctx.closePath();
}
function hexPath(side,ctx) {
        var verts = Grid.vertices(new Grid.Vector(0,0)).map(function(c) {
                return Grid.vertexToWorld(c,side);
        })
        drawPath(verts,ctx);
}
function drawHexPoints(hexCoords,side,ctx) {
    var mappingFunction = function(coord) {
        drawVertex(coord,side,ctx);
    }
    var coordsList = vertices(hexCoords);
    coordsList.map(mappingFunction)
}


function drawVertex(vertexCoords,side,ctx) {
        coords = vertexToWorld(vertexCoords,side);
        ctx.fillRect(coords.x,coords.y,10,10)
}
function linePath(start,end,ctx) {
        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);
}
// wrapText function from: http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        y+= lineHeight;

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
}


function newScale(delta,scale) {

        function sigmoid(x) {
                return 1/(1 + Math.exp(-x))
        }
        function spec(x) {
                return sigmoid(x) + 0.5
        }
        var out = scale + sigmoid(scale)/2* ((sigmoid(delta/10) - 0.5)/4) ;
        if ( out < 0.5) {
                return 0.5;
        } else if (out > 1.5) {
                return 1.5;
        } else {
                return out;
        }
}


function clearCanvas(ctx) {
        var canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
}


return {
        drawHexImage:drawHexImage,
        drawRect:drawRect,
        drawPath:drawPath,
        hexPath:hexPath,
        drawHexPoints: drawHexPoints,
        drawVertex:drawVertex,
        linePath:linePath,
        wrapText:wrapText,
        newScale:newScale,
        clearCanvas:clearCanvas,
}
});
