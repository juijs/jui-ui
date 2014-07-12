jui.define("chart.grid.basic", [  "util.graphics" ], function(Graphics) {
    var GraphicsUtil = Graphics.util;

    var Grid = function(chart) {

        var xAxis = [],
            min = 0,
            max = 0,
            niceMin = 0,
            niceMax = 0,
            unit = 0,
            range = 0,
            tickWidth = 0;

        function caculateData() {
            var series = chart.get('series');
            var labels = chart.get('labels');
            var data = chart.get('data');
            var maxTicks = chart.get('maxTicks');

            for(var i = 0, len = data.length; i < len; i++) {
                var row = data[i];

                xAxis.push(row[labels]);

                for(var k in series) {
                    series[k].data = series[k].data || [];
                    var value = null;

                    if (row[k]) {
                        value = row[k];
                    } else {
                        if (GraphicsUtil.isFunction(series[k].get)) { // custom legend 설정
                            value = series[k].get(row);
                        }
                    }

                    series[k].data.push(value);

                    if (value < min) { min = value; }
                    if (value > max) { max = value; }
                }
            }

            unit = chart.area.chart.width / xAxis.length;

            var obj = chart.niceAxis(min, max);

            range = obj.max - obj.min;
            tickWidth = obj.tickWidth;
            niceMin = obj.min;
            niceMax = obj.max;
        }

        function drawX() {
            // x 축 그리기
            var pos = unit / 2

            var xStart = chart.area.chart.x + pos;
            var yStart = chart.area.chart.y2 + 15;

            var xLineStart = chart.area.chart.x + unit;

            for(var i = 0; i < xAxis.length; i++) {
                chart.renderer.text(xStart, yStart, xAxis[i], {
                    "font-size" : "10pt",
                    "text-anchor" : "middle",
                    "fill" : "black"
                });

                xStart += unit;

                chart.renderer.line(xLineStart, chart.area.chart.y, xLineStart, chart.area.chart.y2, {
                    "stroke-width" : 0.5,
                    "stroke" : "rgba(0, 0, 0, 0.2)"
                });

                xLineStart += unit;
            }

        }

        function drawY() {
            var style = { "stroke-width" : 1, stroke : '#000' };

            // 기본 좌표
            chart.renderer.line(chart.area.chart.x, chart.area.chart.y, chart.area.chart.x, chart.area.chart.y2, style);

            // 구간별 라인
            var rate = tickWidth / range;
            var split2 = chart.area.chart.height * rate
            var start = chart.area.chart.y;

            for(var i = niceMax ; i >= niceMin; i -= tickWidth) {
                if (i == 0) {
                    chart.renderer.line(chart.area.chart.x, start, chart.area.chart.x2, start, style);
                }

                chart.renderer.line(chart.area.chart.x, start, chart.area.chart.x2, start, {
                    "stroke-width" : 0.5,
                    "stroke" : "rgba(0, 0, 0, 0.2)"
                });

                chart.renderer.text(chart.area.chart.x - 5, start+5, i+"", {
                    "font-size" : "10pt",
                    "text-anchor" : "end",
                    "fill" : "gray"
                });

                start += split2;
            }
        }

        this.getMin = function() {
            return min;
        }

        this.getMax = function() {
            return max;
        }

        this.getUnit = function() {
            return unit;
        }

        this.draw = function() {
            caculateData();
            drawX();
            drawY();
        }
    }

    return Grid;
});