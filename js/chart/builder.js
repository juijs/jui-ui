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
        var _axis = [], _brush = [], _widget = [], _hash = {};
        var _padding, _series, _area, _panel, _theme;
        var _initialize = false, _options = null, _handler = []; // 리셋 대상 커스텀 이벤트 핸들러

        function getValue(value, max) {
            if(_.typeCheck("string", value) && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
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

            var _chart = {
                width: max.width - (_padding.left + _padding.right),
                height: max.height - (_padding.top + _padding.bottom),
                x: _padding.left,
                y: _padding.top
            };

            // chart 크기가 마이너스일 경우 (엘리먼트가 hidden 상태)
            if(_chart.width < 0) _chart.width = 0;
            if(_chart.height < 0) _chart.height = 0;

            // _chart 영역 계산
            _chart.x2 = _chart.x + _chart.width;
            _chart.y2 = _chart.y + _chart.height;

            _area = _chart;
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

        function caculatePanel(a) {
            a.x = getValue(a.x, _area.width);
            a.y = getValue(a.y, _area.height);
            a.width = getValue(a.width, _area.width);
            a.height = getValue(a.height, _area.height);

            a.x2 = a.x + a.width;
            a.y2 = a.y + a.height;

            return a;
        }

        /**
         * draw 이전에 환경 셋팅
         *
         */
        function drawBefore(self) {
            _axis = _.deepClone(_options.axis);
            _series = _.deepClone(_options.series);
            _brush = _.deepClone(_options.brush);
            _widget = _.deepClone(_options.widget);

            // 해쉬 코드 초기화
            _hash = {};
        }

        function setMaxValue(axis) {
            if (!axis.data) return;

            var _series = {},
                _data = axis.data;

            // 시리즈 데이터 구성
            for(var i = 0, len = _data.length; i < len; i++) {
                var row = _data[i];

                for(var key in row) {
                    var obj = _series[key] || {data : []},
                        value = row[key],
                        range = null;

                    if (typeof obj.data == 'undefined') {
                        obj.data = [];
                    }

                    obj.data.push(value);

                    if(value instanceof Array) {
                        range = { max : Math.max.apply(Math, value), min : Math.min.apply(Math, value) }
                    } else {
                        range = { max : +value, min : +value }
                    }

                    obj.min = typeof obj.min == 'undefined' ? 0 : obj.min;
                    obj.max = typeof obj.max == 'undefined' ? 0 : obj.max;

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

            axis.series = _series;
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
                width: self.area('width'),
                height: self.area('height')
            }));
            defs.append(clip);

            self.defs = defs;
        }

        function drawAxis(self) {

            function drawAxisType(axis, k, chart) {
                var ax = axis[k];
                if (typeof ax.extend != 'undefined') {
                    ax = $.extend(_axis[ax.extend][k], ax);
                    delete ax.extend;
                }
                ax.axis = true;

                var Grid = jui.include("chart.grid." + (ax.type || "block"));

                // axis 기본 프로퍼티 정의
                var obj = new Grid(ax.orient, chart, ax),
                    dist = ax.dist || 0;

                obj.chart = chart;
                obj.grid = ax;

                var elem = obj.render();

                // grid 별 dist 로 위치선정하기
                if(ax.orient == 'left') {
                    elem.root.translate(_area.x - dist, _area.y);
                } else if(ax.orient == 'right') {
                    elem.root.translate(_area.x + chart.area('x2') + dist, _area.y);
                } else if(ax.orient == 'bottom') {
                    elem.root.translate(_area.x , _area.y + chart.area('y2') + dist);
                } else if(ax.orient == 'top') {
                    elem.root.translate(_area.x , _area.y + chart.area('y') - dist);
                } else {
                    // custom
                    if (elem.root) elem.root.translate(_area.x, _area.y);
                }

                return elem.scale;
            }

            for(var key in _axis) {
                var axis = _axis[key];

                if (!axis) continue;

                // set panel
                savePanel(caculatePanel(axis.area || { x: 0, y: 0 , width: _area.width, height: _area.height }));

                // set data
                if(axis.data) saveData(axis.data);

                if(axis.x) {
                    axis.x.orient = axis.x.orient || "bottom"
                    axis.xScale = drawAxisType(axis, "x", self);
                }
                if(axis.y) {
                    axis.y.orient = axis.y.orient || "left";
                    axis.yScale = drawAxisType(axis, "y", self);
                }
                if(axis.c) { axis.cScale = drawAxisType(axis, "c", self); }

                if(axis.data) restoreData();
                restorePanel();

                // 시리즈 구하기
                setMaxValue(axis);
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
                    var Obj = jui.include("chart." + type + "." + draws[i].type),
                        axisIndex = draws[i].axis || _options.axisIndex;

                    // 브러쉬 타겟 설정
                    if(type == "brush") {
                        if(!draws[i].target) {
                            var target = [];

                            if (_axis[axisIndex]) {
                                for(var key in _axis[axisIndex].series) {
                                    target.push(key);
                                }
                            }

                            draws[i].target = target;
                        } else if(typeof draws[i].target == "string") {
                            draws[i].target = [ draws[i].target ];
                        }
                    }

                    // 브러쉬&위젯 축 설정
                    if (_axis[axisIndex]) {
                        draws[i].x = _axis[axisIndex].xScale;
                        draws[i].y = _axis[axisIndex].yScale;
                        draws[i].c = _axis[axisIndex].cScale;
                    }
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

                        if(_axis[axisIndex]) saveData(_options.axis[axisIndex].data);

                        var elem = draw.render();
                        if(!draw.isRender()) {
                            self.svg.autoRender(elem, false);
                        }

                        if(_axis[axisIndex]) restoreData();
                    } else {
                        if(_axis[axisIndex]) saveData(_options.axis[axisIndex].data);
                        draw.render();
                        if(_axis[axisIndex]) restoreData();
                    }
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
                if(e.chartX > self.area("width")) return;
                if(e.chartY < 0) return;
                if(e.chartY > self.area("height")) return;

                return true;
            }
        }

        function createGradient(self, obj, hashKey) {
            if(typeof hashKey != "undefined" && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var g = null,
                id = self.createId("gradient");

            obj.id = id;

            if(obj.type == "linear") {
                g = self.svg.linearGradient(obj);
            } else if(obj.type == "radial") {
                g = self.svg.radialGradient(obj);
            }

            for(var i = 0; i < obj.stops.length; i++) {
                g.append(self.svg.stop(obj.stops[i]));
            }

            self.defs.append(g);

            if(typeof hashKey != "undefined") {
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
            if(arguments.length == 1) {
                _theme = $.extend(_theme, arguments[0]);
            } else if (arguments.length == 2) {
                _theme[arguments[0]] = arguments[1];
            }
        }

        function setDefaultOptions(self) {
            var opts = self.options;

            // UI 바인딩 설정
            if(opts.bind) {
                self.bindUI(opts.bind);
                opts.bind = null;
            }

            // 바인딩 옵션을 제외하고 클론
            _options = _.deepClone(opts);

            // 패딩 옵션 설정
            if(_options.padding == "empty") {
                _padding = {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                };
            } else {
                _padding = _options.padding;
            }

            if(!_.typeCheck([ "array" ], _options.axis)) {
                _options.axis = [ _options.axis ];
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

            // 차트 테마 설정 (+옵션 스타일)
            setThemeStyle($.extend(jui.include("chart.theme." + _options.theme), _options.style));

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width: _options.width,
                height: _options.height
            });

            // 차트 기본 렌더링
            if(_options.axis[_options.axisIndex]) {
                this.update();
            } else {
                this.render();
            }

            // 차트 이벤트 설정
            setChartEvent(this);
        }

        /**
         * 차트 영역 데이터 반환
         *
         * @returns {*}
         */

        this.area = function(key) {
            if(_panel) {
                return typeof _panel[key] == 'undefined' ? _panel : _panel[key];
            } else {
                return typeof _area[key] == 'undefined' ? _area : _area[key];
            }
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
            if(arguments.length == 0) {
                return _theme;
            } else if(arguments.length == 1) {
                if(key.indexOf("Color") > -1 && _theme[key] != null) {
                    return getColor(this, _theme[key]);
                }

                return _theme[key];
            } else if(arguments.length == 3) {
                var val = (key) ? value : value2;

                if(val.indexOf("Color") > -1 && _theme[val] != null) {
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
            var _axis = this.axis(_options.axisIndex);

            if(_axis.series[key]) {
                return $.extend(_series[key], _axis.series[key]);
            }

            return _series;
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
            if(_data && _data[index]) {
                if(!_.typeCheck("undefined", field)) {
                    return _data[index][field];
                }

                return _data[index]
            }

            return _data || [];
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
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            if (data) {
                axis.originData = data;
            } else {
                axis.originData = axis.data || [];
            }

            this.page(1);
        }

        this.page = function(pNo) {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            if(arguments.length == 0) {
                return _page - 1;
            }

            var dataList = axis.originData,
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
                axis.data = dataList.slice(_start, _end);

                if(this.isRender()) this.render();
                if(dataList.length > 0) _page++;
            }
        }

        this.next = function() {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.originData,
                limit = _options.bufferCount,
                step = _options.shiftCount;

            _start += step;

            var isLimit = (_start + limit > dataList.length);

            _end = (isLimit) ? dataList.length : _start + limit;
            _start = (isLimit) ? dataList.length - limit : _start;
            _start = (_start < 0) ? 0 : _start;
            axis.data = dataList.slice(_start, _end);

            if(this.isRender()) this.render();
        }

        this.prev = function() {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.originData,
                limit = _options.bufferCount,
                step = _options.shiftCount;

            _start -= step;

            var isLimit = (_start < 0);

            _end = (isLimit) ? limit : _start + limit;
            _start = (isLimit) ? 0 : _start;
            axis.data = dataList.slice(_start, _end);

            if(this.isRender()) this.render();
        }

        this.zoom = function(start, end) {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            if(arguments.length == 0) {
                return {
                    start: _start,
                    end: _end
                }
            }

            if(start == end)
                return;

            var dataList = axis.originData;

            _end = (end > dataList.length) ? dataList.length : end;
            _start = (start < 0) ? 0 : start;

            axis.data = dataList.slice(_start, _end);

            if(this.isRender()) this.render();
        }

        /**
         * chart CSV 데이터 갱신 후 렌더링
         *
         * @param csv
         */
        this.setCsv = function(csv) {
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
            var self = this;

            _.fileToCsv(file, function(csv) {
                self.setCsv(csv);
            });
        }

        this.addBrush = function(brush) {
            _options.brush.push(brush);
            if(this.isRender()) this.render();
        }

        this.removeBrush = function(index) {
            _options.brush.splice(index, 1);
            if(this.isRender()) this.render();
        }

        this.updateBrush = function(index, brush) {
            for(var key in brush) {
                _options.brush[index][key] = brush[key];
            }

            if(this.isRender()) this.render();
        }

        this.addWidget = function(widget) {
            _options.widget.push(widget);
            if(this.isRender()) this.render(true);
        }

        this.removeWidget = function(index) {
            _options.widget.splice(index, 1);
            if(this.isRender()) this.render(true);
        }

        this.updateWidget = function(index, widget) {
            for(var key in widget) {
                _options.widget[index][key] = widget[key];
            }

            if(this.isRender()) this.render(true);
        }

        this.addAxis = function(axis) {
            _options.axis.push(axis);
            if(this.isRender()) this.render(true);
        }

        this.removeAxis = function(index) {
            _options.axis.splice(index, 1);
            if(this.isRender()) this.render(true);
        }

        this.updateAxis = function(index, axis) {
            if(!_options.axis[index] || !axis) return;

            $.extend(true, _options.axis[index], axis);
            if(this.isRender()) this.render(true);
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
                if(this.isRender()) this.render(true);
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
            if(this.isRender()) this.render(true);
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
            return (!_initialize) ? true : _options.render;
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
            brush: [],
            widget: [],
            axis: [],
            axisIndex: 0,
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
