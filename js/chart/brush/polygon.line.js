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
				maxPoint = null;

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
				this.drawPolygon(points[i], function(p) {
					var vector = p.vectors[0];
					elem.point(vector.x, vector.y);

					if(maxPoint == null) {
						maxPoint = p;
					} else {
						if(vector.z > maxPoint.vectors[0].z) {
							maxPoint = p;
						}
					}
				});
			}

			// 별도로 우선순위 설정
			elem.order = this.axis.depth - maxPoint.max().z;

			return elem;
		}

		this.draw = function() {
			var g = this.chart.svg.group(),
				datas = this.listData(),
				targets = this.brush.target;

			for(var i = 0; i < datas.length - 1; i++) {
				for(var j = 0; j < targets.length; j++) {
					g.append(this.createLine(datas, targets[j], i, j));
				}
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
