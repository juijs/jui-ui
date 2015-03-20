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
                if(type.startsWith("chart.") && _.typeCheck("integer", axisIndex)) {
                    var axis = self.chart.axis(axisIndex),
                        e = arguments[0];

                    if(_.typeCheck("object", axis)) {
                        var top = axis.padding("top") + axis.area("y"),
                            left = axis.padding("left") + axis.area("x");

                        if((e.chartY >= top && e.chartY <= top + axis.area("height")) &&
                            (e.chartX >= left && e.chartX <= left + axis.area("width"))) {
                            e.axisX = e.chartX - left;
                            e.axisY = e.chartY - top

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