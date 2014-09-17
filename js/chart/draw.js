jui.define("chart.draw", [ "util.base" ], function(_) {
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
		this.render = function(chart) {

			/**
			 * 
			 * 그리기 객체는 draw 함수를 항상 정의해야한다. 
			 * 
			 */
			if (!_.typeCheck("function", this.draw)) {
				throw new Error("JUI_CRITICAL_ERR: 'draw' method must be implemented");
			}
			
			// drawBefore
            if (_.typeCheck("function", this.drawBefore)) {
                this.drawBefore(chart);
            }			

			// draw 함수 실행 
			return this.draw(chart);
		}
		
	}

	return Draw;
});
