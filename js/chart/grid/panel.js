jui.define("chart.grid.panel", [  ], function() {

    /**
     * @class chart.grid.panel
     *
     * implements default panel grid
     *
     * @extends chart.grid.core
     */
    var PanelGrid = function(chart, axis, grid) {

        var orient = grid.orient;

        /**
         * @method custom
         *
         * draw sample panel area
         *
         * @param {ChartBuilder} chart
         * @param {SVGElement} g
         * @protected
         */
        this.custom = function(chart, g) {
            var obj = this.scale(0);

            obj.x -= axis.area('x');
            obj.y -= axis.area('y');

            var rect = chart.svg.rect($.extend(obj, {
                fill : 'white',
                stroke : "white"
            }));

            g.append(rect);
        }

        /**
         * @method drawBefore
         *
         * initialize grid option before draw grid
         *
         */
        this.drawBefore = function() {

            /**
             * @method scale
             *
             * get scale function
             *
             */
            this.scale = (function(axis) {
                return function(i) {

                    return {
                        x : axis.area('x'),
                        y : axis.area('y'),
                        width : axis.area('width'),
                        height : axis.area('height')
                    }
                }
            })(axis);

        }

        /**
         * @method draw
         *
         *
         * @returns {Object}
         * @returns {util.scale} scale  return scale be used in grid
         * @returns {SVGElement} root grid root element
         * @protected
         */
        this.draw = function() {
            return this.drawGrid(chart, orient, "panel", grid);
        }
    }
    
    return PanelGrid;
}, "chart.grid.core");
