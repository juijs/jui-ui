var jsdom = require('jsdom');
global.document = jsdom.jsdom();
global.window = document.parentWindow;
global.jQuery = global.$ = require('jquery');

var jui = require('./jui').jui;
module.exports = jui;
