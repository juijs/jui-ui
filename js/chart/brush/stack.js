jui.define("chart.brush.stack", [], function() {

  var StackBrush = function(brush) {
    var g, zeroY, series, count, width, barWidth;
    var outerPadding = 15, innerPadding = 10;

    this.drawBefore = function(chart) {
      g = chart.svg.group().translate(chart.getArea('x'), chart.getArea('y'));

      zeroY = brush.y.scale(0);
      series = chart.options.series;
      count = series[brush.target[0]].data.length;

      width = chart.x.scale.rangeBand();
      barWidth = width - outerPadding * 2;
    }

    this.draw = function(chart) {
      var chart_height = chart.getArea('height');
      for (var i = 0; i < count; i++) {
        var startX = brush.x.scale(i) + outerPadding;

        var heightSum = 0;
        var heightArr = [];
        for (var j = 0; j < brush.target.length; j++) {
          var height = series[brush.target[j]].data[i];

          heightSum += height;
          heightArr.push(chart_height - brush.y.scale(height));
        }

        var startY = brush.y.scale(heightSum);

        for (var j = heightArr.length - 1; j >= 0; j--) {
          var r = chart.svg.rect({
            x : startX,
            y : startY,
            width : barWidth,
            height : heightArr[j],
            fill : this.getColor(j)
          });

          g.append(r);

          startY += heightArr[j]
        }

      }
    }
  }

  return StackBrush;
}, "chart.brush"); 