jui.define("chart.grid.table", [  ], function() {

    /**
     * @class chart.grid.table
     *
     * implements table grid 
     *
     * @extends chart.grid.core
     */
    var TableGrid = function(chart, axis, grid) {
        var orient = grid.orient;
        var rowUnit, columnUnit, outerPadding, row, column ;

        this.custom = function(chart, g) {
            for(var r = 0; r < row; r++) {
                for (var c = 0; c < column; c++) {
                    var index = r * column + c;

                    var obj = this.scale(index);
                    
                    obj.x -= axis.area('x');
                    obj.y -= axis.area('y');

                    var rect = chart.svg.rect($.extend(obj, {
                        fill : 'white',
                        stroke : "white"
                    }));

                    g.append(rect);
                }
            }
        }

        this.drawBefore = function() {

            row = grid.rows;
            column = grid.columns;
            
            padding = grid.padding;
            
            columnUnit = (axis.area('width') -  (column - 1) * padding) / column;
            rowUnit = (axis.area('height') - (row - 1) * padding ) / row;

            // create scale
            this.scale = (function(axis) {
                return function(i) {

                    var r = Math.floor(i  / column) ;
                    var c = i % column;

                    var x = c * columnUnit;
                    var y = r * rowUnit;

                    var space = padding * c;
                    var rspace = padding * r;

                    return {
                        x : axis.area('x') + x +  space,
                        y : axis.area('y') + y + rspace,
                        width : columnUnit,
                        height : rowUnit
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
            return this.drawGrid(chart, orient, "table", grid);
        }
    }

    TableGrid.setup = function() {
        return {
            /** @cfg {Number} [rows=1] row count in table  */
            rows: 1,
            /** @cfg {Number} [column=1] column count in table  */
            columns: 1,
            /** @cfg {Number} [padding=1] padding in table  */
            padding: 10
        };
    }
    
    return TableGrid;
}, "chart.grid.core");
