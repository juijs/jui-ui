jui.define("chart.brush.fullstackcylinder3d", [], function() {

    /**
     * @class chart.brush.fullstackcylinder3d
     * @extends chart.brush.core
     */
	var FullStackCylinder3DBrush = function() {
        this.drawMain = function(index, width, height, degree, depth) {
            var top = Math.sin(this.axis.c.radian) * depth,
                h = (index > 0) ? height - top : height;

            return this.chart.svg.cylinder3d(this.color(index), width, h, degree, depth);
        }

        this.getTextXY = function(index, x, y, depth) {
            var top = Math.sin(this.axis.c.radian) * depth;

            return {
                x: x + ((Math.cos(this.axis.c.radian) * depth) / 2),
                y: y - ((index > 0) ? top : 0)
            }
        }
	}

	return FullStackCylinder3DBrush;
}, "chart.brush.fullstackcolumn3d");
