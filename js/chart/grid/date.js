jui.define("chart.grid.date", [], function() {

    var Grid = function(orient, opt) {
        var self = this;

        function drawDate(chart, orient, domain, range, step, format) {
            var g = chart.svg.group();
            var scale = self.scale.time().domain(domain).rangeRound(range);

            var max = range[0];
            var min = range[0];

            for(var i = 0; i < range.length; i++) {
                if (range[i] > max) max = range[i];
                else if (range[i] < min) min = range[i];
            }

            if (typeof format  == 'string') {
                var str = format;
                format = function(value) {
                    return _.dateFormat(value, str);
                }
            }

            var ticks = scale.ticks(step[0], step[1]); // step = [this.time.days, 1];
            var values = [];


            if (orient == 'top') {
                var height = 30;
                var bar = 6;
                var barY = height - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: height,
                    x2: max,
                    y2: height,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));

                for(var i = 0; i < ticks.length; i++) {
                    values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate("+ values[i] + ", 0)"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: barY,
                            x2: 0,
                            y2: height,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: 0,
                            y: bar * 3,
                            'text-anchor' : 'middle'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
                }
            } else if (orient == 'bottom') {
                var height = 30;
                var bar = 6;
                var barY = height - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: max,
                    y2: 0,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));

                for(var i = 0; i < ticks.length; i++) {
                    values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate("+ values[i] + ", 0)"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: bar,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: 0,
                            y: bar * 3,
                            'text-anchor' : 'middle'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
                }

            } else if (orient == 'left') {
                var width = 30;
                var bar = 6;
                var barX = width - bar;

                g.append(chart.svg.line({
                    x1: width,
                    y1: 0,
                    x2: width,
                    y2: max,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));

                for(var i = 0; i < ticks.length; i++) {
                    values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate(0,"+ values[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: barX,
                            y1: 0,
                            x2: width,
                            y2: 0,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: bar,
                            y: bar,
                            'text-anchor' : 'end'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
                }

            } else if (orient == 'right') {
                var width = 30;
                var bar = 6;
                var barX = width - bar;

                g.append(chart.svg.line({
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: max,
                    stroke : "black",
                    "stroke-width" : 0.5
                }));

                for(var i = 0; i < ticks.length; i++) {
                    values[i] = scale(ticks[i]);

                    g.append(chart.svg.group({
                        "transform" : "translate(0,"+ values[i] + ")"
                    }, function() {
                        chart.svg.line({
                            x1: 0,
                            y1: 0,
                            x2: bar,
                            y2: 0,
                            stroke : "black",
                            "stroke-width" : 0.5
                        });

                        chart.svg.text({
                            x: bar * 2,
                            y: bar,
                            'text-anchor' : 'start'
                        }, format ? format(ticks[i]) : ticks[i])
                    }));
                }
            }

            return { g: g, scale: scale, ticks: ticks, values: values};
        }

        this.drawBefore = function(chart) {
        }

        this.draw = function(chart) {
        	var obj = drawDate(chart, orient, opt.domain, [0, chart.area.height]);

			if (orient == 'left') {
				var x = chart.area.x - 30;
				var y = chart.area.y;
			} else if (orient == 'right') {
				var x = chart.area.x2;
				var y = chart.area.y;
			} else if (orient == 'top') {
				var x = chart.area.x;
				var y = chart.area.y - 30;
			} else if (orient == 'bottom') {
				var x = chart.area.x;
				var y = chart.area.y2;
			}

            obj.g.translate(x, y);

			return obj;
        }
    }

    return Grid;
}, "chart.grid");
