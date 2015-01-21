jui.define("chart.axis", [ "jquery", "util.base" ], function($, _) {

    var Axis = function(chart, originAxis, cloneAxis) {
        var self = this;
        var _area = {};

        function caculatePanel(a) {
            a.x = getValue(a.x, chart.area('width'));
            a.y = getValue(a.y, chart.area('height'));
            a.width = getValue(a.width, chart.area('width'));
            a.height = getValue(a.height, chart.area('height'));

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
        
        function drawGridType(axis, k) {
            if((k == 'x' || k == 'y') && !_.typeCheck("object", axis[k])) return null;

            // 축 위치 설정
            axis[k] = axis[k]  || {};
            axis[k].orient = axis[k].orient || ((k == "x") ? "bottom" : "left");

            if (k == 'c') {
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
        
        this.reload = function(options) {
            _.extend(this, {
                x : options.x,
                y : options.y,
                c : options.c
            });

            _area = caculatePanel(_.extend(options.area, {
                x: 0, y: 0 , width: chart.area("width"), height: chart.area("height")
            }, true));

            this.x = drawGridType(this, "x");
            this.y = drawGridType(this, "y");
            this.c = drawGridType(this, "c");
        }
        
        this.area = function(key) {
            return _.typeCheck("undefined", _area[key]) ? _area : _area[key];
        }

        this.updateGrid = function(type, grid) {
            _.extend(originAxis[type], grid);
            if(chart.isRender()) chart.render();
        }

        this.update = function(data) {
            this.origin = data;
            this.page = 1;
            this.start = 0;
            this.end = 0;

            this.screen(1);
        }

        this.screen = function(pNo) {
            page(pNo);

            if(this.end <= this.origin.length) {
                if(chart.isRender()) chart.render();
            }
        }

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
            x: null,
            y: null,
            c: null,
            data: [],
            origin: [],
            area: {},
            buffer: 10000,
            shift: 1,
            page: 1
        }
    }

    return Axis;
});
