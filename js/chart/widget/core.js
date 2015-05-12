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

        /**
         * @method drawAfter  
         * @param {Object} obj
         */
        this.drawAfter = function(obj) {
            obj.attr({ "class": "widget widget-" + this.widget.type });
        }

        this.getIndexArray = function(index) {
            var list = [ 0 ];

            if(_.typeCheck("array", index)) {
                list = index;
            } else if(_.typeCheck("integer", index)) {
                list = [ index ];
            }

            return list;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.on = function(type, callback, axisIndex) {
            var self = this;

            return this.chart.on(type, function() {
                if(_.startsWith(type, "axis.") && _.typeCheck("integer", axisIndex)) {
                    var axis = self.chart.axis(axisIndex),
                        e = arguments[0];

                    if (_.typeCheck("object", axis)) {
                        if (arguments[1] == axisIndex) {
                            callback.apply(self, [ e ]);
                        }
                    }
                } else {
                    callback.apply(self, arguments);
                }
            }, this.isRender() ? "render" : "renderAll");
        }
	}

    CoreWidget.setup = function() {

        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} widget */
        /** @property {Number} index [Read Only] Index which shows the sequence how a widget is drawn. */

        return {
            /**
             * @cfg {Boolean} [render=false] Determines whether a widget is to be rendered.
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