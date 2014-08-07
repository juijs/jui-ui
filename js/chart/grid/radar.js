jui.define("chart.grid.radar", [], function() {

	var Grid = function(orient, opt) {
        var position = [];

        function drawCircle(chart, root, centerX, centerY, x, y, count) {
            var r = Math.abs(y);
            var cx = centerX;
            var cy = centerY;

            root.append(chart.svg.circle({
                cx : cx,
                cy : cy,
                r : r,
                "fill-opacity" : 0,
                stroke : 'black',
                "stroke-width" : 1
            }))
        }

        function drawRadal(chart, root, centerX, centerY, x, y, count, unit) {

            var g = chart.svg.group();

            var points = [];

            points.push([centerX + x, centerY + y]);

            var startX = x;
            var startY = y;

            for (var i = 0; i < count; i++) {
                var obj = this.rotate(startX, startY, unit);

                startX = obj.x;
                startY = obj.y;

                points.push([centerX + obj.x, centerY + obj.y]);
            }

            var path = chart.svg.path({

                "fill-opacity" : 0,
                stroke : "black"
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

            g.append(path)

            root.append(g);
        }
		
		this.drawBefore = function(chart) {
		}

		this.xy = function(index, rate) {
            var obj = position[0];

            var height = Math.abs(obj.y1) - Math.abs(obj.y2);
            var pos = height * rate;
            var unit = 2 * Math.PI / opt.domain.length;

            var centerX = obj.x1;
            var centerY = obj.y1;
            var y = -pos;
            var x = 0;

            for (var i = 0; i < index; i++) {

                var obj = this.rotate(x, y, unit);

                x = obj.x;
                y = obj.y;
            }

            return { x: centerX + x, y: centerY + y }
        }

		this.draw = function(chart) {
			var width = chart.area.width, height = chart.area.height;
			opt.line = typeof opt.line == 'undefined' ? true : opt.line;

			var min = width;

			if (height < min) {
				min = height;
			}

			// center
			var w = min / 2;
			var centerX = width / 2;
			var centerY = height / 2;

			var startY = -w / 1.5;
			var startX = 0;
			var count = opt.domain.length;
			var step = opt.step;
			var unit = 2 * Math.PI / count;

			var h = Math.abs(startY) / step;

			var g = chart.svg.group({
				'class' : 'grid radal'
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
					"stroke-width" : 1,
					'stroke' : 'black'
				}))
				
				position[i] = { x1 : centerX, y1 : centerY, x2 : x2, y2 : y2 };

				var ty = y2;
				var tx = x2;
				var talign = 'middle';

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

				root.append(chart.svg.text({
					x : tx,
					y : ty,
					'text-anchor' : talign
				}, opt.domain[i]))

				var obj = this.rotate(startX, startY, unit);

				startX = obj.x;
				startY = obj.y;

			}

			if (!opt.line)
				return;

			// area split line
			startY = -w / 1.5;

			for (var i = 0; i < step; i++) {

				if (i == 0 && opt.extra) {
					startY += h;
					continue;
				}
				if (opt.shape == 'circle') {
					drawCircle(chart, root, centerX, centerY, 0, startY, count);
				} else {
					drawRadal(chart, root, centerX, centerY, 0, startY, count, unit);
				}

				startY += h;
			}

			return this; 
		}
	}

	return Grid;
}, "chart.grid");
