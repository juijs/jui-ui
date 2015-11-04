jui.defineUI("ui.slider", [ "jquery", "util.base" ], function($, _) {

    /**
     * @class ui.slider
     * @extends core
     * @alias Slider
     * @requires jquery
     * @requires util.base
     */
    var UI = function() {
        var self, $root, $track, $handle, $toHandle, $tooltipTrack, $progress;
        var $tooltip, $tooltipMessage, $tooltip2, $tooltipMessage2;

        this.init = function() {
            self = this;
            $root = $(this.root);

            this.isVertical = (this.options.orient == 'vertical');
            this.initElement();
            this.initEvent();
            this.setValue();
        }

        this.min = function () {
            return $root.data('min') || this.options.min;
        }

        this.max = function () {
            return $root.data('max') || this.options.max;
        }

        this.step = function () {
            return $root.data('step') || this.options.step;
        }

        this.type = function () {
            return $root.data('type') || this.options.type;
        }

        this.isDouble = function () {
            return this.type() == 'double';
        }

        this.isSingle = function () {
            return this.type() == 'single';
        }

        this.isShowProgress = function () {

            return $root.data('progress') == false ? false : this.options.progress;
        }

        this.isShowTooltip = function () {
            return $root.data('tooltip') == false ? false : this.options.tooltip;
        }

        this.getTooltip = function (type) {
            return (type == 'from') ? $tooltip : $tooltip2;
        }

        this.getTooltipMessage = function (type) {
            return (type == 'from') ? $tooltipMessage : $tooltipMessage2;
        }

        this.getHandle = function (type) {
            if (type == 'to') {
                return $toHandle;
            }

            return $handle;
        }

        this.setValue = function (from, to) {
            from = from || $root.data('from') || this.options.from;
            var min = this.min();
            var max = this.max();

            var dist = (from - min) / (max - min) * 100;

            this.setViewStatus(dist, 'from');

            if (this.isDouble()) {
                to = to || $root.data('to') || this.options.to;
                dist2 = (to - min) / (max - min) * 100;

                this.setViewStatus(dist2, 'to');
            }
        }

        this.getValue = function(dist) {
            var min = this.min();
            var max = this.max();
            if (typeof dist == 'undefined') {

                if (this.isVertical) {
                    dist = parseFloat($handle.css('bottom'))/$track.height();
                } else {
                    dist = parseFloat($handle.css('left'))/$track.width();
                }

            }
            var value = (min + (max - min) * dist);
            var temp = value % this.step();

            value = value - temp;

            if (temp >= this.step()/2) {
                value += this.step();
            }

            //TODO: rounding number
            //value = value.toFixed(2);

            return value;
        };


        this.initElement = function () {

            $root.addClass(this.options.orient);

            $track = $("<div class='track' />");
            $tooltipTrack = $("<div class='tooltip-track' />");
            $progress = $("<div class='progress' />");

            if (!this.isShowProgress()) {
                $progress.hide();
            }

            $handle = $("<div class='handle from' />");

            $track.html($progress);
            $track.append($handle);

            if (this.isDouble()) {
                $toHandle = $("<div class='handle to' />");
                $track.append($toHandle);
            }

            var tooltip_orient = this.isVertical ? 'right': 'top';

            $tooltip = $('<div class="tooltip '+tooltip_orient+'"><div class="message" /></div>').hide();
            $tooltipMessage = $tooltip.find(".message");

            $tooltip2 = $('<div class="tooltip '+tooltip_orient+'"><div class="message" /></div>').hide();
            $tooltipMessage2 = $tooltip2.find(".message");

            $tooltipTrack.html($tooltip);
            $tooltipTrack.append($tooltip2);

            $root.html($track);
            $root.append($tooltipTrack);

            if (this.isShowTooltip()) {
                $root.addClass('has-tooltip');
            }
        }

        this.pos = function (e) {

            if (_.isTouch) {
                return e.originalEvent.touches[0];
            }

            return e;
        }

        function getStyleValue($node, key) {
            return $node[0].style[key];
        }

        this.setProgressBar = function () {

            if (this.isSingle()) {
                if (this.isVertical) {
                    $progress.height(getStyleValue($handle, 'bottom')).css({ bottom : 0 });
                } else {
                    $progress.width(getStyleValue($handle, 'left'));
                }
            } else {

                if (this.isVertical) {

                    var toDist = parseFloat(getStyleValue($toHandle, 'bottom').replace('%', ''));
                    var fromDist = parseFloat(getStyleValue($handle, 'bottom').replace('%', ''));

                    $progress.height((toDist - fromDist) + '%').css({
                        bottom : fromDist + '%'
                    });
                } else {

                    var toDist = parseFloat(getStyleValue($toHandle, 'left').replace('%', ''));
                    var fromDist = parseFloat(getStyleValue($handle, 'left').replace('%', ''));

                    $progress.width((toDist - fromDist) + '%').css({
                        left : fromDist + '%'
                    });
                }

            }


        }

        this.checkMaxFromTo = function (dist, type) {

            if (this.isDouble()) {

                if (type == 'from') {

                    if (this.isVertical) {
                        var toDist = parseFloat(getStyleValue($toHandle, 'bottom').replace('%', ''));
                        if (dist >=  toDist) {
                            dist = toDist;
                        }
                    } else {
                        var toDist = parseFloat(getStyleValue($toHandle, 'left').replace('%', ''));
                        if (dist >=  toDist) {
                            dist = toDist;
                        }
                    }

                } else if (type == 'to') {
                    if (this.isVertical) {
                        var fromDist = parseFloat(getStyleValue($handle, 'bottom').replace('%', ''));
                        if (dist <=  fromDist) {
                            dist = fromDist;
                        }
                    } else {
                        var fromDist = parseFloat(getStyleValue($handle, 'left').replace('%', ''));
                        if (dist <=  fromDist) {
                            dist = fromDist;
                        }
                    }
                }
            }

            return dist;
        }

        this.setViewStatus = function (dist, type) {
            var value = this.getValue(dist/100);

            var min = this.min();
            var max = this.max();


            if (value < min) value = min;
            if (value > max) value = max;

            dist = (value - min) / (max - min) * 100;
            dist = this.checkMaxFromTo(dist, type);

            // redefine value
            value = this.getValue(dist/100);

            var percent = dist + '%';

            var $handle = this.getHandle(type)

            if (this.isVertical) {
                $handle.css({ bottom : percent });
            } else {
                $handle.css({ left : percent });
            }

            this.setProgressBar();

            if (this.isShowTooltip()) {

                var $tooltip = this.getTooltip(type);
                var $tooltipMessage = this.getTooltipMessage(type);

                if (_.typeCheck("function", this.options.format)) {
                    value = this.options.format.call(this, value);
                }

                $tooltipMessage.html(value);

                if (this.isVertical) {
                    $tooltip.css({
                        bottom : $track.height() * (dist / 100),
                        'margin-bottom' : -1 * ($tooltip.height()/2)
                    });

                } else {
                    $tooltip.css({
                        left : percent,
                        "margin-left" : -1 * ($tooltip.width()/2)
                    });

                    var xPos = $track.width() * ( dist/100);
                    var lastPos =  xPos + $tooltip.width()/2;
                    var firstPos =  xPos - $tooltip.width()/2;

                    if (lastPos >= $track.width() ) {
                        $tooltip.css({
                            left : $track.width() - $tooltip.width() + $handle.width()/2,
                            'margin-left' : 0
                        }).addClass('last');
                    } else if (firstPos <= 0 ) {
                        $tooltip.css({
                            'left' : -$handle.width()/2,
                            'margin-left' : 0
                        }).addClass('first');
                    } else {
                        $tooltip.removeClass('first last');
                    }
                }

                $tooltip.show();
            }

            if (type == 'from') {
                if (this.preFromValue != value) {
                    this.emit("change", [type, value, this.preFromValue]);
                    this.preFromValue = value;
                }
            } else if (type == 'to') {
                if (this.preToValue != value) {
                    this.emit("change", [type, value, this.preToValue]);
                    this.preToValue = value;
                }
            }

        };

        this.setHandlePosition = function (e, type) {
            var min, max, current;
            var dist = undefined;
            var self = this;
            if (self.options.orient == 'vertical') {
                min = $track.offset().top - $("body").scrollTop();
                max = min + $track.height();
                current = self.pos(e).clientY;

                if (current <= min) {
                    dist = 100;
                } else if (current >= max) {
                    dist = 0;
                } else {
                    dist = (max - current) / (max - min) * 100;

                }

            } else {
                min = $track.offset().left;
                max = min + $track.width();
                current = self.pos(e).clientX;

                if (current < min) {
                    dist = 0;
                } else if (current > max) {
                    dist = 100;
                } else {
                    dist = (current - min) / (max - min) * 100;

                }
            }

            self.setViewStatus(dist, type);
        }

        this.initEvent = function () {
            var self = this;
            this.addEvent($handle, 'mousedown', function(e) {
                $handle.data('select', true);
                $("body").addClass("slider-cursor");
            });

            if (this.isDouble()) {
                this.addEvent($toHandle, 'mousedown', function(e) {
                    $toHandle.data('select', true);
                    $("body").addClass("slider-cursor");
                });
            }

            this.addEvent($track, 'mousedown', function(e) {

                $("body").addClass("slider-cursor");

                if (self.options.type == 'single') {
                    $handle.data('select', true);
                    self.setHandlePosition(e, 'from');
                } else {
                    //TODO: if type is double, check position
                }

            });

            this.addEvent('body', 'mouseup', function(e) {
                $handle.data('select', false);
                if (self.options.type == 'double') {
                    $toHandle.data('select', false);
                }

                $("body").removeClass("slider-cursor");
            });

            this.addEvent('body', 'mousemove', function(e) {
                if ($handle.data('select')) {
                    self.setHandlePosition(e, 'from');
                } else if (self.options.type == 'double' && $toHandle.data('select')) {
                    self.setHandlePosition(e, 'to');
                }
            });

        }

    }

    UI.setup = function() {
        return {
            type : 'single', // or double
            orient : "horizontal", // or vertical,
            min : 0,
            max : 10,
            step : 1,
            from : 0,
            to : 10,
            tooltip : true,
            format : null,
            progress : true

        }
    }

    /**
     * @event change
     * Event that occurs when dragging on a slider
     *
     * @param {Object} data Data of current from
     * @param {jQueryEvent} e The event object
     */

    return UI;
});