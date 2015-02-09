var jsdom = require("jsdom");
global.window = jsdom.jsdom().parentWindow;


var jui = require('../jui');

console.log(jui);