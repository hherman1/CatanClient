
requirejs.config({
    baseUrl: 'https://rawgit.com/hherman1/CatanClient/gh-pages/www/apps/',
    paths: {
        jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min",
    }
});

define(function (require) {
    Init = require("./Init");
    Init.main();
});
