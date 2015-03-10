jui.define("chart.brush.fullstackcolumn3d", [], function() {

    /**
     * @class chart.brush.fullstackcolumn3d
     * @extends chart.brush.core
     */
	var FullStackColumn3DBrush = function() {
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

        this.getTextXY = function(index, x, y, depth) {
            return {
                x: x,
                y: y
            }
        }

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = this.chart.svg.group(),
                    startX = this.axis.c(i, 0).x - bar_width / 2,
                    startY = zeroXY.y,
                    sum = 0,
                    list = [];

                for(var j = 0; j < this.brush.target.length; j++) {
                    var height = data[this.brush.target[j]];

                    sum += height;
                    list.push(height);
                }

                for(var j = 0; j < this.brush.target.length; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value),
                        top = Math.sin(this.axis.c.radian) * xy.depth,
                        height = zeroXY.y - this.axis.y.rate(list[j], sum),
                        r = this.drawMain(j, bar_width, height, this.axis.c.degree, xy.depth);

                    r.translate(startX, startY - height + top);
                    group.append(r);

                    // 퍼센트 노출 옵션 설정
                    if(this.brush.showText) {
                        var p = Math.round((list[j] / sum) * this.axis.y.max()),
                            x = startX + bar_width / 2,
                            y = startY - height / 2 + 6,
                            xy = this.getTextXY(j, x, y, xy.depth)

                        group.append(this.drawText(p, xy.x, xy.y));
                    }

                    startY -= height;
                }

                this.addEvent(group, i, j);
                g.append(group);
            });

            return g;
		}
	}

    FullStackColumn3DBrush.setup = function() {
        return {
            outerPadding: 10,
            showText: false
        };
    }

	return FullStackColumn3DBrush;
}, "chart.brush.fullstackbar3d");
