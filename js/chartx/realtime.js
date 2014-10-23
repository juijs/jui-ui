jui.defineUI("chartx.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    var UI = function() {
        var dataList = [];

        function runningChart(self) {
            var domain = initDomain(self);

            for(var i = 0; i < dataList.length; i++) {
                if (dataList[i].value.getTime() <= domain[0].getTime()) {
                    dataList.splice(i, 1);
                } else {
                    break;
                }
            }

            self.chart.options.grid.x.domain = domain;
            self.chart.update(dataList);
        }

        function initDomain(self) {
            var end = new Date(),
                start = time.add(end, time.minutes, -self.options.period);

            return [ start, end ];
        }

        function getOptions(self) {
            var options = {},
                excepts = [ "interval", "period", "format", "key", "xstep", "ystep", "xline", "yline" ];

            for(var key in self.options) {
                if($.inArray(key, excepts) == -1) {
                    options[key] = self.options[key];
                }
            }

            return options;
        }

        this.init = function() {
            var self = this,
                opts = this.options,
                target = (_.typeCheck("array", opts.brush)) ? opts.brush[0].target : opts.brush.target;

            this.chart = builder(this.selector, $.extend({
                bufferCount : opts.period * 60,
                grid : {
                    x : {
                        type : "date",
                        domain : initDomain(this),
                        step : [ time.minutes, opts.xstep ],
                        realtime : true,
                        format : opts.format,
                        key : opts.key,
                        line : opts.xline
                    },
                    y : {
                        type : "range",
                        target : target,
                        step : opts.ystep,
                        line : opts.yline
                    }
                }
            }, getOptions(this)));

            // 초기값 세팅
            if(opts.data.length > 0) {
                this.append(opts.data);
                this.chart.render();
            }

            // 리얼타임 차트 실행
            setInterval(function() {
                runningChart(self);
            }, opts.interval * 1000)
        }

        this.append = function(data) {
            var newData = data;

            if(!_.typeCheck("array", data)) {
                newData = [ data ];
            }

            dataList = dataList.concat(newData);
        }

        this.render = function(isAll) {
            this.chart.render(!isAll ? false : true);
        }
    }

    UI.setup = function() {
        return {
            options: {
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
                brush : null,
                widget : null,
                data : [],

                // realtime
                interval : 1, // 초
                period : 5, // 분
                format : "hh:mm",
                key : "date",
                xstep : 1, // x축 분 간격
                ystep : 10,
                xline : true,
                yline : true
            }
        }
    }

    return UI;
}, "core");