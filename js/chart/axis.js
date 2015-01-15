jui.define("chart.axis", [ "jquery", "util.base" ], function($, _) {

    var Axis = function(chart, originAxis, cloneAxis) {
        var self = this;

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
            _.extend(self, cloneAxis);

            // 원본 데이터 설정
            self.origin = self.data;

            page(1);
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

        this.x = function(value) {}
        this.y = function(value) {}
        this.c = function(value) {}

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
            page: 1,
            start: 0,
            end: 0
        }
    }

    return Axis;
});
