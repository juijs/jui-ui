jui.define("chart.brush.clusterbar3d", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.clusterbar3d
     * @extends chart.brush.bar
     */
    var ClusterBar3DBrush = function(chart, axis, brush) {
        var g;
        var height;

        this.drawBefore = function() {
            g = chart.svg.group();
            height = axis.y.rangeBand() - brush.outerPadding * 2;
        }

        this.draw = function() {
            var count = brush.target.length,
                dataList = this.listData();

            for(var i = dataList.length - 1; i >= 0; i--) {
                var data = dataList[i];

                for(var j = count - 1; j >= 0; j--) {
                    var value = data[brush.target[j]],
                        xy = axis.c(value, i, j, count),
                        zeroXY = axis.c(0, i, j, count),
                        padding = (brush.innerPadding > xy.depth) ? xy.depth : brush.innerPadding;

                    var startY = xy.y - (height / 2) + (padding / 2),
                        width = Math.abs(zeroXY.x - xy.x),
                        r = chart.svg.rect3d(this.color(j), width, height, axis.c.degree, xy.depth - padding);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(zeroXY.x, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.append(r);
                }
            }

            return g;
        }
    }

    ClusterBar3DBrush.setup = function() {
        return {
            outerPadding: 5,
            innerPadding: 5
        };
    }

    return ClusterBar3DBrush;
}, "chart.brush.core");
