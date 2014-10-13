jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
	/**
	 * 그리기 Base 클래스
	 * 
	 * 
	 */
	var Draw = function() {
        var self = this;

        function setupOptions(defOpts, opts) {
            var exceptOpts = [ "type", "target", "x", "y", "x1", "y1", "index", "colors" ],
                defOptKeys = [],
                optKeys = [];

            for(var key in defOpts) { defOptKeys.push(key); }
            for(var key in opts) { optKeys.push(key); }

            for(var i = 0; i < optKeys.length; i++) {
                var name = optKeys[i];

                if($.inArray(name, defOptKeys) == -1 && $.inArray(name, exceptOpts) == -1) {
                    throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not an option in chart.draw");
                }
            }

            // 옵션 프로퍼티 설정
            self.options = $.extend(defOpts, opts);

            // 옵션이 아닌 프로퍼티 제거
            for(var i = 0; i < exceptOpts.length; i++) {
                delete self.options[exceptOpts[i]];
            }
        }
		
		/**
		 * 모든 Draw 객체는  render 함수를 통해서 그려진다. 
		 * 
		 */
		this.render = function(chart, options) {

			/**
			 * 
			 * 그리기 객체는 draw 함수를 항상 정의해야한다. 
			 * 
			 */
			if (!_.typeCheck("function", this.draw)) {
				throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
			}

            // drawSetup
            if (_.typeCheck("function", this.drawSetup)) {
                var opts = this.drawSetup(chart),
                    defOpts = _.typeCheck("object", opts) ? opts : {};

                // Options Check
                setupOptions(defOpts, options);
            }
			
			// drawBefore
            if (_.typeCheck("function", this.drawBefore)) {
                this.drawBefore(chart);
            }			

			// draw 함수 실행 
			var obj = this.draw(chart);

            if (!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            }

            return obj;
		}
	}

	return Draw;
});
