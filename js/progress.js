jui.defineUI("ui.progress", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.slider
     * @extends core
     * @alias Slider
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
        var self, $root, $area, $bar;

        function min() {
            return self.options.min;
        }

        function max() {
            return self.options.max;
        }

        function orient() {
            return self.options.orient;
        }

        function type() {
            return self.options.type;
        }

        function animated() {
            return self.options.animated;
        }

        function striped() {
            return self.options.striped;
        }

        function value() {
            return self.options.value;
        }

        function setBarSize(percent) {
            if (orient() == "vertical") {
                $bar.height(percent + "%");
            } else {
                $bar.width(percent + "%");
            }
        }

        function getBarSize() {
            var percent;
            if (orient() == "vertical") {
                percent = $bar.css("height");
            } else {
                percent = $bar.css("width");
            }

            return percent;
        }


        function initElement() {
            $root.addClass(orient()).addClass(type());

            $area = $root.find(".area");
            $bar = $root.find(".bar");

            if($area.length == 0) {
                $area = $("<div class='area' />");
                $root.html($area);
            }

            if($bar.length == 0) {
                $bar = $("<div class='bar' />");
                $area.html($bar);
            }

            self.setValue();
            self.setStriped();
            self.setAnimated();
        }

        this.init = function () {
            self = this;
            $root = $(this.root);

            initElement();
        }

        this.setAnimated = function(isAnimated) {
            if (typeof isAnimated == "undefined") {
                $bar.toggleClass("animated", animated());
            } else {
                $bar.toggleClass("animated", isAnimated);
            }
        }

        this.setStriped = function(isStriped) {
            if (typeof isStriped == "undefined") {
                $bar.toggleClass("striped", striped());
            } else {
                $bar.toggleClass("striped", isStriped);
            }
        }

        this.setValue = function(v) {
            var v = (typeof v == "undefined") ? value() : v,
                percent = (v - min()) / (max() - min()) * 100;

            setBarSize(percent);
        }

        this.getValue = function() {
            return min() + (max() - min()) * (parseFloat(getBarSize().replace("%", "")) / 100);
        }
    }

    UI.setup = function() {
        return {
            type: "",       // simple or flat
            orient : "horizontal", // or vertical,
            min : 0,
            max : 100,
            value : 0,
            striped : false,   // or true
            animated : false     // or true
        }
    };

    /**
     * @event change
     * Event that occurs when dragging on a slider
     *
     * @param {Object} data Data of current from
     * @param {jQueryEvent} e The event object
     */

    return UI;
});
