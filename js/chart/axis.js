jui.define("chart.axis", [ "jquery", "util.base", "util.math" ], function($, _, math) {

    /**
     * @class chart.axis
     *
     * Axis 를 관리하는 클래스
     *
     * * x 축
     * * y 축
     * * area { x, y, width, height}
     * * data Axis 에 적용될 데이타
     *
     */
    var Axis = function(chart, originAxis, cloneAxis) {
        var self = this;
        var _area = {}, _padding = {},
            _clipId = "", _clipPath = null;

        function caculatePanel(a, padding) {

            a.x = getRate(a.x, chart.area('width'));
            a.y = getRate(a.y, chart.area('height'));
            a.width = getRate(a.width, chart.area('width'));
            a.height = getRate(a.height, chart.area('height'));

            a.x2 = a.x + a.width;
            a.y2 = a.y + a.height;
            
            // 패딩 개념 추가 
            a.x += padding.left || 0;
            a.y += padding.top || 0;
            
            a.x2 -= padding.right || 0;
            a.y2 -= padding.bottom || 0;
            
            a.width = a.x2 - a.x;
            a.height = a.y2 - a.y;

            return a;
        }

        function getRate(value, max) {
            if(_.typeCheck("string", value) && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }

        function drawGridType(axis, k) {
            if((k == "x" || k == "y") && !_.typeCheck("object", axis[k])) return null;

            // 축 위치 설정
            axis[k] = axis[k]  || {};

            if (k == "x") {
                axis[k].orient = axis[k].orient == "top" ? "top" : "bottom";
            } else if (k == "y") {
                axis[k].orient = axis[k].orient == "right" ? "right" : "left";
            } else if (k == "c") {
                axis[k].type = axis[k].type || "panel";
                axis[k].orient = "custom";
            }

            // 다른 그리드 옵션을 사용함
            /*/
            if(_.typeCheck("integer", axis[k].extend)) {
                _.extend(axis[k], chart.options.axis[axis[k].extend][k], true);
            }
            /**/

            axis[k].type = axis[k].type || "block";
            var Grid = jui.include("chart.grid." + axis[k].type);

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
                 elem.root.translate(chart.area("x") + self.area("x") - axis[k].dist, chart.area("y"));
            } else if(axis[k].orient == "right") {
                elem.root.translate(chart.area("x") + self.area("x2") + axis[k].dist, chart.area("y"));
            } else if(axis[k].orient == "bottom") {
                elem.root.translate(chart.area("x") , chart.area("y") + self.area("y2") + axis[k].dist);
            } else if(axis[k].orient == "top") {
                elem.root.translate(chart.area("x") , chart.area("y") + self.area("y") - axis[k].dist);
            } else {
                // custom
                if(elem.root) elem.root.translate(chart.area("x") + self.area("x"), chart.area("y") + self.area("y"));
            }

            elem.scale.type = axis[k].type;
            elem.scale.root = elem.root;

            return elem.scale;
        }
        
        function page(pNo) {
            var dataList = self.origin,
                limit = self.buffer,
                maxPage = Math.ceil(dataList.length / limit);

            // 최소 & 최대 페이지 설정
            if(pNo < 1) {
                self.page = 1;
            } else {
                self.page = (pNo > maxPage) ? maxPage : pNo;
            }

            self.start = (self.page - 1) * limit, self.end = self.start + limit;

            // 마지막 페이지 처리
            if(self.end > dataList.length) {
                self.start = dataList.length - limit;
                self.end = dataList.length;
            }

            if(self.end <= dataList.length) {
                self.start = (self.start < 0) ? 0 : self.start;
                self.data = dataList.slice(self.start, self.end);

                if(dataList.length > 0) self.page++;
            }
        }

        function createClipPath() {
            if (_clipPath) {
                _clipPath.remove();
                _clipPath = null;
            }

            _clipId = _.createId("clip-id-");

            _clipPath = chart.svg.clipPath({
                id: _clipId
            }, function() {
                chart.svg.rect({
                    x: _area.x,
                    y: _area.y,
                    width: _area.width,
                    height: _area.height
                });
            });

            chart.appendDefs(_clipPath);
        }

        function setAxisMouseEvent() {
            var isMouseOver = false;

            chart.on("chart.mousemove", function(e) {
                if(self.checkAxisPoint(e)) {
                    if(!isMouseOver) {
                        chart.emit("chart.mouseover", [ e, cloneAxis.index ]);
                        isMouseOver = true;
                    }
                } else {
                    if(isMouseOver) {
                        chart.emit("chart.mouseout", [ e, cloneAxis.index ]);
                        isMouseOver = false;
                    }
                }
            });
        }

        function init() {
            _.extend(self, {
                data : cloneAxis.data,
                origin : cloneAxis.origin,
                buffer : cloneAxis.buffer,
                shift : cloneAxis.shift,
                page : cloneAxis.page
            });

            // 원본 데이터 설정
            self.origin = self.data;

            // 페이지 초기화
            page(1);

            // 엑시스 이벤트 설정
            setAxisMouseEvent();

            // Grid 및 Area 설정
            self.reload(cloneAxis);
        }
        
        this.checkAxisPoint = function(e) {
            var top = this.padding("top") + this.area("y"),
                left = this.padding("left") + this.area("x");

            if((e.chartY > top && e.chartY < top + this.area("height")) &&
                (e.chartX > left && e.chartX < left + this.area("width"))) {
                return true;
            }

            return false;
        }

        /**
         * @method getValue
         *
         * 특정 필드의 값을 맵핑해서 가지고 온다.
         *
         * @param {Object} data row data
         * @param {String} fieldString 필드 이름
         * @param {String/Number/Boolean/Object} [defaultValue=''] 기본값
         * @return {Mixed}
         */
        this.getValue = function(data, fieldString, defaultValue) {
            var value = data[cloneAxis.keymap[fieldString]];
            if (!_.typeCheck("undefined", value)) {
                return value;
            }

            value = data[fieldString];
            if (!_.typeCheck("undefined", value)) {
                return value;
            }
            
            return defaultValue;
        }

        /**
         * @method reload
         * 
         * Axis 의 x,y,z 축을 다시 생성한다. 
         * * * 
         * @param {Object} options
         */
        this.reload = function(options) {
            var area = chart.area();

            _.extend(this, {
                x : options.x,
                y : options.y,
                c : options.c
            });

            // 패딩 옵션 설정
            if(_.typeCheck("integer", options.padding)) {
                _padding = { left: options.padding, right: options.padding, bottom: options.padding, top: options.padding };
            } else {
                _padding = options.padding;
            }

            _area = caculatePanel(_.extend(options.area, {
                x: 0, y: 0 , width: area.width, height: area.height
            }, true), _padding);

            this.x = drawGridType(this, "x");
            this.y = drawGridType(this, "y");
            this.c = drawGridType(this, "c");
            
            createClipPath();
        }

        /**
         * @method area
         *
         * Axis 의 표시 영역을 리턴한다. 
         *  
         * @param {"x"/"y"/"width"/'height"/null} key  area's key
         * @return {Number/Object} key 가 있으면 해당 key 의 value 를 리턴한다. 없으면 전체 area 객체를 리턴한다.
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
         * @method get
         *
         * Axis 의 옵션 정보를 리턴한다.
         *
         * @param key
         */
        this.get = function(type) {
            var obj = {
                area: _area,
                padding: _padding,
                clipId: _clipId
            };

            return obj[type] || cloneAxis[type];
        }

        /**
         * @method updateGrid 
         * 
         * grid 정보를 업데이트 한다.  
         *  
         * @param {"x"/"y"/"c"} type
         * @param {Object} grid
         */
        this.updateGrid = function(type, grid) {
            _.extend(originAxis[type], grid);
            if(chart.isRender()) chart.render();
        }

        /**
         * @method update 
         * 
         * data 를 업데이트 한다.
         *  
         * @param {Array} data
         */
        this.update = function(data) {
            this.origin = data;
            this.page = 1;
            this.start = 0;
            this.end = 0;

            this.screen(1);
        }

        /**
         * @method screen 
         * 
         * 화면상에 보여줄 데이타를 페이징한다.  
         *  
         * @param {Number} pNo 페이지 번호 
         */
        this.screen = function(pNo) {
            page(pNo);

            if(this.end <= this.origin.length) {
                if(chart.isRender()) chart.render();
            }
        }

        /**
         * @method next 
         * 
         */
        this.next = function() {
            var dataList = this.origin,
                limit = this.buffer,
                step = this.shift;

            this.start += step;

            var isLimit = (this.start + limit > dataList.length);

            this.end = (isLimit) ? dataList.length : this.start + limit;
            this.start = (isLimit) ? dataList.length - limit : this.start;
            this.start = (this.start < 0) ? 0 : this.start;
            this.data = dataList.slice(this.start, this.end);

            if(chart.isRender()) chart.render();
        }

        /**
         * @method prev  
         */
        this.prev = function() {
            var dataList = this.origin,
                limit = this.buffer,
                step = this.shift;

            this.start -= step;

            var isLimit = (this.start < 0);

            this.end = (isLimit) ? limit : this.start + limit;
            this.start = (isLimit) ? 0 : this.start;
            this.data = dataList.slice(this.start, this.end);

            if(chart.isRender()) chart.render();
        }

        /**
         * @method zoom 
         * 
         * 특정 인덱스의 영역으로 데이타를 다시 맞춘다.
         *
         * @param {Number} start
         * @param {Number} end
         */
        this.zoom = function(start, end) {
            if(start == end) return;

            var dataList = this.origin;
            this.end = (end > dataList.length) ? dataList.length : end;
            this.start = (start < 0) ? 0 : start;
            this.data = dataList.slice(this.start, this.end);

            if(chart.isRender()) chart.render();
        }

        init();
    }

    Axis.setup = function() {

        return {
            /** @cfg {Integer} [extend=null]  Configures the index of an applicable grid group when intending to use already configured axis options. */
            extend: null,

            /** @cfg {chart.grid.core} [x=null] Sets a grid on the X axis (see the grid tab). */
            x: null,
            /** @cfg {chart.grid.core} [y=null]  Sets a grid on the Y axis (see the grid tab). */
            y: null,
            /** @cfg {chart.grid.core} [c=null] Sets a grid on the C axis (see the grid tab). */
            c: null,
            /** @cfg {Array} [data=[]]  Sets the row set data which constitute a chart.  */
            data: [],
            /** @cfg {Array} [origin=[]]  [Fore read only] Original data initially set. */
            origin: [],
            /** @cfg {Object} [keymap={}] grid's data key map  */
            keymap: {},
            /** @cfg {Object} [area={}]  set area(x, y, width, height) of axis */
            area: {},
            /**
             * @cfg  {Object} padding axis padding
             * @cfg  {Number} [padding.top=0] axis's top padding
             * @cfg  {Number} [padding.bottom=0] axis's bottom padding
             * @cfg  {Number} [padding.left=0] axis's left padding
             * @cfg  {Number} [padding.right=0] axis's right padding
             */
            padding : {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            /** @cfg {Number} [buffer=10000] Limits the number of elements shown on a chart.  */
            buffer: 10000,
            /** @cfg {Number} [shift=1]  Data shift count for the 'prev' or 'next' method of the chart builder.  */
            shift: 1,
            /** @cfg {Number} [page=1]  [For read only] Page number of the data currently drawn. */
            page: 1,

            /** @cfg {Number} [degree=0]  Set degree of 3d chart */
            degree: 0,
            /** @cfg {Number} [depth=0]  Set depth of 3d chart  */
            depth: 0
        }
    }

    return Axis;
});
