jui.define("chart.brush.stackcylinder3d", [], function() {

    /**
     * @class chart.brush.stackcylinder3d
     * @extends chart.brush.core
     */
	var StackCylinder3DBrush = function() {
        this.drawMain = function(index, width, height, degree, depth) {
            var top = Math.sin(this.axis.c.radian) * depth,
                h = (index > 0) ? height - top : height;

            return this.chart.svg.cylinder3d(this.color(index), width, h, degree, depth);
        }
	}

	return StackCylinder3DBrush;
}, "chart.brush.stackcolumn3d");
