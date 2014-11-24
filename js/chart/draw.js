jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
	/**
	 * 그리기 Base 클래스
	 * 
	 * 
	 */
	var Draw = function() {

        function setupOptions(options, defOpts) {
            var exceptOpts = [
                    "type", "target", "index", "colors", // only brush
                    "x", "y", "x1", "y1", "c", "dist" // only grid
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

                if(_.typeCheck("undefined", options[key])) {
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
            if (!_.typeCheck("function", this.draw)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
            }

            // Call drawSetting method (Only brush and widget)
            if (_.typeCheck("function", this.drawSetup)) {
                var tmpOpts = this.drawSetup(),
                    opts = _.typeCheck("object", tmpOpts) ? tmpOpts : {};

                // Options Check
                setupOptions(this.grid || this.brush || this.widget, opts);
            }

            // Call drawBefore method (All)
            if (_.typeCheck("function", this.drawBefore)) {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            if (!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                if(this.brush) { // 브러쉬일 경우, 기본 좌표 설정
                    obj.translate(this.chart.x(), this.chart.y());
                }
            }

            return obj;
		}
	}

	return Draw;
});
