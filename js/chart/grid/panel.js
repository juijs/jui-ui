jui.define("chart.grid.panel", [  ], function() {

    /**
     * @class chart.grid.panel
     * @extends chart.grid.core
     */
    var PanelGrid = function() {

        this.custom = function(g) {
            var obj = this.scale(0);

            obj.x -= this.axis.area('x');
            obj.y -= this.axis.area('y');

            var rect = this.chart.svg.rect($.extend(obj, {
                fill : 'tranparent',
                stroke : "white"
            }));

            g.append(rect);
        }

        this.drawBefore = function() {
            this.scale = (function(axis) {
                return function(i) {

                    return {
                        x : axis.area('x'),
                        y : axis.area('y'),
                        width : axis.area('width'),
                        height : axis.area('height')
                    }
                }
            })(this.axis);
        }

        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid("panel");
        }
    }
    
    return PanelGrid;
}, "chart.grid.core");
