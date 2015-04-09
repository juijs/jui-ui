jui.define("chart.brush.map.template", [ "util.base" ], function(_) {

    /**
     * @class chart.brush.map.template
     * implements over brush 
     * @extends chart.brush.core
     */
	var MapTemplateBrush = function() {

		this.draw = function() {
            var self = this;
            var g = this.chart.svg.group();
            this.eachData(function(i, data) {
                var path = self.axis.map(data.id);
                var arr = path.attr('position').split(",");
                var x = parseFloat(arr[0]);
                var y = parseFloat(arr[1]);
                var result = self.brush.callback.call(self, i, data, { x : x, y : y});
                
                result.translate(x, y);
                
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
}, "chart.brush.core");
