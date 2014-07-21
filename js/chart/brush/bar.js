jui.defineUI("chart.bar", [ "util.graphics", "chart.grid.basic" ], function(Graphics, BasicGrid) {
	var GraphicsUtil = Graphics.util;

    var UI = function() {
        var grid = null;

        function getPropertyCount(obj) {
            var count = 0;

            for(var key in obj) {
                count += 1;
            }

            return count;
        }

        this.drawChart = function() {
            var data = this.get('data');
            var series = this.get('series');
            var theme = this.get('theme');
            var barPadding = this.get('barPadding');
            var seriesPadding = this.get('seriesPadding');

            var width = grid.getUnit() - barPadding * 2;
            var seriesCount = getPropertyCount(series);
            var seriesWidth = (width - (seriesCount -1) * seriesPadding) / seriesCount;
            var nextWidth = seriesWidth + seriesPadding;

            var obj = this.niceAxis(grid.getMin(), grid.getMax());
            var range = obj.max - obj.min;
            var tickWidth = obj.tickWidth;

            var startX = this.area.chart.x;
            var startY = this.area.chart.y;
            var height = this.area.chart.height;
            var rate = tickWidth / range;
            var tickCount = obj.max / tickWidth;
            var zeroBase = this.area.chart.y + ((this.area.chart.height * rate) * tickCount);
            var heightHigh = zeroBase;
            var heightLow = this.area.chart.height - zeroBase;

            var index = 0;
            var colors = theme.series || ["black", 'red', 'blue'];

            for(var key in series) {

                var chart = series[key];
                var x = startX + barPadding +  index * (nextWidth);

                for(var i = 0, len = chart.data.length; i < len; i++) {

                    var value = chart.data[i];
                    var h = height * (Math.abs(value) / range);
                    if (value >= 0) {
                        this.renderer.rect(x, heightHigh - h, seriesWidth, h, {
                            fill : chart.color || colors[index]
                        })
                    } else {
                        this.renderer.rect(x, zeroBase, seriesWidth, h, {
                            fill : chart.color || colors[index]
                        })
                    }

                    x += grid.getUnit();
                }

                index++;
            }
        }

        this.renderChart = function() {
            grid = new BasicGrid(this);
            grid.draw();

            this.drawChart();
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