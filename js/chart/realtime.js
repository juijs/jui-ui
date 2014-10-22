jui.defineUI("chart.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    var UI = function() {
        this.init = function() {
            var start = new Date(),
                end = time.add(start, time.minutes, 5);

            this.chart = builder(this.selector, $.extend({
                grid : {
                    x : {
                        type : "date",
                        domain : [ start, end ],
                        step : [ time.minutes, 1 ],
                        format : "hh:mm",
                        key: "value",
                        line : true,
                        realtime : true
                    },
                    y : {
                        type : "range",
                        target : [ "name", "name2" ],
                        step : 10,
                        line : true
                    }
                }
            }, this.options));
        }

        this.render = function(isAll) {
            this.chart.render(!isAll ? false : true);
        }
    }

    return UI;
}, "core");