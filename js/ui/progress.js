jui.defineUI("ui.progress", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.slider
     * @extends core
     * @alias Slider
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
        var self, $root, $progress, $area, $bar;

        function min() {
            return $root.data('min') || self.options.min;
        }

        function max() {
            return $root.data('max') || self.options.max;
        }

        function orient() {
            return $root.data('orient') || self.options.orient;
        }

        function type() {
            return $root.data('type') || self.options.type;
        }

        function animated() {
            return $root.data('animated') || self.options.animated;
        }

        function striped() {
            return $root.data('striped') || self.options.striped;
        }

        function value() {
            return $root.data('value') || self.options.value;
        }

        function setBarSize(percent) {
            if (orient() == 'vertical') {
                $bar.height(percent + '%');
            } else {
                $bar.width(percent + '%');
            }
        }

        function getBarSize() {
            var percent;
            if (orient() == 'vertical') {
                percent = $bar.css('height');
            } else {
                percent = $bar.css('width');
            }

            return percent;
        }


        function initElement() {
            $progress = $("<div class='progress' />").addClass(orient()).addClass(type());
            $area = $("<div class='area' />");
            $bar = $("<div class='bar' />");

            self.setValue();
            self.setStriped();
            self.setAnimated();

            $area.html($bar);
            $progress.html($area);
            $root.html($progress);
        }

        this.init = function () {
            self = this;
            $root = $(this.root);

            initElement();
        }

        this.setAnimated = function(isAnimated) {
            if (typeof isAnimated == 'undefined') {
                $bar.toggleClass('animated', animated());
            } else {
                $bar.toggleClass('animated', isAnimated);
            }
        }

        this.setStriped = function(isStriped) {
            if (typeof isStriped == 'undefined') {
                $bar.toggleClass('striped', striped());
            } else {
                $bar.toggleClass('striped', isStriped);
            }
        }

        this.setValue = function(v) {
            var v = (typeof v == 'undefined') ? value() : v,
                percent = (v - min()) / (max() - min()) * 100;

            setBarSize(percent);
        }

        this.getValue = function() {
            return min() + (max() - min()) * (parseFloat(getBarSize().replace('%', '')) / 100);
        }
    }

    UI.setup = function() {
        return {
            type: '',       // simple or flat
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