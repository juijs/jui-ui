jui.define("chart.brush.clustercylinder3d", [], function() {

    /**
     * @class chart.brush.clustercylinder3d
     * @extends chart.brush.bar
     */
    var ClusterCylinder3DBrush = function() {
        this.drawMain = function(color, width, height, degree, depth) {
            return this.chart.svg.cylinder3d(color, width, height, degree, depth, this.brush.topRate);
        }
    }

    ClusterCylinder3DBrush.setup = function() {
        return {
            topRate: 1,
            outerPadding: 5,
            innerPadding: 5
        };
    }

    return ClusterCylinder3DBrush;
}, "chart.brush.clustercolumn3d");
