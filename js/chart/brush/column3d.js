jui.define("chart.brush.column3d", [], function() {

    /**
     * @class chart.brush.column3d
     * @extends chart.brush.core
     */
	var Column3DBrush = function(chart, axis, brush) {
		var g;
        var width, col_width;

		this.drawBefore = function() {
			g = chart.svg.group();
            width = axis.x.rangeBand();
            col_width = (width - brush.outerPadding * 2 - (brush.target.length - 1) * brush.innerPadding) / brush.target.length;
            col_width = (col_width < 0) ? 0 : col_width;
		}

		this.draw = function() {
            var count = brush.target.length;

            this.eachData(function(i, data) {
                var zeroXY = axis.c(i, 0),
                    startX = zeroXY.x - (width - brush.outerPadding * 2) / 2;

                for(var j = 0; j < count; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(i, value);

                    var startY = xy.y + (Math.sin(axis.c.radian) * xy.depth),
                        height = Math.abs(zeroXY.y - xy.y),
                        r = chart.svg.rect3d(this.color(j), col_width, height, axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(startX, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.append(r);

                    startX += col_width + brush.innerPadding;
                }
            });

            return g;
		}
	}

    Column3DBrush.setup = function() {
        return {
            outerPadding: 10,
            innerPadding: 5
        };
    }

	return Column3DBrush;
}, "chart.brush.core");
