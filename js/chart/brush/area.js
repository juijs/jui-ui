jui.define("chart.brush.area", [], function() {

  var AreaBrush = function(brush) {
    var g, zeroY, maxY, series, count, width;

    this.drawBefore = function(chart) {
      g = chart.svg.group().translate(chart.area('x'), chart.area('y'));

      zeroY = brush.y.scale(0);
      maxY = chart.area('height');
      series = chart.options.series;
      count = series[brush.target[0]].data.length;
      width = chart.x.scale.rangeBand();
    }

    this.draw = function(chart) {
      var path = [];

      for (var i = 0; i < count; i++) {
        var startX = brush.x.scale(i) + 1, valueSum = 0;

        for (var j = 0; j < brush.target.length; j++) {
          var value = series[brush.target[j]].data[i];

          if (brush.nest === false && j > 0) {
            valueSum += series[brush.target[j - 1]].data[i];
          }

          if (!path[j]) {
            path[j] = {
              x : [],
              y : []
            };
          }

          path[j].x.push(startX);
          path[j].y.push(brush.y.scale(value + valueSum));
        }
      }

      for (var i = 0; i < path.length; i++) {
        var p = chart.svg.path({
          stroke : this.getColor(i),
          "stroke-width" : 2,
          fill : "transparent"
        });

        var p2 = chart.svg.polygon({
          fill : this.getColor(i),
          opacity : brush.opacity
        });

        var x = path[i].x, y = path[i].y;

        p2.point(x[0], maxY);

        for (var j = 0; j < x.length - 1; j++) {
          p.MoveTo(x[j], y[j]);
          p.LineTo(x[j + 1], y[j + 1]);
          p2.point(x[j], y[j]);
        }

        p2.point(x[x.length - 1], y[y.length - 1]);
        p2.point(x[x.length - 1], maxY);

        g.prepend(p);
        g.prepend(p2);
      }
    }
  }

  return AreaBrush;
}, "chart.brush"); 