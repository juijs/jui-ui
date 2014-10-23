jui.defineUI("chart.realtime", [ "jquery", "util.base", "util.time", "chart.builder" ], function($, _, time, builder) {

    var UI = function() {
        var dataList = [];

        function runGrid(self) {
            var domain = getDomain(self);

            if(dataList != null) {
                for(var i = 0; i < dataList.length; i++) {
                    if (dataList[i].value.getTime() <= domain[0].getTime()) {
                        dataList.splice(i, 1);
                    } else {
                        break;
                    }
                }

                self.chart.options.grid.x.domain = domain;
                self.chart.update(dataList);
            } else {
                self.chart.render();
            }

            console.log(dataList.length);
        }

        function getDomain(self) {
            var end = new Date(),
                start = time.add(end, time.minutes, -5);

            return [ start, end ];
        }

        this.init = function() {
            var self = this;

            this.chart = builder(this.selector, $.extend({
                grid : {
                    x : {
                        type : "date",
                        domain : getDomain(this),
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

            setInterval(function() {
                runGrid(self);
            }, 1000)
        }

        this.update = function(data) {
            dataList = data;
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

    return UI;
}, "core");