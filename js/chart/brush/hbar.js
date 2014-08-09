jui.define("chart.brush.bar", [], function() {

  var BarBrush = function(brush) {
    var g, zeroY, series, count, width, barWidth;
    var outerPadding = 15, innerPadding = 10;

    this.drawBefore = function(chart) {
      g = chart.svg.group().translate(chart.area.x, chart.area.y);

      zeroX = brush.x.scale(0);
      series = chart.options.series;
      count = series[brush.target[0]].data.length;

      height = brush.y.scale.rangeBand();
      barHeight = (height - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;
    }

    this.draw = function(chart) {
      for (var i = 0; i < count; i++) {
        var startY = brush.y.scale(i) + outerPadding;

        for (var j = 0; j < brush.target.length; j++) {
          var startX = brush.x.scale(series[brush.target[j]].data[i]);

          if (startX >= zeroX) {
            var r = chart.svg.rect({
              x : zeroX,
              y : startY,
              height : barHeight,
              width : Math.abs(zeroX - startX),
              fill : this.getColor(j)
            });

            g.append(r);
          } else {
            var w = Math.abs(zeroX - startX);
            
            var r = chart.svg.rect({
              y : startY,
              x : zeroX - w,
              height : barHeight,
              width : w,
              fill : this.getColor(j)
            });

            g.append(r);
          }

          startY += barHeight + innerPadding;
        }
      }
    }
  }

  return BarBrush;
}, "chart.brush"); 