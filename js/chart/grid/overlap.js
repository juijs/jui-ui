jui.define("chart.grid.overlap", [  ], function() {

    /**
     * @class chart.grid.overlap
     *
     * implements overlap grid be used in multiple pie or donut chart
     *
     * @param chart
     * @param axis
     * @param grid
     * @extends chart.grid.core
     */
    var OverlapGrid = function(chart, axis, grid) {
        var orient = grid.orient;
        var size, widthUnit, heightUnit, width, height ;

        this.custom = function(chart, g) {
            for(var i = 0, len = this.axis.data.length; i < len; i++) {
                var obj = this.scale(i);

                obj.x -= this.axis.area.x;
                obj.y -= this.axis.area.y;

                var rect = chart.svg.rect($.extend(obj, {
                    fill : 'white',
                    stroke : "white"
                }));

                g.append(rect);
            }
        }

        this.drawBefore = function() {
            size = this.grid.count || this.axis.data.length ||  1;

            widthUnit = (this.axis.area.width / 2) / size;
            heightUnit = (this.axis.area.height / 2) / size;

            width = this.axis.area.width;
            height = this.axis.area.height;

            // create scale
            this.scale = (function(axis) {
                return function(i) {

                    var x = i * widthUnit;
                    var y = i * heightUnit;

                    var obj = { x : x , y : y };

                    return {
                        x : axis.area.x + obj.x,
                        y : axis.area.y + obj.y,
                        width : Math.abs(width/2 - obj.x)*2,
                        height : Math.abs(height/2 - obj.y)*2
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
            return this.drawGrid(chart, orient, "overlap", grid);
        }

        OverlapGrid.setup = function() {
            return {
                /** @cfg {Number} [size=null] divid count */
                count : null
            }
        }
    }
    
    return OverlapGrid;
}, "chart.grid.core");
