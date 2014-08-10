jui.define("chart.brush.bar", [], function() {

  var BarBrush = function(brush) {
    var g, zeroY, series, count, width, barWidth;
    var outerPadding = 15, innerPadding = 10;

    this.drawBefore = function(chart) {
      g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

      zeroY = brush.y.scale(0);
      series = chart.options.series;
      count = series[brush.target[0]].data.length;

      width = chart.x.scale.rangeBand();
      barWidth = (width - outerPadding * 2 - (brush.target.length - 1) * innerPadding) / brush.target.length;
    }

    this.draw = function(chart) {
      for (var i = 0; i < count; i++) {
        var startX = brush.x.scale(i) + outerPadding;

        for (var j = 0; j < brush.target.length; j++) {
          var startY = brush.y.scale(series[brush.target[j]].data[i]);

          if (startY <= zeroY) {
            var r = chart.svg.rect({
              x : startX,
              y : startY,
              width : barWidth,
              height : Math.abs(zeroY - startY),
              fill : this.getColor(j)
            });

            g.append(r);
          } else {
            var r = chart.svg.rect({
              x : startX,
              y : zeroY,
              width : barWidth,
              height : Math.abs(zeroY - startY),
              fill : this.getColor(j)
            });

            g.append(r);
          }

          startX += barWidth + innerPadding;
        }
      }
    }
  }

  return BarBrush;
}, "chart.brush"); 