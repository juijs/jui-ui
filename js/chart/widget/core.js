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

        /**
         * @method drawAfter  
         * @param {Object} obj
         */
        this.drawAfter = function(obj) {
            obj.attr({ "class": "widget widget-" + this.widget.type });
        }

        /**
         * @method eachBrush 
         * traverse each brush 
         * @param {Function} callback
         */
        this.eachBrush = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = getIndexArray(this.widget.brush);

            for(var i = 0; i < list.length; i++) {
                callback.apply(this, [ i, this.chart.get("brush", list[i]) ]);
            }
        }

        /**
         * @method listBrush 
         * 
         * 연결된 브러쉬 객체 목록을 가지고 온다. 
         *  
         * @returns {Array}
         */
        this.listBrush = function() {
            var list = getIndexArray(this.widget.brush),
                result = [];

            for(var i = 0; i < list.length; i++) {
                result[i] = this.chart.get("brush", list[i]);
            }

            return result;
        }

        /**
         * @method getBrush 
         * 연결된 브러쉬를 가지고 온다. 
         *  
         * @param {Number} index 
         * @returns {*}
         */
        this.getBrush = function(index) {
            return this.listBrush()[index];
        }

        /**
         * @method existBrush 
         * 연결된 브러쉬가 존재하는지 체크한다.
         *
         * @param {Number} index
         * @returns {Boolean}
         */
        this.existBrush = function(index) {
            var list = getIndexArray(this.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.on = function(type, callback) {
            return this.chart.on(type, callback, (this.isRender() ? "render" : "renderAll"));
        }
	}

    CoreWidget.setup = function() {

        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} widget */
        
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