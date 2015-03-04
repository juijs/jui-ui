jui.defineUI("chartx.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    /**
     * @class chartx.realtime
     *
     * 리얼타임 차트 구현
     *
     * @extends core
     */
    var UI = function() {
        var axis = null,
            interval = null,
            dataList = [];

        function runningChart(self) {
            var opts = self.options,
                domain = initDomain(self);

            for(var i = 0; i < dataList.length; i++) {
                if(dataList[i][opts.axis.key].getTime() <= domain[0].getTime()) {
                    dataList.splice(i, 1);
                } else {
                    break;
                }
            }

            axis.updateGrid("x", {
                domain: domain
            });

            axis.update(dataList);
        }

        function initDomain(self) {
            var end = new Date(),
                start = time.add(end, time.minutes, -self.options.period);

            return [ start, end ];
        }

        function getOptions(self) {
            var options = {},
                excepts = [ "interval", "period", "axis" ];

            for(var key in self.options) {
                if($.inArray(key, excepts) == -1) {
                    options[key] = self.options[key];
                }
            }

            return options;
        }

        this.init = function() {
            var opts = this.options,
                target = (_.typeCheck("array", opts.brush)) ? opts.brush[0].target : opts.brush.target;

            var axis_domain = target;

            if(_.typeCheck("array", target )) {
                axis_domain = (function(target) {
                    return function(d) {
                        var arr = [];
                        for(var i = 0; i < target.length ;i++) {
                            arr.push(d[target[i]]);
                        }

                        return arr;
                    }
                })(target);
            }

            this.chart = builder(this.selector, _.extend({
                axis : {
                    x : {
                        type : "date",
                        domain : initDomain(this),
                        step : [ time.minutes, opts.axis.xstep ],
                        realtime : true,
                        format : opts.axis.format,
                        key : opts.axis.key,
                        line : opts.axis.xline,
                        hide : opts.axis.xhide
                    },
                    y : {
                        type : "range",
                        domain : (opts.axis.domain != null) ? opts.axis.domain : axis_domain,
                        step : opts.axis.ystep,
                        line : opts.axis.yline,
                        hide : opts.axis.yhide
                    },
                    buffer: opts.period * 60
                }
            }, getOptions(this)));

            // 기본 엑시스 설정
            axis = this.chart.get("axis", 0);

            // 초기값 설정
            if(opts.axis.data.length > 0) {
                this.update(opts.axis.data);
            }

            // 리얼타임 그리드 시작
            this.start();
        }

        this.update = function(data) {
            dataList = data;
            axis.update(dataList);
        }

        this.clear = function() {
            dataList = [];
            axis.update([]);
        }

        this.reset = function() {
            this.clear();
            this.stop();
        }

        this.append = function(data) {
            var newData = data;

            if(!_.typeCheck("array", data)) {
                newData = [ data ];
            }

            dataList = dataList.concat(newData);
        }

        this.start = function() {
            if(interval != null) return;

            var self = this;
            interval = setInterval(function () {
                runningChart(self);
            }, this.options.interval * 1000);
        }

        this.stop = function() {
            if(interval == null) return;

            clearInterval(interval);
            interval = null;
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

            /**
             * @cfg {Object} axis  Determines a axis to be added to a chart
             * @cfg {Array/Function/String} [domain=null]
             * @cfg {String} [format="hh:mm"]
             * @cfg {String} [key="time"]
             * @cfg {Number} [xstep=1] Set a step of x grid(date).
             * @cfg {Number} [ystep=10] Set a step of y grid(range).
             * @cfg {Boolean} [xline=true] Set a line option of x grid.
             * @cfg {Boolean} [yline=true] Set a line option of y grid.
             * @cfg {Boolean} [xhide=true] Set a hide option of x grid.
             * @cfg {Boolean} [yhide=true] Set a hide option of y grid.
             * @cfg {Array} [data=[]] Sets the row set data which constitute a chart.
             */
            axis : {
                domain : null,
                format : "hh:mm",
                key : "time",
                xstep : 1, // x축 분 간격
                ystep : 10,
                xline : true,
                yline : true,
                xhide : false,
                yhide : false,
                data : []
            },

            /** @cfg {Number} [interval=1] Set moving time interval(in seconds) */
            interval : 1, // second

            /** @cfg {Number} [period=1] set interval for realtime (in minute)*/
            period : 5 // minute
        }
    }

    return UI;
});