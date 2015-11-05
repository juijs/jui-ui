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

        this.init = function () {
            self = this;
            $root = $(this.root);

            this.initElement();
        }

        this.min = function () {
            return $root.data('min') || this.options.min;
        }

        this.max = function () {
            return $root.data('max') || this.options.max;
        }

        this.orient = function () {
            return $root.data('orient') || this.options.orient;
        }

        this.type = function () {
            return $root.data('type') || this.options.type;
        }

        this.animated = function () {
            return $root.data('animated') || this.options.animated;
        }
        this.striped = function () {
            return $root.data('striped') || this.options.striped;
        }
        this.value = function () {
            return $root.data('value') || this.options.value;
        }

        this.setValue = function (value) {
            var max = this.max();
            var min = this.min();
            value = (typeof value == 'undefined') ? this.value() : value;

            var percent = (value - min) / (max - min) * 100;
            this.setBarSize(percent);
        };

        this.setBarSize = function (percent) {
            if (this.orient() == 'vertical') {
                $bar.height(percent + '%');
            } else {
                $bar.width(percent + '%');
            }
        }

        this.getValue = function (dist) {
            var min = this.min();
            var max = this.max();

            return min + (max - min) * (parseFloat(this.getBarSize().replace('%', '')) / 100);
        };

        this.getBarSize = function () {
            var percent;
            if (this.orient() == 'vertical') {
                percent = $bar.css('height');
            } else {
                percent = $bar.css('width');
            }

            return percent;
        }


        this.initElement = function () {
            $progress = $("<div class='progress' />").addClass(this.orient()).addClass(this.type());
            $area = $("<div class='area' />");
            $bar = $("<div class='bar' />");

            this.setValue();
            this.setStriped();
            this.setAnimated();


            $area.html($bar);
            $progress.html($area);
            $root.html($progress);

        }

        this.setAnimated = function (isAnimated) {
            if (typeof isAnimated == 'undefined') {
                $bar.toggleClass('animated', this.animated());
            } else {
                $bar.toggleClass('animated', isAnimated);
            }
        }

        this.setStriped = function (isStriped) {
            if (typeof isStriped == 'undefined') {
                $bar.toggleClass('striped', this.striped());
            } else {
                $bar.toggleClass('striped', isStriped);
            }
        }

    };

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