define(['jquery'
       ,'BoardState'
       ,'Player'
       ,'StructureRenderer']
      ,function($
               ,BoardState
               ,Player
               ,StructureRenderer){
function flattenDictionary(dictionary) {
        var out = [];
        Object.keys(dictionary).forEach(function(k) {
                out.push(dictionary[k]);
        });
        return out;
}
function flattenJQuery(selectors) {
        var out = $();
        selectors.forEach(function(s) {
                out = out.add(s);
        });
        return out;
}

function genResourceSymbolImages() {
        var images = flattenDictionary(StructureRenderer.getResourceSymbolImages());
        return $(images).clone();
}

function addResourceSymbolImages(images) {
        function addToResource(resource,image) {
                $("[resource="+resource+"]").append(image);
        }
        addToResource("Lumber",images[BoardState.Resource.Lumber]);
        addToResource("Grain",images[BoardState.Resource.Grain]);
        addToResource("Wool",images[BoardState.Resource.Wool]);
        addToResource("Ore",images[BoardState.Resource.Ore]);
        addToResource("Brick",images[BoardState.Resource.Brick]);
}

function addStructureIcons(images) {
        function addStructureImage(structure,image) {
            var structureName = BoardState.getStructureName(structure);
            $("[structure="+structureName+"] .structureImage").append(image);
        };
        addStructureImage(BoardState.Structure.Settlement,images[BoardState.Structure.Settlement]);
        addStructureImage(BoardState.Structure.City,images[BoardState.Structure.City]);
        addStructureImage(BoardState.Structure.Road,images[BoardState.Structure.Road]);

}
function genStructureIcons() {
        function genIcon(structure) {
            return $(StructureRenderer.getBuildingImg(structure,Player.Colors.White)).clone();
        }
        var out = {};
        out[BoardState.Structure.Settlement] = genIcon(BoardState.Structure.Settlement);
        out[BoardState.Structure.City] = genIcon(BoardState.Structure.City);
        out[BoardState.Structure.Road] = genIcon(BoardState.Structure.Road);
        return out;
}

function addCostImages(images) {
        function addCostImagesForStructure(structure) {
                var imgs = images[structure];
                var structureName = BoardState.getStructureName(structure);
                $("[structure="+structureName+"] .choiceReqs").append(imgs);
        };
        addCostImagesForStructure(BoardState.Structure.Settlement);
        addCostImagesForStructure(BoardState.Structure.City);
        addCostImagesForStructure(BoardState.Structure.Road);
}

function genCostImages() {
        function genCostImagesFromResources(resources) {
                var out = [];
                resources.forEach(function(count,resource) {
                        var img = StructureRenderer.getResourceSymbolImage(resource);
                        for(var i  = 0; i < count; i ++) {
                                out.push(img);
                        }
                });
                return $(out).clone();
        };
        var out = {};
        out[BoardState.Structure.Road] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.Road));
        out[BoardState.Structure.Settlement] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.Settlement));
        out[BoardState.Structure.City] = genCostImagesFromResources(BoardState.getPrice(BoardState.Structure.City));
        return out;
}

function gameImageCount() {
        return StructureRenderer.getLoadedImages().length;
}

function addUIImages(structureIcons,costImages,resourceSymbolImages) {
        addStructureIcons(structureIcons);
        addCostImages(costImages);
        addResourceSymbolImages(resourceSymbolImages);
}

//take regular array
function numComplete(images) {
        var out = 0;
        images.forEach(function(i) {out += i.complete});
        return out;
}

function loadGame(game,callback) {
        var structureIcons = genStructureIcons();
        var costImages = genCostImages();
        var resourceSymbolImages = genResourceSymbolImages();
        var gameImages = StructureRenderer.getLoadedImages(); // array

        $("#loader").append(gameImages);
        addUIImages(structureIcons,costImages,resourceSymbolImages);
        var images = $.merge($("img"),gameImages);
        var numLoadedImages = numComplete(images.toArray());;
        var totalImages = images.length;


        var loaded = false;
        
        function checkLoaded() {
                numLoadedImages = numComplete(images.toArray());
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
                        setInterval(periodicallyCheckLoaded,1000);
                }
        }
        $(images).load(function() {
                checkLoaded();
        });
        periodicallyCheckLoaded();
        
}

return {loadGame:loadGame}

});
