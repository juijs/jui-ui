jui.define("chart.brush.map.template", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.template
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapTemplateBrush = function() {
        var self = this;

		this.draw = function() {
            var g = this.chart.svg.group();

            this.eachData(function(i, data) {
                var xy = self.axis.map(data.id),
                    result = self.brush.callback.call(self, i, data, { x: xy.x, y: xy.y });

                result.translate(xy.x, xy.y);
                g.append(result);
            });

			return g;
		}
	}

    MapTemplateBrush.setup = function() {
        return {
            callback : function(data) { return ''; }
        }

    }

	return MapTemplateBrush;
}, "chart.brush.map.core");
