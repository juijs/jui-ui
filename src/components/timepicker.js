import $ from "jquery"

export default {
    name: "ui.timepicker",
    extend: "event",
    component: function () {
        var UI = function() {
            var $focus = null, minYear, maxYear;

            function getRangeMap(year, month) {
                var lastDate = new Date(year, month, 0);

                var rangeMap = {
                    min: {
                        year: minYear,
                        month: 1,
                        date: 1,
                        hours: 0,
                        minutes: 0
                    },
                    max: {
                        year: maxYear,
                        month: 12,
                        date: lastDate.getDate(),
                        hours: 23,
                        minutes: 59
                    }
                }

                return rangeMap;
            }

            function printLowNumber(value) {
                return value < 10 ? "0" + value : value;
            }

            function validNumberType(evt) {
                var theEvent = evt || window.event,
                    key = theEvent.keyCode || theEvent.which;
                key = String.fromCharCode( key );

                var regex = /[0-9]|\./;
                if(!regex.test(key)) {
                    theEvent.returnValue = false;

                    if(theEvent.preventDefault) {
                        theEvent.preventDefault();
                    }
                }
            }

            function updateNumberValue(elem, min, max) {
                var val = parseInt($(elem).val());

                if(!isNaN(val)) {
                    if(val > max) $(elem).val(max);
                    if(val < min) $(elem).val(printLowNumber(min));
                } else {
                    $(elem).val(printLowNumber(min));
                }
            }

            function updateUpDownValue(elem, dist) {
                var val = parseInt($(elem).val());

                var res = val + (dist || 0);
                if(res < 0) res = 0;

                $(elem).val(printLowNumber(res));
            }

            function updateBtnValue(elem, dist, min, max, focusout) {
                if(!focusout) $(elem).focus();

                updateUpDownValue(elem, dist);
                updateNumberValue(elem, min, max);
            }

            function settingKeyUpEvent(e) {
                var $root = $(e.target).parent();

                var dist = 0,
                    focusKey = $focus.attr("class"),
                    rangeMap = getRangeMap($root.find(".year").val(), $root.find(".month").val());

                if(e.which == 38) dist = 1;
                else if(e.which == 40) dist = -1;

                if(dist != 0) {
                    updateBtnValue(e.target, dist, rangeMap.min[focusKey], rangeMap.max[focusKey]);
                }
            }

            function initInputElements(self) {
                var year = self.options.year,
                    month = self.options.month,
                    date = self.options.date,
                    hours = self.options.hours,
                    minutes = self.options.minutes;

                var $year = $(self.root).find(".year").attr("maxlength", 4),
                    $month = $(self.root).find(".month").attr("maxlength", 2),
                    $date = $(self.root).find(".date").attr("maxlength", 2),
                    $hours = $(self.root).find(".hours").attr("maxlength", 2),
                    $minutes = $(self.root).find(".minutes").attr("maxlength", 2);

                $year.on("keypress", validNumberType);
                $year.on("keyup", settingKeyUpEvent);
                $year.on("focusout", function(e) {
                    updateBtnValue(this, 0, minYear, maxYear, true);
                    emitChangeEvent(self);
                });
                $year.on("focus", function(e) {
                    $focus = $year;
                    $focus.select();
                });

                $month.on("keypress", validNumberType);
                $month.on("keyup", settingKeyUpEvent);
                $month.on("focusout", function(e) {
                    updateBtnValue(this, 0, 1, 12, true);
                    emitChangeEvent(self);
                });
                $month.on("focus", function(e) {
                    $focus = $month;
                    $focus.select();
                });

                $date.on("keypress", validNumberType);
                $date.on("keyup", settingKeyUpEvent);
                $date.on("focusout", function(e) {
                    var rangeMap = getRangeMap($year.val(), $month.val());
                    updateBtnValue(this, 0, 1, rangeMap.max.date, true);
                    emitChangeEvent(self);
                });
                $date.on("focus", function(e) {
                    $focus = $date;
                    $focus.select();
                });

                $hours.on("keypress", validNumberType);
                $hours.on("keyup", settingKeyUpEvent);
                $hours.on("focusout", function(e) {
                    updateBtnValue(this, 0, 0, 23, true);
                    emitChangeEvent(self);
                });
                $hours.on("focus", function(e) {
                    $focus = $hours;
                    $focus.select();
                });

                $minutes.on("keypress", validNumberType);
                $minutes.on("keyup", settingKeyUpEvent);
                $minutes.on("focusout", function(e) {
                    updateBtnValue(this, 0, 0, 59, true);
                    emitChangeEvent(self);
                });
                $minutes.on("focus", function(e) {
                    $focus = $minutes;
                    $focus.select();
                });

                // 초기값 설정
                $year.val(year);
                $month.val(printLowNumber(month));
                $date.val(printLowNumber(date));
                $hours.val(printLowNumber(hours));
                $minutes.val(printLowNumber(minutes));

                // 초기 선택된 넘버 박스
                $focus = ($year.length == 0)  ? $hours : $year;
            }

            function emitChangeEvent(self) {
                self.emit("change", {
                    year: self.getYear(),
                    month: self.getMonth(),
                    date: self.getDate(),
                    hours: self.getHours(),
                    minutes: self.getMinutes()
                });
            }

            function initBtnElements(self) {
                var $up = $("<div></div>"),
                    $down = $("<div></div>"),
                    $year = $(self.root).find(".year"),
                    $month = $(self.root).find(".month"),
                    $hours = $(self.root).find(".hours"),
                    $minutes = $(self.root).find(".minutes");

                // 년/월/일 모드일 때, 위/아래 숫자 변경은 사용하지 않는다.
                if($hours.length == 0 || $minutes.length == 0) return;

                var size = $(self.root).outerHeight() / 2,
                    styles = {
                        position: "absolute",
                        width: size,
                        height: size,
                        cursor: "pointer",
                        right: "2px"
                    };

                $up.css($.extend({ top: "0px" }, styles));
                $down.css($.extend({ top: size + "px" }, styles));

                $up.on("mouseup", function(e) {
                    var focusKey = $focus.attr("class"),
                        rangeMap = getRangeMap($year.val(), $month.val());

                    updateBtnValue($focus[0], 1, rangeMap.min[focusKey], rangeMap.max[focusKey]);
                    emitChangeEvent(self);

                    return false;
                });
                $down.on("mouseup", function(e) {
                    var focusKey = $focus.attr("class"),
                        rangeMap = getRangeMap($year.val(), $month.val());

                    updateBtnValue($focus[0], -1, rangeMap.min[focusKey], rangeMap.max[focusKey]);
                    emitChangeEvent(self);

                    return false;
                });

                $(self.root).append($up);
                $(self.root).append($down);
            }

            this.init = function() {
                minYear = this.options.minYear;
                maxYear = this.options.maxYear;

                initInputElements(this);
                initBtnElements(this);

                return this;
            }

            this.setYear = function(year) {
                var $year = $(this.root).find(".year").val(year);
                updateBtnValue($year[0], 0, minYear, maxYear);
            }

            this.getYear = function() {
                return parseInt($(this.root).find(".year").val());
            }

            this.setMonth = function(month) {
                var $month = $(this.root).find(".month").val(month);
                updateBtnValue($month[0], 0, 1, 12);
            }

            this.getMonth = function() {
                return parseInt($(this.root).find(".month").val());
            }

            this.setDate = function(date) {
                var rangeMap = getRangeMap(this.getYear(), this.getMonth());
                var $date = $(this.root).find(".date").val(date);

                updateBtnValue($date[0], 0, 1, rangeMap.max.date);
            }

            this.getDate = function() {
                return parseInt($(this.root).find(".date").val());
            }

            this.setHours = function(hours) {
                var $hours = $(this.root).find(".hours").val(hours);
                updateBtnValue($hours[0], 0, 0, 23);
            }

            this.getHours = function() {
                return parseInt($(this.root).find(".hours").val());
            }

            this.setMinutes = function(minutes) {
                var $minutes = $(this.root).find(".minutes").val(minutes);
                updateBtnValue($minutes[0], 0, 0, 59);
            }

            this.getMinutes = function() {
                return parseInt($(this.root).find(".minutes").val());
            }
        }

        UI.setup = function() {
            var now = new Date();

            return {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                date: now.getDate(),
                hours: now.getHours(),
                minutes: now.getMinutes(),

                minYear: 2015,
                maxYear: 2020
            };
        }

        return UI;
    }
}