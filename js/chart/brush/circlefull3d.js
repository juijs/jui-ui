jui.define("chart.brush.circlefull3d", [ "chart.polygon.point" ], function(PointPolygon) {

	/**
	 * @class chart.brush.circlefull3d
	 * @extends chart.brush.core
	 */
	var CircleFull3DBrush = function() {
		this.createCircle = function(data, target, dataIndex, targetIndex) {
			var color = this.color(dataIndex, targetIndex),
				r = this.brush.size / 2,
				x = this.axis.x(dataIndex),
				y = this.axis.y(data[target]),
				z = 0,
				p = new PointPolygon(x, y, z);

			this.calculate3d(p);
			var elem = this.chart.svg.circle({
				r: r,
				fill: color,
				cx: p.vertices[0][0],
				cy: p.vertices[0][1]
			});

			return elem;
		}

		this.draw = function() {
			var g = this.chart.svg.group(),
				datas = this.listData(),
				targets = this.brush.target;

			for(var i = 0; i < datas.length; i++) {
				for(var j = 0; j < targets.length; j++) {
					var p = this.createCircle(datas[i], targets[j], i, j);

					this.addEvent(p, i, j);
					g.append(p);
				}
			}

			return g;
		}
	}

	CircleFull3DBrush.setup = function() {
		return {
			/** @cfg {Number} [size=7]  Determines the size of a starter. */
			size: 7,
			/** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
			clip: false
		};
	}

	return CircleFull3DBrush;
}, "chart.brush.core");
