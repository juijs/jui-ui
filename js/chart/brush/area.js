jui.define("chart.brush.area", [], function() {

    /**
     * @class chart.brush.area
     *
     * implements area brush
     *
     *
     * @extends chart.brush.line
     */
    var AreaBrush = function() {

        /**
         * @method drawArea 
         * 
         * draw area util method
         *
         * @param {Array} path  caculated xy points
         * @return {TransformElement}
         * @protected
         */
        this.drawArea = function(path) {
            var g = this.chart.svg.group(),
                maxY = this.axis.y(this.axis.y.min());

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k),
                    xList = path[k].x;

                if(path[k].length > 0) {
                    p.LineTo(xList[xList.length - 1], maxY);
                    p.LineTo(xList[0], maxY);
                    p.ClosePath();
                }

                p.attr({
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                });

                this.addEvent(p, null, k);
                g.prepend(p);
            }

            return g;
        }

        /**
         * @method draw 
         * 
         * @protected  
         * @return {TransformElement}
         */
        this.draw = function() {
            return this.drawArea(this.getXY());
        }

        /**
         * @method drawAnimate
         *
         * @protected
         */
        this.drawAnimate = function(root) {
            root.append(
                this.chart.svg.animate({
                     attributeName: "opacity",
                     from: "0",
                     to: "1",
                     begin: "0s" ,
                     dur: "1.5s",
                     repeatCount: "1",
                     fill: "freeze"
                 })
            );
        }
    }

    return AreaBrush;
}, "chart.brush.line");
