jui.defineUI("chartx.layout", ["util.svg", "chart.builder"], function(SVG, ChartBuilder) {

    /**
     * @class chartx.layout
     * implements layout form many charts 
     * 
     * @sxample 
     *      
     *      var ChartLayout = jui.include("chartx.layout");
     *      new ChartLayout({
     *          width : "100%",
     *          height : "100%",
                layout : "table",
                charts : [
                    { axis : {}, brush : [], widget : [], layout : { column : 2, row : 1 }  },
                    { axis : {}, brush : [], widget : [], layout : { column : 2, row : 1 }  }
                ]
     *      });      
     */
    var ChartLayout = function() {

        var ChartLayout = null;
        var chart_list = []; 
        var svg = null;
        
        /**
         * Constructor 
         *
         * @constructor ChartLayout  
         */
        this.init = function() {
            
            svg = new SVG(this.root);
            svg.size(this.options.width, this.options.height);
            
            if (this.options.x != null) {
                svg.root.attr({
                    x : this.options.x,
                    y : this.options.y
                })
            }

        }
        
        // TODO: implements event delivery
        
        this.setBounds = function(x, y, width, height) {

            svg.root.attr({
                x : x,
                y : y,
                width : width,
                height : height 
            })
            
            this.render();
        }
        
        this.render = function() {

            // caculate layout size
            var size = svg.size();
            var width = size.width;
            var height = size.height;

            var layoutObject = this.options.name;
            
            if (typeof layoutObject == 'string') {
                layoutObject = { name : layoutObject };
            }
            
            layoutObject = $.extend({
                x : this.options.x,
                y : this.options.y,
                width : width,
                height : height
            }, layoutObject);
            
            var Layout = jui.include("chartx.layout." + layoutObject.name);
            new Layout(layoutObject).render(this.options.charts);

            for(var i = 0, len = this.options.charts.length; i < len; i++) {
                var chart = this.options.charts[i];
            
                if (chart_list[i]) {
                    chart_list[i].setBounds(chart.x, chart.y, chart.width, chart.height);
                } else {
                    if (chart.type && chart.type == 'layout') {
                        chart_list[i] = jui.create("chartx.layout", svg.root.element, chart);
                    } else {
                        chart_list[i] = jui.create("chart.builder", svg.root.element, chart);
                    }

                    chart_list[i].render();
                }

            }
            
        }
    }

    ChartLayout.setup = function() {
        return {
            x : 0,
            y : 0,
            width : "100%",		// chart 기본 넓이
            height : "100%",		// chart 기본 높이
            type : "default",
            charts : []

        }
    }
    
})