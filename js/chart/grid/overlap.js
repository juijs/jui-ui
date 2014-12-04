jui.define("chart.grid.overlap", [  ], function() {

    var OverlapGrid = function(orient, chart, grid) {
        var size, widthUnit, heightUnit, width, height ;

        function getXY ( i ) {
            var x = width/2  - i * widthUnit;
            var y = height/2 - i * heightUnit;

            return { x : x , y : y }
        }

        this.drawBefore = function() {
            size = grid.size || chart.data().length ||  1;

            widthUnit = (chart.width() / 2) / size;
            heightUnit = (chart.height() / 2) / size;

            width = chart.width();
            height = chart.height();
        }

        this.scale = function(chart) {
            return function(i) {
                var obj = getXY(size - i);

                return {
                    x : obj.x,
                    y : obj.y,
                    width : Math.abs(width/2 - obj.x)*2,
                    height : Math.abs(height/2 - obj.y)*2
                }
            }
        }

        this.draw = function() {
            return {
                scale : this.scale(chart)
            };
        }

        this.drawSetup = function() {
            return this.getOptions();
        }

    }
    
    return OverlapGrid;
}, "chart.grid.core");
