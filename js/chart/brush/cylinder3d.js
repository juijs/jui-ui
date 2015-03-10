jui.define("chart.brush.cylinder3d", [], function() {

    /**
     * @class chart.brush.cylinder3d
     * @extends chart.brush.core
     */
	var Cylinder3DBrush = function() {
        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.cylinder3d(color, width, height, degree, depth, this.brush.topRate);
        }
	}

    Cylinder3DBrush.setup = function() {
        return {
            topRate: 1,
            outerPadding: 10,
            innerPadding: 5
        };
    }

	return Cylinder3DBrush;
}, "chart.brush.column3d");
