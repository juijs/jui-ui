jui.define("chart.brush.column3d", [], function() {

    /**
     * @class chart.brush.column3d
     * @extends chart.brush.core
     */
	var Column3DBrush = function() {
		var g;
        var width, col_width;

		this.drawBefore = function() {
			g = this.chart.svg.group();
            width = this.axis.x.rangeBand();
            col_width = (width - this.brush.outerPadding * 2 - (this.brush.target.length - 1) * this.brush.innerPadding) / this.brush.target.length;
            col_width = (col_width < 0) ? 0 : col_width;
		}

        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.rect3d(color, width, height, degree, depth);
        }

		this.draw = function() {
            var count = this.brush.target.length;

            this.eachData(function(i, data) {
                var zeroXY = this.axis.c(i, 0),
                    startX = zeroXY.x - (width - this.brush.outerPadding * 2) / 2;

                for(var j = 0; j < count; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value);

                    var startY = xy.y + (Math.sin(this.axis.c.radian) * xy.depth),
                        height = Math.abs(zeroXY.y - xy.y),
                        r = this.drawMain(this.color(j), col_width, height, this.axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(startX, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.append(r);

                    startX += col_width + this.brush.innerPadding;
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
