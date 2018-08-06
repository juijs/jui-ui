import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.colorpicker",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");
        var color = jui.include("util.color");

        var UI = function() {
            var self, opts, dist;
            var hue_color = [
                { rgb : '#ff0000', start : .0 },
                { rgb : '#ffff00', start : .17 },
                { rgb : '#00ff00', start : .33 },
                { rgb : '#00ffff', start : .50 },
                { rgb : '#0000ff', start : .67 },
                { rgb : '#ff00ff', start : .83 },
                { rgb : '#ff0000', start : 1 }
            ];

            // TODO: 차후에 컬러픽커 사이즈 변경 고려!!!
            var size = {
                color_width: 226,
                color_height: 145,
                hue_width: 157,
                opacity_width: 119,
                dragBar_width: 12,
                hueContainer_width: 157,
                opacityDragBar_width: 12
            };

            var $root, $hue, $color, $value, $saturation, $drag_pointer, $drag_bar,
                $control, $controlPattern, $controlColor, $hueContainer, $opacity, $opacityContainer,
                $opacityInput, $opacity_drag_bar, $information, $informationTitle1, $informationTitle2,
                $informationTitle3, $informationTitle4, $informationInput1, $informationInput2,
                $informationInput3, $informationInput4;

            function setInputColor(evtType) {
                var rgb = null;

                if (evtType == 'hex') {
                    rgb = color.rgb($informationInput1.val());

                    $informationInput2.val(rgb.r);
                    $informationInput3.val(rgb.g);
                    $informationInput4.val(rgb.b);

                } else if (evtType == 'rgb') {
                    $informationInput1.val(color.format({
                        r : parseInt($informationInput2.val(), 10),
                        g : parseInt($informationInput3.val(), 10),
                        b : parseInt($informationInput4.val(), 10)
                    }, 'hex'));

                    rgb = color.rgb($informationInput1.val());

                } else {
                    var str = self.getColor('hex');

                    $informationInput1.val(str);

                    rgb = color.rgb($informationInput1.val());
                    $informationInput2.val(rgb.r);
                    $informationInput3.val(rgb.g);
                    $informationInput4.val(rgb.b);
                }

                // set alpha
                rgb.a = caculateOpacity();

                // set background
                $controlColor.css("background-color", color.format(rgb, 'hex'));
                $opacityInput.val(Math.floor(rgb.a * 100) + "%");

                // emit change
                self.emit("change", [ color.format(rgb, 'hex' ), rgb ]);
            }

            function setMainColor(e) {
                var offset = $color.offset();
                var w = size.color_width;
                var h = size.color_height;

                var x = e.clientX - offset.left;
                var y = e.clientY - offset.top;

                if (x < 0) x = 0;
                else if (x > w) x = w;

                if (y < 0) y = 0;
                else if (y > h) y = h;

                $drag_pointer.css({
                    left: x - 5,
                    top: y - 5
                }).data('pos', { x: x, y : y});

                setInputColor();
            }

            function checkHueColor(p) {
                var startColor, endColor;

                for(var i = 0; i < hue_color.length;i++) {
                    if (hue_color[i].start >= p) {
                        startColor = hue_color[i-1];
                        endColor = hue_color[i];
                        break;
                    }
                }

                if (startColor && endColor) {
                    var scale = color.scale().domain(startColor.rgb, endColor.rgb);

                    return scale((p - startColor.start)/(endColor.start - startColor.start), 'hex');
                }

                return null;
            }

            function setHueColor(e) {
                var min = $hueContainer.offset().left;
                var max = min + size.hueContainer_width;
                var current = pos(e).clientX;

                if (current < min) {
                    dist = 0;
                } else if (current > max) {
                    dist = 100;
                } else {
                    dist = (current - min) / (max - min) * 100;
                }

                var x = (size.hue_width * (dist/100));

                $drag_bar.css({
                    left: (x -Math.ceil(size.dragBar_width/2)) + 'px'
                }).data('pos', { x : x});

                var hueColor = checkHueColor(dist/100);
                $color.css("background-color", hueColor);

                setInputColor();
            }

            function setOpacity(e) {
                var min = $opacity.offset().left;
                var max = min + size.opacity_width;
                var current = pos(e).clientX;

                if (current < min) {
                    dist = 0;
                } else if (current > max) {
                    dist = 100;
                } else {
                    dist = (current - min) / (max - min) * 100;
                }

                var x = (size.opacity_width * (dist/100));

                $opacity_drag_bar.css({
                    left: (x -Math.ceil(size.opacityDragBar_width/2)) + 'px'
                }).data('pos', { x : x});

                setInputColor();
            }

            function caculateOpacity() {
                var opacityPos = $opacity_drag_bar.data('pos') || { x : 0 };
                var a = Math.round((opacityPos.x / size.opacity_width) * 100) / 100;

                return a;
            }

            function calculateColor() {
                var pos = $drag_pointer.data('pos') || { x : 0, y : 0 };
                var huePos = $drag_bar.data('pos') || { x : 0 };

                var width = size.color_width;
                var height = size.color_height;

                var h = (huePos.x / size.hue_width) * 360;
                var s = (pos.x / width);
                var v = ((height - pos.y) / height);

                var rgb = color.HSVtoRGB(h, s, v);
                rgb.a = caculateOpacity();

                return rgb;
            }

            function selectDom(tag, attr) {
                var tag = !tag ? "div" : tag,
                    $dom = $("<" + tag + " />");

                if(typeof(attr) == "object") {
                    $dom.attr(attr);
                }

                return $dom;
            };

            function pos(e) {
                if (_.isTouch) {
                    return e.originalEvent.touches[0];
                }

                return e;
            }

            function checkNumberKey(e) {
                var code = e.which,
                    isExcept = false;

                if(code == 37 || code == 39 || code == 8 || code == 46 || code == 9)
                    isExcept = true;

                if(!isExcept && (code < 48 || code > 57))
                    return false;

                return true;
            }

            function setRGBtoHexColor(e) {
                var r = $informationInput2.val(),
                    g = $informationInput3.val(),
                    b = $informationInput4.val();

                if(r == "" || g == "" || b == "") return;

                if(parseInt(r) > 255) $informationInput2.val(255);
                else $informationInput2.val(parseInt(r));

                if(parseInt(g) > 255) $informationInput3.val(255);
                else $informationInput3.val(parseInt(g));

                if(parseInt(b) > 255) $informationInput4.val(255);
                else $informationInput4.val(parseInt(b));

                initColor(color.format({
                    r: parseInt($informationInput2.val()),
                    g: parseInt($informationInput3.val()),
                    b: parseInt($informationInput4.val())
                }, "hex"), "rgb");
            }

            function initColor(newColor, evtType) {
                var c = newColor || self.options.color,
                    rgb = color.rgb(c);

                $color.css("background-color", c);

                var hsv = color.RGBtoHSV(rgb.r, rgb.g, rgb.b),
                    x = size.color_width * hsv.s,
                    y = size.color_height * (1-hsv.v);

                $drag_pointer.css({
                    left : x - 5,
                    top : y - 5
                }).data('pos', { x  : x, y : y });

                var hueX = size.hue_width * (hsv.h / 360);

                $drag_bar.css({
                    left : hueX - 7.5
                }).data('pos', { x : hueX });

                var opacityX = size.opacity_width * (rgb.a || 0);

                $opacity_drag_bar.css({
                    left : opacityX - 7.5
                }).data('pos', { x : opacityX });

                setInputColor(evtType);
            }

            function initEvent() {
                self.addEvent($color, 'mousedown', function(e) {
                    $color.data('isDown', true);
                    setMainColor(e);
                });

                self.addEvent($color, 'mouseup', function(e) {
                    $color.data('isDown', false);
                });

                self.addEvent($drag_bar, 'mousedown', function(e) {
                    e.preventDefault();
                    $hue.data('isDown', true);
                });

                self.addEvent($opacity_drag_bar, 'mousedown', function(e) {
                    e.preventDefault();
                    $opacity.data('isDown', true);
                });

                self.addEvent($hueContainer, 'mousedown', function(e) {
                    $hue.data('isDown', true);
                    setHueColor(e);
                });

                self.addEvent($opacityContainer, 'mousedown', function(e) {
                    $opacity.data('isDown', true);
                    setOpacity(e);
                });

                self.addEvent($informationInput1, 'keydown', function(e) {
                    if(e.which < 65 || e.which > 70) {
                        return checkNumberKey(e);
                    }
                });
                self.addEvent($informationInput1, 'keyup', function(e) {
                    var code = $(this).val();

                    if(e.which == 13) {
                        if (code.charAt(0) == '#' && (code.length == 7 || code.length == 4)) {
                            initColor(code, 'hex');
                            self.emit('enter', [ code, color.rgb(code) ]);
                        }
                    }
                });

                self.addEvent($informationInput2, 'keydown', checkNumberKey);
                self.addEvent($informationInput2, 'keyup', setRGBtoHexColor);
                self.addEvent($informationInput3, 'keydown', checkNumberKey);
                self.addEvent($informationInput3, 'keyup', setRGBtoHexColor);
                self.addEvent($informationInput4, 'keydown', checkNumberKey);
                self.addEvent($informationInput4, 'keyup', setRGBtoHexColor);

                self.addEvent(document, 'mouseup', function (e) {
                    $color.data('isDown', false);
                    $hue.data('isDown', false);
                    $opacity.data('isDown', false);
                });

                self.addEvent(document, 'mousemove', function (e) {
                    if ($color.data('isDown')) {
                        setMainColor(e);
                    }

                    if ($hue.data('isDown')) {
                        setHueColor(e);
                    }

                    if ($opacity.data('isDown')) {
                        setOpacity(e);
                    }
                });
            }

            this.init = function() {
                self = this, opts = this.options;

                $root = $(this.root);
                $color = selectDom('div', { 'class': 'color' });
                $drag_pointer = selectDom('div', { 'class': 'drag-pointer' });
                $value = selectDom('div', { 'class': 'value' });
                $saturation = selectDom('div', { 'class': 'saturation' });

                $control = selectDom('div', { 'class': 'control' });
                $controlPattern = selectDom('div', { 'class': 'empty' });
                $controlColor = selectDom('div', { 'class': 'color' });
                $hue = selectDom('div', { 'class': 'hue' });
                $hueContainer = selectDom('div', { 'class': 'container' });
                $drag_bar = selectDom('div', { 'class': 'drag-bar' });
                $opacity = selectDom('div', { 'class': 'opacity' });
                $opacityContainer = selectDom('div', { 'class': 'container' });
                $opacityInput = selectDom('input', { 'class': 'input', 'type': 'text', 'disabled': true });
                $opacity_drag_bar = selectDom('div', { 'class': 'drag-bar2' });

                $information = selectDom('div', { 'class': 'information' });
                $informationTitle1 = selectDom('div', { 'class': 'title' }).html("HEX");
                $informationTitle2 = selectDom('div', { 'class': 'title' }).html("R");
                $informationTitle3 = selectDom('div', { 'class': 'title' }).html("G");
                $informationTitle4 = selectDom('div', { 'class': 'title' }).html("B");
                $informationInput1 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 7 });
                $informationInput2 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 3  });
                $informationInput3 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 3  });
                $informationInput4 = selectDom('input', { 'class': 'input', 'type': 'text', 'maxlength': 3  });

                $value.html($drag_pointer);
                $saturation.html($value);
                $color.html($saturation);

                $hueContainer.html($drag_bar);
                $hue.html($hueContainer);

                $opacityContainer.html($opacity_drag_bar);
                $opacity.html($opacityContainer);

                $control.append($hue);
                $control.append($opacity);
                $control.append($opacityInput);
                $control.append($controlPattern);
                $control.append($controlColor);

                $information.append($informationInput1);
                $information.append($informationInput2);
                $information.append($informationInput3);
                $information.append($informationInput4);
                $information.append($informationTitle1);
                $information.append($informationTitle2);
                $information.append($informationTitle3);
                $information.append($informationTitle4);

                $root.html($color);
                $root.append($control);
                $root.append($information);

                initEvent();
                initColor();
            }

            this.setColor = function(value) {
                if(typeof(value) == "object") {
                    if(!value.r || !value.g || !value.b)
                        return;

                    initColor(color.format(value, "hex"));
                } else if(typeof(value) == "string") {
                    if(value.charAt(0) != "#")
                        return;

                    initColor(value);
                }
            }

            this.getColor = function(type) {
                var rgb = calculateColor();

                if (type) {
                    if (type == 'hex') {
                        if (rgb.a < 1) {
                            type = 'rgb';
                        }
                    }
                    return color.format(rgb, type);
                }

                return rgb;
            }
        }

        UI.setup = function() {
            return {
                type : 'full',
                color : '#FF0000'
            }
        }

        return UI;
    }
}