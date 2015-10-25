jui.define("chart.grid.draw2d", [ "util.base", "util.math" ], function(_, math) {

    /**
     * @class chart.grid.draw2d
     * @abstract
     */
    var Draw2DGrid = function() {

        this.createGridX = function(position, index, x, isActive, isLast) {
            var line = this.getLineOption(),
                axis = this.chart.svg.group().translate(x, 0),
                size = this.chart.theme("gridTickBorderSize");

            axis.append(this.line({
                y2 : (position == "bottom") ? size : -size,
                stroke : this.color(isActive, "gridActiveBorderColor", "gridXAxisBorderColor"),
                "stroke-width" : this.chart.theme("gridTickBorderWidth")
            }));

            if (line) {
                this.drawValueLine(position, axis, isActive, line, index, isLast);
            }

            return axis;
        }

        this.createGridY = function(position, index, y, isActive, isLast) {
            var line = this.getLineOption(),
                axis = this.chart.svg.group().translate(0, y),
                size = this.chart.theme("gridTickBorderSize");

            axis.append(this.line({
                x2 : (position == "left") ? -size : size,
                stroke : this.color(isActive, "gridActiveBorderColor", "gridYAxisBorderColor"),
                "stroke-width" : this.chart.theme("gridTickBorderWidth")
            }));

            if (line) {
                this.drawValueLine(position, axis, isActive, line, index, isLast);
            }

            return axis;
        }

        this.fillRectObject = function(g, line, position, x, y , width, height) {
            if (line.type.indexOf("gradient") > -1) {
                g.append(this.chart.svg.rect({
                    x : x,
                    y : y,
                    height : height,
                    width : width,
                    fill : this.chart.color(( line.fill ? line.fill : "linear(" + position + ") " + this.chart.theme("gridPatternColor") + ",0.5 " + this.chart.theme("backgroundColor") )),
                    "fill-opacity" : this.chart.theme("gridPatternOpacity")
                }));
            } else if (line.type.indexOf("rect") > -1) {
                g.append(this.chart.svg.rect({
                    x : x,
                    y : y,
                    height : height,
                    width : width,
                    fill : this.chart.color( line.fill ? line.fill : this.chart.theme("gridPatternColor") ),
                    "fill-opacity" : this.chart.theme("gridPatternOpacity")
                }));
            }
        }

        /**
         * @method drawAxisLine
         * theme 이 적용된  axis line 리턴
         * @param {ChartBuilder} chart
         * @param {Object} attr
         */
        this.drawAxisLine = function(position, g, attr) {
            var isTopOrBottom = (position == "top" || position == "bottom");

            g.append(this.chart.svg.line(_.extend({
                x1 : 0,
                y1 : 0,
                x2 : 0,
                y2 : 0,
                stroke : this.color(isTopOrBottom ? "gridXAxisBorderColor" : "gridYAxisBorderColor"),
                "stroke-width" : this.chart.theme(isTopOrBottom ? "gridXAxisBorderWidth" : "gridYAxisBorderWidth"),
                "stroke-opacity" : 1
            }, attr)));
        }

        this.drawPattern = function(position, ticks, values, isMove) {
            if (this.grid.hide) return;
            if (!position) return;
            if (!ticks) return;
            if (!values) return;

            var line = this.getLineOption(),
                isY = (position == "left" || position == "right");

            var g = this.chart.svg.group({
                "class" : "grid-pattern grid-pattern-" + this.grid.type
            });

            g.translate(this.axis.area("x") + this.chart.area("x"), this.axis.area("y") + this.chart.area("y"));

            if (line && (line.type.indexOf("gradient") > -1 || line.type.indexOf("rect") > -1)) {
                for(var i = 0; i < values.length-1; i += 2) {
                    var dist = Math.abs(values[i+1] - values[i]),
                        pos = values[i] - (isMove ?  dist/2 : 0 ),
                        x = (isY) ? 0 : pos,
                        y = (isY) ? pos : 0,
                        width = (isY) ?  this.axis.area("width") : dist,
                        height = (isY) ?  dist : this.axis.area("height");

                    this.fillRectObject(g, line, position, x, y, width, height);
                }
            }
        }

        this.drawBaseLine = function(position, g) {
            var obj = this.getGridSize(),
                pos = {};

            if (position == "bottom" || position == "top") {
                pos = { x1 : obj.start, x2 : obj.end };
            } else if (position == "left" || position == "right") {
                pos = { y1 : obj.start, y2 : obj.end };
            }

            this.drawAxisLine(position, g, pos)
        }

        this.drawValueLine = function(position, axis, isActive, line, index, isLast) {
            var area = {},
                isDrawLine = false;

            if (position == "top") {
                isDrawLine = this.checkDrawLineY(index, isLast);
                area = { x1: 0, x2: 0, y1: 0, y2: this.axis.area("height") };
            } else if (position == "bottom" ) {
                isDrawLine = this.checkDrawLineY(index, isLast);
                area = { x1: 0, x2: 0, y1: 0, y2: -this.axis.area("height") };
            } else if (position == "left") {
                isDrawLine = this.checkDrawLineX(index, isLast);
                area = { x1: 0, x2: this.axis.area("width"), y1: 0, y2: 0 };
            } else if (position == "right" ) {
                isDrawLine = this.checkDrawLineX(index, isLast);
                area = { x1: 0, x2: -this.axis.area("width"), y1: 0, y2: 0 };
            }

            if(isDrawLine) {
                var lineObject = this.line(_.extend({
                    stroke: this.chart.theme(isActive, "gridActiveBorderColor", "gridBorderColor"),
                    "stroke-width": this.chart.theme(isActive, "gridActiveBorderWidth", "gridBorderWidth")
                }, area));

                if (line.type.indexOf("dashed") > -1) {
                    lineObject.attr({ "stroke-dasharray": "5,5" });
                }

                axis.append(lineObject);
            }
        }

        this.drawValueText = function(position, axis, index, xy, domain, move, isActive) {
            if (this.grid.hideText) return;

            if(position == "top") {
                axis.append(this.getTextRotate(this.chart.text({
                    x: move,
                    y: -(this.chart.theme("gridTickBorderSize") + this.chart.theme("gridTickPadding") * 2),
                    dy: this.chart.theme("gridXFontSize") / 3,
                    fill: this.chart.theme(isActive, "gridActiveFontColor", "gridXFontColor"),
                    "text-anchor": "middle",
                    "font-size": this.chart.theme("gridXFontSize"),
                    "font-weight": this.chart.theme("gridXFontWeight")
                }, domain)));
            } else if(position == "bottom") {
                axis.append(this.getTextRotate(this.chart.text({
                    x: move,
                    y: this.chart.theme("gridTickBorderSize") + this.chart.theme("gridTickPadding") * 2,
                    dy: this.chart.theme("gridXFontSize") / 3,
                    fill: this.chart.theme(isActive, "gridActiveFontColor", "gridXFontColor"),
                    "text-anchor": "middle",
                    "font-size": this.chart.theme("gridXFontSize"),
                    "font-weight": this.chart.theme("gridXFontWeight")
                }, domain)));
            } else if(position == "left") {
                axis.append(this.getTextRotate(this.chart.text({
                    x: -this.chart.theme("gridTickBorderSize") - this.chart.theme("gridTickPadding"),
                    y: move,
                    dy: this.chart.theme("gridYFontSize") / 3,
                    fill: this.chart.theme(isActive, "gridActiveFontColor", "gridYFontColor"),
                    "text-anchor": "end",
                    "font-size": this.chart.theme("gridYFontSize"),
                    "font-weight": this.chart.theme("gridYFontWeight")
                }, domain)));
            } else if(position == "right") {
                axis.append(this.getTextRotate(this.chart.text({
                    x: this.chart.theme("gridTickBorderSize") + this.chart.theme("gridTickPadding"),
                    y: move,
                    dy: this.chart.theme("gridYFontSize") / 3,
                    fill: this.chart.theme(isActive, "gridActiveFontColor", "gridYFontColor"),
                    "text-anchor": "start",
                    "font-size": this.chart.theme("gridYFontSize"),
                    "font-weight": this.chart.theme("gridYFontWeight")
                }, domain)));
            }
        }

        this.drawImage = function(orient, g, tick, index, x, y) {
            if (!_.typeCheck("function", this.grid.image)) return;

            var opts = this.grid.image.apply(this.chart, [ tick, index ]);

            if(_.typeCheck("object", opts)) {
                var image = this.chart.svg.image({
                    "xlink:href": opts.uri,
                    width: opts.width,
                    height: opts.height
                });

                if(orient == "top" || orient == "bottom") {
                    image.attr({
                        x: (this.grid.type == "block") ? this.scale.rangeBand()/2 - opts.width/2 : -(opts.width/2)
                    });
                } else if(orient == "left" || orient == "right") {
                    image.attr({
                        y: (this.grid.type == "block") ? this.scale.rangeBand()/2 - opts.height/2 : -(opts.height/2)
                    })
                }

                if(orient == "bottom") {
                    image.attr({ y: opts.dist });
                } else if(orient == "top") {
                    image.attr({ y: -(opts.dist + opts.height) });
                } else if(orient == "left") {
                    image.attr({ x: -(opts.dist + opts.width) });
                } else if(orient == "right") {
                    image.attr({ x: opts.dist });
                }

                image.translate(x, y)
                g.append(image);
            }
        }
    }

    return Draw2DGrid;
}, "chart.draw");