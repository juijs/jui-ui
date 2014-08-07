jui.define("chart.grid.block", [], function() {

    var Grid = function(orient, opt) {
        var self = this;

        function drawBlock(chart, orient, domain, range) {
            var g = chart.svg.group();
            var scale = self.scale.ordinal().domain(domain);

            var max = range[0];
            var min = range[0];

            for(var i = 0; i < range.length; i++) {
                if (range[i] > max) max = range[i];
                else if (range[i] < min) min = range[i];
            }

            var points = scale.rangePoints(range).range();
            var band = scale.rangeBand();
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

                for(var i = 0; i < points.length; i++) {
                    values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate("+ points[i] + ", 0)"
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
                            x: band / 2,
                            y: 20,
                            'text-anchor' : 'middle'
                        },domain[i])
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

                for(var i = 0; i < points.length; i++) {
                    values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate("+ points[i] + ", 0)"
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
                            x: band / 2,
                            y: 20,
                            'text-anchor' : 'middle'
                        }, domain[i])
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

                for(var i = 0; i < points.length; i++) {
                    values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate(0, "+ points[i] + ")"
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
                            x: bar * 4,
                            y: band / 2,
                            'text-anchor' : 'end'
                        }, domain[i])
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

                for(var i = 0; i < points.length; i++) {
                    values[i] = { point : points[i], band : band };

                    g.append(chart.svg.group({
                        "transform" : "translate(0, "+ points[i] + ")"
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
                            x: bar,
                            y: band / 2,
                            'text-anchor' : 'start'
                        }, domain[i])
                    }));
                }
            }

            return { g: g, scale: scale, values: values };
        }

        this.drawBefore = function(chart) {
        }

        this.draw = function(chart) {
        	var width = chart.area.width,
                height = chart.area.height,
                max = (orient == 'left' || orient == 'right') ? height : width,
                obj = drawBlock(chart, orient, opt.domain, [0, max]);

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
