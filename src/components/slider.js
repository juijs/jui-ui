import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.slider",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");
        var math = jui.include("util.math");

        var UI = function() {
            var self, isVertical, preFromValue, preToValue;
            var $root, $track, $handle, $toHandle, $tooltipTrack, $progress;
            var $tooltip, $tooltipMessage, $tooltip2, $tooltipMessage2;

            function min() {
                return self.options.min;
            }

            function max() {
                return self.options.max;
            }

            function step() {
                return self.options.step;
            }

            function type() {
                return self.options.type;
            }

            function isDouble() {
                return type() == 'double';
            }

            function isSingle() {
                return type() == 'single';
            }

            function isShowProgress() {

                return $root.data('progress') == false ? false : self.options.progress;
            }

            function isShowTooltip() {
                return $root.data('tooltip') == false ? false : self.options.tooltip;
            }

            function getTooltip(type) {
                return (type == 'from') ? $tooltip : $tooltip2;
            }

            function getTooltipMessage(type) {
                return (type == 'from') ? $tooltipMessage : $tooltipMessage2;
            }

            function getHandle(type) {
                if (type == 'to') {
                    return $toHandle;
                }

                return $handle;
            }

            function pos(e) {
                if (_.isTouch) {
                    return e.originalEvent.touches[0];
                }

                return e;
            }

            function getStyleValue($node, key) {
                return $node[0].style[key];
            }

            function setProgressBar() {
                if (isSingle()) {
                    if (isVertical) {
                        $progress.height(getStyleValue($handle, 'bottom')).css({ bottom : 0 });
                    } else {
                        $progress.width(getStyleValue($handle, 'left'));
                    }
                } else {
                    if (isVertical) {
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

            function checkMaxFromTo(dist, type) {
                if (isDouble()) {
                    if (type == 'from') {
                        if (isVertical) {
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
                        if (isVertical) {
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

            function setViewStatus(dist, type) {
                var value = getValue(dist/100);

                if (value < min()) value = min();
                if (value > max()) value = max();

                dist = (value - min()) / (max() - min()) * 100;
                dist = checkMaxFromTo(dist, type);

                // redefine value
                value = getValue(dist/100);

                var percent = dist + '%';
                var $handle = getHandle(type)

                if (isVertical) {
                    $handle.css({ bottom : percent });
                } else {
                    $handle.css({ left : percent });
                }

                setProgressBar();

                if (isShowTooltip()) {
                    var $tooltip = getTooltip(type);
                    var $tooltipMessage = getTooltipMessage(type);

                    if (_.typeCheck("function", self.options.format)) {
                        value = self.options.format.call(self, value);
                    }

                    $tooltipMessage.html(value);

                    if (isVertical) {
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
                    if (preFromValue != value) {
                        self.emit("change", [ { type: type, from: value, to: self.getToValue() } ]);
                        preFromValue = value;
                    }
                } else if (type == 'to') {
                    if (preToValue != value) {
                        self.emit("change", [ { type: type, from: self.getFromValue(), to: value } ]);
                        preToValue = value;
                    }
                }

            }

            function setHandlePosition(e, type) {
                var min, max, current;
                var dist = undefined;

                if (self.options.orient == 'vertical') {
                    min = $track.offset().top - $("body").scrollTop();
                    max = min + $track.height();
                    current = pos(e).clientY;

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
                    current = pos(e).clientX;

                    if (current < min) {
                        dist = 0;
                    } else if (current > max) {
                        dist = 100;
                    } else {
                        dist = (current - min) / (max - min) * 100;
                    }
                }

                setViewStatus(dist, type);
            }

            function getValue(dist) {
                if (typeof dist == 'undefined') {

                    if (isVertical) {
                        dist = parseFloat($handle.css('bottom'))/$track.height();
                    } else {
                        dist = parseFloat($handle.css('left'))/$track.width();
                    }
                }

                var minValue = min();
                var maxValue = max();

                var value = (minValue + (maxValue - minValue) * dist);

                var stepValue = step();
                var temp = math.remain(value, stepValue);

                value = math.minus(value, temp);

                if (temp > math.div(stepValue, 2)) {
                    value = math.plus(value, stepValue);
                }

                return value;
            }

            function initElement() {
                $root.addClass(self.options.orient);

                $track = $("<div class='track' />");
                $tooltipTrack = $("<div class='tooltip-track' />");
                $progress = $("<div class='progress' />");

                if (!isShowProgress()) {
                    $progress.hide();
                }

                $handle = $("<div class='handle from' />");
                $track.html($progress);
                $track.append($handle);

                if (isDouble()) {
                    $toHandle = $("<div class='handle to' />");
                    $track.append($toHandle);
                }

                var tooltip_orient = isVertical ? 'right': 'top';

                $tooltip = $('<div class="tooltip '+tooltip_orient+'"><div class="message" /></div>').hide();
                $tooltipMessage = $tooltip.find(".message");

                $tooltip2 = $('<div class="tooltip '+tooltip_orient+'"><div class="message" /></div>').hide();
                $tooltipMessage2 = $tooltip2.find(".message");

                $tooltipTrack.html($tooltip);
                $tooltipTrack.append($tooltip2);

                $root.html($track);
                $root.append($tooltipTrack);

                if (isShowTooltip()) {
                    $root.addClass('has-tooltip');
                }
            }

            function initEvent() {
                self.addEvent($handle, 'mousedown', function(e) {
                    $handle.data('select', true);
                    $("body").addClass("slider-cursor");
                });

                if (isDouble()) {
                    self.addEvent($toHandle, 'mousedown', function(e) {
                        $toHandle.data('select', true);
                        $("body").addClass("slider-cursor");
                    });
                }

                self.addEvent($track, 'mousedown', function(e) {
                    $("body").addClass("slider-cursor");

                    if (self.options.type == 'single') {
                        $handle.data('select', true);
                        setHandlePosition(e, 'from');
                    } else {
                        //TODO: if type is double, check position
                    }
                });

                self.addEvent('body', 'mouseup', function(e) {
                    $handle.data('select', false);
                    if (self.options.type == 'double') {
                        $toHandle.data('select', false);
                    }

                    $("body").removeClass("slider-cursor");
                });

                self.addEvent('body', 'mousemove', function(e) {
                    if ($handle.data('select')) {
                        setHandlePosition(e, 'from');
                    } else if (self.options.type == 'double' && $toHandle.data('select')) {
                        setHandlePosition(e, 'to');
                    }
                });
            }

            this.init = function() {
                self = this;
                $root = $(this.root);

                isVertical = (this.options.orient == 'vertical');
                initElement();
                initEvent();

                this.setFromValue();
                this.setToValue();
            }

            /**
             * @method setFromValue
             * set FromHandle's value
             *
             * @param {Number}
             */
            this.setFromValue = function(value) {
                var from = value || $root.data("from") || this.options.from,
                    dist = (from - min()) / (max() - min()) * 100;

                setViewStatus(dist, "from");
            }

            /**
             * @method setToValue
             * set ToHandle's value
             *
             * @param {Number}
             */
            this.setToValue = function(value) {
                if (isDouble()) {
                    var to = value || $root.data("to") || this.options.to,
                        dist = (to - min()) / (max() - min()) * 100;

                    setViewStatus(dist, "to");
                }
            }

            /**
             * @method getFromValue
             * get FromHandle's value
             *
             * @return {Number} value
             */
            this.getFromValue = function() {
                return getValue();
            }

            /**
             * @method getToValue
             * get ToHandle's value
             *
             * @return {Number} value
             */
            this.getToValue = function () {
                var dist;

                if(isDouble()) {
                    if (isVertical) {
                        dist = parseFloat($toHandle.css("bottom")) / $track.height();
                    } else {
                        dist = parseFloat($toHandle.css("left")) / $track.width();
                    }

                    return getValue(dist);
                }

                return getValue();
            }
        }

        UI.setup = function() {
            return {
                type : "single", // or double
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
    }
}