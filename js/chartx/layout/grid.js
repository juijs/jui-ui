jui.define("chartx.layout.grid", [ ], function() {

    var GridLayout = function(config) {

        var width = config.width;
        var height = config.height;
        var rows = config.rows || 1;
        var columns = config.columns || 1;
        var hgap = config.hgap || 0;
        var vgap = config.vgap || 0;

        var unitWidth = Math.floor((width - ((columns - 1) * vgap)) / columns);
        var unitHeight = Math.floor((height - ((rows - 1) * hgap)) / rows);
        
        this.render = function(charts) {


            for(var i = 0, len = charts.length; i < len; i++) {
                var tempColumn = i % columns;
                var tempRow = Math.floor(i / columns);

                var tempX = 0;
                var tempY = 0; 
                
                if (tempColumn !== 0) {
                    tempX = (vgap + unitWidth) * tempColumn;
                }

                if (tempRow !== 0) {
                    tempY = (hgap + unitHeight) * tempRow;
                }
                
                this.setBounds(charts[i], tempX, tempY, unitWidth, unitHeight);
            }
        }
    }

    return GridLayout;

}, "chartx.layout.core")
