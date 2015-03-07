jui.define("chart.brush.bar3d", [], function() {

    /**
     * @class chart.brush.bar3d
     * @extends chart.brush.core
     */
	var Bar3DBrush = function(chart, axis, brush) {
		var g;
        var height, col_height;

		this.drawBefore = function() {
			g = chart.svg.group();
            height = axis.y.rangeBand();
            col_height = (height - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            col_height = (col_height < 0) ? 0 : col_height;
		}

		this.draw = function() {
            var count = brush.target.length;

            this.eachData(function(i, data) {
                var zeroXY = axis.c(0, i),
                    startY = zeroXY.y - (height - brush.outerPadding * 2) / 2;

                for(var j = 0; j < count; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i),
                        top = Math.sin(axis.c.radian) * xy.depth,
                        width = Math.abs(zeroXY.x - xy.x),
                        r = chart.svg.rect3d(this.color(j), width, col_height, axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x, startY + top);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.prepend(r);

                    startY += col_height + brush.innerPadding;
                }
            });

            return g;
		}
	}

    Bar3DBrush.setup = function() {
        return {
            outerPadding: 10,
            innerPadding: 5
        };
    }

	return Bar3DBrush;
}, "chart.brush.core");
