jui.define("chart.grid.core", [ "jquery", "util.base", "util.math" ], function($, _, math) {
	/**
	 * @class chart.grid.core
     * Grid Core 객체
	 * @extends chart.draw
     * @abstract
	 */
	var CoreGrid = function() {

        /**
         * @method drawAfter
         *
         *
         *
         * @param {Object} obj
         * @protected
         */
		this.drawAfter = function(obj) {
			obj.root.attr({ "class": "grid grid-" + this.grid.type});
		}

		/**
		 * @method wrapper
         * scale wrapper
		 *
		 * grid 의 x 좌표 값을 같은 형태로 가지고 오기 위한 wrapper 함수
		 *
		 * grid 속성에 key 가 있다면  key 의 속성값으로 실제 값을 처리
		 *
		 *      @example
		 *      // 그리드 속성에 키가 없을 때
		 *      scale(0);		// 0 인덱스에 대한 값  (block, radar)
		 *      // grid 속성에 key 가 있을 때
		 *      grid { key : "field" }
		 *      scale(0)			// field 값으로 scale 설정 (range, date)
         *
		 * @protected
		 */
		this.wrapper = function(scale, key) {
			return scale;
		}

		/**
         * @method axisLine
		 * theme 이 적용된  axis line 리턴
		 * @param {ChartBuilder} chart
         * @param {Object} attr
		 */
		this.axisLine = function(attr) {
			return this.chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridAxisBorderColor"),
				"stroke-width" : this.chart.theme("gridAxisBorderWidth"),
				"stroke-opacity" : 1
			}, attr));
		}

		/**
		 * @method line
         * theme 이 적용된  line 리턴
         * @protected
         * @param {ChartBuilder} chart
         * @param {Object} attr
		 */
		this.line = function(attr) {
			return this.chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridBorderColor"),
				"stroke-width" : this.chart.theme("gridBorderWidth"),
				"stroke-dasharray" : this.chart.theme("gridBorderDashArray"),
				"stroke-opacity" : 1
			}, attr));
		}

        /**
         * @method color
         * grid 에서 color 를 위한 유틸리티 함수
         * @param theme
         * @return {Mixed}
         */
		this.color  = function(theme) {
			if (arguments.length == 3) {
				return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme.apply(this.chart, arguments);
			}

			return (this.grid.color) ? this.chart.color(0, { colors: [ this.grid.color ] }) : this.chart.theme(theme);
		}

        /**
         * @method data
         * get data for axis
         * @protected
         * @param {Number} index
         * @param {String} field
         */
        this.data = function(index, field) {
			if(this.axis.data && this.axis.data[index]) {
                return this.axis.data[index][field] || this.axis.data[index];
			}

			return this.axis.data || [];
		}

        /**
         * @method drawGrid
         * draw base grid structure
         * @protected
         * @param {chart.builder} chart
         * @param {String} orient
         * @param {String} cls
         * @param {Grid} grid
         */
		this.drawGrid = function() {
			// create group
			var root = this.chart.svg.group(),
                func = this[this.grid.orient];

			// render axis
            if(_.typeCheck("function", func)) {
                func.call(this, root);
            }

			// wrapped scale
			this.scale = this.wrapper(this.scale, this.grid.key);

			// hide grid
			if(this.grid.hide) {
				root.attr({ display : "none" })
			}

			return {
				root : root,
				scale : this.scale
			};
		}

        /**
         * @method getTextRotate
         * implement text rotate in grid text
         * @protected
         * @param {SVGElement} textElement
         */
		this.getTextRotate = function(textElement) {
			var rotate = this.grid.textRotate;

			if (rotate == null) {
				return textElement;
			}

			if (_.typeCheck("function", rotate)) {
				rotate = rotate.apply(this.chart, [ textElement ]);
			}

			var x = textElement.attr("x");
			var y = textElement.attr("y");

			textElement.rotate(rotate, x, y);

			return textElement;
		}

		/**
		 * @method getGridSize
         *
         * get real size of grid
		 *
		 * @param {chart.builder} chart
		 * @param {Strng} orient
		 * @param {Object} grid             그리드 옵션
		 * @return {Object}
         * @return {Number} return.start    시작 지점
         * @return {Number} return.size     그리드 넓이 또는 높이
         * @return {Number} return.end      마지막 지점
		 */
		this.getGridSize = function() {
			var width = this.axis.area("width"),
				height = this.axis.area("height"),
				axis = (this.grid.orient == "left" || this.grid.orient == "right") ? this.axis.area("y") : this.axis.area("x"),
				max = (this.grid.orient == "left" || this.grid.orient == "right") ? height : width,
                depth = this.axis.get("depth"),
                angle = this.axis.get("angle"),
				start = axis,
				size = max,
                end = start + size,
                x2 = 0,
                y2 = 0;

            if(depth > 0 || angle > 0) {
                var radian = math.radian(360 - angle);
                x2 = Math.cos(radian) * depth,
                y2 = Math.sin(radian) * depth;
            }

            if(this.grid.orient == "left" || this.grid.orient == "right") {
                return {
                    start: start - y2,
                    size: size - y2,
                    end: end
                }
            } else {
                return {
                    start: start,
                    size: size - x2,
                    end: end - x2
                }
            }
		}
	}

	CoreGrid.setup = function() {

        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} grid */

		return {
            /**
             * @cfg {Number} [extend=null] extend grid's option
             */
			extend:	null,
            /**  @cfg {Number} [dist=0] 그리는 좌표로부터 떨어지는 거리  */
			dist: 0,

			/**  @cfg {"top"/"left"/"bottom"/"right"} [orient=null] 기본적으로 배치될 그리드 방향 */
			orient: null,

            /** @cfg {Boolean} [hide=false] 숨기기 여부 설정, hide=true 이면 보이지 않음  */
			hide: false,

            /** @cfg {String/Object/Number} [color=null] 그리드의 라인 색깔 */
			color: null,
            /** @cfg {String} [title=null] */
			title: null,
            /** @cfg {Boolean} [hide=false] */
			line: false,
            baseline : true,
            /** @cfg {Function} [format=null]  화면상에 나타나는 텍스트를 변환하는 함수 */
			format: null,
            /** @cfg {Number} [textRotate=null] 표시되는 텍스트의 회전 여부 */
			textRotate : null
		};
	}

	return CoreGrid;
}, "chart.draw"); 