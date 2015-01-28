jui.define("chart.grid.table", [  ], function() {

    /**
     * @class chart.grid.table
     *
     * implements table grid 
     *
     * @extends chart.grid.core
     */
    var TableGrid = function(chart, axis, grid) {
        var rowUnit, columnUnit, outerPadding, row, column ;

        this.custom = function(g) {
            for(var r = 0; r < row; r++) {
                for (var c = 0; c < column; c++) {
                    var index = r * column + c;

                    var obj = this.scale(index);
                    
                    obj.x -= this.axis.area('x');
                    obj.y -= this.axis.area('y');

                    var rect = this.chart.svg.rect($.extend(obj, {
                        fill : 'tranparent',
                        stroke : "black"
                    }));

                    //g.append(rect);
                }
            }
        }

        this.drawBefore = function() {

            var row = this.grid.rows;
            var column = this.grid.columns;
            
            padding = this.grid.padding;
            
            var columnUnit = (this.axis.area('width') -  (column - 1) * padding) / column;
            var rowUnit = (this.axis.area('height') - (row - 1) * padding ) / row;

            // create scale
            this.scale = (function(axis, row, column, rowUnit, columnUnit) {
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
            })(this.axis, row, column, rowUnit, columnUnit);
        }

        /**
         * @method draw
         *
         *
         * @return {Object}
         * @return {util.scale} return.scale  return scale be used in grid
         * @return {SVGElement} return.root grid root element
         * @protected
         */
        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid("table");
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
