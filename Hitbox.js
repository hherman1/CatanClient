/* Hitbox Object
 * {center:vector,
 *  dimension:vector, - Positive values 
 *  data: any
 *  }
 */

testBox = {center: makeVector(0,0),
           dimension: makeVector(5,5),
           data: makeVector (0,1)}

function topRight(box) {
        return add(box.center,times(0.5,box.dimension))
}
function bottomLeft(box) {
        return add(box.center,times(-0.5,box.dimension))
}
function isHit(loc,box) {
       return (loc.x <= topRight(box).x && loc.y <= topRight(box).y
              && loc.x >= bottomLeft(box).x && loc.y >= bottomLeft(box).y)
}
