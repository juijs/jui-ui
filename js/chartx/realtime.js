jui.defineUI("chartx.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    var UI = function() {
        var interval = null,
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

            self.chart.updateAxis(0, {
                x: {
                    domain: domain
                },
                data: dataList
            });
        }

        function initDomain(self) {
            var end = new Date(),
                start = time.add(end, time.minutes, -self.options.period);

            return [ start, end ];
        }

        function getOptions(self) {
            var options = {},
                excepts = [ "interval", "period" ];

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

            this.chart = builder(this.selector, _.extend({
                axis : {
                    x : {
                        type : "date",
                        domain : initDomain(this),
                        step : [ time.minutes, opts.axis.xstep ],
                        realtime : true,
                        format : opts.axis.format,
                        key : opts.axis.key,
                        line : opts.axis.xline
                    },
                    y : {
                        type : "range",
                        target : (opts.axis.target != null) ? opts.axis.target : target,
                        step : opts.axis.ystep,
                        line : opts.axis.yline
                    },
                    buffer: opts.period * 60
                }
            }, getOptions(this)));

            // 초기값 세팅
            if(opts.axis.data.length > 0) {
                this.update(opts.axis.data);
            }

            // 그리드 러닝
            this.start();
        }

        this.update = function(data) {
            dataList = data;
            this.chart.update(dataList);
        }

        this.clear = function() {
            dataList = [];
            this.chart.update([]);
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
            width : "100%",		// chart 기본 넓이
            height : "100%",		// chart 기본 높이

            // style
            padding : {
                left : 50 ,
                right : 50,
                bottom : 50,
                top : 50
            },

            // chart
            theme : "jennifer",	// 기본 테마 jennifer
            style : {},
            series : {},
            brush : [],
            widget : [],

            // grid (custom)
            axis : {
                target : null,
                format : "hh:mm",
                key : "time",
                xstep : 1, // x축 분 간격
                ystep : 10,
                xline : true,
                yline : true,
                data : []
            },

            // realtime
            interval : 1, // 초
            period : 5 // 분
        }
    }

    return UI;
});