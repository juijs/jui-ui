jui.define("chart.brush.bar", [], function() {

    var BarBrush = function(chart, grid) {

        function getPropertyCount(obj) {
            var count = 0;

            for(var key in obj) {
                var brushes = obj[key].brush;

                if($.inArray("bar", brushes) != -1 || !brushes)
                    count += 1;
            }

            return count;
        }

        function isCheckedBrush(brushes) {
            if($.inArray("bar", brushes) != -1 || !brushes) {
                return true;
            }

            return false;
        }

        this._calculate = function() {

        }

        this._draw = function() {
            var data = chart.get('data');
            var series = chart.get('series');
            var theme = chart.get('theme');
            var barPadding = chart.get('barPadding');
            var seriesPadding = chart.get('seriesPadding');

            var width = grid.getUnit() - barPadding * 2;
            var seriesCount = getPropertyCount(series);
            var seriesWidth = (width - (seriesCount -1) * seriesPadding) / seriesCount;
            var nextWidth = seriesWidth + seriesPadding;

            var obj = chart.niceAxis(grid.getMin(), grid.getMax());
            var range = obj.max - obj.min;
            var tickWidth = obj.tickWidth;

            var startX = chart.area.chart.x;
            var startY = chart.area.chart.y;
            var height = chart.area.chart.height;
            var rate = tickWidth / range;
            var tickCount = obj.max / tickWidth;
            var zeroBase = chart.area.chart.y + ((chart.area.chart.height * rate) * tickCount);
            var heightHigh = zeroBase;
            var heightLow = chart.area.chart.height - zeroBase;

            var index = 0;
            var colors = theme.series || ["black", 'red', 'blue'];

            for(var key in series) {
                var chartInfo = series[key];

                if(isCheckedBrush(chartInfo.brush)) {
                    var x = startX + barPadding + index * (nextWidth);

                    for (var i = 0, len = chartInfo.data.length; i < len; i++) {

                        var value = chartInfo.data[i];
                        var h = height * (Math.abs(value) / range);
                        if (value >= 0) {
                            chart.renderer.rect(x, heightHigh - h, seriesWidth, h, {
                                fill: chartInfo.color || colors[index]
                            })
                        } else {
                            chart.renderer.rect(x, zeroBase, seriesWidth, h, {
                                fill: chartInfo.color || colors[index]
                            })
                        }

                        x += grid.getUnit();
                    }

                    index++;
                }
            }
        }
    }
	
	return BarBrush;
}, "chart.brush");