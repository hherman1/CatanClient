define(['Grid'],function(Grid) {

var Transform = function(translation,scale) {
        this.translation=translation;
        this.scale = scale;
}
function inverseTransform(v,trans) {
        return Grid.times((1/trans.scale),Grid.add(Grid.times(-1,trans.translation),v))
}
function transform(v,trans) {
        return Grid.add(trans.translation,Grid.times(trans.scale,v))
}
function setTransform(transform,ctx) {
        ctx.setTransform(transform.scale,0,0,transform.scale,transform.translation.x,transform.translation.y)
}
function resetTransform(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
}

return {
        Transform:Transform,
        inverseTransform:inverseTransform,
        transform:transform,
        setTransform:setTransform,
        resetTransform:resetTransform,
}

});
