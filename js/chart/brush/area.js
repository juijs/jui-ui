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
                y = this.axis.y(this.brush.startZero ? 0 : this.axis.y.min());

            for(var k = 0; k < path.length; k++) {
                var p = this.createLine(path[k], k),
                    xList = path[k].x;

                if(path[k].length > 0) {
                    p.LineTo(xList[xList.length - 1], y);
                    p.LineTo(xList[0], y);
                    p.ClosePath();
                }

                p.attr({
                    fill: this.color(k),
                    "fill-opacity": this.chart.theme("areaBackgroundOpacity"),
                    "stroke-width": 0
                });

                this.addEvent(p, null, k);
                g.prepend(p);

                // Add line
                if(this.brush.line) {
                    g.prepend(this.createLine(path[k], k));
                }
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

    AreaBrush.setup = function() {
        return {
            /** @cfg {"normal"/"curve"/"step"} [symbol="normal"] Sets the shape of a line (normal, curve, step). */
            symbol: "normal", // normal, curve, step
            /** @cfg {Number} [active=null] Activates the bar of an applicable index. */
            active: null,
            /** @cfg {String} [activeEvent=null]  Activates the bar in question when a configured event occurs (click, mouseover, etc). */
            activeEvent: null,
            /** @cfg {"max"/"min"} [display=null]  Shows a tool tip on the bar for the minimum/maximum value.  */
            display: null,
            /** @cfg {Boolean} [startZero=false]  The end of the area is zero point. */
            startZero: false,
            /** @cfg {Boolean} [line=true]  Visible line */
            line: true
        };
    }

    return AreaBrush;
}, "chart.brush.line");
