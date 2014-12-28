jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
	/**
	 * 그리기 Base 클래스
	 * 
	 * 
	 */
	var Draw = function() {

        function setupOptions(options, defOpts) {
            var exceptOpts = [
                    "extend", "dist", "orient", "x", "y", "c",   // axis
                    "type", "target", "index", "colors", "axis" // common
                ],
                defOptKeys = [],
                optKeys = [];

            // 사용자가 넘긴 옵션
            for(var key in options) {
                optKeys.push(key);
            }

            // 드로우 객체의 정의된 옵션
            for(var key in defOpts) {
                defOptKeys.push(key);

                if(typeof options[key] == 'undefined') {
                    options[key] = defOpts[key];
                }
            }

            // 정의되지 않은 옵션 사용 유무 체크
            for(var i = 0; i < optKeys.length; i++) {
                var name = optKeys[i];

                if($.inArray(name, defOptKeys) == -1 && $.inArray(name, exceptOpts) == -1) {
                    throw new Error("JUI_CRITICAL_ERR: '" + name + "' is not an option in chart.draw");
                }
            }
        }
		
		/**
		 * 모든 Draw 객체는  render 함수를 통해서 그려진다. 
		 * 
		 */
		this.render = function() {
            if (typeof this.draw != 'function') {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
            }

            // Call drawSetting method (Only brush and widget)
            if (typeof this.drawSetup == 'function') {
                var tmpOpts = this.drawSetup(),
                    opts = (typeof tmpOpts == 'object') ? tmpOpts : {};

                // Options Check
                setupOptions(this.grid || this.brush || this.widget, opts);
            }

            // Call drawBefore method (All)
            if (typeof this.drawBefore == 'function') {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            if (typeof obj != 'object') {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                if(this.brush) { // 브러쉬일 경우, 기본 좌표 설정
                    obj.translate(this.chart.area("x"), this.chart.area("y"));
                }
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

	return Draw;
});
