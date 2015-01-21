jui.define("chart.brush.myclock2", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.myclock 
     * 
     * implements myclock brush 
     *  
     * @extends chart.brush.core  
     * 
     */
	var MyClockBrush = function() {

        this.drawOuterCircle = function(w, centerX, centerY) {

            var g = this.super("drawOuterCircle", arguments);
            
            g.attr({
                fill : this.color('pattern-white-rect1'),
                stroke : this.color('pattern-white-rect2')
            })
            
            return g;
        }
        
        

	}

	return MyClockBrush;
}, "chart.brush.myclock");
