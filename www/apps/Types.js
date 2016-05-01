define(function(){

NextType = 0;

function registerType() {
        return NextType++;
}

return {registerType:registerType}
});
