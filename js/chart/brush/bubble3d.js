jui.define("chart.brush.bubble3d", [], function() {

    /**
     * @class chart.brush.bubble3d
     * @extends chart.brush.core
     */
	var Bubble3DBrush = function() {
		this.draw = function() {
            var g = this.chart.svg.group(),
                count = this.brush.target.length;

            this.eachData(function(i, data) {
                for(var j = 0; j < count; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value, j, count),
                        dx = Math.cos(this.axis.c.radian) * xy.depth,
                        dy = Math.sin(this.axis.c.radian) * xy.depth,
                        startX = xy.x + dx / 2,
                        startY = xy.y - dy / 2;

                    var b = this.createBubble({
                        x: startX, y: startY, value: value
                    }, this.color(i, j));

                    this.addEvent(b, i, j);
                    g.append(b);
                }
            });

            return g;
		}
	}

	return Bubble3DBrush;
}, "chart.brush.bubble");
