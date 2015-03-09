jui.define("chart.brush.stackcolumn3d", [], function() {

    /**
     * @class chart.brush.stackcolumn3d
     * @extends chart.brush.core
     */
	var StackColumn3DBrush = function(chart, axis, brush) {
		var g;
        var width, bar_width;
        var zeroXY;

		this.drawBefore = function() {
			g = chart.svg.group();
            width = axis.x.rangeBand();
            bar_width = width - brush.outerPadding * 2;
            zeroXY = axis.c(0, 0);
		}

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = chart.svg.group(),
                    startX = axis.c(i, 0).x - bar_width / 2,
                    col_height = 0;

                for(var j = 0; j < brush.target.length; j++) {
                    var r = null,
                        value = data[brush.target[j]],
                        xy = axis.c(i, value),
                        top = Math.sin(axis.c.radian) * xy.depth;

                    var startY = xy.y + top,
                        height = Math.abs(zeroXY.y - xy.y);

                    if(brush.symbol == "cylinder") {
                        var h = (j > 0) ? height - top : height;
                        r = chart.svg.cylinder3d(this.color(j), bar_width, h, axis.c.degree, xy.depth);
                    } else {
                        r = chart.svg.rect3d(this.color(j), bar_width, height, axis.c.degree, xy.depth);
                    }

                    r.translate(startX, startY - col_height);
                    group.append(r);

                    col_height += height;
                }

                if(value != 0) {
                    this.addEvent(group, i, j);
                }

                g.append(group);
            });

            return g;
		}
	}

    StackColumn3DBrush.setup = function() {
        return {
            symbol: "rectangle",
            outerPadding: 10
        };
    }

	return StackColumn3DBrush;
}, "chart.brush.core");
