jui.define("chart.brush.fullstackcolumn3d", [], function() {

    /**
     * @class chart.brush.fullstackcolumn3d
     * @extends chart.brush.core
     */
	var FullStackColumn3DBrush = function(chart, axis, brush) {
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
                    startY = zeroXY.y,
                    sum = 0,
                    list = [];

                for(var j = 0; j < brush.target.length; j++) {
                    var height = data[brush.target[j]];

                    sum += height;
                    list.push(height);
                }

                for(var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(i, value),
                        top = Math.sin(axis.c.radian) * xy.depth;

                    var height = zeroXY.y - axis.y.rate(list[j], sum),
                        r = chart.svg.rect3d(this.color(j), bar_width, height, axis.c.degree, xy.depth);

                    r.translate(startX, startY - height + top);
                    group.append(r);

                    // 퍼센트 노출 옵션 설정
                    if(brush.showText) {
                        var p = Math.round((list[j] / sum) * axis.y.max()),
                            x = startX + bar_width / 2,
                            y = startY - height / 2 + 6;

                        group.append(this.drawText(p, x, y));
                    }

                    startY -= height;
                }

                this.addEvent(group, i, j);
                g.append(group);
            });

            return g;
		}
	}

	return FullStackColumn3DBrush;
}, "chart.brush.fullstackbar3d");
