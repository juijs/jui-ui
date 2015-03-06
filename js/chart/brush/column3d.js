jui.define("chart.brush.column3d", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.column3d
     *
     * implements column brush
     *
     * @extends chart.brush.bar
     */
	var Column3DBrush = function(chart, axis, brush) {
		var g;
        var width;

		this.drawBefore = function() {
			g = chart.svg.group();
            width = axis.x.rangeBand() - brush.outerPadding;
		}

		this.draw = function() {
            var count = brush.target.length;

            this.eachData(function(i, data) {
                for(var j = 0; j < count; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(i, value, j, count),
                        zeroXY = axis.c(i, 0, j, count);

                    var startY = xy.y,
                        height = Math.abs(zeroXY.y - startY),
                        r = chart.svg.rect3d(this.color(j), width, height, axis.c.degree, xy.depth - brush.innerPadding);

                    r.translate(xy.x - (width / 2), startY - (Math.sin(axis.c.radian) * brush.innerPadding));

                    // 그룹에 컬럼 엘리먼트 추가
                    g.prepend(r);
                }
            }, true);

            return g;
		}
	}

    Column3DBrush.setup = function() {
        return {
            /** @cfg {Number} [outerPadding=2] Determines the outer margin of a bar */
            outerPadding: 3,
            /** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar */
            innerPadding: 3
        };
    }

	return Column3DBrush;
}, "chart.brush.core");
