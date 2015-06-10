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
     * Implements chart builder
     *
     * @extends core
     * @alias ChartBuilder
     * @requires util.base
     * @requires util.svg
     * @requires util.color
     * @requires chart.axis
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
         * caculate chart's default area
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

            // defs 엘리먼트 생성
            _defs = self.svg.defs();

            // 해쉬 코드 초기화
            _hash = {};
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

                // 엑시스 인덱스 설정
                axisList[i].index = i;

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
         * @param {Boolean} isAll  Whether redraw widget
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
                    var draw = new Obj(self, _axis[0], draws[i]);
                    draw.chart = self;
                    draw.axis = _axis[0];
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

        function createGradient(obj, hashKey) {
            if(!_.typeCheck("undefined", hashKey) && _hash[hashKey]) {
                return "url(#" + _hash[hashKey] + ")";
            }

            var g = null,
                id = _.createId("gradient");

            obj.attr.id = id;

            g = SVGUtil.createObject(obj);

            _defs.append(g);

            if(!_.typeCheck("undefined", hashKey)) {
                _hash[hashKey] = id;
            }

            return "url(#" + id + ")";
        }
        
        function createPattern(obj) {
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

                patternElement = SVGUtil.createObject(patternElement);

                _defs.append(patternElement);
                
                _hash[obj] = obj;
                
                return "url(#" + obj + ")";
                
            } else {
                obj.attr.id = obj.attr.id || _.createId('pattern-');

                if (_hash[obj.attr.id]) {
                    return "url(#" + obj.attr.id + ")";
                }                
                
                var patternElement = SVGUtil.createObject(obj);
                
                _defs.append(patternElement);
                
                _hash[obj.attr.id] = obj.attr.id;
                
                return "url(#" + obj.attr.id + ")";
            }
        }

        function createColor(color) {
            if(_.typeCheck("undefined", color)) {
                return "none";
            }

            if(_.typeCheck("object", color)) {
                
                if (color.type == "pattern") {
                    return createPattern(color);
                } else {
                    return createGradient(color);
                }
            }
            
            if (typeof color == "string") {
                var url = createPattern(color);
                if (url) {
                    return url; 
                }
            }

            var parsedColor = ColorUtil.parse(color);
            if(parsedColor == color)
                return color;

            return createGradient(parsedColor, color);
        }

        function setThemeStyle(theme) {
            var style = {};

            // 테마를 하나의 객체로 Merge
            if(_.typeCheck("string", theme)) {
                _.extend(style, jui.include("chart.theme." + theme));
                _.extend(style, _options.style);
            } else if(_.typeCheck("object", theme)) {
                _.extend(_theme, _options.style);
                _.extend(_theme, theme);
                _.extend(style, _theme);
            }

            // 최종 렌더링에 적용되는 객체
            _theme = style;
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

            // Axis 확장 설정
            for(var i = 0; i < _options.axis.length; i++) {
                var axis = _options.axis[i];
                _.extend(axis, _options.axis[axis.extend], true);
            }
        }

        function setChartIcons() {
            var icon = _options.icon;
            if(!_.typeCheck([ "string", "array" ], icon.path)) return;

            var pathList = (_.typeCheck("string", icon.path)) ? [ icon.path ] : icon.path,
                urlList = [];

            for(var i = 0; i < pathList.length; i++) {
                var path = pathList[i],
                    url = "url(" + path + ") ";

                if (path.indexOf(".eot") != -1) {
                    url += "format('embedded-opentype')";
                } else if (path.indexOf(".woff") != -1) {
                    url += "format('woff')";
                } else if (path.indexOf(".ttf") != -1) {
                    url += "format('truetype')";
                } else if (path.indexOf(".svg") != -1) {
                    url += "format('svg')";
                }

                urlList.push(url);
            }

            var fontFace = "font-family: " + icon.type + "; font-weight: normal; font-style: normal; src: " + urlList.join(",");

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
            /** @property {chart.svg} svg Refers to an SVG utility object. */
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
            setChartIcons();
        }
        
        /**
         * @method get  
         *
         * Gets a named axis, brush, widget or series (type: axis, brush, widget, series, padding, area)
         *
         * @param {"axis"/"brush"/"widget"/"series"/"padding"/"area"} type
         * @param {String} key  Property name
         * @return {Mixed/Object}
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
         * Gets the axis object of that index.
         *
         * @param {Number} key
         * @returns {Array/Object}
         */
        this.axis = function(key) {
            return _.typeCheck("undefined", _axis[key]) ? _axis : _axis[key];
        }

        /**
         * Gets a calculated value for a chart area (type: width, height, x, y, x2, y2)).
         *
         * @param {String} key
         * @return {Number/Object}
         */
        this.area = function(key) {
            return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
        }

        /**
         * Gets the top, bottom, left and right margin values.
         *
         * @param {"top"/"left"/"bottom"/"right"} key
         * @return {Number/Object}
         */
        this.padding = function(key) {
            return _.typeCheck("undefined", _padding[key]) ? _padding : _padding[key];
        }

        /**
         * Gets a color defined in the theme or the color set.
         *
         * @param {Number} i
         * @param {chart.brush.core} brush
         * @return {String} Selected color string
         */
        this.color = function(i, brush) {
            var color = null;

            // 직접 색상을 추가할 경우 (+그라데이션, +필터)
            if(_.typeCheck("string", i)) {
                color = i;
            } else {
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
            }

            if(_hash[color]) {
                return "url(#" + _hash[color] + ")";
            }

            function nextColor(newIndex) {
                var c = _theme["colors"],
                    index = newIndex || i;

                return (index > c.length - 1) ? c[c.length - 1] : c[index];
            }

            return createColor(color);
        }

        /**
         * Gets the unicode string of the icon.
         *
         * @param {String} key  icon's alias
         */
        this.icon = function(key) {
            return jui.include("chart.icon." + _options.icon.type)[key];
        }

        /**
         * Creates a text element to which a theme is applied.
         *
         * Also it support icon string
         *
         * @param {Object} attr
         * @param {String|Function} textOrCallback
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
         *
         * Gets a value for the theme element applied to the current chart.
         *
         * ```
         *      // get all theme property
         *      var theme = chart.theme();
         *      // get a part of theme
         *      var fontColor = chart.theme("fontColor");
         *      // get selected value of theme
         *      chart.theme(isSelected, "selectedFontColor", "fontColor");  // if isSelected is true, return 'selectedFontColor' else return 'fontColor'
         * ```
         */
        this.theme = function(key, value, value2) {
            if(arguments.length == 0) {
                return _theme;
            } else if(arguments.length == 1) {
                if(key.indexOf("Color") > -1 && _theme[key] != null) {
                    return createColor(_theme[key]);
                }

                return _theme[key];
            } else if(arguments.length == 3) {
                var val = (key) ? value : value2;

                if(val.indexOf("Color") > -1 && _theme[val] != null) {
                    return createColor(_theme[val]);
                }

                return _theme[val];
            }
        }

        /**
         * Returns a value from the format callback function of a defined option.
         *
         * @param {Function} format
         * @return {Mixed}
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
         * Binds data used in a uix.table or the uix.xtable.
         *
         * @param {Number} axisIndex
         * @param {Object} uiObj
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
         * A callback function defined as an on method is run when an emit method is called.
         *
         * @param {String} type Event's name
         * @param {Function} callback
         * @param {"render"/"renderAll"/undefined} resetType
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
         * Change the scale of the chart.
         *
         * @param {Number} scale
         * @return {Number}
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
         * Change the view of the chart.
         *
         * @param {Number} x
         * @param {Number} y
         * @return {Object}
         * @return {Number} return.x
         * @return {Number} return.y
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
         * Renders all draw objects.
         *
         * @param {Boolean} isAll
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

        /**
         * @method appendDefs
         *
         * Add the child element in defs tag.
         *
         * @param {chart.svg.element} elem
         */
        this.appendDefs = function(elem) {
            _defs.append(elem);
        }

        /*
         * Brush & Widget 관련 메소드
         *
         */

        /**
         * @method addBrush 
         * 
         * Adds a brush and performs rendering again.
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
         * Deletes the brush of a specified index and performs rendering again.
         * @param {Number} index
         */
        this.removeBrush = function(index) {
            _options.brush.splice(index, 1);
            if(this.isRender()) this.render();
        }
        /**
         * @method updateBrush 
         * Updates the brush of a specified index and performs rendering again.
         * @param {Number} index
         * @param {Object} brush
         */
        this.updateBrush = function(index, brush) {
            _.extend(_options.brush[index], brush);
            if(this.isRender()) this.render();
        }

        /**
         * @method addWidget 
         * Adds a widget and performs rendering again.
         * 
         * @param {Object} widget
         */
        this.addWidget = function(widget) {
            _options.widget.push(widget);
            if(this.isRender()) this.render();
        }

        /**
         * @method removeWidget 
         * Deletes the widget of a specified index and performs rendering again.
         * @param {Number} index
         */
        this.removeWidget = function(index) {
            _options.widget.splice(index, 1);
            if(this.isRender()) this.render();
        }

        /**
         * @method updateWidget
         * Updates the widget of a specified index and performs rendering again
         * @param {Number} index
         * @param {Object} widget
         */
        this.updateWidget = function(index, widget) {
            _.extend(_options.widget[index], widget);
            if(this.isRender()) this.render();
        }


        /**
         * Changes a chart to a specified theme and renders the chart again.
         *
         * @param {String/Object} theme
         */
        this.setTheme = function(theme) {
            setThemeStyle(theme);
            if(this.isRender()) this.render(true);
        }

        /**
         * Changes the size of a chart to the specified area and height then performs rendering.
         *
         * @param {Number} width
         * @param {Number} height
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
         * Returns true if the horizontal or vertical size of the chart is 100%.
         *
         * @return {Boolean}
         */
        this.isFullSize = function() {
            if(_options.width == "100%" || _options.height == "100%")
                return true;

            return true;
        }

        /**
         * Returns the values of rendering options and, if the rendering option is false, does not render the chart again when a method is called.
         *
         * @return {Boolean}
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
            /** @cfg {Object} series Sets additional information for a specific data property. */
            series: {},
            /** @cfg {Array} brush Determines a brush to be added to a chart. */
            brush: [],
            /** @cfg {Array} widget Determines a widget to be added to a chart. */
            widget: [],
            /** @cfg {Array} [axis=[]] Determines a axis to be added to a chart. */
            axis: [],

            /** @cfg {Object} [bind=null] Sets a component objects to be bind.*/
            bind: null,
            /** @cfg {Function} [format=null] Sets a format callback function to be used in a grid/brush/widget. */
            format: null,
            /** @cfg {Boolean} [render=true] Does not render a chart when a rendering-related method is called with false (although the render method is not included). */
            render: true,

            /**
             * @cfg {Object} icon Icon-related settings available in the chart.
             * @cfg {String} [icon.type="jennifer"]
             * @cfg {String} [icon.path=null]
             */
            icon: {
                type: "jennifer",
                path: null
            }
        }
    }

    /**
     * @event bg_click
     * Real name ``` bg.click ```
     * Event that occurs when clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_click
     * Real name ``` chart.click ```
     * Event that occurs when clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_rclick
     * Real name ``` bg.rclick ```
     * Event that occurs when right clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_rclick
     * Real name ``` chart.rclick ```
     * Event that occurs when right clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_dblclick
     * Real name ``` bg.dblclick ```
     * Event that occurs when clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_dblclick
     * Real name ``` chart.dblclick ```
     * Event that occurs when double clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousemove
     * Real name ``` bg.mousemove```
     * Event that occurs when moving the mouse over a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousemove
     * Real name ``` chart.mousemove ```
     * Event that occurs when moving the mouse over the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mousedown
     * Real name ``` bg.mousedown ```
     * Event that occurs when left clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mousedown
     * Real name ``` chart.mousedown ```
     * Event that occurs when left clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseup
     * Real name ``` bg.mouseup ```
     * Event that occurs after left clicking on a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseup
     * Real name ``` chart.mouseup ```
     * Event that occurs after left clicking on the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseover
     * Real name ``` bg.mouseover ```
     * Event that occurs when placing the mouse over a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseover
     * Real name ``` chart.mouseover ```
     * Event that occurs when placing the mouse over the chart area.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event bg_mouseout
     * Real name ``` bg.mouseout ```
     * Event that occurs when moving the mouse out of a chart margin.
     * @param {jQueryEvent} e The event object.
     */

    /**
     * @event chart_mouseout
     * Real name ``` chart.mouseout ```
     * Event that occurs when placing the mouse over the chart area.
     * @param {jQueryEvent} e The event object.
     */

    return UI;
});
