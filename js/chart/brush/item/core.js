jui.define("chart.brush.item.core", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.brush.item.core
     *
     * implements simple brush item
     *
     * @extends chart.draw
     * @requires jquery
     * @requires util.base
     */
	var CoreBrushItem = function() {
        this.drawAfter = function(obj) {

        }
	}

    /** @cfg {Object} item */
    /** @cfg {chart.builder} chart */
    /** @cfg {Object} data */

	return CoreBrushItem;
}, "chart.draw"); 