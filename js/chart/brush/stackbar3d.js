jui.define("chart.brush.stackbar3d", [], function() {

    /**
     * @class chart.brush.stackbar3d
     * @extends chart.brush.core
     */
	var StackBar3DBrush = function(chart, axis, brush) {
		var g;
        var height, bar_height;
        var zeroXY;

		this.drawBefore = function() {
			g = chart.svg.group();
            height = axis.y.rangeBand();
            bar_height = height - brush.outerPadding * 2;
            zeroXY = axis.c(0, 0);
		}

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = chart.svg.group(),
                    startY = axis.c(0, i).y - bar_height / 2,
                    col_width = 0;

                for(var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i),
                        top = Math.sin(axis.c.radian) * xy.depth,
                        width = Math.abs(zeroXY.x - xy.x),
                        r = chart.svg.rect3d(this.color(j), width, bar_height, axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x + col_width, startY + top);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.append(r);

                    col_width += width;
                }

                if(value != 0) {
                    this.addEvent(group, i, j);
                }

                g.append(group);
            });

            return g;
		}
	}

    StackBar3DBrush.setup = function() {
        return {
            outerPadding: 10
        };
    }

	return StackBar3DBrush;
}, "chart.brush.core");
