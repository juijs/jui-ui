jui.define("chart.brush.rline", [], function() {

  var LineBrush = function(brush) {
    var g, zeroY, count, width;

    this.drawBefore = function(chart) {
      var defs = chart.svg.defs();
      var clip = chart.svg.clipPath({
        id : 'clip'
      })
      defs.append(clip)
      clip.append(chart.svg.rect({
        x : 0,
        y : 0,
        width : chart.area('width'),
        height : chart.area('height')
      }))
      g = chart.svg.group({
        "clip-path" : "url(#clip)"
      }).translate(chart.area('x'), chart.area('y'));

      zeroY = brush.y.scale(0);
      count = chart.series(brush.target[0]).data.length;
    }

    this.draw = function(chart) {
      var path = {};

      var raw = chart.series(brush.x.key).data;
      for (var i = 0; i < count; i++) {
        var startX = brush.x.scale(raw[i]);

        for (var j = 0; j < brush.target.length; j++) {
          var startY = brush.y.scale(chart.series(brush.target[j]).data[i]);

          if (!path[j]) {
            path[j] = {
              x : [],
              y : []
            };
          }

          path[j].x.push(startX);
          path[j].y.push(startY);
        }
      }

      for (var k in path) {
        var p = chart.svg.path({
          stroke : this.color(k),
          "stroke-width" : 2,
          fill : "transparent"
        });

        var x = path[k].x, y = path[k].y, px = [], py = [];

        if (brush.smooth) {
          px = this.curvePoints(x);
          py = this.curvePoints(y);
        }

        for (var i = 0; i < x.length - 1; i++) {
          p.MoveTo(x[i], y[i]);

          if (brush.smooth) {
            p.CurveTo(px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
          } else {
            p.LineTo(x[i + 1], y[i + 1]);
          }
        }

        g.append(p);
      }
    }
  }

  return LineBrush;
}, "chart.brush"); 