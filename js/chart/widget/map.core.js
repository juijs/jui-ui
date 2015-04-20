jui.define("chart.widget.map.core", [], function() {

    /**
     * @class chart.widget.map.core
     * @extends chart.widget.core
     */
    var MapCoreWidget = function(chart, axis, widget) {
    }

    MapCoreWidget.setup = function() {
        return {
            axis: 0
        }
    }

    return MapCoreWidget;
}, "chart.widget.core");