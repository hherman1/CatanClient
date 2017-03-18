
/// <reference path="declarations/jquery.d.ts" />


import {main} from "./Init"
// import * as JQuery from "jquery"

// requirejs.config({
//     baseUrl: './apps/',
//     paths: {
//         jquery: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min",
//     }
// });

// require(["https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"], function($:any) { 
    $(document).ready(()=> {
        console.log("webpack is sht")
        main();
    })
// })

// require(['jquery'], function ($:any) {
//     $(document).ready(() => {
//         main();
//     });
// });