jui.define("chart.grid.radar", [ "util.math" ], function(math) {

	var RadarGrid = function(orient, chart, grid) {
		var position = [];
		var format;

		function drawCircle(chart, root, centerX, centerY, x, y, count) {
			var r = Math.abs(y);
			var cx = centerX;
			var cy = centerY;

			root.append(chart.svg.circle({
				cx : cx,
				cy : cy,
				r : r,
				"fill-opacity" : 0,
				stroke : chart.theme("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth")
			}))
		}

		function drawRadial(chart, root, centerX, centerY, x, y, count, unit) {
			var g = chart.svg.group();
			var points = [];

			points.push([centerX + x, centerY + y]);

			var startX = x;
			var startY = y;

			for (var i = 0; i < count; i++) {
				var obj = math.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;

				points.push([centerX + obj.x, centerY + obj.y]);
			}

			var path = chart.svg.path({
				"fill" : "none",
				stroke : chart.theme("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth")
			});

			for (var i = 0; i < points.length; i++) {
				var point = points[i];

				if (i == 0) {
					path.MoveTo(point[0], point[1])
				} else {
					path.LineTo(point[0], point[1]);
				}
			}

			path.LineTo(points[0][0], points[0][1]);
			//path.ClosePath();

			g.append(path);
			root.append(g);
		}

        function scale(obj) {
            var max = grid.max;
            var domain = grid.domain;

            return function(index, value) {
                var rate = value / max;

                var height = Math.abs(obj.y1) - Math.abs(obj.y2);
                var pos = height * rate;
                var unit = 2 * Math.PI / domain.length;

                var cx = obj.x1;
                var cy = obj.y1;
                var y = -pos;
                var x = 0;

                var o = math.rotate(x, y, unit * index);
                x = o.x;
                y = o.y;

                return {
                    x : cx + x,
                    y : cy + y
                }
            }
        }

		this.drawBefore = function() {
			grid = this.setBlockDomain(chart, grid);

			format = grid.format;
		}

		this.draw = function() {
			var width = chart.width(), height = chart.height();
			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			var w = min / 2;
			var centerX = chart.x() + width / 2;
			var centerY = chart.y() + height / 2;

			var startY = -w;
			var startX = 0;
			var count = grid.domain.length;
			var step = grid.step;
			var unit = 2 * Math.PI / count;

			var h = Math.abs(startY) / step;

			var g = chart.svg.group({
				"class" : "grid radar"
			});

			var root = chart.svg.group();

			g.append(root);

			// domain line
			position = [];
			for (var i = 0; i < count; i++) {

				var x2 = centerX + startX;
				var y2 = centerY + startY;

				root.append(chart.svg.line({
					x1 : centerX,
					y1 : centerY,
					x2 : x2,
					y2 : y2,
					stroke : chart.theme("gridAxisBorderColor"),
					"stroke-width" : chart.theme("gridBorderWidth")
				}))

				position[i] = {
					x1 : centerX,
					y1 : centerY,
					x2 : x2,
					y2 : y2
				};

				var ty = y2;
				var tx = x2;
				var talign = "middle";

				if (y2 > centerY) {
					ty = y2 + 20;
				} else if (y2 < centerY) {
					ty = y2 - 10;
				}

				if (x2 > centerX) {
					talign = "start";
					tx += 10;
				} else if (x2 < centerX) {
					talign = "end";
					tx -= 10;
				}

				if (!grid.hideText) {
					root.append(chart.text({
						x : tx,
						y : ty,
						"text-anchor" : talign,
						fill : chart.theme("gridFontColor")
					}, grid.domain[i]))
				}
				
				var obj = math.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;

			}

			if (!grid.line) {
				return {
					root : root , 
					scale : scale(position[0])
				};
			}

			// area split line
			startY = -w;
			var stepBase = 0;
			var stepValue = grid.max / grid.step;

			for (var i = 0; i < step; i++) {

				if (i == 0 && grid.extra) {
					startY += h;
					continue;
				}

				if (grid.shape == "circle") {
					drawCircle(chart, root, centerX, centerY, 0, startY, count);
				} else {
					drawRadial(chart, root, centerX, centerY, 0, startY, count, unit);
				}

				if (!grid.hideText) {
					root.append(chart.text({
						x : centerX,
						y : centerY + (startY + h - 5),
						fill : chart.theme("gridFontColor")
					}, (grid.max - stepBase) + ""))
				}

				startY += h;
				stepBase += stepValue;
			}
			
			// hide
			if (grid.hide) {
				root.attr({ display : "none" })
			}			

			return {
				root : root, 
				scale : scale(position[0])
			};
		}

		this.drawSetup = function() {
			return {
				// core options
				domain: null,
				step: 10,
				min: 0,
				max: 0,
				reverse: false,
				key: null,
				hide: false,
				unit: 0,

				// common options
				line: true,
				format: null,

				hideText: false,
				extra: false,
				shape: "radial" // or circle
			}
		}
	}

	return RadarGrid;
}, "chart.grid.core");
