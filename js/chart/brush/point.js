jui.define("chart.brush.point", [], function() {

    var PointBrush = function(chart, grid) {
        var radius = 1.7;

        function isCheckedBrush(brushes) {
            if($.inArray("point", brushes) != -1 || !brushes) {
                return true;
            }

            return false;
        }

        this._calculate = function() {

        }

        this._draw = function() {
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
                    if(isCheckedBrush(series[key].brush)) {
                        var value = series[key].data[i - 1];
                        var cy = chart.area.chart.y + ((max - value + info.min) * rate);

                        chart.renderer.circle(cx, cy, radius, {
                            fill: series[key].color,
                            title: key + ": " + value
                        });
                    }
                }
            }

            console.log(this);
        }

        this.getRadius = function() {
            return radius;
        }
    }

    return PointBrush;
}, "chart.brush");