jui.defineUI("chart.line", [
    "util.graphics",
    "chart.grid.basic"
], function(Graphics, BasicGrid) {

    var GraphicsUtil = Graphics.util;

    var UI = function() {
        var grid = null, radius = 1.7;

        function getPropertyCount(obj) {
            var count = 0;

            for(var key in obj) {
                count += 1;
            }

            return count;
        }

        function setCircleEvent(self) {
            $(self.selector).find("circle").each(function(i) {
                console.log(this);
            });
        }

        this.drawChart = function() {
            var data = this.get('data');
            var series = this.get('series');
            var barPadding = this.get('barPadding');
            var seriesPadding = this.get('seriesPadding');

            var info = this.niceAxis(grid.getMin(), grid.getMax());
            var cw = grid.getUnit() / 2,
                max = Math.abs(info.min) + Math.abs(info.max),
                rate = this.area.chart.height / max;

            for(var i = 1; i <= data.length; i++) {
                var cx = this.area.chart.x + (grid.getUnit() * i) - cw;

                for(var key in series) {
                    var value = series[key].data[i - 1];
                    var cy = this.area.chart.y + ((max - value + info.min) * rate);

                    if(!series[key].path) {
                        series[key].path = [];
                    }

                    // 라인을 그리기 위한 위치 값 저장
                    series[key].path.push({ cx: cx, cy: cy });

                    var circle = this.renderer.circle(cx, cy, radius, {
                        fill: series[key].color,
                        title: key + ": " + value
                    });
                }
            }

            for(var key in series) {
                var path = series[key].path;

                for(var i = 0; i < path.length - 1; i++) {
                    var x1 = path[i].cx,
                        y1 = path[i].cy,
                        x2 = path[i + 1].cx,
                        y2 = path[i + 1].cy;

                    this.renderer.line(x1, y1, x2, y2, {
                        "stroke-width": 1,
                        "stroke": series[key].color
                    });
                }
            }
        }

        this.renderChart = function() {
            grid = new BasicGrid(this);
            grid.draw();

            this.drawChart();
        }

        this.setTooltip = function() {
            var self = this;
            var func = this.tpl.tooltip;

            this.addEvent($(this.root).find("circle"), "mouseover", function(e) {
                $(self.root).find(".tooltip").remove();

                var $tooltip = $(func({ title: $(this).attr("title") }));
                $(self.root).append($tooltip);

                var offset = $(this).offset(),
                    w = $tooltip.outerWidth(),
                    h = $tooltip.outerHeight();

                $tooltip.css({
                    left: offset.left - (w / 2) + radius,
                    top: offset.top - h + radius
                });
            });
        }
    }

    UI.setting = function() {
        return {
            options: {
                "type": "svg",
                "width": "100%",
                "height": "100%",
                "padding": 10,
                "barPadding": 10,
                "seriesPadding": 1,
                "maxTicks": 5,
                "title": "",
                "titleY": "",
                "titleX": "",
                "theme": {},
                "titleHeight": 50,
                "titleYWidth": 50,
                "titleXHeight": 50,
                "labels": "",
                "series": {},
                "data": []
            }
        }
    }

    return UI;
}, "chart.core");