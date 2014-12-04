jui.define("chart.grid.table", [  ], function() {

    var TableGrid = function(orient, chart, grid) {
        var start, size, rowUnit, columnUnit, outerPadding ;

        function getValue(value, max) {
            if (typeof value == 'string' && value.indexOf("%") > -1) {
                return max * (parseFloat(value.replace("%", "")) /100);
            }

            return value;
        }

        function getArrayValue (value, chart) {
            var start;

            if (typeof value == 'number') {
                start = [value, value];
            } else if (typeof value == 'string') {

                if (value.indexOf("%") > -1) {
                    start = [getValue(value, chart.width()), getValue(value,  chart.height())]
                } else {
                    start = [parseFloat(value), parseFloat(value)]
                }

            } else if (value instanceof Array) {
                for(var i = 0; i < value.length; i++) {
                    if (i == 0) {
                        value[i] = getValue(value[i], chart.width());
                    } else if (i == 1) {
                        value[i] = getValue(value[i], chart.height());
                    }
                }

                start = value;
            }

            return start;
        }

        this.drawBefore = function() {
            start = [ 0, 0 ];

            if (grid.start !== null) {
                start = getArrayValue(grid.start, chart);
            }

            size = [chart.width(), chart.height()];
            if (grid.size != null) {
                size = getArrayValue(grid.size, chart);
            }

            var row = grid.row,
                column = grid.column;

            columnUnit = size[0] / column;
            rowUnit = size[1] / row;

            outerPadding = grid.outerPadding;
        }

        this.scale = function(chart) {
            return function(i) {

                var r = Math.floor(i  / column) ;
                var c = i % column;

                var x = c * columnUnit;
                var y = r * rowUnit;

                return {
                    x : x - outerPadding,
                    y : y - outerPadding,
                    width : columnUnit - outerPadding*2,
                    height : rowUnit - outerPadding*2
                }
            }
        }

        this.draw = function() {
            return {
                scale : this.scale(chart)
            };
        }

        this.drawSetup = function() {
            return this.getOptions({
                row : 1,
                column : 1,
                outerPadding : 1
            });
        }
    }
    
    return TableGrid;
}, "chart.grid.core");
