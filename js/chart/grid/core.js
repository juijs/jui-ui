jui.define("chart.grid.core", [ "jquery", "util.base", "util.math" ], function($, _, math) {
	/**
	 * @class chart.grid.core
     * Grid Core 객체
	 * @extends chart.draw
     * @abstract
	 */
	var CoreGrid = function() {

		this.getLineOption = function() {
			var line = this.grid.line;

			if (typeof line === "string") {
				line = { type : line || "solid"}
			} else if (typeof line === "number") {
				line = { type : "solid", "stroke-width" : line }
			} else if (typeof line !== "object") {
				line = !!line;

				if (line) {
					line = { type : "solid" }
				}
			}

			if (line && !line.type == "string") {
				line.type = line.type.split(/ /g);
			}

			return line;
		}

		this.drawBaseLine = function(position, g) {

			var obj = this.getGridSize();
			var pos = {};

			if (position == "bottom" || position == "top") {
				pos = { x1 : obj.start, x2 : obj.end };
			} else if (position == "left" || position == "right") {
				pos = { y1 : obj.start, y2 : obj.end };
			} else {
				// TODO: custom base line
			}

			g.append(this.axisLine(pos));
		}

		this.getLineForArea = function(orient, obj) {
			return obj;
		}

		this.checkDrawLineTop = function(index, isLast) {

			var y = this.axis.get("y");

			var orient = y.orient;

			if (y && y.hide) {

			} else if (orient == "left") {
				if (index == 0) return;
			} else if (orient == "right") {
				if (isLast) return;
			}

			return true;
		}

		this.checkDrawLineBottom  = function(index, isLast) {
			var y = this.axis.get("y");

			var orient = y.orient;

			if (y && y.hide) {

			} else if (orient == "left") {
				if (index == 0 ) return;
			} else if (orient == "right") {
				if (isLast) return;
			}

			return true;
		}

		this.checkDrawLineLeft = function(index, isLast) {
			var x = this.axis.get("x");

			var orient = x.orient;

			if (x && x.hide) {

			} else if (orient == "top") {
				if (index == 0) return;
			} else if (orient == "bottom") {
				if (isLast) return;
			}

			return true;
		}

		this.checkDrawLineRight = function(index, isLast) {
			var x = this.axis.get("x");

			var orient = x.orient;

			if (x && x.hide) {

			} else if (orient == "top") {
				if (index == 0) return;
			} else if (orient == "bottom") {
				if (isLast) return;
			}

			return true;
		}

		this.checkDrawRect = function(index, isLast) {
			return true;
		}

		this.drawValueLine = function(position, axis, isActive, line, index, isLast) {


			var area = { };
			if (position == "top") {

				if (!this.checkDrawLineTop(index, isLast)) return;

				area = this.getLineForArea('top', {x1: 0, x2: 0, y1: 0, y2: this.axis.area("height")});
			} else if (position == "bottom" ) {

				if (!this.checkDrawLineBottom(index, isLast)) return;

				area = this.getLineForArea('bottom', {x1: 0, x2: 0, y1: 0, y2: -this.axis.area("height") });
			} else if (position == "left") {

				if (!this.checkDrawLineLeft(index, isLast)) return;

				area = this.getLineForArea('left', {x1: 0, x2: this.axis.area("width"), y1: 0, y2: 0});
			} else if (position == "right" ) {

				if (!this.checkDrawLineRight(index, isLast)) return;

				area = this.getLineForArea('right', {x1: 0, x2: -this.axis.area("width"), y1: 0, y2: 0});
			}

			var lineObject = this.line($.extend({
				stroke : this.chart.theme(isActive, "gridActiveBorderColor", "gridBorderColor"),
				"stroke-width" : this.chart.theme(isActive, "gridActiveBorderWidth", "gridBorderWidth")
			}, area));


			if (line.type.indexOf("dashed") > -1) {
				lineObject.attr({ "stroke-dasharray" : "5,5" });
			}

			var x = 0;
			var y = 0;
			var width = (position == "left" || position == "right") ? this.axis.area("width") : this.scale.rangeBand();
			var height = (position == "top" || position == "bottom") ? this.axis.area("height") : this.scale.rangeBand();


			if (position == "bottom") y = -height;
			if (position == "right") x = -width;

			if (index % 2== 0) {

				if (this.checkDrawRect(index, isLast)) {
					if (line.type.indexOf("gradient") > -1) {
						axis.append(this.chart.svg.rect({  x : x, y : y, height : height, width : width,
							fill : this.chart.color(( line.fill ? line.fill : "linear(" + position + ") " + this.chart.theme("gridRectColor") + ",0.5 " + this.chart.theme("backgroundColor") )),
							"fill-opacity" : 0.1
						}));
					} else if (line.type.indexOf("rect") > -1) {
						axis.append(this.chart.svg.rect({x : x, y : y, height : height, width : width,
							fill : this.chart.color( line.fill ? line.fill : this.chart.theme("gridRectColor") ),
							"fill-opacity" : 0.1
						}));
					}
				}
			}

			// TODO: add customize?

			axis.append(lineObject);
		}

		/**
		 * @method top
		 *
		 * draw top
		 *
		 * @param {chart.util.svg} g
		 * @param {Array} ticks
		 * @param {Array} values
		 * @param {Number} min
		 * @param {Function} checkActive
		 */
		this.drawTop = function(g, ticks, values, checkActive, moveX) {
			moveX = moveX || 0;
			var line = this.getLineOption();

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == "function") {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(" + (values[i] + moveX) + ", 0)"
				});

				axis.append(this.line({
					y2 : -this.chart.theme("gridTickSize"),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));

				if (line) this.drawValueLine( "top", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: (this.grid.type == "block" && !this.grid.full) ? this.scale.rangeBand() / 2 : 0,
						y: -this.chart.theme("gridTickSize") - this.chart.theme("gridTickPadding") * 2,
						fill: this.chart.theme(isActive, "gridActiveFontColor", "gridXFontColor"),
						"text-anchor": "middle",
						"font-size": this.chart.theme("gridXFontSize"),
						"font-weight": this.chart.theme("gridXFontWeight")
					}, domain)));
				}

				g.append(axis);
			}

		}

		this.drawBottom = function(g, ticks, values, checkActive, moveX){
			moveX = moveX || 0;
			var line = this.getLineOption();

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == "function") {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(" + (values[i] + moveX) + ", 0)"
				});

				axis.append(this.line({
					y2 : this.chart.theme("gridTickSize"),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));


				if (line) this.drawValueLine( "bottom", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x : (this.grid.type == "block" && !this.grid.full) ? this.scale.rangeBand()/2 : 0,
						y : this.chart.theme("gridTickSize") + this.chart.theme("gridTickPadding") * 2,
						fill : this.chart.theme(isActive, "gridActiveFontColor", "gridXFontColor"),
						"text-anchor" : "middle",
						"font-size": this.chart.theme("gridXFontSize"),
						"font-weight": this.chart.theme("gridXFontWeight")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.drawLeft = function(g, ticks, values, checkActive, moveY){
			moveY = moveY || 0;
			var line = this.getLineOption();

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == "function") {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + (values[i] + moveY) + ")"
				})

				axis.append(this.line({
					x2 : -this.chart.theme("gridTickSize"),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));

				if (line) this.drawValueLine( "left", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x : -this.chart.theme("gridTickSize") - this.chart.theme("gridTickPadding"),
						y : (this.grid.type == "block" && !this.grid.full) ? this.scale.rangeBand()/2 : this.chart.theme("gridTickSize"),
						fill : this.chart.theme(isActive, "gridActiveFontColor", "gridYFontColor"),
						"text-anchor" : "end",
						"font-size": this.chart.theme("gridYFontSize"),
						"font-weight": this.chart.theme("gridYFontWeight")
					}, domain)));
				}

				g.append(axis);

			}
		}

		this.drawRight = function(g, ticks, values, checkActive, moveY){
			moveY = moveY || 0;
			var line = this.getLineOption();

			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var isActive = false;
				if (typeof checkActive == "function") {
					isActive = checkActive(ticks[i], i);
				}

				var axis = this.chart.svg.group({ "transform" : "translate(0, " + (values[i] + moveY) + ")" });

				axis.append(this.line({
					x2 : this.chart.theme("gridTickSize"),
					stroke : this.color(isActive, "gridActiveBorderColor", "gridAxisBorderColor"),
					"stroke-width" : this.chart.theme("gridTickBorderWidth")
				}));


				if (line) this.drawValueLine( "right", axis, isActive, line, i, (i == len -1));

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: this.chart.theme("gridTickSize") + this.chart.theme("gridTickPadding"),
						y: (this.grid.type == "block" && !this.grid.full) ? this.scale.rangeBand() / 2 : this.chart.theme("gridTickSize"),
						fill: this.chart.theme(isActive, "gridActiveFontColor", "gridYFontColor"),
						"text-anchor": "start",
						"font-size": this.chart.theme("gridYFontSize"),
						"font-weight": this.chart.theme("gridYFontWeight")
					}, domain)));
				}

				g.append(axis);
			}
		}

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
				"stroke-opacity" : this.chart.theme("gridBorderOpacity")
			}, attr));
		}

        /**
         * @method color
         * grid 에서 color 를 위한 유틸리티 함수
         * @param theme
         * @return {Mixed}
         */
		this.color = function(theme) {
			var color = this.grid.color;

			if (arguments.length == 3) {
				return (color != null) ? this.chart.color(color) : this.chart.theme.apply(this.chart, arguments);
			}

			return (color != null) ? this.chart.color(color) : this.chart.theme(theme);
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

			// wrapped scale
			this.scale = this.wrapper(this.scale, this.grid.key);

			// render axis
            if(_.typeCheck("function", func)) {
                func.call(this, root);
            }

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
            var orient = this.grid.orient,
                area = this.axis.area();

			var width = area.width,
				height = area.height,
				axis = (orient == "left" || orient == "right") ? area.y : area.x,
				max = (orient == "left" || orient == "right") ? height : width,
                depth = this.axis.get("depth"),
                degree = this.axis.get("degree"),
				start = axis,
				size = max,
                end = start + size;

            var result = {
                start: start,
                size: size,
                end: end
            };

            if(depth > 0 || degree > 0) {
                var radian = math.radian(360 - degree),
                    x2 = Math.cos(radian) * depth,
                    y2 = Math.sin(radian) * depth;

                if(orient == "left") {
                    result.start = result.start - y2;
                    result.size = result.size - y2;
                } else if(orient == "bottom") {
                    result.end = result.end - x2;
                    result.size = result.size - x2;
                }
            }

            return result;
		}
	}

	CoreGrid.setup = function() {

        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} grid */

		return {
            /**  @cfg {Number} [dist=0] Able to change the locatn of an axis.  */
			dist: 0,
			/**  @cfg {"top"/"left"/"bottom"/"right"} [orient=null] Specifies the direction in which an axis is shown (top, bottom, left or right). */
			orient: null,
            /** @cfg {Boolean} [hide=false] Determines whether to display an applicable grid.  */
			hide: false,
            /** @cfg {String/Object/Number} [color=null] Specifies the color of a grid. */
			color: null,
            /** @cfg {String} [title=null] Specifies the text shown on a grid.*/
			title: null,
            /** @cfg {Boolean} [hide=false] Determines whether to display a line on the axis background. */
			line: false,
			/** @cfg {Boolean} [hide=false] Determines whether to display the base line on the axis background. */
            baseline : true,
            /** @cfg {Function} [format=null]  Determines whether to format the value on an axis. */
			format: null,
            /** @cfg {Number} [textRotate=null] Specifies the slope of text displayed on a grid. */
			textRotate : null
		};
	}

	return CoreGrid;
}, "chart.draw"); 