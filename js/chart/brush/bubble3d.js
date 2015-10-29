jui.define("chart.brush.bubble3d", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.bubble3d
     * @extends chart.brush.core
     */
	var Bubble3DBrush = function() {
		this.getRadialGradient = function(i, j) {
            var color = this.color(i, j),
                degree = this.axis.c.degree,
                dx_rate = 40 / 45,
                dy_rate = 80 / 90,
                dx = 50 + (dx_rate * ((degree >= 45) ? Math.abs(degree - 90) : degree)),
                dy = 10 + (dy_rate * (90 - degree));

            if(color.indexOf("radial") == -1) {
                return this.chart.color("radial(" + dx + "%," + dy + "%,50%," + dx + "%," + dy + "%) 0% #FFFFFF,50% " + color);
            }

            return color;
        }

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
                        startY = xy.y - dy / 2,
                        rate = math.scaleValue(count - j, 1, count, 0.6, 1),
                        color = this.color(i, j);

                    var b = this.createBubble({
                        x: startX, y: startY, value: value
                    }, color),
                    c = b.get(0);

                    c.attr({
                        r: c.attributes.r * rate,
                        fill: this.getRadialGradient(i, j)
                    });

                    this.addEvent(b, i, j);
                    g.append(b);
                }
            });

            return g;
		}
	}

	return Bubble3DBrush;
}, "chart.brush.bubble");
