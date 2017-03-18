import * as Imported from "./imported"
import  * as Grid from "./Grid"

document.onload = Imported.run;

var test:Grid.Vector = {x:1,y:1};
console.log(Grid.add(test,test));

interface Test {
    arg:string[];
    f:number;
}
