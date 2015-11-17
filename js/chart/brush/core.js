jui.define("chart.brush.core", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.brush.core
     *
     * implements core method for brush
     *
     * @abstract
     * @extends chart.draw
     * @requires jquery
     * @requires util.base
     */
	var CoreBrush = function() {

        function getMinMaxValue(data, target) {
            var seriesList = {},
                targetList = {};

            for(var i = 0; i < target.length; i++) {
                if (!seriesList[target[i]]) {
                    targetList[target[i]] = [];
                }
            }

            // 시리즈 데이터 구성
            for(var i = 0, len = data.length; i < len; i++) {
                var row = data[i];

                for(var k in targetList) {
                    targetList[k].push(row[k]);
                }
            }

            for(var key in targetList) {
                seriesList[key] = {
                    min : Math.min.apply(Math, targetList[key]),
                    max : Math.max.apply(Math, targetList[key])
                }
            }

            return seriesList;
        }

        this.drawAfter = function(obj) {
            if(this.brush.clip !== false) {
                obj.attr({ "clip-path" : "url(#" + this.axis.get("clipId") + ")" });
            }

            obj.attr({ "class": "brush brush-" + this.brush.type });
            obj.translate(this.chart.area("x"), this.chart.area("y")); // 브러쉬일 경우, 기본 좌표 설정
        }

        this.drawTooltip = function(fill, stroke, opacity) {
            var self = this,
                tooltip = null;

            function draw() {
                return self.chart.svg.group({ "visibility" : "hidden" }, function() {
                    self.chart.text({
                        fill : self.chart.theme("tooltipPointFontColor"),
                        "font-size" : self.chart.theme("tooltipPointFontSize"),
                        "font-weight" : self.chart.theme("tooltipPointFontWeight"),
                        "text-anchor" : "middle",
                        opacity: opacity
                    });

                    self.chart.svg.circle({
                        r: self.chart.theme("tooltipPointRadius"),
                        fill: fill,
                        stroke: stroke,
                        opacity: opacity,
                        "stroke-width": self.chart.theme("tooltipPointBorderWidth")
                    });
                });
            }

            function show(orient, x, y, value) {
                var text = tooltip.get(0);
                text.element.textContent = value;

                if(orient == "left") {
                    text.attr({ x: -7, y: 4, "text-anchor": "end" });
                } else if(orient == "right") {
                    text.attr({ x: 7, y: 4, "text-anchor": "start" });
                } else if(orient == "bottom") {
                    text.attr({ y: 16 });
                } else {
                    text.attr({ y: -7 });
                }

                tooltip.attr({ visibility: (value != 0) ? "visible" : "hidden" });
                tooltip.translate(x, y);
            }

            // 툴팁 생성
            tooltip = draw();

            return {
                tooltip: tooltip,
                control: show,
                style: function(fill, stroke, opacity) {
                    tooltip.get(0).attr({
                        opacity: opacity
                    });

                    tooltip.get(1).attr({
                        fill: fill,
                        stroke: stroke,
                        opacity: opacity
                    })
                }
            }
        }

        /**
         * 
         * @method curvePoints
         *
         * 좌표 배열 'K'에 대한 커브 좌표 'P1', 'P2'를 구하는 함수
         *
         * TODO: min, max 에 대한 처리도 같이 필요함.
         *
         * @param {Array} K
         * @return {Object}
         * @return {Array} return.p1
         * @return {Array} return.p2
         *
         */
		this.curvePoints = function(K) {
			var p1 = [];
			var p2 = [];
			var n = K.length - 1;

			/*rhs vector*/
			var a = [];
			var b = [];
			var c = [];
			var r = [];

			/*left most segment*/
			a[0] = 0;
			b[0] = 2;
			c[0] = 1;
			r[0] = K[0] + 2 * K[1];

			/*internal segments*/
			for ( i = 1; i < n - 1; i++) {
				a[i] = 1;
				b[i] = 4;
				c[i] = 1;
				r[i] = 4 * K[i] + 2 * K[i + 1];
			}

			/*right segment*/
			a[n - 1] = 2;
			b[n - 1] = 7;
			c[n - 1] = 0;
			r[n - 1] = 8 * K[n - 1] + K[n];

			/*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
			for (var i = 1; i < n; i++) {
				var m = a[i] / b[i - 1];
				b[i] = b[i] - m * c[i - 1];
				r[i] = r[i] - m * r[i - 1];
			}

			p1[n - 1] = r[n - 1] / b[n - 1];
			for (var i = n - 2; i >= 0; --i)
				p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

			/*we have p1, now compute p2*/
			for (var i = 0; i < n - 1; i++)
				p2[i] = 2 * K[i + 1] - p1[i + 1];

			p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

			return {
				p1 : p1,
				p2 : p2
			};
		}

        /**
         * 
         * @method eachData
         *
         * loop axis data
         *
         * @param {Function} callback
         */
        this.eachData = function(callback, reverse) {
            if(!_.typeCheck("function", callback)) return;
            var list = this.listData();

            if(reverse === true) {
                for(var len = list.length - 1; len >= 0; len--) {
                    callback.call(this, len, list[len]);
                }
            } else {
                for(var index = 0, len = list.length; index < len; index++) {
                    callback.call(this, index, list[index]);
                }
            }
        }

        /**
         * 
         * @method listData
         *
         * get axis.data
         *
         * @returns {Array} axis.data
         */
        this.listData = function() {
            return this.axis.data;
        }

        /**
         * 
         * @method getData
         *
         * get record by index in axis.data
         *
         * @param {Integer} index
         * @returns {Object} record in axis.data
         */
        this.getData = function(index) {
            return this.listData()[index];
        }

        /**
         * @method getValue
         *
         * chart.axis.getValue alias
         *
         * @param {Object} data row data
         * @param {String} fieldString 필드 이름
         * @param {String/Number/Boolean/Object} [defaultValue=''] 기본값
         * @return {Mixed}
         */
        this.getValue = function(data, fieldString, defaultValue) {
            return this.axis.getValue(data, fieldString, defaultValue);
        }

        /**
         * 
         * @method getXY
         *
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         *
         * @param {Boolean} [isCheckMinMax=true]
         * @return {Array}
         */
        this.getXY = function(isCheckMinMax) {
            var xy = [],
                series = {},
                length = this.listData().length,
                i = length,
                target = this.brush.target,
                targetLength = target.length;

            if(isCheckMinMax !== false) {
                series = getMinMaxValue(this.axis.data, target);
            }

            for(var j = 0; j < targetLength; j++) {
                xy[j] = {
                    x: new Array(length),
                    y: new Array(length),
                    value: new Array(length),
                    min: [],
                    max: [],
                    length: length
                };
            }
            
            var axisData = this.axis.data,
                isRangeY = (this.axis.y.type == "range"),
                x = this.axis.x,
                y = this.axis.y,
                func = _.loop(i);

            func(function(i, group) {
                var data = axisData[i],
                    startX = 0,
                    startY = 0;

                if(isRangeY) startX = x(i);
                else startY = y(i);

                for(var j = 0; j < targetLength ; j++) {
                    var key = target[j],
                        value = data[key];

                    if(isRangeY) startY = y(value);
                    else startX = x(value);

                    xy[j].x[i] = startX;
                    xy[j].y[i] = startY;
                    xy[j].value[i] = value;

                    if(isCheckMinMax !== false) {
                        xy[j].min[i] = (value == series[key].min);
                        xy[j].max[i] = (value == series[key].max);
                    }
                }
            })

            return xy;
        }

        /**
         * 
         * @method getStackXY
         *
         * 차트 데이터에 대한 좌표 'x', 'y'를 구하는 함수
         * 단, 'y' 좌표는 다음 데이터 보다 높게 구해진다.
         *
         * @param {Boolean} [isCheckMinMax=true]
         * @return {Array}
         */
        this.getStackXY = function(isCheckMinMax) {
            var xy = this.getXY(isCheckMinMax),
                isRangeY = (this.axis.y.type == "range");

            this.eachData(function(i, data) {
                var valueSum = 0;

                for(var j = 0; j < this.brush.target.length; j++) {
                    var key = this.brush.target[j],
                        value = data[key];

                    if(j > 0) {
                        valueSum += data[this.brush.target[j - 1]];
                    }

                    if(isRangeY) {
                        xy[j].y[i] = this.axis.y(value + valueSum);
                    } else {
                        xy[j].x[i] = this.axis.x(value + valueSum);
                    }
                }
            });

            return xy;
        }
        
        /**
         * @method addEvent 
         * 브러쉬 엘리먼트에 대한 공통 이벤트 정의
         *
         * @param {Element} element
         * @param {Integer} dataIndex
         * @param {Integer} targetIndex
         */
        this.addEvent = function(elem, dataIndex, targetIndex) {
            var chart = this.chart,
                obj = {
                brush: this.brush,
                dataIndex: dataIndex,
                dataKey: (targetIndex != null) ? this.brush.target[targetIndex] : null,
                data: (dataIndex != null) ? this.getData(dataIndex) : null
            };

            elem.on("click", function(e) {
                setMouseEvent(e);
                chart.emit("click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(e);
                chart.emit("dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(e);
                chart.emit("rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(e);
                chart.emit("mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(e);
                chart.emit("mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(e);
                chart.emit("mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(e);
                chart.emit("mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(e);
                chart.emit("mouseup", [ obj, e ]);
            });

            function setMouseEvent(e) {
                var pos = $(chart.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - chart.padding("left");
                e.chartY = offsetY - chart.padding("top");
            }
        }

        /**
         * @method color
         *  
         * chart.color() 를 쉽게 사용할 수 있게 만든 유틸리티 함수 
         *  
         * @param {Number} key1  브러쉬에서 사용될 컬러 Index
         * @param {Number} key2  브러쉬에서 사용될 컬러 Index
         * @returns {*}
         */
        this.color = function(key1, key2) {
            var colors = this.brush.colors,
                color = null,
                colorIndex = 0,
                rowIndex = 0;

            if(!_.typeCheck("undefined", key2)) {
                colorIndex = key2;
                rowIndex = key1;
            } else {
                colorIndex = key1;
            }

            if(_.typeCheck("function", colors)) {
                var newColor = colors.call(this.chart, this.getData(rowIndex));

                if(_.typeCheck([ "string", "integer" ], newColor)) {
                    color = this.chart.color(newColor);
                } else {
                    color = this.chart.color(0);
                }
            } else {
                color = this.chart.color(colorIndex, colors);
            }

            return color;
        }

        /**
         * @method offset
         *
         * 그리드 타입에 따른 시작 좌표 가져오기 (블럭)
         *
         * @param {String} 그리드 종류
         * @param {Number} 인덱스
         * @returns {*}
         */
        this.offset = function(type, index) { // 그리드 타입에 따른 시작 좌표 가져오기
            var res = this.axis[type](index);

            if(this.axis[type].type != "block") {
                res += this.axis[type].rangeBand() / 2;
            }

            return res;
        }
	}


    CoreBrush.setup = function() {
        return {

            /** @property {chart.builder} chart */
            /** @property {chart.axis} axis */
            /** @property {Object} brush */

            /** @cfg {Array} [target=null] Specifies the key value of data displayed on a brush.  */
            target: null,
            /** @cfg {Array/Function} [colors=null] Able to specify color codes according to the target order (basically, refers to the color codes of a theme) */
            colors: null,
            /** @cfg {Integer} [axis=0] Specifies the index of a grid group which acts as the reference axis of a brush. */
            axis: 0,
            /** @cfg {Integer} [index=null] [Read Only] Sequence index on which brush is drawn. */
            index: null,
            /** @cfg {boolean} [clip=true] If the brush is drawn outside of the chart, cut the area. */
            clip: true
        }
    }

    /**
     * @event click
     * Event that occurs when clicking on the brush.
     * @param {BrushData} obj Related brush data.
     */
    /**
     * @event dblclick
     * Event that occurs when double clicking on the brush.
     * @param {BrushData} obj Related brush data.
     */
    /**
     * @event rclick
     * Event that occurs when right clicking on the brush.
     * @param {BrushData} obj Related brush data.
     */
    /**
     * @event mouseover
     * Event that occurs when placing the mouse over the brush.
     * @param {BrushData} obj Related brush data.
     */
    /**
     * @event mouseout
     * Event that occurs when moving the mouse out of the brush.
     * @param {BrushData} obj Related brush data.
     */
    /**
     * @event mousemove
     * Event that occurs when moving the mouse over the brush.
     * @param {BrushData} obj Related brush data.
     */
    /**
     * @event mousedown
     * Event that occurs when left clicking on the brush.
     * @param {BrushData} obj Related brush data.
     */
    /**
     * @event mouseup
     * Event that occurs after left clicking on the brush.
     * @param {BrushData} obj Related brush data.
     */

	return CoreBrush;
}, "chart.draw"); 