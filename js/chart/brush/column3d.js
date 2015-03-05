jui.define("chart.brush.column3d", [], function() {

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
            this.eachData(function(i, data) {
                for(var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(i, value, j),
                        zeroXY = axis.c(i, 0, j);

                    var startY = xy.y,
                        height = Math.abs(zeroXY.y - startY),
                        r = chart.svg.rect3d(this.color(j), width, height, axis.c.angle, axis.c.depth - brush.innerPadding);

                    r.translate(xy.x - width / 2, startY);

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
