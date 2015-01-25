jui.define("chart.widget.core", [ "jquery", "util.base" ], function($, _) {


    /**
     * @class chart.widget.core
     * implements core widget
     * @extends chart.draw
     * @alias CoreWidget
     * @requires util.base
     * @requires jquery
     *
     */
	var CoreWidget = function() {
        function getIndexArray(brush) {
            var list = [ 0 ];

            if(_.typeCheck("array", brush)) {
                list = brush;
            } else if(_.typeCheck("integer", brush)) {
                list = [ brush ];
            }

            return list;
        }

        this.drawAfter = function(obj) {
            obj.attr({ "class": "widget widget-" + this.widget.type });
        }

        this.eachBrush = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = getIndexArray(this.widget.brush);

            for(var i = 0; i < list.length; i++) {
                callback.apply(this, [ i, this.chart.get("brush", list[i]) ]);
            }
        }

        this.listBrush = function() {
            var list = getIndexArray(this.widget.brush),
                result = [];

            for(var i = 0; i < list.length; i++) {
                result[i] = this.chart.get("brush", list[i]);
            }

            return result;
        }

        this.getBrush = function(index) {
            return this.listBrush()[index];
        }

        this.existBrush = function(index) {
            var list = getIndexArray(this.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.on = function(type, callback) {
            return this.chart.on(type, callback, this.isRender());
        }
	}

    CoreWidget.setup = function() {
        return {
            /**
             * @cfg {Number} [brush=0] selected brush index  
             */
            brush: 0,
            /**
             * @cfg {Boolean} [render=false] check whether widget redraw
             */            
            render: false,
            /**
             * @cfg {Number} [index=0] current widget index
             */
            index: 0
        }
    }

	return CoreWidget;
}, "chart.draw"); 