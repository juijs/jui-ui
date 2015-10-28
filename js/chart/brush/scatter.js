jui.define("chart.brush.scatter", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.scatter
     * @extends chart.brush.core
     */
    var ScatterBrush = function() {

        this.getSymbolType = function(key, value) {
            var symbol = this.brush.symbol,
                target = this.brush.target[key];

            if(_.typeCheck("function", symbol)) {
                var res = symbol.apply(this.chart, [ target, value ]);

                if (res == "triangle" || res == "cross" || res == "rectangle" || res == "rect" || res == "circle") {
                    return {
                        type : "default",
                        uri : res
                    };
                } else {
                    return {
                        type : "image",
                        uri : res
                    };
                }
            }

            return {
                type : "default",
                uri : symbol
            };
        }

        this.createScatter = function(pos, dataIndex, targetIndex, symbol) {
            var self = this,
                elem = null,
                w = h = this.brush.size;

            var color = this.color(dataIndex, targetIndex),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

            if(symbol.type == "image") {
                elem = this.chart.svg.image({
                    "xlink:href": symbol.uri,
                    width: w + borderWidth,
                    height: h + borderWidth,
                    x: pos.x - (w / 2) - borderWidth,
                    y: pos.y - (h / 2)
                });
            } else {
                if(symbol.uri == "triangle" || symbol.uri == "cross") {
                    elem = this.chart.svg.group({ width: w, height: h }, function() {
                        if(symbol.uri == "triangle") {
                            var poly = self.chart.svg.polygon();

                            poly.point(0, h)
                                .point(w, h)
                                .point(w / 2, 0);
                        } else {
                            self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: 0, x2: w, y2: h });
                            self.chart.svg.line({ stroke: color, "stroke-width": borderWidth * 2, x1: 0, y1: w, x2: h, y2: 0 });
                        }
                    }).translate(pos.x - (w / 2), pos.y - (h / 2));
                } else {
                    if(symbol.uri == "rectangle" || symbol.uri == "rect") {
                        elem = this.chart.svg.rect({
                            width: w,
                            height: h,
                            x: pos.x - (w / 2),
                            y: pos.y - (h / 2)
                        });
                    } else {
                        elem = this.chart.svg.ellipse({
                            rx: w / 2,
                            ry: h / 2,
                            cx: pos.x,
                            cy: pos.y
                        });
                    }
                }

                if(symbol.uri != "cross") {
                    elem.attr({
                        fill: color,
                        stroke: borderColor,
                        "stroke-width": borderWidth
                    })
                    .hover(function () {
                        if(elem == self.activeScatter) return;

                        var opts = {
                            fill: self.chart.theme("scatterHoverColor"),
                            stroke: color,
                            "stroke-width": borderWidth * 2,
                            opacity: 1
                        };

                        if(self.brush.hoverSync) {
                            for(var i = 0; i < self.cachedSymbol[dataIndex].length; i++) {
                                opts.stroke = self.color(dataIndex, i);
                                self.cachedSymbol[dataIndex][i].attr(opts);
                            }
                        } else {
                            elem.attr(opts);
                        }
                    }, function () {
                        if(elem == self.activeScatter) return;

                        var opts = {
                            fill: color,
                            stroke: borderColor,
                            "stroke-width": borderWidth,
                            opacity: (self.brush.hide) ? 0 : 1
                        };

                        if(self.brush.hoverSync) {
                            for(var i = 0; i < self.cachedSymbol[dataIndex].length; i++) {
                                opts.fill = self.color(dataIndex, i);
                                self.cachedSymbol[dataIndex][i].attr(opts);
                            }
                        } else {
                            elem.attr(opts);
                        }
                    });
                }
            }

            return elem;
        }

        this.drawScatter = function(points) {
            // hoverSync 옵션 처리를 위한 캐싱 처리
            this.cachedSymbol = {};

            var self = this,
                g = this.chart.svg.group(),
                borderColor = this.chart.theme("scatterBorderColor"),
                borderWidth = this.chart.theme("scatterBorderWidth");

            for(var i = 0; i < points.length; i++) {
                for(var j = 0; j < points[i].length; j++) {
                    if(!this.cachedSymbol[j]) {
                        this.cachedSymbol[j] = [];
                    }

                    if(this.brush.hideZero && points[i].value[j] === 0) {
                        continue;
                    }

                    var data = {
                        x: points[i].x[j],
                        y: points[i].y[j],
                        max: points[i].max[j],
                        min: points[i].min[j],
                        value: points[i].value[j]
                    };

                    var symbol = this.getSymbolType(i, data.value),
                        p = this.createScatter(data, j, i, symbol),
                        d = this.brush.display;

                    // hoverSync 옵션을 위한 엘리먼트 캐싱
                    if(symbol.type == "default" && symbol.uri != "cross") {
                        this.cachedSymbol[j].push(p);
                    }

                    // Max & Min 툴팁 생성
                    if((d == "max" && data.max) || (d == "min" && data.min) || d == "all") {
                        g.append(this.drawTooltip(data.x, data.y, this.format(data.value)));
                    }

                    // 컬럼 및 기본 브러쉬 이벤트 설정
                    if(this.brush.activeEvent != null) {
                        (function(scatter, data, color, symbol) {
                            var x = data.x,
                                y = data.y,
                                text = self.format(data.value);

                            scatter.on(self.brush.activeEvent, function(e) {
                                if(symbol.type == "default" && symbol.uri != "cross") {
                                    if (self.activeScatter != null) {
                                        self.activeScatter.attr({
                                            fill: self.activeScatter.attributes["stroke"],
                                            stroke: borderColor,
                                            "stroke-width": borderWidth,
                                            opacity: (self.brush.hide) ? 0 : 1
                                        });
                                    }

                                    self.activeScatter = scatter;
                                    self.activeScatter.attr({
                                        fill: self.chart.theme("scatterHoverColor"),
                                        stroke: color,
                                        "stroke-width": borderWidth * 2,
                                        opacity: 1
                                    });
                                }

                                self.activeTooltip.html(text);
                                self.activeTooltip.translate(x, y);
                            });

                            scatter.attr({ cursor: "pointer" });
                        })(p, data, this.color(j, i), this.getSymbolType(i, data.value));
                    }

                    if(this.brush.hide) {
                        p.attr({ opacity: 0 });
                    }

                    this.addEvent(p, j, i);
                    g.append(p);
                }
            }

            // 액티브 툴팁
            this.activeTooltip = this.drawTooltip(0, 0, "");
            g.append(this.activeTooltip);

            return g;
        }

        this.drawTooltip = function(x, y, text) {
            return this.chart.text({
                y: -this.brush.size,
                "text-anchor" : "middle",
                "font-size" : this.chart.theme("tooltipPointFontSize"),
                "font-weight" : this.chart.theme("tooltipPointFontWeight")
            }, text).translate(x, y);
        }

        this.draw = function() {
            return this.drawScatter(this.getXY());
        }

        this.drawAnimate = function() {
            var area = this.chart.area();

            return this.chart.svg.animateTransform({
                attributeName: "transform",
                type: "translate",
                from: area.x + " " + area.height,
                to: area.x + " " + area.y,
                begin: "0s" ,
                dur: "0.4s",
                repeatCount: "1"
            });
        }
    }

    ScatterBrush.setup = function() {
        return {
            /** @cfg {"circle"/"triangle"/"rectangle"/"cross"/"callback"} [symbol="circle"] Determines the shape of a (circle, rectangle, cross, triangle).  */
            symbol: "circle",
            /** @cfg {Number} [size=7]  Determines the size of a starter. */
            size: 7,
            /** @cfg {Boolean} [hide=false]  Hide the scatter, will be displayed only when the mouse is over. */
            hide: false,
            /** @cfg {Boolean} [hideZero=false]  When scatter value is zero, will be hidden. */
            hideZero: false,
            /** @cfg {Boolean} [hoverSync=false]  Over effect synchronization of all the target's symbol. */
            hoverSync: false,
            /** @cfg {String} [activeEvent=null]  Activates the scatter in question when a configured event occurs (click, mouseover, etc). */
            activeEvent: null,
            /** @cfg {"max"/"min"/"all"} [display=null]  Shows a tooltip on the scatter for the minimum/maximum value.  */
            display: null,
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false
        };
    }

    return ScatterBrush;
}, "chart.brush.core");