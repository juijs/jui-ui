jui.define("chart.brush.fullstackbar3d", [], function() {

    /**
     * @class chart.brush.fullstackbar3d
     * @extends chart.brush.core
     */
	var FullStackBar3DBrush = function(chart, axis, brush) {
		var g;
        var height, bar_height;
        var zeroXY;

		this.drawBefore = function() {
			g = chart.svg.group();
            height = axis.y.rangeBand();
            bar_height = height - brush.outerPadding * 2;
            zeroXY = axis.c(0, 0);
		}

        this.drawText = function(percent, x, y) {
            var text = this.chart.text({
                x : x,
                y : y,
                "text-anchor" : "middle"
            }, percent + "%");

            return text;
        }

		this.draw = function() {
            this.eachData(function(i, data) {
                var group = chart.svg.group(),
                    startY = axis.c(0, i).y - bar_height / 2,
                    col_width = 0,
                    sum = 0,
                    list = [];

                for(var j = 0; j < brush.target.length; j++) {
                    var width = data[brush.target[j]];

                    sum += width;
                    list.push(width);
                }

                for(var j = 0; j < brush.target.length; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i),
                        top = Math.sin(axis.c.radian) * xy.depth,
                        width = axis.x.rate(list[j], sum),
                        r = chart.svg.rect3d(this.color(j), width, bar_height, axis.c.degree, xy.depth);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x + col_width, startY + top);

                    // 그룹에 컬럼 엘리먼트 추가
                    group.append(r);

                    // 퍼센트 노출 옵션 설정
                    if(brush.showText) {
                        var p = Math.round((list[j] / sum) * axis.x.max()),
                            x = col_width + width / 2,
                            y = startY + bar_height / 2 + 5;

                        group.append(this.drawText(p, x, y));
                    }

                    col_width += width;
                }

                this.addEvent(group, i, j);
                g.append(group);
            });

            return g;
		}
	}

    FullStackBar3DBrush.setup = function() {
        return {
            outerPadding: 10,
            showText: false
        };
    }

	return FullStackBar3DBrush;
}, "chart.brush.core");
