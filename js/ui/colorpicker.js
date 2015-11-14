jui.defineUI("ui.colorpicker", [ "jquery", "util.base", "util.color" ], function($, _, color) {

    /**
     * @class ui.colorpicker
     * @extends core
     * @alias ColorPicker
     * @requires jquery
     * @requires util.base
     * @requires util.color
     */
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
        var $root, $hue, $color, $value, $saturation, $drag_pointer, $drag_bar,
            $control, $controlColor, $hueContainer, $opacity, $opacityPattern, $opacityContainer,
            $opacityInput, $opacity_drag_bar, $information, $informationTitle1, $informationTitle2,
            $informationTitle3, $informationTitle4, $informationInput1, $informationInput2,
            $informationInput3, $informationInput4;

        function setInputColor() {
            var rgb = caculateColor(),
                str = self.getColor('hex');

            $controlColor.css({
                background: str,
                border: "1px solid rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")"
            });

            $informationInput1.val(str);
            $informationInput2.val(rgb.r);
            $informationInput3.val(rgb.g);
            $informationInput4.val(rgb.b);
            $opacityInput.val(Math.floor(rgb.a * 100) + "%");

            self.emit("change", [ str, rgb ]);
        }

        function setMainColor(e) {
            var offset = $color.offset();
            var w = $color.width();
            var h = $color.height();

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
            var min = $hue.offset().left;
            var max = min + $hue.width();
            var current = pos(e).clientX;

            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = ($hue.width() * (dist/100));

            $drag_bar.css({
                left: (x -Math.ceil($drag_bar.width()/2)) + 'px'
            }).data('pos', { x : x});

            var hueColor = checkHueColor(dist/100);

            $color.css({
                background: hueColor
            });

            setInputColor();
        }

        function setOpacity(e) {
            var min = $opacity.offset().left;
            var max = min + $opacity.width();
            var current = pos(e).clientX;

            if (current < min) {
                dist = 0;
            } else if (current > max) {
                dist = 100;
            } else {
                dist = (current - min) / (max - min) * 100;
            }

            var x = ($opacity.width() * (dist/100));

            $opacity_drag_bar.css({
                left: (x -Math.ceil($opacity_drag_bar.width()/2)) + 'px'
            }).data('pos', { x : x});

            setInputColor();
        }

        function caculateColor() {
            var pos = $drag_pointer.data('pos') || { x : 0, y : 0 };
            var huePos = $drag_bar.data('pos') || { x : 0 };
            var opacityPos = $opacity_drag_bar.data('pos') || { x : 0 };

            var width = $color.width();
            var height = $color.height();

            var h = (huePos.x / $hue.width()) * 360;
            var s = (pos.x / width);
            var v = ((height - pos.y) / height);

            var a = Math.round((opacityPos.x / $opacity.width()) * 100) / 100;

            var rgb = color.HSVtoRGB(h, s, v);

            rgb.a = a;

            return rgb;
        }

        function selectDom(selector, tag) {
            var tag = !tag ? "div" : tag,
                $dom = $root.find("." + selector);

            return ($dom.length)  ? $dom : $("<" + tag + " class='" + selector + "' />");
        };

        function pos(e) {
            if (_.isTouch) {
                return e.originalEvent.touches[0];
            }

            return e;
        }

        function initColor(c) {
            var rgb = color.rgb(c || self.options.color);

            $color.css({
                background: self.options.color
            });

            var hsv = color.RGBtoHSV(rgb.r, rgb.g, rgb.b);

            var x = $color.width() * hsv.s;
            var y = $color.height() * (1-hsv.v);

            $drag_pointer.css({
                left : x - 5,
                top : y - 5
            }).data('pos', { x  : x, y : y });

            var hueX = $hue.width() * (hsv.h / 360);

            $drag_bar.css({
                left : hueX - 7.5
            }).data('pos', { x : hueX });

            var opacityX = $opacity.width() * (rgb.a || 0);

            $opacity_drag_bar.css({
                left : opacityX - 7.5
            }).data('pos', { x : opacityX });

            setInputColor();
        }

        function initEvent() {
            $color.on('mousedown', function(e) {
                $color.data('isDown', true);
                setMainColor(e);
            });

            $drag_bar.on('mousedown', function(e) {
                e.preventDefault();
                $hue.data('isDown', true);
            });

            $opacity_drag_bar.on('mousedown', function(e) {
                e.preventDefault();
                $opacity.data('isDown', true);
            });

            $hueContainer.on('mousedown', function(e) {
                $hue.data('isDown', true);
                setHueColor(e);
            });

            $opacityContainer.on('mousedown', function(e) {
                $opacity.data('isDown', true);
                setOpacity(e);
            });

            self.addEvent('body', 'mouseup', function (e) {
                $color.data('isDown', false);
                $hue.data('isDown', false);
                $opacity.data('isDown', false);
            })

            self.addEvent('body', 'mousemove', function (e) {
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
            $color = selectDom('color');
            $drag_pointer = selectDom('drag-pointer');
            $value = selectDom('value');
            $saturation = selectDom('saturation');

            $control = selectDom('control');
            $controlColor = selectDom('color');
            $hue = selectDom('hue');
            $hueContainer = selectDom('container');
            $drag_bar = selectDom('drag-bar');
            $opacity = selectDom('opacity');
            $opacityPattern = selectDom('pattern');
            $opacityContainer = selectDom('container');
            $opacityInput = selectDom('input', 'input');
            $opacity_drag_bar = selectDom('drag-bar2');

            $information = selectDom('information');
            $informationTitle1 = selectDom('title').html("HEX");
            $informationTitle2 = selectDom('title').html("R");
            $informationTitle3 = selectDom('title').html("G");
            $informationTitle4 = selectDom('title').html("B");
            $informationInput1 = selectDom('input', 'input');
            $informationInput2 = selectDom('input', 'input');
            $informationInput3 = selectDom('input', 'input');
            $informationInput4 = selectDom('input', 'input');

            $value.html($drag_pointer);
            $saturation.html($value);
            $color.html($saturation);

            $hueContainer.html($drag_bar);
            $hue.html($hueContainer);

            $opacityContainer.html($opacity_drag_bar);
            $opacity.html($opacityPattern);
            $opacity.append($opacityContainer);

            $control.append($hue);
            $control.append($opacity);
            $control.append($opacityInput);
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

        this.setColor = function(c) {
            initColor(c);
        }

        this.getColor = function(type) {
            var rgb = caculateColor();

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
});