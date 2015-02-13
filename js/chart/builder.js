jui.defineUI("chart.builder", [ "jquery", "util.base", "util.svg", "util.color", "chart.axis" ],
    function($, _, SVGUtil, ColorUtil, Axis) {

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

                if(!ui_list[j].isRender()) {
                    ui_list[j].render(true);
                }
            }
        }

        win_width = $(window).width();
    }, 300);


    /**
     * @class chart.builder
     *
     * implements chart builder
     *
     * @extends core
     * @alias ChartBuilder
     * @requires util.base
     * @requires util.svg
     * @requires util.color
     * @requires jquery
     *
     */
    var UI = function() {
        var _axis = [], _brush = [], _widget = [], _defs = null;
        var _padding, _series, _area,  _theme, _hash = {};
        var _initialize = false, _options = null, _handler = { render: [], renderAll: [] }; // 리셋 대상 커스텀 이벤트 핸들러
        var _scale = 1, _xbox = 0, _ybox = 0; // 줌인/아웃, 뷰박스X/Y 관련 변수

        /**
         * @method caculate
         * 
         * chart 기본 영역 계산
         *
         * padding 을 제외한 영역에서  x,y,x2,y2,width,height 속성을 구함
         *
         * 기본적으로 모든 브러쉬와 그리드는 계산된 영역안에서 그려짐
         *
         * @param {chart.builder} self
         * @private  
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

        /**
         * @method drawBefore 
         * 
         * option copy (series, brush, widget)
         *  
         * @param {chart.builder} self
         * @private  
         */
        function drawBefore(self) {
            _series = _.deepClone(_options.series);
            _brush = _.deepClone(_options.brush);
            _widget = _.deepClone(_options.widget);

            // 해쉬 코드 초기화
            _hash = {};
        }

        /**
         * @method drawDefs
         * define svg default pattern, clipPath, Symbol  
         * @param {chart.builder} self
         * @private
         */
        function drawDefs(self) {
            _defs = self.svg.defs();
        }
        
        function addDefs(dom) {
            _defs.append(dom);
            
        }

        /**
         * @method drawAxis 
         * implements axis draw 
         * @param {chart.builder} self 
         * @private
         */
        function drawAxis(self) {

            // 엑시스 리스트 얻어오기
            var axisList = _.deepClone(_options.axis, { data : true, origin : true });

            for(var i = 0; i < axisList.length; i++) {
                jui.defineOptions(Axis, axisList[i]);

                if(!_axis[i]) {
                    _axis[i] = new Axis(self, _options.axis[i], axisList[i]);
                } else {
                    _axis[i].reload(axisList[i]);
                }

            }
        }

        /**
         * @method drawBrush
         * brush 그리기
         *
         * brush 에 맞는 x, y 축(grid) 설정
         * @private
         */
        function drawBrush(self) {
            var draws = _brush;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.brush." + draws[i].type);

                    // 브러쉬 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);
                    var axis = _axis[draws[i].axis];

                    // 타겟 프로퍼티 설정
                    if(!draws[i].target) {
                        var target = [];

                        if(axis) {
                            for(var key in axis.data[0]) {
                                target.push(key);
                            }
                        }

                        draws[i].target = target;
                    } else if(_.typeCheck("string", draws[i].target)) {
                        draws[i].target = [ draws[i].target ];
                    }

                    // 브러쉬 인덱스 설정
                    draws[i].index = i;

                    // 브러쉬 기본 프로퍼티 정의
                    var draw = new Obj(self, axis, draws[i]);
                    draw.chart = self;
                    draw.axis = axis;
                    draw.brush = draws[i];

                    // 브러쉬 렌더링
                    draw.render();
                }
            }
        }

        /**
         * @method drawWidget 
         * implements widget draw 
         *  
         * @param {chart.builder} self
         * @param {Boolean} isAll  whether redraw widget 
         * @private  
         */
        function drawWidget(self, isAll) {
            var draws = _widget;

            if(draws != null) {
                for(var i = 0; i < draws.length; i++) {
                    var Obj = jui.include("chart.widget." + draws[i].type);

                    // 위젯 기본 옵션과 사용자 옵션을 합침
                    jui.defineOptions(Obj, draws[i]);

                    // 위젯 인덱스 설정
                    draws[i].index = i;

                    // 위젯 기본 프로퍼티 정의
                    var brush = _brush[_.typeCheck("array", draws[i].brush) ? draws[i].brush[0] : draws[i].brush],
                        draw = new Obj(self, _axis[brush.axis], draws[i]);

                    draw.chart = self;
                    draw.axis = _axis[brush.axis];
                    draw.widget = draws[i];

                    // 위젯은 렌더 옵션이 false일 때, 최초 한번만 로드함 (연산 + 드로잉)
                    // 하지만 isAll이 true이면, 강제로 연산 및 드로잉을 함 (테마 변경 및 리사이징 시)
                    if(_initialize && !draw.isRender() && isAll !== true) {
                        return;
                    }

                    var elem = draw.render();
                    if(!draw.isRender()) {
                        self.svg.autoRender(elem, false);
                    }
                }
            }
        }

        /**
         * @method setChartEvent
         * define chart custom event
         * @param {chart.builder} self
         * @private
         */
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

                e.bgX = (offsetX + _xbox) / _scale;
                e.bgY = (offsetY + _ybox) / _scale;
                e.chartX = (offsetX - self.padding("left") + _xbox) / _scale;
                e.chartY = (offsetY - self.padding("top") + _ybox) / _scale;

                if(e.chartX < 0) return;
                if(e.chartX > self.area("width")) return;
                if(e.chartY < 0) return;
                if(e.chartY > self.area("height")) return;

                return true;
            }
        }

        function resetCustomEvent(self, isAll) {
            for(var i = 0; i < _handler.render.length; i++) {
                self.off(_handler.render[i]);
            }
            _handler.render = [];

            if(isAll === true) {
                for(var i = 0; i < _handler.renderAll.length; i++) {
                    self.off(_handler.renderAll[i]);
                }
                _handler.renderAll = [];
            }
        }

        function createGradient(self, obj, hashKey) {
            if(!_.typeCheck("undefined", hashKey) && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var g = null,
                id = _.createId("gradient");

            obj.attr.id = id;

            g = SVGUtil.createElement(obj);

            _defs.append(g);

            if(!_.typeCheck("undefined", hashKey)) {
                _hash[hashKey] = id;
            }

            return "url(#" + id + ")";
        }
        
        function createPattern(self, obj) {
            if (_.typeCheck("string", obj)) {
                obj = obj.replace("url(#", "").replace(")", "");

                if(_hash[obj]) {
                    return "url(#" + obj + ")";
                }
                
                // already pattern id 
                if (obj.indexOf('pattern-') == -1) {
                    return false
                }

                var arr = obj.split("-"),
                    method = arr.pop();

                var pattern = jui.include("chart." + arr.join("."));
                
                if (!pattern) {
                    return false;
                }

                var patternElement = pattern[method];
                
                if (typeof patternElement == 'function') {
                    patternElement = patternElement.call(patternElement);
                }

                // json 객체를 svg element 로 변환
                if (patternElement.attr && !patternElement.attr.id) {
                    patternElement.attr.id = obj;
                }

                patternElement = SVGUtil.createElement(patternElement);

                _defs.append(patternElement);
                
                _hash[obj] = obj;
                
                return "url(#" + obj + ")";
                
            } else {
                obj.attr.id = obj.attr.id || _.createId('pattern-');

                if (_hash[obj.attr.id]) {
                    return "url(#" + obj.attr.id + ")";
                }                
                
                var patternElement = SVGUtil.createElement(obj);
                
                _defs.append(patternElement);
                
                _hash[obj.attr.id] = obj.attr.id;
                
                return "url(#" + obj.attr.id + ")";
            }
        }

        function createColor(self, color) {
            if(_.typeCheck("undefined", color)) {
                return "none";
            }

            if(_.typeCheck("object", color)) {
                
                if (color.type == 'pattern') {
                    return createPattern(self, color);
                } else {
                    return createGradient(self, color);
                }
            }
            
            if (typeof color == 'string') {
                var url = createPattern(self, color);
                if (url) {
                    return url; 
                }
            }

            var parsedColor = ColorUtil.parse(color);
            if(parsedColor == color)
                return color;

            return createGradient(self, parsedColor, color);
        }

        function setThemeStyle(theme) {
            var style = {},
                newStyle = {};

            // 테마를 하나의 객체로 Merge
            if(_.typeCheck("string", theme)) {
                _.extend(style, jui.include("chart.theme." + theme));
            } else if(_.typeCheck("object", theme)) {
                _.extend(style, theme);
            }

            // 빌더 스타일 옵션 Merge
            _.extend(style, _options.style);

            // 최종 렌더링에 적용되는 객체
            _theme = _.extend(newStyle, style);
        }

        function setDefaultOptions(self) {
            // 일부 옵션을 제외하고 클론
            _options = _.deepClone(self.options, { data: true, bind: true });

            var padding = _options.padding;

            // 패딩 옵션 설정
            if(_.typeCheck("integer", padding)) {
                _padding = { left: padding, right: padding, bottom: padding, top: padding };
            } else {
                _padding = padding;
            }

            // UI 바인딩 설정 (차후에 변경, 현재는 첫번째 엑시스로 고정)
            if(_.typeCheck("object", _options.bind)) {
                self.bindUI(0, _options.bind);
            }

            // Draw 옵션 설정
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

        function setChartIcons(self) {
            var icon = _options.icon;
            if(!_.typeCheck("string", icon.path)) return;

            var iconList = [
                "url(" + icon.path + ".eot) format('embedded-opentype')",
                "url(" + icon.path + ".woff) format('woff')",
                "url(" + icon.path + ".ttf) format('truetype')",
                "url(" + icon.path + ".svg) format('svg')"
            ],
            fontFace = "font-family: " + icon.type + "; font-weight: normal; font-style: normal; src: " + iconList.join(",");

            (function(rule) {
                var sheet = (function() {
                    var style = document.createElement("style");

                    style.appendChild(document.createTextNode(""));
                    document.head.appendChild(style);

                    return style.sheet;
                })();

                sheet.insertRule(rule, 0);
            })("@font-face {" + fontFace + "}");
        }

        this.init = function() {
            // 기본 옵션 설정
            setDefaultOptions(this);

            // 차트 테마 설정 (+옵션 스타일)
            setThemeStyle(_options.theme);

            // svg 기본 객체 생성
            this.svg = new SVGUtil(this.root, {
                width: _options.width,
                height: _options.height,
                "buffered-rendering" : "dynamic"
            });

            // 차트 기본 렌더링
            this.render();

            // 차트 이벤트 설정
            setChartEvent(this);

            // 아이콘 폰트 설정
            setChartIcons(this);
        }
        
        this.addDefs = function(dom) {
            addDefs(dom);
        }

        /**
         * @method get  
         * get option's property of chart builder 
         *
         * @param {String} type "axis", "brush", "widget", "series", "padding", "area"
         * @param {String} key  property name
         */
        this.get = function(type, key) {
            var obj = {
                axis: _axis,
                brush: _brush,
                widget: _widget,
                series: _series,
                padding: _padding,
                area: _area
            };

            if(obj[type][key]) {
                return obj[type][key];
            }

            return obj[type] || obj;
        }

        /**
         * 차트의 엑시스 객체를 반환
         *
         * @param key
         * @returns {Array}
         */
        this.axis = function(key) {
            return _.typeCheck("undefined", _axis[key]) ? _axis : _axis[key];
        }

        /**
         * 차트의 영역 요소 반환
         *
         * @param key (width | height | x | y | x2 | y2)
         * @returns {*}
         */
        this.area = function(key) {
            return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
        }

        /**
         * 차트의 여백 요소 반환
         * @param key (top | left | bottom | right)
         * @returns {*}
         */
        this.padding = function(key) {
            return _.typeCheck("undefined", _padding[key]) ? _padding : _padding[key];
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

            return createColor(this, color);
        }

        /**
         * 아이콘 유니코드를 가져오는 함수
         *
         * @param key
         */
        this.icon = function(key) {
            return jui.include("chart.icon." + _options.icon.type)[key];
        }

        /**
         * 텍스트 엘리먼트 생성하는 함수, 아이콘 키를 유니코드로 자동으로 파싱해준다.
         *
         * @param {object} attr
         * @param {string|function} textOrCallback
         */
        this.text = function(attr, textOrCallback) {
            if(_.typeCheck("string", textOrCallback)) {
                var regex = /{([^{}]+)}/g,
                    result = textOrCallback.match(regex);

                if(result != null) {
                    for(var i = 0; i < result.length; i++) {
                        var key = result[i].substring(1, result[i].length - 1);
                        textOrCallback = textOrCallback.replace(result[i], this.icon(key));
                    }
                }
            } else if(_.typeCheck("undefined", textOrCallback)) {
                textOrCallback = "";
            }

            return this.svg.text(attr, textOrCallback);
        }

        /**
         * @method theme
         * theme 의 요소에 대한 값 구하기
         *
         * ```
         *      // theme 전체 객체 얻어오기
         *      var theme = chart.theme();
         *      // 부분 속성 얻어오기
         *      var fontColor = chart.theme("fontColor");
         *      // 값 비교해서 얻어오기
         *      chart.theme(isSelected, "selectedFontColor", "fontColor");  // isSelected 가 true 이면 selectedFontColor, 아니면 fontColor 리턴
         * ```
         */
        this.theme = function(key, value, value2) {
            if(arguments.length == 0) {
                return _theme;
            } else if(arguments.length == 1) {
                if(key.indexOf("Color") > -1 && _theme[key] != null) {
                    return createColor(this, _theme[key]);
                }

                return _theme[key];
            } else if(arguments.length == 3) {
                var val = (key) ? value : value2;

                if(val.indexOf("Color") > -1 && _theme[val] != null) {
                    return createColor(this, _theme[val]);
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
         * @method bindUI 
         * 
         * uix.table, uix.xtable 객체를 바인딩 해서 사용할 수 있음.
         * 테이블 요소를 수정하면 chart의 data 속성으로 자동으로 설정
         *
         * @param {object} bind   uix.table, uix.xtable 객체 사용
         */
        this.bindUI = function(axisIndex, uiObj) {
            var self = this;

            if(uiObj.module.type == "uix.table") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
                uiObj.callAfter("append", updateTable);
                uiObj.callAfter("insert", updateTable);
                uiObj.callAfter("remove", updateTable);
            } else if(uiObj.module.type == "uix.xtable") {
                uiObj.callAfter("update", updateTable);
                uiObj.callAfter("sort", updateTable);
            }

            function updateTable() {
                self.axis(axisIndex).update(uiObj.listData());
            }
        }

        /**
         * @method on
         * 
         * 차트에서 사용할 커스텀 이벤트 핸들러
         *
         * @param type
         * @param callback
         */
        this.on = function(type, callback, resetType) {
            if(!_.typeCheck("string", type)  || !_.typeCheck("function", callback)) return;

            this.event.push({ type: type.toLowerCase(), callback: callback  });

            // 브러쉬나 위젯에서 설정한 이벤트 핸들러만 추가
            if(resetType == "render" || resetType == "renderAll") {
                _handler[resetType].push(callback);
            }
        }

        /**
         * 차트의 줌인/줌아웃 상태를 설정
         *
         * @param scale
         * @returns {number}
         */
        this.scale = function(scale) {
            if(!scale || scale < 0) return _scale;

            _scale = scale;
            this.svg.root.each(function(i, elem) {
                elem.scale(_scale);
            });

            return _scale;
        }

        /**
         * 차트의 보이는 영역을 변경
         *
         * @param x
         * @param y
         * @returns {{x: number, y: number}}
         */
        this.view = function(x, y) {
            var area = this.area(),
                xy = {
                    x: _xbox,
                    y: _ybox
                };

            if(Math.abs(x) > area.width || !_.typeCheck("number", x)) return xy;
            if(Math.abs(y) > area.height || !_.typeCheck("number", y)) return xy;

            _xbox = x;
            _ybox = y;

            this.svg.root.attr({
                viewBox: _xbox + " " + _ybox + " " + area.width + " " + area.height
            });

            return {
                x: _xbox,
                y: _ybox
            }
        }

        /**
         * @method render 
         *
         * chart render 함수 재정의
         *
         */
        this.render = function(isAll) {
            // SVG 메인 리셋
            this.svg.reset(isAll);

            // chart 이벤트 초기화 (삭제 대상)
            resetCustomEvent(this, isAll);

            // chart 영역 계산
            calculate(this);

            // chart 관련된 요소 draw
            drawBefore(this);
            drawDefs(this);
            drawAxis(this);
            drawBrush(this);
            drawWidget(this, isAll);

            // SVG 기본 테마 설정
            this.svg.root.css({
                "font-family": this.theme("fontFamily") + "," + _options.icon.type,
                "font-size": this.theme("fontSize"),
                fill: this.theme("fontColor"),
                background: this.theme("backgroundColor")
            });

            // SVG 메인/서브 렌더링
            this.svg.render(isAll);

            // 커스텀 이벤트 발생
            this.emit("render", [ _initialize ]);

            // 초기화 설정
            _initialize = true;
        }

        /*
         * Brush & Widget 관련 메소드
         *
         */

        /**
         * @method addBrush 
         * 
         * 동적으로 브러쉬를 추가한다. 
         *  
         * @param {Object} brush
         */
        this.addBrush = function(brush) {
            _options.brush.push(brush);
            if(this.isRender()) this.render();
        }

        /**
         * @method removeBrush 
         * 
         * 특정 브러쉬를 삭제한다. 
         * @param {Number} index
         */
        this.removeBrush = function(index) {
            _options.brush.splice(index, 1);
            if(this.isRender()) this.render();
        }
        /**
         * @method updateBrush 
         * 특정 브러쉬를 업데이트 한다.  
         * @param {Number} index
         * @param {Object} brush
         */
        this.updateBrush = function(index, brush) {
            _.extend(_options.brush[index], brush);
            if(this.isRender()) this.render();
        }

        /**
         * @method addWidget 
         * 동적으로 위젯을 추가한다. 
         * 
         * @param {Object} widget
         */
        this.addWidget = function(widget) {
            _options.widget.push(widget);
            if(this.isRender()) this.render();
        }

        /**
         * @method removeWidget 
         * 특정 위젯을 삭제한다.  
         * @param {Number} index
         */
        this.removeWidget = function(index) {
            _options.widget.splice(index, 1);
            if(this.isRender()) this.render();
        }

        /**
         * @method updateWidget
         * 특정 위젯을 업데이트한다.
         * @param {Number} index
         * @param {Object} widget
         */
        this.updateWidget = function(index, widget) {
            _.extend(_options.widget[index], widget);
            if(this.isRender()) this.render();
        }


        /**
         * 테마 변경 후 차트 렌더링
         *
         * @param themeName
         */
        this.setTheme = function(theme) {
            setThemeStyle(theme);
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
         * 차트의 자동 렌더링 여부 확인
         * false일 경우, 수동으로 render 메소드를 호출해줘야 함
         *
         * @returns {boolean}
         */
        this.isRender = function() {
            return (!_initialize) ? true : _options.render;
        }
    }

    UI.setup = function() {
        return {
            
            /** @cfg  {String/Number} [width="100%"] chart width */ 
            width: "100%", // chart 기본 넓이
            /** @cfg  {String/Number} [height="100%"] chart height */
            height: "100%", // chart 기본 높이
            /** 
             * @cfg  {Object} padding chart padding 
             * @cfg  {Number} [padding.top=50] chart padding 
             * @cfg  {Number} [padding.bottom=50] chart padding
             * @cfg  {Number} [padding.left=50] chart padding
             * @cfg  {Number} [padding.right=50] chart padding
             */
            padding: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            },

            /** @cfg  {String} [theme=jennifer] chart theme  */
            theme: "jennifer",
            /** @cfg  {Object} style chart custom theme  */
            style: {},
            /** @cfg {Object} series 각각의 필드에 대한 메타 정보 */
            series: {},
            /** @cfg {Array} brush 그려질 브러쉬 목록 */
            brush: [],
            /** @cfg {Array} widget 그려질 위젯 목록 */
            widget: [],
            /** @cfg {Array} axis 그려질 Axis 목록 */
            axis: [],

            bind: null,
            /** @cfg {Function} [format=null] 빌더에서 공통으로 사용할 format 함수 정의 */
            format: null,
            /** @cfg {Boolean} [render=true] */
            render: true,

            /** @cfg {Object} */
            icon: {
                type: "jennifer",
                path: null
            }
        }
    }

    /**
     * @event bg_click
     * 실제 이벤트 이름은 bg.click 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_click
     * 실제 이벤트 이름은 chart.click 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_rclick
     * 실제 이벤트 이름은 bg.rclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_rclick
     * 실제 이벤트 이름은 chart.rclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_dblclick
     * 실제 이벤트 이름은 bg.dblclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_dblclick
     * 실제 이벤트 이름은 chart.dblclick 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousemove
     * 실제 이벤트 이름은 bg.mousemove 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousemove
     * 실제 이벤트 이름은 chart.mousemove 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousedown
     * 실제 이벤트 이름은 bg.mousedown 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousedown
     * 실제 이벤트 이름은 chart.mousedown 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseup
     * 실제 이벤트 이름은 bg.mouseup 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseup
     * 실제 이벤트 이름은 chart.mouseup 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseover
     * 실제 이벤트 이름은 bg.mouseover 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseover
     * 실제 이벤트 이름은 chart.mouseover 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseout
     * 실제 이벤트 이름은 bg.mouseout 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseout
     * 실제 이벤트 이름은 chart.mouseout 사용된다.
     * @param {jQueryEvent} e The event object.
     */

    return UI;
});
