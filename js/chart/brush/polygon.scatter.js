jui.define("chart.brush.polygon.scatter",
	[ "util.base", "util.math", "util.color", "chart.polygon.point" ],
	function(_, MathUtil, ColorUtil, PointPolygon) {

	/**
	 * @class chart.brush.polygon.scatter
	 * @extends chart.brush.polygon.core
	 */
	var PolygonScatterBrush = function() {
		this.createScatter = function(data, target, dataIndex, targetIndex) {
			var color = this.color(dataIndex, targetIndex),
				zkey = this.brush.zkey,
				r = this.brush.size / 2,
				x = this.axis.x(dataIndex),
				y = this.axis.y(data[target]),
				z = null;

			if(_.typeCheck("function", zkey)) {
				var zk = zkey.call(this.chart, data);
				z = this.axis.z(zk);
			} else {
				z = this.axis.z(data[zkey]);
			}

			if(color.indexOf("radial") == -1) {
				color = this.chart.color(
					"radial(40%,40%,100%,0%,0%) 0% " +
					ColorUtil.lighten(color, this.chart.theme("polygonScatterRadialOpacity")) +
					",70% " +
					color
				);
			}

			return this.drawPolygon(new PointPolygon(x, y, z), function(p) {
				var elem = this.chart.svg.circle({
					r: r * MathUtil.scaleValue(z, 0, this.axis.depth, 1, p.perspective),
					fill: color,
					"fill-opacity": this.chart.theme("polygonScatterBackgroundOpacity"),
					cx: p.vectors[0].x,
					cy: p.vectors[0].y
				});

				if(data[target] != 0) {
					this.addEvent(elem, dataIndex, targetIndex);
				}

				return elem;
			});
		}

		this.draw = function() {
			var g = this.chart.svg.group(),
				datas = this.listData(),
				targets = this.brush.target;

			for(var i = 0; i < datas.length; i++) {
				for(var j = 0; j < targets.length; j++) {
					g.append(this.createScatter(datas[i], targets[j], i, j));
				}
			}

			return g;
		}
	}

		PolygonScatterBrush.setup = function() {
		return {
			zkey: null,

			/** @cfg {Number} [size=7]  Determines the size of a starter. */
			size: 7,
			/** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
			clip: false
		};
	}

	return PolygonScatterBrush;
}, "chart.brush.polygon.core");
