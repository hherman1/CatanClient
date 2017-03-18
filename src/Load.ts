import * as BoardState from "./BoardState"
import * as Player from "./Player"
import * as StructureRenderer from "./StructureRenderer"

// function flattenDictionary<T>(dictionary:T[]) {
//         var out:T[] = [];
//         Object.keys(dictionary).forEach(function(k) {
//                 out.push(dictionary[k]);
//         });
//         return out;
// }
export function flattenJQuery(selectors:JQuery[]) {
        var out = $();
        selectors.forEach(function(s) {
                out = out.add(s);
        });
        return out;
}

export function genResourceSymbolImages() {
        var images = StructureRenderer.getResourceSymbolImages();
        return <HTMLImageElement[]>$(images).clone().toArray();
}

export function addResourceSymbolImages(images:HTMLImageElement[]) {
        function addToResource(resource:BoardState.Resource,image:HTMLImageElement) {
                $("[resource="+resource+"]").append(image);
        }
        addToResource(BoardState.Resource.Lumber,images[BoardState.Resource.Lumber]);
        addToResource(BoardState.Resource.Grain,images[BoardState.Resource.Grain]);
        addToResource(BoardState.Resource.Wool,images[BoardState.Resource.Wool]);
        addToResource(BoardState.Resource.Ore,images[BoardState.Resource.Ore]);
        addToResource(BoardState.Resource.Brick,images[BoardState.Resource.Brick]);
}

export function addStructureIcons(images:HTMLImageElement[]) {
        function addStructureImage(structure:BoardState.Structure,image:HTMLImageElement) {
            var structureName = BoardState.getStructureName(structure);
            $("[structure="+structureName+"] .structureImage").append(image);
        };
        addStructureImage(BoardState.Structure.Settlement,images[BoardState.Structure.Settlement]);
        addStructureImage(BoardState.Structure.City,images[BoardState.Structure.City]);
        addStructureImage(BoardState.Structure.Road,images[BoardState.Structure.Road]);

}
export function genStructureIcons() {
        function genIcon(structure:BoardState.Structure) {
            return <HTMLImageElement>$(StructureRenderer.getBuildingImg(structure,Player.Colors.White)).clone().toArray()[0];
        }
        let x:JQuery;
        var out = [];
        out[BoardState.Structure.Settlement] = genIcon(BoardState.Structure.Settlement);
        out[BoardState.Structure.City] = genIcon(BoardState.Structure.City);
        out[BoardState.Structure.Road] = genIcon(BoardState.Structure.Road);
        return out;
}

export function addCostImages(images:HTMLImageElement[][]) {
        function addCostImagesForStructure(structure:BoardState.Structure) {
                var imgs = images[structure];
                var structureName = BoardState.getStructureName(structure);
                $("[structure="+structureName+"] .choiceReqs").append(imgs);
        };
        addCostImagesForStructure(BoardState.Structure.Settlement);
        addCostImagesForStructure(BoardState.Structure.City);
        addCostImagesForStructure(BoardState.Structure.Road);
}

export function genCostImages() {
        function genCostImagesFromResources(resources:BoardState.Resource[]) {
                var out:HTMLImageElement[] = [];
                resources.forEach(function(count,resource) {
                        var img = StructureRenderer.getResourceSymbolImage(resource);
                        for(var i  = 0; i < count; i ++) {
                                out.push(img);
                        }
                });
                return <HTMLImageElement[]>$(out).clone().toArray();
        };
        var out = [];
        out[BoardState.Structure.Road] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.Road));
        out[BoardState.Structure.Settlement] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.Settlement));
        out[BoardState.Structure.City] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.City));
        return out;
}

export function gameImageCount() {
        return StructureRenderer.getLoadedImages().length;
}

export function addUIImages(structureIcons:HTMLImageElement[],costImages:HTMLImageElement[][],resourceSymbolImages:HTMLImageElement[]) {
        addStructureIcons(structureIcons);
        addCostImages(costImages);
        addResourceSymbolImages(resourceSymbolImages);
}

//take regular array
export function numComplete(images:HTMLImageElement[]) {
        var out = 0;
        images.forEach(function(i) {out += i.complete?1:0});
        return out;
}

export function loadGame(callback:()=>any) {
        var structureIcons = genStructureIcons();
        var costImages = genCostImages();
        var resourceSymbolImages = genResourceSymbolImages();
        var gameImages = StructureRenderer.getLoadedImages(); // array

        $("#loader").append(gameImages);
        addUIImages(structureIcons,costImages,resourceSymbolImages);
        var images = $.merge<HTMLImageElement>(<HTMLImageElement[]>$("img").toArray(),gameImages);
        var numLoadedImages = numComplete(images);;
        var totalImages = images.length;


        var loaded = false;
        
        function checkLoaded() {
                numLoadedImages = numComplete(images);
                $("#loaded").css("width",100* numLoadedImages/totalImages + "%");
                if(numLoadedImages == totalImages && !loaded) {
                        loaded = true;
                        callback();
                        setTimeout(function() {
                                $("#loading-screen").fadeOut(300);
                        },1000);
                } else if(numLoadedImages > totalImages) {
                        numComplete([]);
                        console.log(images.length);
                        throw "What"
                }
        }
        function periodicallyCheckLoaded() {
                if(!loaded) {
                        checkLoaded();
                        setTimeout(periodicallyCheckLoaded,1000);
                }
        }
        $(images).load(function() {
                checkLoaded();
        });
        periodicallyCheckLoaded();
        
}
