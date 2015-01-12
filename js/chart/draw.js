jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.draw
     * Base Draw Class
     * @extends core
     * @alias Draw
     * @requires util.base
     * @requires jquery
     *
     */
	var Draw = function() {

		/**
		 * 모든 Draw 객체는  render 함수를 통해서 그려진다. 
		 * 
		 */
		this.render = function() {
            if(!_.typeCheck("function", this.draw) || !_.typeCheck("function", this.drawAfter)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw & drawAfter' method must be implemented");
            }

            // Call drawBefore method (All)
            if(_.typeCheck("function", this.drawBefore)) {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            // Call drawAnimate method (All)
            if(_.typeCheck("function", this.drawAnimate)) {
                var draw = this.grid || this.brush || this.widget;

                if(draw.animate === true) {
                    this.drawAnimate(obj);
                }
            }

            if(!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                this.drawAfter(obj);
            }

            return obj;
		}

        /**
         * Draw 객체 기본 포맷 메소드
         *
         */
        this.format = function() {
            var draw = this.grid || this.brush || this.widget,
                callback = draw.format || this.chart.format;

            return callback.apply(this.chart, arguments);
        }
	}

    Draw.setup = function() {
        return {
            type: null,
            animate: false
        }
    }

	return Draw;
});
