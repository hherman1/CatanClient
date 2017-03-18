import * as Grid from "./Grid"

export interface Transform {
        translation:Grid.Vector,
        scale:number
}
export function inverseTransform(v:Grid.Vector,trans:Transform) {
        return Grid.times((1/trans.scale),Grid.add(Grid.times(-1,trans.translation),v))
}
export function transform(v:Grid.Vector,trans:Transform) {
        return Grid.add(trans.translation,Grid.times(trans.scale,v))
}
export function setTransform(transform:Transform,ctx:CanvasRenderingContext2D) {
        ctx.setTransform(transform.scale,0,0,transform.scale,transform.translation.x,transform.translation.y)
}
export function resetTransform(ctx:CanvasRenderingContext2D) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
}
