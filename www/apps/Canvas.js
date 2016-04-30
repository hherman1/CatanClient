define(['Grid'
       ,'Transform'
       ,'Player'
       ,'BoardState'
       ,'Hitbox'
       ,'CanvasMethods'
       ,'RenderTree'
       ,'Animation'
       ,'View'
       ,'MouseView']
       ,function(Grid
                ,Transform
                ,Player
                ,BoardState
                ,Hitbox
                ,CanvasMethods
                ,RenderTree
                ,Animation
                ,View
                ,MouseView) {

/*
 * CANVAS.JS
 *Canvas.js contains functions to draw/render objects onto the window.
 */


function drawHexes(gamestate,scale,ctx) {
        var tree = new ScaleNode(scale);
        tree.addChildren(RenderTree.makeHexNodes(gamestate.board.hexes, gamestate.board.robber));
        RenderTree.drawNode(tree,ctx);
}


function generateHexCanvas(gamestate,scale) {
        var $canvas = $("<canvas></canvas>");
        $canvas.attr("width","1000");
        $canvas.attr("height","1000");
        var ctx = $canvas[0].getContext("2d");
        ctx.translate(500,500);
        drawHexes(gamestate,scale,ctx);
        return $canvas[0];
}

View.Message.newMessageType("RenderGameCanvas",function(sender,gamestate,highlight,graphics,side) {
        this.gamestate= gamestate;
        this.highlight = highlight;
        this.graphics = graphics;
        this.side = side;
});

View.Message.newMessageType("AdjustTranslation",function(sender,translation) {
        this.translation = translation;
});

View.Message.newMessageType("AdjustScale",function(sender,adjustment) {
        this.adjustment = adjustment;
});

View.Message.newMessageType("RequestHits",function(sender,coordinate) {
        this.coordinate = coordinate;
});

View.Message.newMessageType("SetHitboxes",function(sender,hitboxes) {
        this.hitboxes = hitboxes;
});

View.Message.newMessageType("HitsData",function(sender,hits) {
        this.hits = hits;
});

CanvasView = function(ctx) {
        var self = this;
        self.mouseView = new MouseView.MouseView(ctx.canvas);
        self.canvasRenderView = new CanvasRenderView(ctx);
        View.Message.Client.call(self,function(message) {
                View.sendMessage(message,self.mouseView);
                View.sendMessage(message,self.canvasRenderView);
        });
}

CanvasRenderView = function(ctx) {
        var self = this;
        self.ctx = ctx;
        self.transform = {
                translation: Grid.center(new Grid.Vector(ctx.canvas.width,ctx.canvas.height)),
                scale: 1
        };
        self.hitboxes = [];
        var receiveMessage = function(message) {
                switch(message.type) {
                        case View.Message.Type.RenderGameCanvas:
                                redraw(message.gamestate
                                      ,message.highlight
                                      ,message.graphics
                                      ,self.transform
                                      ,message.side
                                      ,self.ctx);
                                break;
                        case View.Message.Type.AdjustTranslation:
                                self.transform.translation = Grid.add(self.transform.translation
                                                                     ,message.translation);
                                break;
                        case View.Message.Type.AdjustScale:
                                self.transform.scale = CanvasMethods.newScale(message.adjustment
                                                                             ,self.transform.scale);
                                break;
                        case View.Message.Type.SetHitboxes:
                                self.hitboxes = message.hitboxes;
                                break;
                        case View.Message.Type.RequestHits:
                                var hitlist = Hitbox.transformHitlist(self.hitboxes,self.transform);
                                var hits = Hitbox.getHits(hitlist,message.coordinate);
                                View.respond(message,new View.Message.HitsData(self,hits));
                }
        };
        View.Message.Client.call(self,receiveMessage);
}

function redraw(gamestate,highlight,graphics,transform,side,ctx) {
        var colorMap = Player.getPlayerColors(gamestate.players);
        var currentPlayerColor = colorMap[gamestate.currentPlayerID];

        var hexes = gamestate.board.hexes;
        var roads = gamestate.board.roads;
        var vertices = gamestate.board.vertices;

        if(highlight != null) {
                switch(highlight.type) {
                        case BoardState.Position.Type.Road:
                                roads = roads.filter(BoardState.notEqualPositionCoordinatesFilter(highlight))
                                             .concat(highlight);
                                break;
                        case BoardState.Position.Type.Vertex:
                                vertices = vertices.filter(BoardState.notEqualPositionCoordinatesFilter(highlight))
                                                   .concat(highlight);
                                break;
                }
        }

        CanvasMethods.clearCanvas(ctx);

        var renderTree = new RenderTree.TransformNode(transform);
        renderTree.addChild(new RenderTree.RadialGradientNode(side*20,"#77B2EB","blue"));
        renderTree.addChild(new RenderTree.CenteredImageNode(graphics.renderedHexes));

        var scaled = new ScaleNode(side);
        scaled.addChildren(RenderTree.makeRoadNodes(roads,colorMap));
        scaled.addChildren(RenderTree.makeVertexNodes(vertices,colorMap));
        renderTree.addChild(scaled);
        RenderTree.drawNode(renderTree,ctx);

        graphics.animations.data = Animation.pruneAnimations(graphics.animations.data);
        if(graphics.animations.data.length > 0)  {
                Animation.drawAnims(graphics.animations.data,graphics.transform,ctx);
        }
}

return {
        CanvasView:CanvasView,
        generateHexCanvas:generateHexCanvas,
}

});
