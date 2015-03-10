jui.define("chart.brush.clustercolumn3d", [], function() {

    /**
     * @class chart.brush.clustercolumn3d
     * @extends chart.brush.bar
     */
    var ClusterColumn3DBrush = function() {
        var g;
        var width;

        this.drawBefore = function() {
            g = this.chart.svg.group();
            width = this.axis.x.rangeBand() - this.brush.outerPadding * 2;
        }

        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.rect3d(color, width, height, degree, depth);
        }

        this.draw = function() {
            var count = this.brush.target.length;

            this.eachData(function(i, data) {
                for(var j = 0; j < count; j++) {
                    var value = data[this.brush.target[j]],
                        xy = this.axis.c(i, value, j, count),
                        zeroXY = this.axis.c(i, 0, j, count),
                        padding = (this.brush.innerPadding > xy.depth) ? xy.depth : this.brush.innerPadding;

                    var startX = xy.x - (width / 2),
                        startY = xy.y - (Math.sin(this.axis.c.radian) * padding),
                        height = Math.abs(zeroXY.y - xy.y),
                        r = this.drawMain(this.color(j), width, height, this.axis.c.degree, xy.depth - padding);

                    if(value != 0) {
                        this.addEvent(r, i, j);
                    }

                    r.translate(startX, startY);

                    // 그룹에 컬럼 엘리먼트 추가
                    g.prepend(r);
                }
            }, true);

            return g;
        }
    }

    ClusterColumn3DBrush.setup = function() {
        return {
            outerPadding: 5,
            innerPadding: 5
        };
    }

    return ClusterColumn3DBrush;
}, "chart.brush.core");
