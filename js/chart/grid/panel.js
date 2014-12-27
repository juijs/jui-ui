jui.define("chart.grid.panel", [  ], function() {

    var PanelGrid = function(chart, axis, grid) {
        var start, size;

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
                    start = [getValue(value, chart.area('width')), getValue(value,  chart.area('height'))]
                } else {
                    start = [parseFloat(value), parseFloat(value)]
                }

            } else if (value instanceof Array) {

                for(var i = 0; i < value.length; i++) {
                    if (i == 0) {
                        value[i] = getValue(value[i], chart.area('width'));
                    } else if (i == 1) {
                        value[i] = getValue(value[i], chart.area('height'));
                    }
                }

                start = value;
            }

            return start;
        }

        this.drawBefore = function() {
            start = [0, 0];

            if (grid.start !== null) {
                start = getArrayValue(grid.start, chart);
            }

            size = [chart.area('width'), chart.area('height')];
            if (grid.size != null) {
                size = getArrayValue(grid.size, chart);
            }
        }

        this.scale = function() {
            return function() {
                return {
                    x : start[0],
                    y : start[1],
                    width : size[0],
                    height : size[1]
                }
            }
        }

        this.draw = function() {
            return {
                scale : this.scale(chart)
            };
        }

    }
    
    return PanelGrid;
}, "chart.grid.core");
