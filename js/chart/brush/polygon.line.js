jui.define("chart.brush.polygon.line",
	[ "util.base", "util.color", "util.math", "chart.polygon.point" ],
	function(_, ColorUtil, MathUtil, PointPolygon) {

	/**
	 * @class chart.brush.polygon.line
	 * @extends chart.brush.polygon.core
	 */
	var PolygonLineBrush = function() {
		this.createLine = function(datas, target, dataIndex, targetIndex) {
			var color = this.color(dataIndex, targetIndex),
				d = this.axis.z.rangeBand() - this.brush.padding * 2,
				x1 = this.axis.x(dataIndex),
				y1 = this.axis.y(datas[dataIndex][target]),
				z1 = this.axis.z(targetIndex) - d / 2,
				x2 = this.axis.x(dataIndex + 1),
				y2 = this.axis.y(datas[dataIndex + 1][target]),
				z2 = this.axis.z(targetIndex) + d / 2,
				maxDepth = 0;

			var elem = this.chart.svg.polygon({
				fill: color,
				"fill-opacity": this.chart.theme("polygonLineBackgroundOpacity"),
				stroke: ColorUtil.darken(color, this.chart.theme("polygonLineBorderOpacity")),
				"stroke-opacity": this.chart.theme("polygonLineBorderOpacity")
			});

			var points = [
				new PointPolygon(x1, y1, z1),
				new PointPolygon(x1, y1, z2),
				new PointPolygon(x2, y2, z2),
				new PointPolygon(x2, y2, z1)
			];

			for(var i = 0; i < points.length; i++) {
				this.calculate3d(points[i]);
				maxDepth = Math.max(maxDepth, points[i][2]);
			}

			for(var i = 0; i < points.length; i++) {
				var value = points[i].vertices[0];
				elem.point(value[0], value[1]);
			}

			return {
				element: elem,
				depth: maxDepth / 2
			};
		}

		this.draw = function() {
			var g = this.chart.svg.group(),
				datas = this.listData(),
				targets = this.brush.target,
				groups = [];

			for(var i = 0; i < datas.length - 1; i++) {
				for(var j = 0; j < targets.length; j++) {
					var obj = this.createLine(datas, targets[j], i, j);
					groups.push(obj);
				}
			}

			groups.sort(function(a, b) {
				return b.depth - a.depth;
			});

			for(var i = 0; i < groups.length; i++) {
				g.append(groups[i].element);
			}

			return g;
		}
	}

	PolygonLineBrush.setup = function() {
		return {
			/** @cfg {Number} [padding=20] Determines the outer margin of a bar.  */
			padding: 10,
			/** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
			clip: false
		};
	}

	return PolygonLineBrush;
}, "chart.brush.polygon.core");
