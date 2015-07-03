jui.define("chart.grid.core", [ "util.base", "util.math" ], function(_, math) {
	/**
	 * @class chart.grid.core
	 * Grid Core 객체
	 * @extends chart.draw
	 * @abstract
	 */
	var CoreGrid = function() {

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
		this.axisLine = function(position, attr) {
			var isTopOrBottom = (position == "top" || position == "bottom");

			return this.chart.svg.line(_.extend({
				x1 : 0,
				y1 : 0,
				x2 : 0,
				y2 : 0,
				stroke : this.color(isTopOrBottom ? "gridXAxisBorderColor" : "gridYAxisBorderColor"),
				"stroke-width" : this.chart.theme(isTopOrBottom ? "gridXAxisBorderWidth" : "gridYAxisBorderWidth"),
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
			return this.chart.svg.line(_.extend({
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

		this.checkDrawLineY = function(index, isLast) {
			var y = this.axis.get("y");

			if(!y.hide) {
				if (y.orient == "left" && index == 0) {
					return false;
				} else if (y.orient == "right" && isLast) {
					return false;
				}
			}

			return true;
		}

		this.checkDrawLineX = function(index, isLast) {
			var x = this.axis.get("x");

			if (!x.hide) {
				if (x.orient == "top" && index == 0) {
					return false;
				} else if (x.orient == "bottom" && isLast) {
					return false;
				}
			}

			return true;
		}

		this.createGridX = function(position, index, x, isActive, isLast) {
			var line = this.getLineOption(),
				axis = this.chart.svg.group().translate(x, 0),
				size = this.chart.theme("gridTickBorderSize");

			axis.append(this.line({
				y2 : (position == "bottom") ? size : -size,
				stroke : this.color(isActive, "gridActiveBorderColor", "gridXAxisBorderColor"),
				"stroke-width" : this.chart.theme("gridTickBorderWidth")
			}));

			if (line) {
				this.drawValueLine(position, axis, isActive, line, index, isLast);
			}

			return axis;
		}

		this.createGridY = function(position, index, y, isActive, isLast) {
			var line = this.getLineOption(),
				axis = this.chart.svg.group().translate(0, y),
				size = this.chart.theme("gridTickBorderSize");

			axis.append(this.line({
				x2 : (position == "left") ? -size : size,
				stroke : this.color(isActive, "gridActiveBorderColor", "gridYAxisBorderColor"),
				"stroke-width" : this.chart.theme("gridTickBorderWidth")
			}));

			if (line) {
				this.drawValueLine(position, axis, isActive, line, index, isLast);
			}

			return axis;
		}

		this.fillRectObject = function(g, line, position, x, y , width, height) {
			if (line.type.indexOf("gradient") > -1) {
				g.append(this.chart.svg.rect({
					x : x,
					y : y,
					height : height,
					width : width,
					fill : this.chart.color(( line.fill ? line.fill : "linear(" + position + ") " + this.chart.theme("gridPatternColor") + ",0.5 " + this.chart.theme("backgroundColor") )),
					"fill-opacity" : this.chart.theme("gridPatternOpacity")
				}));
			} else if (line.type.indexOf("rect") > -1) {
				g.append(this.chart.svg.rect({
					x : x,
					y : y,
					height : height,
					width : width,
					fill : this.chart.color( line.fill ? line.fill : this.chart.theme("gridPatternColor") ),
					"fill-opacity" : this.chart.theme("gridPatternOpacity")
				}));
			}
		}

		this.drawPattern = function(position, ticks, values, isMove) {
			if (this.grid.hide) return;
			if (!position) return;
			if (!ticks) return;
			if (!values) return;

			var line = this.getLineOption(),
				isY = (position == "left" || position == "right");

			var g = this.chart.svg.group({
				"class" : "grid-pattern grid-pattern-" + this.grid.type
			});

			g.translate(this.axis.area("x") + this.chart.area("x"), this.axis.area("y") + this.chart.area("y"));

			if (line && (line.type.indexOf("gradient") > -1 || line.type.indexOf("rect") > -1)) {
				for(var i = 0; i < values.length-1; i += 2) {
					var dist = Math.abs(values[i+1] - values[i]),
						pos = values[i] - (isMove ?  dist/2 : 0 ),
						x = (isY) ? 0 : pos,
						y = (isY) ? pos : 0,
						width = (isY) ?  this.axis.area("width") : dist,
						height = (isY) ?  dist : this.axis.area("height");

					this.fillRectObject(g, line, position, x, y, width, height);
				}
			}
		}

		this.drawBaseLine = function(position, g) {
			var obj = this.getGridSize(),
				pos = {};

			if (position == "bottom" || position == "top") {
				pos = { x1 : obj.start, x2 : obj.end };
			} else if (position == "left" || position == "right") {
				pos = { y1 : obj.start, y2 : obj.end };
			}

			g.append(this.axisLine(position, pos));
		}

		this.drawValueLine = function(position, axis, isActive, line, index, isLast) {
			var area = {},
				isDrawLine = false;

			if (position == "top") {
				isDrawLine = this.checkDrawLineY(index, isLast);
				area = { x1: 0, x2: 0, y1: 0, y2: this.axis.area("height") };
			} else if (position == "bottom" ) {
				isDrawLine = this.checkDrawLineY(index, isLast);
				area = { x1: 0, x2: 0, y1: 0, y2: -this.axis.area("height") };
			} else if (position == "left") {
				isDrawLine = this.checkDrawLineX(index, isLast);
				area = { x1: 0, x2: this.axis.area("width"), y1: 0, y2: 0 };
			} else if (position == "right" ) {
				isDrawLine = this.checkDrawLineX(index, isLast);
				area = { x1: 0, x2: -this.axis.area("width"), y1: 0, y2: 0 };
			}

			if(isDrawLine) {
				var lineObject = this.line(_.extend({
					stroke: this.chart.theme(isActive, "gridActiveBorderColor", "gridBorderColor"),
					"stroke-width": this.chart.theme(isActive, "gridActiveBorderWidth", "gridBorderWidth")
				}, area));

				if (line.type.indexOf("dashed") > -1) {
					lineObject.attr({ "stroke-dasharray": "5,5" });
				}

				axis.append(lineObject);
			}
		}

		this.drawImage = function(orient, g, tick, index, x, y) {
			if (!_.typeCheck("function", this.grid.image)) return;

			var opts = this.grid.image.apply(this.chart, [ tick, index ]);

			if(_.typeCheck("object", opts)) {
				var image = this.chart.svg.image({
					"xlink:href": opts.uri,
					width: opts.width,
					height: opts.height
				});

				if(orient == "top" || orient == "bottom") {
					image.attr({
						x: (this.grid.type == "block") ? this.scale.rangeBand()/2 - opts.width/2 : -(opts.width/2)
					});
				} else if(orient == "left" || orient == "right") {
					image.attr({
						y: (this.grid.type == "block") ? this.scale.rangeBand()/2 - opts.height/2 : -(opts.height/2)
					})
				}

				if(orient == "bottom") {
					image.attr({ y: opts.dist });
				} else if(orient == "top") {
					image.attr({ y: -(opts.dist + opts.height) });
				} else if(orient == "left") {
					image.attr({ x: -(opts.dist + opts.width) });
				} else if(orient == "right") {
					image.attr({ x: opts.dist });
				}

				image.translate(x, y)
				g.append(image);
			}
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
			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i),
					x = values[i] - moveX,
					isLast = (i == len - 1) && this.grid.type != "block",
					isActive = false;

				// 그리드 이미지 그리기
				this.drawImage("top", g, ticks[i], i, x, 0);

				// 도메인이 없으면 그리지 않음
				if (!domain && domain !== 0) {
					continue;
				}

				// 액티브 라인 체크
				if (_.typeCheck("function", checkActive)) {
					isActive = checkActive(ticks[i]);
				}

				var axis = this.createGridX("top", i, x, isActive, isLast);

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: moveX,
						y: -(this.chart.theme("gridTickBorderSize") + this.chart.theme("gridTickPadding") * 2),
						dy: this.chart.theme("gridXFontSize") / 3,
						fill: this.chart.theme(isActive, "gridActiveFontColor", "gridXFontColor"),
						"text-anchor": "middle",
						"font-size": this.chart.theme("gridXFontSize"),
						"font-weight": this.chart.theme("gridXFontWeight")
					}, domain)));
				}

				g.append(axis);
			}

		}

		this.drawBottom = function(g, ticks, values, checkActive, moveX) {
			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i),
					x = values[i] - moveX,
					isLast = (i == len - 1) && this.grid.type != "block",
					isActive = false;

				// 그리드 이미지 그리기
				this.drawImage("bottom", g, ticks[i], i, x, 0);

				// 도메인이 없으면 그리지 않음
				if (!domain && domain !== 0) {
					continue;
				}

				// 액티브 라인 체크
				if (_.typeCheck("function", checkActive)) {
					isActive = checkActive(ticks[i]);
				}

				var axis = this.createGridX("bottom", i, x, isActive, isLast);

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: moveX,
						y: this.chart.theme("gridTickBorderSize") + this.chart.theme("gridTickPadding") * 2,
						dy: this.chart.theme("gridXFontSize") / 3,
						fill: this.chart.theme(isActive, "gridActiveFontColor", "gridXFontColor"),
						"text-anchor": "middle",
						"font-size": this.chart.theme("gridXFontSize"),
						"font-weight": this.chart.theme("gridXFontWeight")
					}, domain)));
				}

				g.append(axis);
			}
		}

		this.drawLeft = function(g, ticks, values, checkActive, moveY) {
			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i),
					y = values[i] - moveY,
					isLast = (i == len - 1) && this.grid.type != "block",
					isActive = false;

				// 그리드 이미지 그리기
				this.drawImage("left", g, ticks[i], i, 0, y);

				// 도메인이 없으면 그리지 않음
				if (!domain && domain !== 0) {
					continue;
				}

				// 액티브 라인 체크
				if (_.typeCheck("function", checkActive)) {
					isActive = checkActive(ticks[i]);
				}

				var axis = this.createGridY("left", i, y, isActive, isLast);

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: -this.chart.theme("gridTickBorderSize") - this.chart.theme("gridTickPadding"),
						y: moveY,
						dy: this.chart.theme("gridYFontSize") / 3,
						fill: this.chart.theme(isActive, "gridActiveFontColor", "gridYFontColor"),
						"text-anchor": "end",
						"font-size": this.chart.theme("gridYFontSize"),
						"font-weight": this.chart.theme("gridYFontWeight")
					}, domain)));
				}

				g.append(axis);

			}
		}

		this.drawRight = function(g, ticks, values, checkActive, moveY) {
			for (var i = 0, len = ticks.length; i < len; i++) {
				var domain = this.format(ticks[i], i),
					y = values[i] - moveY,
					isLast = (i == len - 1) && this.grid.type != "block",
					isActive = false;

				// 그리드 이미지 그리기
				this.drawImage("right", g, ticks[i], i, 0, y);

				// 도메인이 없으면 그리지 않음
				if (!domain && domain !== 0) {
					continue;
				}

				// 액티브 라인 체크
				if (_.typeCheck("function", checkActive)) {
					isActive = checkActive(ticks[i]);
				}

				var axis = this.createGridY("right", i, y, isActive, isLast);

				if (!this.grid.hideText) {
					axis.append(this.getTextRotate(this.chart.text({
						x: this.chart.theme("gridTickBorderSize") + this.chart.theme("gridTickPadding"),
						y: moveY,
						dy: this.chart.theme("gridYFontSize") / 3,
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
			/** @cfg {Function} [format=null]  Determines whether to format the value on an axis. */
			format: null,
			/** @cfg {Function} [image=null]  Determines whether to image the value on an axis. */
			image: null,
			/** @cfg {Number} [textRotate=null] Specifies the slope of text displayed on a grid. */
			textRotate : null
		};
	}

	return CoreGrid;
}, "chart.draw"); 