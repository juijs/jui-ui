jui.define("chart.brush.polygon.core", [], function() {
    var PolygonCoreBrush = function() {
        this.drawPolygon = function(polygon, callback) {
            this.calculate3d(polygon);

            var element = callback.call(this, polygon);
            if(element) {
                element.order = this.axis.depth - polygon.max().z;
                return element;
            }
        }
    }

    PolygonCoreBrush.setup = function() {
        return {
            id: null,
            clip: false
        }
    }

    return PolygonCoreBrush;
}, "chart.brush.core");