// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: 'https://raw.githubusercontent.com/hherman1/CatanClient/master/www/apps/',
        jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min",
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['jquery'], function($) {
  //$ points to jQuery
});
requirejs(['app/main']);
