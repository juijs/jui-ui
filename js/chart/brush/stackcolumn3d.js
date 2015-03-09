jui.define("chart.brush.stackcolumn3d", [], function() {

    /**
     * @class chart.brush.stackcolumn3d
     * @extends chart.brush.core
     */
	var StackColumn3DBrush = function() {
		var g;
        var width, bar_width;
        var zeroXY;

		this.drawBefore = function() {
			g = this.chart.svg.group();
            width = this.axis.x.rangeBand();
            bar_width = width - this.brush.outerPadding * 2;
            zeroXY = this.axis.c(0, 0);
		}

        this.drawMain = function(index, width, height, degree, depth) {
            return this.chart.svg.rect3d(this.color(index), width, height, degree, depth);
        }

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = this.chart.svg.group(),
                    startX = this.axis.c(i, 0).x - bar_width / 2,
                    col_height = 0;

                for(var j = 0; j < this.brush.target.length; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value),
                        top = Math.sin(this.axis.c.radian) * xy.depth;

                    var startY = xy.y + top,
                        height = Math.abs(zeroXY.y - xy.y),
                        r = this.drawMain(j, bar_width, height, this.axis.c.degree, xy.depth);

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
            outerPadding: 10
        };
    }

	return StackColumn3DBrush;
}, "chart.brush.core");
