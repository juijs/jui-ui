jui.define("chart.brush.stackcolumn3d", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.stackcolumn3d
     *
     * implements column brush
     *
     * @extends chart.brush.bar
     */
    var StackColumn3DBrush = function(chart, axis, brush) {
        var g;
        var width;

        this.drawBefore = function() {
            g = chart.svg.group();
            width = axis.x.rangeBand() - brush.outerPadding * 2;
        }

        this.draw = function() {
            var count = brush.target.length;

            this.eachData(function(i, data) {
                for(var j = 0; j < count; j++) {
                    var value = data[brush.target[j]],
                        xy = axis.c(i, value, j, count),
                        zeroXY = axis.c(i, 0, j, count),
                        padding = (brush.innerPadding > xy.depth) ? xy.depth : brush.innerPadding;

                    var startX = xy.x - (width / 2),
                        startY = xy.y - (Math.sin(axis.c.radian) * padding),
                        height = Math.abs(zeroXY.y - xy.y),
                        r = chart.svg.rect3d(this.color(j), width, height, axis.c.degree, xy.depth - padding);

                    r.translate(startX, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.prepend(r);
                }
            }, true);

            return g;
        }
    }

    StackColumn3DBrush.setup = function() {
        return {
            outerPadding: 5,
            innerPadding: 5
        };
    }

    return StackColumn3DBrush;
}, "chart.brush.core");
