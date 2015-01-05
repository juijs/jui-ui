jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
	/**
	 * 그리기 Base 클래스
	 * 
	 * 
	 */
	var Draw = function() {

		/**
		 * 모든 Draw 객체는  render 함수를 통해서 그려진다. 
		 * 
		 */
		this.render = function() {
            if(!_.typeCheck("function", this.draw)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
            }

            // Call drawBefore method (All)
            if(_.typeCheck("function", this.drawBefore)) {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            if(!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                if(_.typeCheck("object", this.brush)) {
                    obj.attr({ "class": "brush brush-" + this.brush.type });
                    obj.translate(this.chart.area("x"), this.chart.area("y")); // 브러쉬일 경우, 기본 좌표 설정
                } else if(_.typeCheck("object", this.widget)) {
                    obj.attr({ "class": "widget widget-" + this.widget.type });
                } else if(_.typeCheck("object", this.grid)) {
                    obj.root.attr({ "class": "grid grid-" + this.grid.type });
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

    Draw.setup = function() {
        return {
            type: null
        }
    }

	return Draw;
});
