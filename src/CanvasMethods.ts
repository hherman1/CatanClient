import * as Grid from "./Grid"

export function drawHexImage(image:HTMLImageElement, ctx:CanvasRenderingContext2D){
        var w = Math.sqrt(Math.pow(1,2)-Math.pow((1/2),2));
        var x = -1 * w;
        var y = -1;
        var scale = 2;
        ctx.drawImage(image, x, y, scale - 6/25, scale);
}

export function drawRect(coords:Grid.Point,side:number,ctx:CanvasRenderingContext2D) {
        ctx.fillRect(coords.x,coords.y,side,side)
}

export function drawPath(verts:Grid.Point[],ctx:CanvasRenderingContext2D) {
        ctx.beginPath()
        var start = verts[0]
        ctx.moveTo(start.x,start.y)
        verts.map(function(coord) {
               ctx.lineTo(coord.x,coord.y);
        });
        ctx.closePath();
}
export function hexPath(side:number,ctx:CanvasRenderingContext2D) {
        var verts = Grid.vertices({x:0,y:0}).map(function(c) {
                return Grid.vertexToWorld(c,side);
        })
        drawPath(verts,ctx);
}
export function drawHexPoints(hexCoords:Grid.Point,side:number,ctx:CanvasRenderingContext2D) {
    var mappingFunction = function(coord:Grid.Point) {
        drawVertex(coord,side,ctx);
    }
    var coordsList = Grid.vertices(hexCoords);
    coordsList.map(mappingFunction)
}


export function drawVertex(vertexCoords:Grid.Point,side:number,ctx:CanvasRenderingContext2D) {
        let coords = Grid.vertexToWorld(vertexCoords,side);
        ctx.fillRect(coords.x,coords.y,10,10)
}
export function linePath(start:Grid.Point,end:Grid.Point,ctx:CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);
}
// wrapText function from: http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
export function wrapText(context:CanvasRenderingContext2D, text:string, x:number, y:number, maxWidth:number, lineHeight:number) {
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


export function newScale(delta:number,scale:number) {

        function sigmoid(x:number) {
                return 1/(1 + Math.exp(-x))
        }
        function spec(x:number) {
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


export function clearCanvas(ctx:CanvasRenderingContext2D) {
        var canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
}
