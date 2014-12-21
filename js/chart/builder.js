jui.defineUI("chart.builder", [ "jquery", "util.base", "util.svg", "util.color" ], function($, _, SVGUtil, ColorUtil) {

    /**
     * Common Logic
     *
     */
    var win_width = 0;

    _.resize(function() {
        if(win_width == $(window).width()) return;

        var call_list = jui.get("chart.builder");
        for(var i = 0; i < call_list.length; i++) {
            var ui_list = call_list[i];

            for(var j = 0; j < ui_list.length; j++) {
                if(ui_list[j].isFullSize()) {
                    ui_list[j].setSize();
                }
            }
        }

        win_width = $(window).width();
    }, 300);

    /**
     * Chart Builder 구현
     *
     */
    var UI = function() {
        var _data = [], _tempData = [],  _page = 1, _start = 0, _end = 0;
        var _grid = {}, _axis = {}, _brush = [], _widget = [], _scales = [], _hash = {};
        var _padding, _series, _area, _panel, _theme;
        var _initialize = false, _options = null, _handler = []; // 리셋 대상 커스텀 이벤트 핸들러

        function getValue(value, max) {
            if(_.typeCheck("string", value) && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }

        function getArrayValue(value, isStart) {
            if(_.typeCheck("number", value)) {
                value = (isStart) ? { left : value, top : value } : { width : value, height : value } ;
            } else if(_.typeCheck("string", value)) {
                if(value.indexOf("%") > -1) {
                    var first = getValue(value, _area.width);
                    var second = getValue(value,  _area.height);
                    value = (isStart) ? { left : first, top : second } : { width : first, height : second } ;
                } else {
                    value = parseFloat(value);
                    value = (isStart) ? { left : value, top : value } : { width : value, height : value } ;
                }
            } else {
                if(isStart) {
                    value.left = getValue(value.left, _area.width);
                    value.top = getValue(value.top, _area.height);
                } else {
                    value.width = getValue(value.width, _area.width);
                    value.height = getValue(value.height, _area.height);
                }
            }

            return value;
        }

        /**
         * chart 기본 영역 계산
         *
         * padding 을 제외한 영역에서  x,y,x2,y2,width,height 속성을 구함
         *
         * 기본적으로 모든 브러쉬와 그리드는 계산된 영역안에서 그려짐
         *
         * @param {Object} self
         */
        function calculate(self) {
            var max = self.svg.size();

            var chart = {
                width: max.width - (_padding.left + _padding.right),
                height: max.height - (_padding.top + _padding.bottom),
                x: _padding.left,
                y: _padding.top
            };

            // chart 크기가 마이너스일 경우 (엘리먼트가 hidden 상태)
            if(chart.width < 0) chart.width = 0;
            if(chart.height < 0) chart.height = 0;

            // chart 영역 계산
            chart.x2 = chart.x + chart.width;
            chart.y2 = chart.y + chart.height;

            _area = chart;
        }

        function savePanel(panel) {
            _panel = panel;
        }

        function restorePanel() {
            _panel = null;
        }

        function saveData(data) {
            _tempData = _data;
            _data = data;
        }

        function restoreData() {
            _data = _tempData;
            _tempData = [] ;
        }

        function caculatePanel(start, size) {
            start = getArrayValue(start, true);
            size = getArrayValue(size);

            return {
                x : start.left,
                y : start.top,
                width : size.width,
                height : size.height,
                x2 : start.left + size.width,
                y2 : start.top + size.height
            };
        }

        /**
         * draw 이전에 환경 셋팅
         *
         */
        function drawBefore(self) {
            var target = [];

            _grid = _.deepClone(self.options.grid);
            _axis = _.deepClone(self.options.axis);
            _series = _.deepClone(self.options.series);
            _brush = _.deepClone(_options.brush);
            _widget = _.deepClone(_options.widget);

            // 시리즈 데이터 구성
            for(var i = 0, len = _data.length; i < len; i++) {
                var row = _data[i];

                for(var key in row) {
                    var obj = _series[key] || {},
                        value = row[key],
                        range = null;

                    if(value instanceof Array) {
                        range = { max : Math.max.apply(Math, value), min : Math.min.apply(Math, value) }
                    } else {
                        range = { max : +value, min : +value }
                    }

                    obj.data = obj.data || [];
                    obj.min = typeof obj.min == 'undefined' ? 0 : obj.min;
                    obj.max = typeof obj.max == 'undefined' ? 0 : obj.max;
                    obj.data[i] = value;

                    if (range.min < obj.min) {
                        obj.min = range.min;
                    }

                    if (range.max > obj.max) {
                        obj.max = range.max;
                    }

                    // 시리즈 데이터 설정
                    _series[key] = obj;
                }
            }

            // 타겟 배열 설정
            for(var key in _series) {
                target.push(key);
            }

            // 브러쉬 타겟 설정
            for(var i = 0; i < _brush.length; i++) {
                var b = _brush[i];

                if(!b.target) {
                    b.target = target;
                } else if(typeof b.target == "string") {
                    b.target = [ b.target ];
                }
            }

            // 해쉬 코드 초기화
            _hash = {};
        }

        /**
         * svg 기본 defs element 생성
         *
         */
        function drawDefs(self) {
            // draw defs
            var defs = self.svg.defs();

            // default clip path
            self.clipId = self.createId('clip-id');

            var clip = self.svg.clipPath({
                id: self.clipId
            });

            clip.append(self.svg.rect({
                x: 0,
                y: 0,
                width: self.width(),
                height: self.height()
            }));
            defs.append(clip);

            self.defs = defs;
        }

        /**
         * grid 그리기
         *
         * 설정된 grid 객체를 통해서
         *
         * x(bottom), y(left), x1(top), y1(right)
         *
         * 의 방향으로 grid 를 생성
         *
         */
        function drawGrid(self) {
            var grid = _grid;

            if(grid != null) {
                if (grid.type) {
                    grid = {
                        c: grid
                    };
                }

                for(var k in grid) {
                    var orient = 'custom';

                    if(k == 'x')
                        orient = 'bottom';
                    else if(k == 'x1')
                        orient = 'top';
                    else if(k == 'y')
                        orient = 'left';
                    else if(k == 'y1')
                        orient = 'right';

                    if(!_scales[k]) {
                        _scales[k] = [];
                    }

                    if(!_.typeCheck("array", grid[k])) {
                        grid[k] = [grid[k]];
                    }

                    for(var keyIndex = 0, len = grid[k].length; keyIndex < len; keyIndex++) {
                        var Grid = jui.include("chart.grid." + (grid[k][keyIndex].type || "block"));

                        // 그리드 기본 프로퍼티 정의
                        var obj = new Grid(orient, self, grid[k][keyIndex]),
                            dist = grid[k][keyIndex].dist || 0;

                        obj.chart = self;
                        obj.grid = grid[k][keyIndex];

                        // 그리드 렌더링
                        var elem = obj.render();

                        // grid 별 dist 로 위치선정하기
                        if(k == 'y') {
                            elem.root.translate(self.x() - dist, self.y());
                        } else if(k == 'y1') {
                            elem.root.translate(self.x2() + dist, self.y());
                        } else if(k == 'x') {
                            elem.root.translate(self.x(), self.y2() + dist);
                        } else if(k == 'x1') {
                            elem.root.translate(self.x(), self.y() - dist);
                        }

                        _scales[k][keyIndex] = elem.scale;
                    }
                }
            }
        }

        function drawAxis(self) {

            function drawAxisType(axis, k, chart) {
                var ax = axis[k],
                    orient = "custom";

                if (k == 'x')
                    orient = 'bottom';
                else if (k == 'x1')
                    orient = 'top';
                else if (k == 'y')
                    orient = 'left';
                else if (k == 'y1')
                    orient = 'right';

                if (ax.extend) {
                    ax = $.extend(_axis[ax.extend][k], ax);
                    delete ax.extend;
                }

                ax.axis = true;

                var Grid = jui.include("chart.grid." + (ax.type || "block"));

                // axis 기본 프로퍼티 정의
                var obj = new Grid(orient, chart, ax),
                    dist = ax.dist || 0;

                obj.chart = chart;
                obj.grid = ax;

                var elem = obj.render();

                // grid 별 dist 로 위치선정하기
                if(k == 'y') {
                    elem.root.translate(_area.x - dist, _area.y);
                } else if(k == 'y1') {
                    elem.root.translate(_area.x + chart.x2() + dist, _area.y);
                } else if(k == 'x') {
                    elem.root.translate(_area.x , _area.y + chart.y2() + dist);
                } else if(k == 'x1') {
                    elem.root.translate(_area.x , _area.y + chart.y() - dist);
                }

                return elem.scale;
            }

            for(var key in _axis) {
                var axis = _axis[key];

                // set panel
                savePanel(caculatePanel(axis.start || {left : 0, top : 0 }, axis.size || {width : self.width(), height : self.height() }));

                // set data
                saveData(axis.data);

                // draw x grid
                if(axis.x) { axis.xScale = drawAxisType(axis, "x", self); }
                if(axis.y) { axis.yScale = drawAxisType(axis, "y", self); }
                if(axis.x1) { axis.x1Scale = drawAxisType(axis, "x1", self); }
                if(axis.y1) { axis.y1Scale = drawAxisType(axis, "y1", self); }
                if(axis.c) { axis.cScale = drawAxisType(axis, "c", self); }

                restoreData();
                restorePanel();
            }
        }

        /**
         * brush 그리기
         *
         * brush 에 맞는 x, y 축(grid) 설정
         *
         */
        function drawBrush(self, type, isAll) {
            var draws = (type == "brush") ? _brush : _widget;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart." + type + "." + draws[i].type);

                    // 그리드 축 설정
                    setGridAxis(draws[i]);
                    draws[i].index = i;

                    // 브러쉬&위젯 기본 프로퍼티 정의
                    var draw = new Obj(self, draws[i]);
                    draw.chart = self;
                    draw[type] = draws[i];

                    // 브러쉬&위젯 엘리먼트 생성 및 후처리
                    if(type == "widget") {
                        // 위젯은 렌더 옵션이 false일 때, 최초 한번만 로드함 (연산 + 드로잉)
                        // 하지만 isAll이 true이면, 강제로 연산 및 드로잉을 함 (테마 변경 및 리사이징 시)
                        if(_initialize && !draw.isRender() && isAll !== true) {
                            return;
                        }

                        if(draws[i].axis) {
                            saveData(_axis[draws[i].axis].data);

                            var elem = draw.render();
                            if(!draw.isRender()) {
                                self.svg.autoRender(elem, false);
                            }

                            restoreData();
                        } else {
                            var elem = draw.render();
                            if(!draw.isRender()) {
                                self.svg.autoRender(elem, false);
                            }
                        }
                    } else {
                        if(draws[i].axis) {
                            saveData(_axis[draws[i].axis].data);
                            draw.render();
                            restoreData();

                        } else {
                            draw.render();
                        }
                    }
                }
            }
        }

        /**
         * 브러쉬와 위젯의 그리드 객체 설정
         *
         * @param draw
         * @param drawObj
         */
        function setGridAxis(draw) {
            if (draw.axis) {
                draw.x = _axis[draw.axis].xScale || _axis[draw.axis].x1Scale;
                draw.y = _axis[draw.axis].yScale || _axis[draw.axis].y1Scale;
                draw.c = _axis[draw.axis].cScale;
                return;
            }

            if(_scales.x || _scales.x1) {
                if(!_scales.x && _scales.x1) {
                    _scales.x = _scales.x1;
                }

                if(!_.typeCheck("function", draw.x)) {
                    draw.x = ( typeof draw.x1 !== 'undefined') ? _scales.x1[draw.x1 || 0] : _scales.x[draw.x || 0];
                }
            }
            if(_scales.y || _scales.y1) {
                if(!_scales.y && _scales.y1) {
                    _scales.y = _scales.y1;
                }

                if(!_.typeCheck("function", draw.y)) {
                    draw.y = ( typeof draw.y1 !== 'undefined') ? _scales.y1[draw.y1 || 0] : _scales.y[draw.y || 0];
                }
            }
            if(_scales.c) {
                if(!_.typeCheck("function", draw.c)) {
                    draw.c = _scales.c[draw.c || 0];
                }
            }
        }

        function setChartEvent(self) {
            var elem = self.svg.root,
                isMouseOver = false;

            elem.on("click", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.click", [ e ]);
                } else {
                    self.emit("chart.click", [ e ]);
                }
            });

            elem.on("dblclick", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.dblclick", [ e ]);
                } else {
                    self.emit("chart.dblclick", [ e ]);
                }
            });

            elem.on("contextmenu", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.rclick", [ e ]);
                } else {
                    self.emit("chart.rclick", [ e ]);
                }

                e.preventDefault();
            });

            elem.on("mousemove", function(e) {
                if (!checkPosition(e)) {
                    if (isMouseOver) {
                        self.emit("chart.mouseout", [ e ]);
                        isMouseOver = false;
                    }

                    self.emit("bg.mousemove", [ e ]);
                } else {
                    if (isMouseOver) {
                        self.emit("chart.mousemove", [ e ]);
                    } else {
                        self.emit("chart.mouseover", [ e ]);
                        isMouseOver = true;
                    }
                }
            });

            elem.on("mousedown", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mousedown", [ e ]);
                } else {
                    self.emit("chart.mousedown", [ e ]);
                }
            });

            elem.on("mouseup", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseup", [ e ]);
                } else {
                    self.emit("chart.mouseup", [ e ]);
                }
            });

            elem.on("mouseover", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseover", [ e ]);
                }
            });

            elem.on("mouseout", function(e) {
                if (!checkPosition(e)) {
                    self.emit("bg.mouseout", [ e ]);
                }
            });

            // 드래그 이벤트 막기
            self.addEvent(self.root, "selectstart", function(e) {
                e.preventDefault();
                return false;
            });

            function checkPosition(e) {
                var pos = $(self.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - self.padding("left");
                e.chartY = offsetY - self.padding("top");

                if(e.chartX < 0) return;
                if(e.chartX > self.width()) return;
                if(e.chartY < 0) return;
                if(e.chartY > self.height()) return;

                return true;
            }
        }

        function createGradient(self, obj, hashKey) {
            if (typeof hashKey != 'undefined' && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var id = self.createId('gradient');

            obj.id = id;
            var g;
            if (obj.type == 'linear') {
                g = self.svg.linearGradient(obj);
            } else if (obj.type == 'radial') {
                g = self.svg.radialGradient(obj);
            }

            for (var i = 0; i < obj.stops.length; i++) {
                g.append(self.svg.stop(obj.stops[i]));
            }

            self.defs.append(g);

            if (typeof hashKey != 'undefined') {
                _hash[hashKey] = id;
            }

            return "url(#" + id + ")";
        }

        function getColor(self, color) {
            if(_.typeCheck("undefined", color)) {
                return "none";
            }

            if(_.typeCheck("object", color)) {
                return createGradient(self, color);
            }

            var parsedColor = ColorUtil.parse(color);
            if(parsedColor == color)
                return color;

            return createGradient(self, parsedColor, color);
        }

        function setThemeStyle() {
            if (arguments.length == 1) {
                _theme = $.extend(_theme, arguments[0]);
            } else if (arguments.length == 2) {
                _theme[arguments[0]] = arguments[1];
            }
        }

        function checkDefaultOptions() {
            var isGridUsed = false;

            for(var key in _options.grid) {
                isGridUsed = true;
                break;
            }

            if(_options.axis != null && isGridUsed) {
                throw new Error("JUI_CRITICAL_ERR: 'axis' and 'grid' option can not be used together");
            } else if(_options.axis != null && _options.data.length > 0) {
                throw new Error("JUI_CRITICAL_ERR: 'axis' and 'data' option can not be used together");
            }
        }

        function setDefaultOptions(self) {
            var opts = self.options;

            // UI 바인딩 설정
            if (opts.bind) {
                self.bindUI(opts.bind);
                opts.bind = null;
            }

            // 바인딩 옵션을 제외하고 클론
            _options = _.deepClone(opts);

            // 패딩 옵션 설정
            if (_options.padding == "empty") {
                _padding = {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                };
            } else {
                _padding = _options.padding;
            }

            if(!_.typeCheck([ "array" ], _options.brush)) {
                _options.brush = [ _options.brush ];
            }

            if(!_.typeCheck([ "array" ], _options.widget)) {
                _options.widget = [ _options.widget ];
            }
        }

        function resetEvent(self) {
            for(var i = 0; i < _handler.length; i++) {
                self.off(_handler[i]);
            }

            _handler = [];
        }

        this.init = function() {
            // 기본 옵션 설정
            setDefaultOptions(this);

            // 옵션 간의 유효성 체크
            checkDefaultOptions();

            // 차트 테마 설정 (+옵션 스타일)
            setThemeStyle($.extend(jui.include("chart.theme." + _options.theme), _options.style));

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width: _options.width,
                height: _options.height
            });

            // 데이터 업데이트 및 커스텀 이벤트 발생
            this.update();

            // 차트 배경 이벤트
            setChartEvent(this);
        }

        /**
         * 차트 영역 데이터 반환
         *
         * @returns {*}
         */

        this.area = function(key) {
            if(_panel) {
              return _panel[key] || _panel;
            } else {
              return _area[key] || _area;
            }
        }

        /**
         * @deprecated
         * @returns {*}
         */
        this.width = function() {
            if(!_area && !_panel) return null;

            if(_panel) return _panel.width;
            return _area.width;
        }

        /**
         * @deprecated
         * @returns {*}
         */
        this.height = function() {
            if(!_area && !_panel) return null;

            if(_panel) return _panel.height;
            return _area.height;
        }

        /**
         * @deprecated
         * @returns {*}
         */
        this.x = function() {
            if(!_area && !_panel) return null;

            if(_panel) return _panel.x;
            return _area.x;
        }

        /**
         * @deprecated
         * @returns {*}
         */
        this.y = function() {
            if(!_area && !_panel) return null;

            if(_panel) return _panel.y;
            return _area.y;
        }

        /**
         * @deprecated
         * @returns {*}
         */
        this.x2 = function() {
            if(!_area && !_panel) return null;

            if(_panel) return _panel.x2;
            return _area.x2;
        }

        /**
         * @deprecated
         * @returns {*}
         */
        this.y2 = function() {
            if(!_area && !_panel) return null;

            if(_panel) return _panel.y2;
            return _area.y2;
        }

        /**
         * padding 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.padding = function(key) {
            if(_padding[key]) {
                return _padding[key];
            }

            return _padding;
        }

        this.color = function(i, brush) {
            var color;

            // 테마 & 브러쉬 옵션 컬러 설정
            if(_.typeCheck("array", brush.colors)) {
                color = brush.colors[i];

                if(_.typeCheck("integer", color)) {
                    color = nextColor(color);
                }
            } else {
                color = nextColor();
            }

            // 시리즈 컬러 설정
            if(_.typeCheck("array", brush.target)) {
                var series = _series[brush.target[i]];

                if(series && series.color) {
                    color = series.color;

                    if(_.typeCheck("integer", color)) {
                        color = nextColor(color);
                    }
                }
            }

            if(_hash[color]) {
                return "url(#" + _hash[color] + ")";
            }

            function nextColor(newIndex) {
                var c = _theme["colors"],
                    index = newIndex || i;

                return (index > c.length - 1) ? c[c.length - 1] : c[index];
            }

            return getColor(this, color);
        }

        /**
         * 현재 text 관련 theme 가 정해진 text element 생성
         *
         * @param {object} attr
         * @param {string|function} textOrCallback
         */
        this.text = function(attr, textOrCallback) {
            var el = this.svg.text($.extend({
                "font-family": this.theme("fontFamily"),
                "font-size": this.theme("fontSize"),
                "fill": this.theme("fontColor")
            }, attr), textOrCallback);

            return el;
        }

        /**
         * theme 의 요소에 대한 값 구하기
         *
         * <code>
         *
         * // theme 전체 객체 얻어오기
         * var theme = chart.theme();
         *
         * // 부분 속성 얻어오기
         * var fontColor = chart.theme("fontColor");
         *
         * // 값 비교해서 얻어오기
         * chart.theme(isSelected, "selectedFontColor", "fontColor");  // isSelected 가 true 이면 selectedFontColor, 아니면 fontColor 리턴
         *
         *
         * </code>
         *
         *
         */
        this.theme = function(key, value, value2) {
            if (arguments.length == 0) {
                return _theme;
            } else if (arguments.length == 1) {
                if (key.indexOf("Color") > -1 && _theme[key] != null) {
                    return getColor(this, _theme[key]);
                }

                return _theme[key];
            } else if (arguments.length == 3) {
                var val = (key) ? value : value2;

                if (val.indexOf("Color") > -1 && _theme[val] != null) {
                    return getColor(this, _theme[val]);
                }

                return _theme[val];
            }
        }

        /**
         * series 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.series = function(key) {
            if (_series[key]) {
                return _series[key];
            }

            return _series;
        }

        /**
         * grid 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.grid = function(key) {
            if(_grid[key]) {
                return _grid[key];
            }

            return _grid;
        }

        this.axis = function(key) {
            if(_axis[key]) {
                return _axis[key];
            }

            return _axis;
        }

        /**
         * brush 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.brush = function(key) {
            if(_brush[key]) {
                return _brush[key];
            }

            return _brush;
        }

        /**
         * data 옵션 리턴
         *
         * @param {integer} index
         *
         */
        this.data = function(index, field) {
            if(_data[index]) {
                if(!_.typeCheck("undefined", field)) {
                    return _data[index][field];
                }

                return _data[index];
            }

            return _data;
        }

        /**
         * 브러쉬/위젯/그리드에서 공통적으로 사용하는 숫자 포맷 함수
         *
         */
        this.format = function() {
            if(arguments.length == 0) return;
            var callback = _options.format;

            if(_.typeCheck("function", callback)) {
                return callback.apply(this, arguments);
            }

            return arguments[0];
        }

        /**
         * chart 내에서 사용될 유일한 키 생성
         *
         * @param {string} key
         */
        this.createId = function(key) {
            return [key || "chart-id", (+new Date), Math.round(Math.random() * 100) % 100].join("-")
        }

        /**
         * uix.table, uix.xtable 객체를 바인딩 해서 사용할 수 있음.
         * 테이블 요소를 수정하면 chart의 data 속성으로 자동으로 설정
         *
         * @param {object} bind   uix.table, uix.xtable 객체 사용
         */
        this.bindUI = function(uiObj) {
            var self = this;

            if (uiObj.module.type == "uix.table") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
                uiObj.callAfter("append", updateTable);
                uiObj.callAfter("insert", updateTable);
                uiObj.callAfter("remove", updateTable);
            } else if (uiObj.module.type == "uix.xtable") {
                uiObj.callAfter("update", updateXTable);
                uiObj.callAfter("sort", updateXTable);
            }

            function updateTable() {
                var data = [];

                for (var i = 0; i < uiObj.count(); i++) {
                    data.push(uiObj.get(i).data);
                }

                self.update(data);
            }

            function updateXTable() {
                self.update(uiObj.listData());
            }
        }

        /**
         * 차트에서 사용할 커스텀 이벤트 핸들러
         *
         * @param type
         * @param callback
         */
        this.on = function(type, callback, isReset) {
            if(typeof(type) != "string" || typeof(callback) != "function") return;

            this.event.push({ type: type.toLowerCase(), callback: callback  });
            if(isReset === true) _handler.push(callback);
        }

        /**
         * chart render 함수 재정의
         *
         */
        this.render = function(isAll) {
            // SVG 메인 리셋
            this.svg.reset(isAll);

            // chart 이벤트 초기화 (삭제 대상)
            resetEvent(this);

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawGrid(this);
            drawAxis(this);
            drawBrush(this, "brush", isAll);
            drawBrush(this, "widget", isAll);

            // SVG 태그 백그라운드 테마 설정
            this.svg.root.css({
                background: this.theme("backgroundColor")
            });

            // SVG 메인/서브 렌더링
            this.svg.render(isAll);

            // 초기화 설정
            _initialize = true;
        }

        /**
         * data 업데이트 후 차트 다시 생성
         *
         * @param {array} data
         */
        this.update = function(data) {
            if(_options.axis != null) {
                if(_.typeCheck("object", data)) {
                    for (var key in data) {
                        _options.axis[key].data = data[key];
                    }
                }

                if(_options.render) this.render();
            } else {
                if(data) {// 데이터가 있을 경우...
                    _options.data = data;
                }

                this.page(1);
            }
        }

        this.page = function(pNo) {
            if(_options.axis != null) return;

            if (arguments.length == 0) {
                return _page - 1;
            }

            var dataList = _options.data,
                limit = _options.bufferCount,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if(pNo < 1) {
                _page = 1;
            } else {
                _page = (pNo > maxPage) ? maxPage : pNo;
            }

            _start = (_page - 1) * limit, _end = _start + limit;

            // 마지막 페이지 처리
            if(_end > dataList.length) {
                _start = dataList.length - limit;
                _end = dataList.length;
            }

            if(_end <= dataList.length) {
                _start = (_start < 0) ? 0 : _start;
                _data = dataList.slice(_start, _end);

                if(_options.render) this.render();
                if(dataList.length > 0) _page++;
            }
        }

        this.next = function() {
            if(_options.axis != null) return;

            var dataList = _options.data,
                limit = _options.bufferCount,
                step = _options.shiftCount;

            _start += step;

            var isLimit = (_start + limit > dataList.length);

            _end = (isLimit) ? dataList.length : _start + limit;
            _start = (isLimit) ? dataList.length - limit : _start;
            _start = (_start < 0) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            if(_options.render) this.render();
        }

        this.prev = function() {
            if(_options.axis != null) return;

            var dataList = _options.data,
                limit = _options.bufferCount,
                step = _options.shiftCount;

            _start -= step;

            var isLimit = (_start < 0);

            _end = (isLimit) ? limit : _start + limit;
            _start = (isLimit) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            if(_options.render) this.render();
        }

        this.zoom = function(start, end) {
            if(_options.axis != null) return;

            if (arguments.length == 0) {
                return {
                    start: _start,
                    end: _end
                }
            }

            if (start == end)
                return;

            var dataList = _options.data;

            _end = (end > dataList.length) ? dataList.length : end;
            _start = (start < 0) ? 0 : start;
            _data = dataList.slice(_start, _end);

            if(_options.render) this.render();
        }

        /**
         * chart CSV 데이터 갱신 후 렌더링
         *
         * @param csv
         */
        this.setCsv = function(csv) {
            if(_options.axis != null) return;

            var chartFields = [],
                csvFields = _options.csv,
                csvNumber = _options.csvNumber;

            for(var key in _series) {
                chartFields.push(key);
            }

            if(chartFields.length == 0 && !csvFields)
                return;

            var fields = _.getCsvFields(chartFields, csvFields),
                csvNumber = (csvNumber) ? _.getCsvFields(fields, csvNumber) : null;

            this.update(_.csvToData(fields, csv, csvNumber));
        }

        /**
         * chart CSV 파일 데이터 설정
         *
         * @param file
         */
        this.setCsvFile = function(file) {
            if(_options.axis != null) return;

            var self = this;

            _.fileToCsv(file, function(csv) {
                self.setCsv(csv);
            });
        }

        /**
         * 브러쉬를 추가한 후 차트 렌더링
         *
         * @param brush
         * @param isRender
         */
        this.addBrush = function(brush) {
            _options.brush.push(brush);
            if(_options.render) this.render();
        }

        /**
         * 브러쉬를 삭제한 후 차트 렌더링
         *
         * @param index
         * @param isRender
         */
        this.removeBrush = function(index) {
            _options.brush.splice(index, 1);
            if(_options.render) this.render();
        }

        /**
         * 해당 인덱스의 브러쉬를 업데이트한 후 렌더링
         *
         * @param index
         * @param brush
         * @param isRender
         */
        this.updateBrush = function(index, brush) {
            for(var key in brush) {
                _options.brush[index][key] = brush[key];
            }

            if(_options.render) this.render();
        }

        // 브러쉬와 동일한 구조
        this.addWidget = function(widget) {
            _options.widget.push(widget);
            if(_options.render) this.render(true);
        }

        // 브러쉬와 동일한 구조
        this.removeWidget = function(index) {
            _options.widget.splice(index, 1);
            if(_options.render) this.render(true);
        }

        // 브러쉬와 동일한 구조
        this.updateWidget = function(index, widget) {
            for(var key in widget) {
                _options.widget[index][key] = widget[key];
            }

            if(_options.render) this.render(true);
        }

        /**
         * 테마 변경 후 차트 렌더링
         *
         * @param themeName
         */
        this.setTheme = function(theme) {
            var newTheme = (_.typeCheck("string", theme)) ? jui.include("chart.theme." + theme) : theme;

            if(newTheme != null) {
                setThemeStyle($.extend(newTheme, _options.style));
                if(_options.render) this.render(true);
            }
        }

        /**
         * 사이즈 조정 후 차트 렌더링
         *
         * @param {integer} width
         * @param {integer} height
         */
        this.setSize = function(width, height) {
            if(arguments.length == 2) {
                _options.width = width;
                _options.height = height;
            }

            this.svg.size(_options.width, _options.height);
            if(_options.render) this.render(true);
        }

        /**
         * 차트가 풀-사이즈인지 확인
         *
         * @returns {boolean}
         */
        this.isFullSize = function() {
            if(_options.width == "100%" || _options.height == "100%")
                return true;

            return true;
        }

        /**
         * 차트의 렌더링 상태 확인
         *
         * @returns {boolean}
         */
        this.isRender = function() {
            return _options.render;
        }
    }

    UI.setup = function() {
        return {
            width: "100%", // chart 기본 넓이
            height: "100%", // chart 기본 높이

            // style
            padding: {
                left: 50,
                right: 50,
                bottom: 50,
                top: 50
            },

            // chart
            theme: "jennifer", // 기본 테마 jennifer
            style: {},
            series: {},
            grid: null,
            axis : null,
            brush: [],
            widget: [],
            data: [],
            bind: null,
            format: null,
            render: true,

            // buffer
            bufferCount: 10000,
            shiftCount: 1,

            // csv
            csv: null,
            csvNumber: null
        }
    }

    return UI;
}, "core");
