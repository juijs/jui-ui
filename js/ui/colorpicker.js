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

		var self, opts;
		var $root, $hue, $color, $value, $saturation, $drag_pointer, $drag_bar;
		var hue_color = [
			{rgb : '#ff0000', start : .0},
			{rgb : '#ffff00', start : .17},
			{rgb : '#00ff00', start : .33},
			{rgb : '#00ffff', start : .50},
			{rgb : '#0000ff', start : .67},
			{rgb : '#ff00ff', start : .83},
			{rgb : '#ff0000', start : 1}
		];


		this.init = function() {
			self = this, opts = this.options;

			$root = $(this.root);

			$color = $root.find(".color");
			$value = $root.find(".value");
			$hue = $root.find(".hue");
			$saturation = $root.find(".saturation");
			$drag_pointer = $root.find(".drag-pointer");
			$drag_bar = $root.find(".drag-bar");
			$input = $root.find(".information input[type=text]");

			setEvent();

			initColor();
		}

		this.setColor = function (c) {
			initColor(c);
		}

		this.getColor = function(type) {
			var rgb = caculateColor();

			if (type) {
				return color.format(rgb, type);
			}

			return rgb;
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

			var hueY = $hue.height() * (hsv.h / 360);

			$drag_bar.css({
				top : hueY - 5  < 0 ? 0 : hueY - 5
			}).data('pos', { y : hueY });

			setInputColor();
		}

		function setInputColor() {

			var rgb = caculateColor();
			var str = color.format(rgb, 'hex');
			$input.css({
				background: str,
				color : caculateFontColor()
			}).val(str);

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

		function setHueColor (e) {
			var offset = $color.offset();
			var h = $color.height();

			var y = e.clientY - offset.top;

			if (y < 0) y = 0;
			else if (y > h) y = h;

			$drag_bar.css({
				top: y - 5
			}).data('pos', { y : y});

			var hueColor = checkHueColor(y/h);

			$color.css({
				background: hueColor
			});

			setInputColor();
		}

		function caculateColor() {
			var pos = $drag_pointer.data('pos') || { x : 0, y : 0 };
			var huePos = $drag_bar.data('pos') || { y : 0 };

			var h = (huePos.y / $hue.height()) * 360;
			var s = (pos.x / $color.width());
			var v = (($color.height() - pos.y) / $color.height());

			var rgb = color.HSVtoRGB(h, s, v);

			return rgb;
		}

		function caculateFontColor() {
			var pos = $drag_pointer.data('pos') || { x : 0, y : 0 };
			var huePos = $drag_bar.data('pos') || { y : 0 };

			if (pos.x / $color.width() < .5) {
				if (pos.y / $color.height() < .3) {
					return "rgb(34, 34, 34)";
				}
			}

			return "rgb(221,221,221)";
		}

		function setEvent() {
			$color.on('mousedown', function(e) {
				e.preventDefault();
				$color.data('isDown', true);
				setMainColor(e);
			});

			$color.on('mouseup', function(e) {
				e.preventDefault();
				$color.data('isDown', false);
			})

			$color.on('mousemove', function(e) {
				e.preventDefault();
				if ($color.data('isDown')) {
					setMainColor(e);
				}
			})

			$hue.on('mousedown', function(e) {
				e.preventDefault();
				$hue.data('isDown', true);
				setHueColor(e);
			});

			$hue.on('mouseup', function(e) {
				e.preventDefault();
				$hue.data('isDown', false);
			})

			$hue.on('mousemove', function(e) {
				e.preventDefault();
				if ($hue.data('isDown')) {
					setHueColor(e);
				}
			})
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