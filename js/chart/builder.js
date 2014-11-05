jui.defineUI("chart.builder", ["jquery", "util.base", "util.svg", "util.color"], function($, _, SVGUtil, ColorUtil) {
    /**
     * Chart Builder 구현
     *
     */
    var UI = function() {
        var _initialize = false;
        var _data = [], _page = 1, _start = 0, _end = 0;
        var _grid = {}, _brush = [], _widget = [], _scales = [], _hash = {};
        var _padding, _series, _area, _theme;
        var _widget_objects = [];


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

            // chart 영역 계산
            chart.x2 = chart.x + chart.width;
            chart.y2 = chart.y + chart.height;

            _area = chart;
        }

        /**
         * draw 이전에 환경 셋팅
         *
         */
        function drawBefore(self) {
            // 데이타 설정 , deepClone 으로 기존 옵션 값에 영향을 주지 않음
            var series = _.deepClone(self.options.series),
                grid = _.deepClone(self.options.grid),
                brush = _.deepClone(self.options.brush),
                widget = _.deepClone(self.options.widget),
                series_list = [];

            // series 데이타 구성
            for (var i = 0, len = _data.length; i < len; i++) {
                var row = _data[i];

                for (var key in row) {
                    var obj = series[key] || {};
                    var value = +row[key];

                    series[key] = obj;

                    obj.data = obj.data || [];
                    obj.min = typeof obj.min == 'undefined' ? 0 : obj.min;
                    obj.max = typeof obj.max == 'undefined' ? 0 : obj.max;
                    obj.data[i] = value;

                    if (value < obj.min) {
                        obj.min = value;
                    }

                    if (value > obj.max) {
                        obj.max = value;
                    }
                }
            }

            // series_list
            for (var key in series) {
                series_list.push(key);
            }

            _brush = createBrushData(brush, series_list);
            _widget = createBrushData(widget, series_list);
            _series = series;
            _grid = grid;

            // hash code 삭제
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
            var grid = self.grid();

            if (grid != null) {
                if (grid.type) {
                    grid = {
                        c: grid
                    };
                }

                for (var k in grid) {
                    var orient = 'custom';

                    if (k == 'x')
                        orient = 'bottom';
                    else if (k == 'x1')
                        orient = 'top';
                    else if (k == 'y')
                        orient = 'left';
                    else if (k == 'y1')
                        orient = 'right';

                    if (!_scales[k]) {
                        _scales[k] = [];
                    }

                    if (!_.typeCheck("array", grid[k])) {
                        grid[k] = [grid[k]];
                    }

                    for (var keyIndex = 0, len = grid[k].length; keyIndex < len; keyIndex++) {
                        var Grid = jui.include("chart.grid." + (grid[k][keyIndex].type || "block"));

                        // 브러쉬&위젯 기본 프로퍼티 정의
                        Grid.prototype.chart = self;
                        Grid.prototype.grid = grid[k][keyIndex];

                        var obj = new Grid(orient, self, grid[k][keyIndex]).render(),
                            dist = grid[k][keyIndex].dist || 0;

                        // grid 별 dist 로 위치선정하기
                        if (k == 'y') {
                            obj.root.translate(self.x() - dist, self.y());
                        } else if (k == 'y1') {
                            obj.root.translate(self.x2() + dist, self.y());
                        } else if (k == 'x') {
                            obj.root.translate(self.x(), self.y2() + dist);
                        } else if (k == 'x1') {
                            obj.root.translate(self.x(), self.y() - dist);
                        }

                        _scales[k][keyIndex] = obj.scale
                    }
                }
            }
        }

        /**
         * brush 그리기
         *
         * brush 에 맞는 x, y 축(grid) 설정
         *
         */
        function drawBrush(self, type) {
            var draws = (type == "brush") ? _brush : _widget;

            if (draws != null) {
                for (var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart." + type + "." + draws[i].type),
                        drawObj = (type == "widget") ? self.brush(i) : draws[i];

                    // 그리드 축 설정
                    setGridAxis(draws[i], drawObj);
                    draws[i].index = i;

                    // 브러쉬&위젯 기본 프로퍼티 정의
                    Obj.prototype.chart = self;
                    Obj.prototype[type] = draws[i];

                    // 브러쉬&위젯 엘리먼트 생성 및 후처리
                    if (type == "widget") {
                        _widget_objects[i] = new Obj(self, draws[i]);
                        var elem = _widget_objects[i].render();

                        self.svg.autoRender(elem, false);
                    } else {
                        new Obj(self, draws[i]).render();
                    }
                }
            }
        }

        /**
         * autoRender가 false일 경우, 위젯의 그리드 프로퍼티 갱신
         *
         * @param self
         */
        function setGridAxisWidget(self) {
            var draws = _widget_objects;

            for (var i = 0; i < draws.length; i++) {
                setGridAxis(draws[i].widget, self.brush(i));
            }
        }

        /**
         * 브러쉬와 위젯의 그리드 객체 설정
         *
         * @param draw
         * @param drawObj
         */
        function setGridAxis(draw, drawObj) {
            delete draw.x;
            delete draw.y;
            delete draw.c;

            if (_scales.x || _scales.x1) {

                if (!_scales.x && _scales.x1) {
                    _scales.x = _scales.x1;
                }

                if (!_.typeCheck("function", draw.x)) {
                    draw.x = ( typeof drawObj.x1 !== 'undefined') ? _scales.x1[drawObj.x1 || 0] : _scales.x[drawObj.x || 0];
                }
            }
            if (_scales.y || _scales.y1) {

                if (!_scales.y && _scales.y1) {
                    _scales.y = _scales.y1;
                }

                if (!_.typeCheck("function", draw.y)) {
                    draw.y = ( typeof drawObj.y1 !== 'undefined') ? _scales.y1[drawObj.y1 || 0] : _scales.y[drawObj.y || 0];
                }
            }
            if (_scales.c) {
                if (!_.typeCheck("function", draw.c)) {
                    draw.c = _scales.c[drawObj.c || 0];
                }
            }
        }

        /**
         * Brush 옵션을 가공하여, 실제 사용되는 객체를 만든다.
         * Widget도 같이 사용한다.
         *
         * @param draws
         * @param series_list
         * @returns {*}
         */
        function createBrushData(draws, series_list) {
            var result = null;

            if (draws != null) {
                if (typeof draws == 'string') {
                    result = [{
                        type: draws
                    }];
                } else if (typeof draws == 'object' && !draws.length) {
                    result = [draws];
                } else {
                    result = draws;
                }

                for (var i = 0, len = result.length; i < len; i++) {
                    var b = result[i];

                    if (!b.target) {
                        b.target = series_list;
                    } else if (typeof b.target == 'string') {
                        b.target = [b.target];
                    }
                }
            }

            return result;
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
            $(self.root).on("selectstart", function(e) {
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

                if (e.chartX < 0)
                    return;
                if (e.chartX > self.width())
                    return;
                if (e.chartY < 0)
                    return;
                if (e.chartY > self.height())
                    return;

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
            if (_.typeCheck("object", color)) {
                return createGradient(self, color);
            }

            var parsedColor = ColorUtil.parse(color);
            if (parsedColor == color)
                return color;

            return createGradient(self, parsedColor, color);
        }


        this.init = function() {
            var opts = this.options;

            // 패딩 옵션 설정
            if (opts.padding == "empty") {
                _padding = {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                };
            } else {
                _padding = opts.padding;
            }

            // 차트 테마 설정
            this.setTheme(opts.theme);

            // 차트 테마 스타일 설정
            if (opts.style) {
                this.setTheme(opts.style);
            }

            // UI 바인딩 설정
            if (opts.bind) {
                this.bindUI(opts.bind);
            }

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width: opts.width,
                height: opts.height
            });

            // 데이터 업데이트 및 커스텀 이벤트 발생
            this.update();
            this.emit("load");

            // 차트 배경 이벤트
            setChartEvent(this);

            // 차트 초기화 설정
            _initialize = true;
        }


        /**
         * 계산된 차트 영역에 대한 값 리턴
         *
         * <code>
         * ex)
         * chart.area('x');
         * chart.area('width');
         * </code>
         *
         * @param {string} key
         */
        this.area = function(key) {
            if (typeof _area[key] !== "undefined") {
                return _area[key];
            }

            return _area;
        }

        this.height = function(value) {
            if (arguments.length == 0) {
                return this.area('height');
            }

            _area.height = value;
        }

        this.width = function(value) {
            if (arguments.length == 0) {
                return this.area('width');
            }

            _area.width = value;
        }

        this.x = function(value) {
            if (arguments.length == 0) {
                return this.area('x');
            }

            _area.x = value;
        }

        this.y = function(value) {
            if (arguments.length == 0) {
                return this.area('y');
            }

            _area.y = value;
        }

        this.x2 = function(value) {
            if (arguments.length == 0) {
                return this.area('x2');
            }

            _area.x2 = value;
        }

        this.y2 = function(value) {
            if (arguments.length == 0) {
                return this.area('y2');
            }

            _area.y2 = value;
        }

        /**
         * padding 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.padding = function(key) {
            if (_padding[key]) {
                return _padding[key];
            }

            return _padding;
        }

        this.color = function(i, colors) {
            var color, c;

            // 테마 또는 브러쉬 옵션일 때 처리
            if (_.typeCheck("array", colors)) {
                c = colors;
            } else {
                c = _theme["colors"];
            }

            // 인덱스가 없다면 마지막 컬러를 반환
            color = (i > c.length - 1) ? c[c.length - 1] : c[i];

            if (_hash[color]) {
                return "url(#" + _hash[color] + ")";
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
            var el = this.svg.text(_.extend({
                "font-family": this.theme("fontFamily"),
                "font-size": this.theme("fontSize"),
                "fill": this.theme("fontColor")
            }, attr), textOrCallback);

            return el;
        }

        /**
         * chart 의 theme 설정
         *
         * @param {string} theme   chart.theme.xxx 의 클래스를 읽어들임
         */
        this.setTheme = function() {
            if (arguments.length == 1) {
                var theme = arguments[0];

                if (_.typeCheck("object", theme)) {
                    _theme = $.extend(_theme, theme);
                } else {
                    _theme = jui.include("chart.theme." + theme);
                }
            } else if (arguments.length == 2) {
                _theme[arguments[0]] = arguments[1];
            }
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
                if (_theme[key]) {
                    if (key.indexOf("Color") > -1 && _theme[key]) {
                        return getColor(this, _theme[key]);
                    } else {
                        return _theme[key];
                    }
                }
            } else if (arguments.length == 3) {
                var val = (key) ? value : value2;
                if (val.indexOf("Color") > -1 && _theme[val]) {
                    return getColor(this, _theme[val]);
                } else {
                    return _theme[val];
                }

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
            if (_grid[key]) {
                return _grid[key];
            }

            return _grid;
        }

        /**
         * brush 옵션 리턴
         *
         * @param {string} key
         *
         */
        this.brush = function(key) {
            if (_brush[key]) {
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
            if (_data[index]) {

                if (typeof field != 'undefined') {
                    return _data[index][field];
                }

                return _data[index];
            }

            return _data;
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
         * jui component binding
         *
         * uix.table, uix.xtable 객체를 바인딩 해서 사용할 수 있음.
         *
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
         * chart render 함수 재정의
         *
         */
        this.render = function(isAll) {
            var isAll = (isAll === true || _initialize === false) ? true : false;

            // SVG 메인 리셋
            this.svg.reset(isAll);

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawGrid(this);
            drawBrush(this, "brush");

            // 위젯은 한번만 draw
            if (isAll) {
                drawBrush(this, "widget");
            } else {
                setGridAxisWidget(this);
            }

            // SVG 태그 백그라운드 테마 설정
            this.svg.root.css({
                background: this.theme("backgroundColor")
            });

            // SVG 메인/서브 렌더링
            this.svg.render(isAll);
            this.emit("render");
        }

        /**
         * data 업데이트 후 차트 다시 생성
         *
         * @param {array} data
         */
        this.update = function(data) {
            if (data) {// 데이터가 있을 경우...
                this.options.data = data;
            }

            this.page(1);
        }

        this.page = function(pNo) {
            if (arguments.length == 0) {
                return _page - 1;
            }

            var dataList = this.options.data,
                limit = this.options.bufferCount,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if (pNo < 1) {
                _page = 1;
            } else {
                _page = (pNo > maxPage) ? maxPage : pNo;
            }

            _start = (_page - 1) * limit, _end = _start + limit;

            // 마지막 페이지 처리
            if (_end > dataList.length) {
                _start = dataList.length - limit;
                _end = dataList.length;
            }

            if (_end <= dataList.length) {
                _start = (_start < 0) ? 0 : _start;
                _data = dataList.slice(_start, _end);

                this.render();
                if (dataList.length > 0)
                    _page++;
            }
        }

        this.next = function() {
            var dataList = this.options.data,
                limit = this.options.bufferCount,
                step = this.options.shiftCount;

            _start += step;

            var isLimit = (_start + limit > dataList.length);

            _end = (isLimit) ? dataList.length : _start + limit;
            _start = (isLimit) ? dataList.length - limit : _start;
            _start = (_start < 0) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        this.prev = function() {
            var dataList = this.options.data,
                limit = this.options.bufferCount,
                step = this.options.shiftCount;

            _start -= step;

            var isLimit = (_start < 0);

            _end = (isLimit) ? limit : _start + limit;
            _start = (isLimit) ? 0 : _start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        this.zoom = function(start, end) {
            if (arguments.length == 0) {
                return {
                    start: _start,
                    end: _end
                }
            }

            if (start == end)
                return;

            var dataList = this.options.data;

            _end = (end > dataList.length) ? dataList.length : end;
            _start = (start < 0) ? 0 : start;
            _data = dataList.slice(_start, _end);

            this.render();
        }

        /**
         * chart 사이즈 조정
         *
         * @param {integer} width
         * @param {integer} height
         */
        this.size = function(width, height) {
            this.svg.size(width, height);
            this.render(true);
        }

        /**
         * chart CSV 데이터 설정
         *
         * @param csv
         */
        this.setCsv = function(csv) {
            var chartFields = [],
                csvFields = this.options.csv,
                csvNumber = this.options.csvNumber;

            for (var key in _series) {
                chartFields.push(key);
            }

            if (chartFields.length == 0 && !csvFields)
                return;

            var fields = _.getCsvFields(chartFields, csvFields), csvNumber = (csvNumber) ? _.getCsvFields(fields, csvNumber) : null;

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
    }

    UI.setup = function() {
        return {
            options: {
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
                grid: {},
                brush: null,
                widget: null,
                data: [],
                bind: null,

                // buffer
                bufferCount: 100,
                shiftCount: 1,

                // csv
                csv: null,
                csvNumber: null
            },
            valid: {
                area: [ "string" ],
                width: [ "integer" ],
                height: [ "integer" ],
                x: [ "integer" ],
                y: [ "integer" ],
                x2: [ "integer" ],
                y2: [ "integer" ],
                padding: [ "string" ],
                color: [ "integer", [ "undefined", "array" ] ], // undefined 제거 요망
                text: [ "object", [ "string", "function" ] ],
                setTheme: [ ["object", "string" ], [ "string", "number", "array" ] ],
                theme: [ [ "string", "boolean" ], "string", "string" ],
                series: [ [ "undefined", "string" ] ], // undefined 제거 요망
                grid: [ "string" ],
                brush: [ "integer" ],
                data: [ [ "null", "integer" ], "string" ], // null 제거 요망
                createId: [ "string" ],
                bindUI: [ "object" ],
                update: [ "array" ],
                page: [ "integer" ],
                size: [ "integer", "integer" ],
                zoom: [ "integer", "integer" ],
                render: [ "boolean" ],
                setCsv: [ "string" ],
                setCsvFile: [ "object" ]
            }
        }
    }

    return UI;
}, "core");
