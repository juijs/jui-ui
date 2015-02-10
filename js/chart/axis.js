jui.define("chart.axis", [ "jquery", "util.base" ], function($, _) {

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
        var _area = {};
        var _clipId = "";

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
                axis[k].orient = axis[k].orient == 'top' ? 'top' : 'bottom';
            } else if (k == 'y') {
                axis[k].orient = axis[k].orient == 'right' ? 'right' : 'left';
            } else if (k == 'c') {
                axis[k].type = axis[k].type || 'panel';
                axis[k].orient = 'custom';
            }

            // 다른 그리드 옵션을 사용함
            if(_.typeCheck("integer", axis[k].extend)) {
                _.extend(axis[k], chart.options.axis[axis[k].extend][k], true);
            }

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
                 elem.root.translate(chart.area('x') + self.area("x") - axis[k].dist, chart.area('y'));
            } else if(axis[k].orient == "right") {
                elem.root.translate(chart.area('x') + self.area("x2") + axis[k].dist, chart.area('y'));
            } else if(axis[k].orient == "bottom") {
                elem.root.translate(chart.area('x') , chart.area('y') + self.area("y2") + axis[k].dist);
            } else if(axis[k].orient == "top") {
                elem.root.translate(chart.area('x') , chart.area('y') + self.area("y") - axis[k].dist);
            } else {
                // custom
                if(elem.root) elem.root.translate(chart.area('x') + self.area("x"), chart.area('y') + self.area('y'));
            }

            elem.scale.type = axis[k].type;

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

            // Grid 및 Area 설정
            self.reload(cloneAxis);
        }
        
        function createClipPath() {
            if (self.clipPath) {
                self.clipPath.remove();
                self.clipPath = null;
            }
            
            _clipId = _.createId("clip-id-");
            
            self.clipPath = chart.svg.clipPath({
                id: _clipId
            }, function() {
                chart.svg.rect({
                    x: _area.x,
                    y: _area.y,
                    width: _area.width,
                    height: _area.height
                });
            });
            
            chart.addDefs(self.clipPath);
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

            _area = caculatePanel(_.extend(options.area, {
                x: 0, y: 0 , width: area.width, height: area.height
            }, true), options.padding || {});

            this.x = drawGridType(this, "x");
            this.y = drawGridType(this, "y");
            this.c = drawGridType(this, "c");
            
            createClipPath();
        }

        /**
         * @method getClipId 
         * 
         * axis 의 clipId 를 가지고 온다.  
         * brush core 에서 자신의 영역을 클립하기 위해서 사용한다.
         *  
         * @returns {string}
         */
        this.getClipId = function() {
            return _clipId;
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
         *  *  
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
            /** @cfg {chart.grid.core} [x=null]  x축 그리드 */
            x: null,
            /** @cfg {chart.grid.core} [y=null]  y축 그리드 */
            y: null,
            /** @cfg {chart.grid.core} [c=null]  커스텀 그리드 */
            c: null,
            /** @cfg {Array} [data=[]]  Axis 에서 사용할 data  */
            data: [],
            /** @cfg {Array} [origin=[]]  원본 data  */
            origin: [],
            /** @cfg {Object} [keymap={}] 데이터 키-맵 */
            keymap: {},
            /** @cfg {Object} [area={}]  Axis 의 위치,크기 정의 */
            area: {},
            /** @cfg {Object} [padding={}] Axis 의 패딩 설정 */
            padding : {},
            /** @cfg {Number} [buffer=10000]  page 당 표시할 데이타 개수  */
            buffer: 10000,
            /** @cfg {Number} [shift=1]  prev, next 로 이동할 때 이동하는 데이타 개수  */
            shift: 1,
            /** @cfg {Number} [page=1]  현재 표시될 페이지 */
            page: 1
        }
    }

    return Axis;
});
