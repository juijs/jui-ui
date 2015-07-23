## Getting Started

#### Install
JUI library only requires the user to load a single package file.
Access to the jui class must then be configured in the markup.
```html
<link rel="stylesheet" href="dist/jui.min.css" />
<link rel="stylesheet" href="dist/jennifer.theme.min.css" />
<body class="jui">...</body>
```

As the script works only with jQuery 1.8 or higher, it is necessary to load the jQuery library first.
```html
<script src="lib/jquery.min.js"></script>
<script src="dist/jui.min.js"></script>
```

#### Install with Bower
```
bower install jui
```

#### Install with JamJS
```
jamjs install jui
```

#### Build
Build using a grunt in JUI Library
```
grunt       // Build all processes
grunt js    // Merge and Minifiy JavaScript files
grunt css   // Compile LESS files
grunt test  // Unit Tests
```
After the build output is shown below.
```
dist/jui.js
dist/jui.min.js
dist/jui.table.js
dist/jui.table.min.js
dist/jui.chart.js
dist/jui.chart.min.js
dist/jui.css
dist/jui.min.css
dist/jennifer.theme.css
dist/jennifer.theme.min.css
dist/dark.theme.css
dist/dark.theme.min.css
```

## Using in NodeJS
You can use the JUI chart in server as well as client.
Get started right now in NodeJS.

#### Install
```
npm install jui
```

#### Example
```js
var jui = require("jui");   // use jui package 
var fs = require("fs");

// create jui chart 
var chart = jui.create("chart.builder", $("<div></div>"), {
    width : 800,
    height : 800,
    axis : {
        x : {
           type : "block",
           domain : "quarter",
           line : true
        },
        y : {
            type : "range",
            domain : [ -100, 50 ],
            step : 10,
            line : true,
            orient : "right"
        },
        data : [
          { quarter : "1Q", sales : 50, profit : 35 },
          { quarter : "2Q", sales : -20, profit : -100 },
          { quarter : "3Q", sales : 10, profit : -5 },
          { quarter : "4Q", sales : 30, profit : 25 }
        ]

    }, 
    brush : {
        type : "column",
        target : [ "sales", "profit" ]
    }
});

// save file as xml  
fs.writeFileSync("test.svg", chart.svg.toXml());
```

## Documentation

##### http://jui.io
##### http://uiplay.jui.io
##### http://chartplay.jui.io

## Maintainers

Created by Alvin and Jayden, Yoha

## License

MIT License 

Copyright (C) 2015 (```JenniferSoft Inc.```)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
