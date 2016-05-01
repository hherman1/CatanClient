
requirejs.config({
    baseUrl: './apps/',
    paths: {
        jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min",
    }
});

define(function (require) {
    Init = require("./Init");
    Init.main();
});
