jui.define("chart.grid.core", [ "jquery", "util.base" ], function($, _) {
	/**
	 * @class chart.grid.core
     * Grid Core 객체 
	 * @extends chart.draw
     * @abstract
	 */
	var CoreGrid = function() {

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
		 *  @example
		 *      // 그리드 속성에 키가 없을 때
		 *      scale(0);		// 0 인덱스에 대한 값  (block, radar)
		 *      // grid 속성에 key 가 있을 때
		 *      grid { key : "field" }
		 *      scale(0)			// field 값으로 scale 설정 (range, date)
         *
		 * @protected 
		 */
		this.wrapper = function(chart, scale, key) {
            var self = this;

			scale.update = function(obj) {
				self.grid = $.extend(self.grid, obj);
			}
			
			return scale;
		}
		
		/**
         * @method axisLine  
		 * theme 이 적용된  axis line 리턴
		 * @param {ChartBuilder} chart 
         * @param {Object} attr  
		 */
		this.axisLine = function(chart, attr) {
			return chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color("gridAxisBorderColor"),
				"stroke-width" : chart.theme("gridAxisBorderWidth"),
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
		this.line = function(chart, attr) {
			return chart.svg.line($.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,				
				stroke : this.color("gridBorderColor"),
				"stroke-width" : chart.theme("gridBorderWidth"),
				"stroke-dasharray" : chart.theme("gridBorderDashArray"),
				"stroke-opacity" : 1
			}, attr));
		}

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
		this.drawGrid = function(chart, orient, cls, grid) {
			// create group
			var root = chart.svg.group();

			// render axis
			this[orient].call(this, chart, root);

			// wrapped scale
			this.scale = this.wrapper(chart, this.scale, grid.key);

			// hide grid 
			if (grid.hide) {
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
		 * @param chart
		 * @param orient
		 * @param grid
		 * @returns {Object} 
         * @returns {Number} start
         * @returns {Number} size 
         * @returns {Number} end
		 */
		this.getGridSize = function(chart, orient, grid) {
			var width = chart.area('width'),
				height = chart.area('height'),
				axis = (orient == "left" || orient == "right") ? chart.area('y') : chart.area('x'),
				max = (orient == "left" || orient == "right") ? height : width,
				start = axis,
				size = max;

			return {
				start: start,
				size: size,
				end: start + size
			}
		}
	}

	CoreGrid.setup = function() {
		return {
            /**
             * @cfg {Number} [extend=null] extend grid's option
             */
			extend:	null,
            /**
             * @cfg
             * grid line distance
             */
			dist: 0,
			orient: null,
			hide: false,
			color: null,
			title: null,
			line: false,
            subline : 0,
            baseline : true,
			format: null,
			textRotate : null
		};
	}

	return CoreGrid;
}, "chart.draw"); 