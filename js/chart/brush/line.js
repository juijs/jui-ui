jui.define("chart.brush.line", [], function() {

    var LineBrush = function(chart, grid) {

        function isCheckedBrush(brushes) {
            if($.inArray("line", brushes) != -1 || !brushes) {
                return true;
            }

            return false;
        }

        this.draw = function() {
            var data = chart.get('data');
            var series = chart.get('series');
            var barPadding = chart.get('barPadding');
            var seriesPadding = chart.get('seriesPadding');

            var info = chart.niceAxis(grid.getMin(), grid.getMax());
            var cw = grid.getUnit() / 2,
                max = Math.abs(info.min) + Math.abs(info.max),
                rate = chart.area.chart.height / max;

            for(var i = 1; i <= data.length; i++) {
                var cx = chart.area.chart.x + (grid.getUnit() * i) - cw;

                for(var key in series) {
                    var value = series[key].data[i - 1];
                    var cy = chart.area.chart.y + ((max - value + info.min) * rate);

                    if(!series[key].path) {
                        series[key].path = [];
                    }

                    // 라인을 그리기 위한 위치 값 저장
                    series[key].path.push({ cx: cx, cy: cy });
                }
            }

            for(var key in series) {
                if(isCheckedBrush(series[key].brush)) {
                    var path = series[key].path;

                    for (var i = 0; i < path.length - 1; i++) {
                        var x1 = path[i].cx,
                            y1 = path[i].cy,
                            x2 = path[i + 1].cx,
                            y2 = path[i + 1].cy;

                        chart.renderer.line(x1, y1, x2, y2, {
                            "stroke-width": 1,
                            "stroke": series[key].color
                        });
                    }
                }
            }
        }
    }

    return LineBrush;
});