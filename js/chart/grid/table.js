jui.define("chart.grid.table", [  ], function() {

    var TableGrid = function(chart, axis, grid) {
        var orient = grid.orient;
        var rowUnit, columnUnit, outerPadding, row, column ;

        this.custom = function(chart, g) {
            for(var r = 0; r < row; r++) {
                for (var c = 0; c < column; c++) {
                    var index = r * columnUnit + c;

                    var obj = this.scale(index);

                    obj.x -= axis.area.x;
                    obj.y -= axis.area.y;

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

            columnUnit = axis.area.width / column;
            rowUnit = axis.area.height / row;

            outerPadding = grid.outerPadding;

            // create scale
            this.scale = (function(axis) {
                return function(i) {

                    var r = Math.floor(i  / column) ;
                    var c = i % column;

                    var x = c * columnUnit;
                    var y = r * rowUnit;

                    var padding = ((column == 0) ? -outerPadding : 0);

                    return {
                        x : axis.area.x + x +  padding,
                        y : axis.area.y + y + padding,
                        width : columnUnit + padding*2,
                        height : rowUnit + padding *2
                    }
                }
            })(axis);
        }

        this.draw = function() {
            return this.drawGrid(chart, orient, "table", grid);
        }
    }

    TableGrid.setup = function() {
        return {
            rows: 1,
            columns: 1,
            outerPadding: 1
        };
    }
    
    return TableGrid;
}, "chart.grid.core");
