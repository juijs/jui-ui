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
        var _data = [], _tempData = [];
        var _axis = [], _brush = [], _widget = [];
        var _padding, _series, _area, _panel, _theme, _hash = {};
        var _initialize = false, _options = null, _handler = []; // 리셋 대상 커스텀 이벤트 핸들러

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

        function caculatePanel(a) {
            a.x = getValue(a.x, _area.width);
            a.y = getValue(a.y, _area.height);
            a.width = getValue(a.width, _area.width);
            a.height = getValue(a.height, _area.height);

            a.x2 = a.x + a.width;
            a.y2 = a.y + a.height;

            return a;
        }

        function getValue(value, max) {
            if(_.typeCheck("string", value) && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
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

        function drawBefore(self) {
            _axis = _.deepClone(_options.axis, { data : true, origin : true });
            _series = _.deepClone(_options.series);
            _brush = _.deepClone(_options.brush);
            _widget = _.deepClone(_options.widget);

            // 해쉬 코드 초기화
            _hash = {};
        }

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

                // 다른 그리드 옵션을 사용함
                if(_.typeCheck("integer", axis[k].extend)) {
                    _.extend(axis[k], _options.axis[axis[k].extend][k], true);
                }

                var Grid = jui.include("chart.grid." + (axis[k].type || "block"));

                // 그리드 기본 옵션과 사용자 옵션을 합침
                jui.defineOptions(Grid, axis[k]);

                // 엑시스 기본 프로퍼티 정의
                var obj = new Grid(chart, axis, axis[k]);
                obj.chart = chart;
                obj.axis = axis;
                obj.grid = axis[k];

                var elem = obj.render();

                // 그리드 별 위치 선정하기
                if(axis[k].orient == "left") {
                    elem.root.translate(_area.x - axis[k].dist, _area.y);
                } else if(axis[k].orient == "right") {
                    elem.root.translate(_area.x + chart.area("x2") + axis[k].dist, _area.y);
                } else if(axis[k].orient == "bottom") {
                    elem.root.translate(_area.x , _area.y + chart.area("y2") + axis[k].dist);
                } else if(axis[k].orient == "top") {
                    elem.root.translate(_area.x , _area.y + chart.area("y") - axis[k].dist);
                } else {
                    // custom
                    if(elem.root) elem.root.translate(_area.x, _area.y);
                }

                return elem.scale;
            }

            for(var key in _axis) {
                var axis = _axis[key];

                if(!axis) continue;

                // 엑시스 영역 설정
                axis.area = _.extend(axis.area, {
                    x: 0, y: 0 , width: _area.width, height: _area.height
                }, true);

                savePanel(caculatePanel(axis.area));

                if(_.typeCheck("array", axis.data))
                    saveData(axis.data);

                if(_.typeCheck("object", axis.x)) {
                    axis.x.orient = axis.x.orient || "bottom"
                    axis.x = drawAxisType(axis, "x", self);
                }

                if(_.typeCheck("object", axis.y)) {
                    axis.y.orient = axis.y.orient || "left";
                    axis.y = drawAxisType(axis, "y", self);
                }

                if(_.typeCheck("object", axis.c)) {
                    axis.c = drawAxisType(axis, "c", self);
                }

                if(_.typeCheck("array", axis.data))
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
        function drawBrush(self) {
            var draws = _brush;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.brush." + draws[i].type),
                        axisIndex = draws[i].axis || _options.axisIndex;

                    // 타겟 프로퍼티 설정
                    if(!draws[i].target) {
                        var target = [];

                        if(_axis[axisIndex]) {
                            for(var key in _axis[axisIndex].series) {
                                target.push(key);
                            }
                        }

                        draws[i].target = target;
                    } else if(_.typeCheck("string", draws[i].target)) {
                        draws[i].target = [ draws[i].target ];
                    }

                    // 브러쉬 인덱스 설정
                    draws[i].index = i;

                    // 브러쉬 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);

                    // 브러쉬 기본 프로퍼티 정의
                    var draw = new Obj(self, _axis[axisIndex], draws[i]);
                    draw.chart = self;
                    draw.axis = _axis[axisIndex];
                    draw.brush = draws[i];

                    // 브러쉬 렌더링
                    if(_axis[axisIndex]) saveData(_options.axis[axisIndex].data);
                    draw.render();
                    if(_axis[axisIndex]) restoreData();
                }
            }
        }

        function drawWidget(self, isAll) {
            var draws = _widget;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.widget." + draws[i].type),
                        axisIndex = _options.axisIndex;

                    // 위젯 인덱스 설정
                    draws[i].index = i;

                    // 위젯 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);

                    // 위젯 기본 프로퍼티 정의
                    var draw = new Obj(self, _axis[axisIndex], draws[i]);
                    draw.chart = self;
                    draw.axis = _axis[axisIndex];
                    draw.widget = draws[i];

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

        function resetCustomEvent(self) {
            for(var i = 0; i < _handler.length; i++) {
                self.off(_handler[i]);
            }

            _handler = [];
        }

        function createGradient(self, obj, hashKey) {
            if(!_.typeCheck("undefined", hashKey) && _hash[hashKey]) {
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

            if(!_.typeCheck("undefined", hashKey)) {
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

        function setThemeStyle(theme, options) {
            if(_.typeCheck("string", theme)) {
                _theme = _.extend(jui.include("chart.theme." + theme), options);
            } else if(_.typeCheck("object", theme)) {
                _theme = _.extend(_theme, theme);
            }
        }

        function setDefaultOptions(self) {
            // 일부 옵션을 제외하고 클론
            _options = _.deepClone(self.options, { data: true, bind: true });

            var padding = _options.padding;

            // 패딩 옵션 설정
            if(padding == "empty") {
                _padding = { left: 0, right: 0, bottom: 0, top: 0 };
            } else {
                if(_.typeCheck("integer", padding)) {
                    _padding = { left: padding, right: padding, bottom: padding, top: padding };
                } else {
                    _padding = padding;
                }
            }

            // UI 바인딩 설정
            if(_options.bind) {
                self.bindUI(_options.bind);
            }

            if(!_.typeCheck("array", _options.axis)) {
                _options.axis = [ _options.axis ];
            }

            if(!_.typeCheck("array", _options.brush)) {
                _options.brush = [ _options.brush ];
            }

            if(!_.typeCheck("array", _options.widget)) {
                _options.widget = [ _options.widget ];
            }
        }

        this.init = function() {
            // 기본 옵션 설정
            setDefaultOptions(this);

            // 차트 테마 설정 (+옵션 스타일)
            setThemeStyle(_options.theme, _options.style);

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
         * 차트의 구성요소 반환
         *
         * @param key (axis | brush | widget)
         */
        this.get = function(type, key) {
            var obj = {
                axis: _axis,
                brush: _brush,
                widget: _widget,
                series: _series
            };

            if(obj[type][key]) {
                return obj[type][key];
            }

            return obj[type] || obj;
        }

        /**
         * 차트의 영역요소 반환
         *
         * @param key (width | height | x | y | x2 | y2)
         * @returns {*}
         */

        this.area = function(key) {
            if(_panel) {
                return _.typeCheck("undefined", _panel[key]) ? _panel : _panel[key];
            } else {
                return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
            }
        }

        /**
         * 차트의 여백요소 반환
         * @param key (top | left | bottom | right)
         * @returns {*}
         */
        this.padding = function(key) {
            if(_padding[key]) {
                return _padding[key];
            }

            return _padding;
        }

        /**
         * 브러쉬 컬러 관련 함수
         *
         * @param dataIndex
         * @param brush
         * @returns {*}
         */
        this.color = function(i, brush) {
            var color;

            // 테마 & 브러쉬 옵션 컬러 설정
            if(brush.colors instanceof Array) {
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
            var el = this.svg.text(_.extend({
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
            if(!_.typeCheck("string", type)  || !_.typeCheck("function", callback)) return;

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
            resetCustomEvent(this);

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawAxis(this);
            drawBrush(this);
            drawWidget(this, isAll);

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
                axis.origin = data;
            } else {
                axis.origin = axis.data || [];
            }

            axis.buffer = axis.buffer || 10000;
            axis.shift = axis.shift || 1;
            axis.page = 1;
            axis.start = 0;
            axis.end = 0;

            this.page(axis.page);
        }

        this.page = function(pNo) {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.origin,
                limit = axis.buffer,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if(pNo < 1) {
                axis.page = 1;
            } else {
                axis.page = (pNo > maxPage) ? maxPage : pNo;
            }

            axis.start = (axis.page - 1) * limit, axis.end = axis.start + limit;

            // 마지막 페이지 처리
            if(axis.end > dataList.length) {
                axis.start = dataList.length - limit;
                axis.end = dataList.length;
            }

            if(axis.end <= dataList.length) {
                axis.start = (axis.start < 0) ? 0 : axis.start;
                axis.data = dataList.slice(axis.start, axis.end);

                if(this.isRender()) this.render();
                if(dataList.length > 0) axis.page++;
            }
        }

        this.next = function() {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.origin,
                limit = axis.buffer,
                step = axis.shift;

            axis.start += step;

            var isLimit = (axis.start + limit > dataList.length);

            axis.end = (isLimit) ? dataList.length : axis.start + limit;
            axis.start = (isLimit) ? dataList.length - limit : axis.start;
            axis.start = (axis.start < 0) ? 0 : axis.start;
            axis.data = dataList.slice(axis.start, axis.end);

            if(this.isRender()) this.render();
        }

        this.prev = function() {
            var axis = _options.axis[_options.axisIndex];
            if(!axis) return;

            var dataList = axis.origin,
                limit = axis.buffer,
                step = axis.shift;

            axis.start -= step;

            var isLimit = (axis.start < 0);

            axis.end = (isLimit) ? limit : axis.start + limit;
            axis.start = (isLimit) ? 0 : axis.start;
            axis.data = dataList.slice(axis.start, axis.end);

            if(this.isRender()) this.render();
        }

        this.zoom = function(start, end) {
            var axis = _options.axis[_options.axisIndex];
            if(!axis || start == end) return;

            var dataList = axis.origin;
            axis.end = (end > dataList.length) ? dataList.length : end;
            axis.start = (start < 0) ? 0 : start;
            axis.data = dataList.slice(axis.start, axis.end);

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


        /**
         * Brush & Widget & Axis 관련 메소드
         *
         */

        this.addAxis = function(axis) {
            _options.axis.push(axis);
            if(this.isRender()) this.render();
        }
        this.removeAxis = function(index) {
            _options.axis.splice(index, 1);
            if(this.isRender()) this.render();
        }
        this.updateAxis = function(index, axis) {
            _.extend(_options.axis[index], axis);
            if(this.isRender()) this.render();
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
            _.extend(_options.brush[index], brush);
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
            _.extend(_options.widget[index], widget);
            if(this.isRender()) this.render(true);
        }


        /**
         * 테마 변경 후 차트 렌더링
         *
         * @param themeName
         */
        this.setTheme = function(theme) {
            setThemeStyle(theme, _options.style);
            if(this.isRender()) this.render(true);
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
            padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            },

            // chart
            theme: "jennifer", // 기본 테마 jennifer
            style: {},
            series: {},
            brush: [],
            widget: [],
            axis: [],
            axisIndex: 0,
            bind: null,
            format: null,
            render: true,

            // csv
            csv: null,
            csvNumber: null
        }
    }

    return UI;
});
