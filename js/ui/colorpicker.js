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

		this.selectDom = function (selector) {
			var $dom = $root.find("." + selector);
			return ($dom.length)  ? $dom : $("<div class='" + selector + "' />");
		};

		this.pos = function (e) {

			if (_.isTouch) {
				return e.originalEvent.touches[0];
			}

			return e;
		}

		this.init = function() {
			self = this, opts = this.options;

			$root = $(this.root);

			this.$colorpicker = this.selectDom('colorpicker');

			this.$color = this.selectDom('color');
			this.$drag_pointer = this.selectDom('drag-pointer');
			this.$value = this.selectDom('value');
			this.$saturation = this.selectDom('saturation');

			this.$hue = this.selectDom('hue');
			this.$hueContainer = this.selectDom('hue-container');
			this.$drag_bar = this.selectDom('drag-bar');

			this.$opacity = this.selectDom('opacity');
			this.$opacityPattern = this.selectDom('opacity-pattern');
			this.$opacityContainer = this.selectDom('opacity-container');
			this.$opacity_drag_bar = this.selectDom('opacity-drag-bar');

			this.$information = this.selectDom('information');
			this.$informationColor = this.selectDom('information-color');
			this.$informationInput = this.selectDom('information-input');

			this.$value.html(this.$drag_pointer);
			this.$saturation.html(this.$value);
			this.$color.html(this.$saturation);



			this.$hueContainer.html(this.$drag_bar);
			this.$hue.html(this.$hueContainer);


			this.$opacityContainer.html(this.$opacity_drag_bar);
			this.$opacity.html(this.$opacityPattern);
			this.$opacity.append(this.$opacityContainer);

			this.$information.html(this.$informationColor);
			this.$information.append(this.$informationInput);

			this.$colorpicker.html(this.$color);
			this.$colorpicker.append(this.$hue);
			this.$colorpicker.append(this.$opacity);
			this.$colorpicker.append(this.$information);

			$root.html(this.$colorpicker);

			this.initEvent();
			initColor();
		}

		this.setColor = function (c) {
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

		function initColor(c) {
			var rgb = color.rgb(c || self.options.color);

			self.$color.css({
				background: self.options.color
			});

			var hsv = color.RGBtoHSV(rgb.r, rgb.g, rgb.b);

			var x = self.$color.width() * hsv.s;
			var y = self.$color.height() * (1-hsv.v);

			self.$drag_pointer.css({
				left : x - 5,
				top : y - 5
			}).data('pos', { x  : x, y : y });

			var hueX = self.$hue.width() * (hsv.h / 360);

			self.$drag_bar.css({
				left : hueX - 7.5
			}).data('pos', { x : hueX });

			var opacityX = self.$opacity.width() * (rgb.a || 0);

			self.$opacity_drag_bar.css({
				left : opacityX - 7.5
			}).data('pos', { x : opacityX });

			setInputColor();
		}

		function setInputColor() {
			var rgb = caculateColor();
			var str = self.getColor('hex');
			console.log(str);
			self.$informationColor.css({
				background: str
			});

			self.$informationInput.html(str).val(str);

			self.emit("change", [ str, rgb ]);
		}

		function setMainColor(e) {
			var offset = self.$color.offset();
			var w = self.$color.width();
			var h = self.$color.height();

			var x = e.clientX - offset.left;
			var y = e.clientY - offset.top;

			if (x < 0) x = 0;
			else if (x > w) x = w;

			if (y < 0) y = 0;
			else if (y > h) y = h;

			self.$drag_pointer.css({
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
			var min = self.$hue.offset().left;
			var max = min + self.$hue.width();
			var current = self.pos(e).clientX;

			if (current < min) {
				dist = 0;
			} else if (current > max) {
				dist = 100;
			} else {
				dist = (current - min) / (max - min) * 100;
			}

			var x = (self.$hue.width() * (dist/100));

			self.$drag_bar.css({
				left: (x -Math.ceil(self.$drag_bar.width()/2)) + 'px'
			}).data('pos', { x : x});

			var hueColor = checkHueColor(dist/100);

			self.$color.css({
				background: hueColor
			});

			setInputColor();
		}

		function setOpacity (e) {
			var min = self.$opacity.offset().left;
			var max = min + self.$opacity.width();
			var current = self.pos(e).clientX;

			if (current < min) {
				dist = 0;
			} else if (current > max) {
				dist = 100;
			} else {
				dist = (current - min) / (max - min) * 100;
			}

			var x = (self.$opacity.width() * (dist/100));

			self.$opacity_drag_bar.css({
				left: (x -Math.ceil(self.$opacity_drag_bar.width()/2)) + 'px'
			}).data('pos', { x : x});

			setInputColor();
		}

		function caculateColor() {
			var pos = self.$drag_pointer.data('pos') || { x : 0, y : 0 };
			var huePos = self.$drag_bar.data('pos') || { x : 0 };
			var opacityPos = self.$opacity_drag_bar.data('pos') || { x : 0 };

			var width = self.$color.width();
			var height = self.$color.height();

			var h = (huePos.x / self.$hue.width()) * 360;
			var s = (pos.x / width);
			var v = ((height - pos.y) / height);

			var a = Math.round((opacityPos.x / self.$opacity.width()) * 100) / 100;

			var rgb = color.HSVtoRGB(h, s, v);

			rgb.a = a;

			return rgb;
		}

		this.initEvent = function () {

			this.$color.on('mousedown', function(e) {
				self.$color.data('isDown', true);
				setMainColor(e);
			});

			this.$drag_bar.on('mousedown', function(e) {
				e.preventDefault();
				self.$hue.data('isDown', true);
			});

			this.$opacity_drag_bar.on('mousedown', function(e) {
				e.preventDefault();
				self.$opacity.data('isDown', true);
			});

			this.$hueContainer.on('mousedown', function(e) {
				self.$hue.data('isDown', true);
				setHueColor(e);
			});

			this.$opacityContainer.on('mousedown', function(e) {
				self.$opacity.data('isDown', true);
				setOpacity(e);
			});

			this.addEvent('body', 'mouseup', function (e) {
				self.$color.data('isDown', false);
				self.$hue.data('isDown', false);
				self.$opacity.data('isDown', false);
			})

			this.addEvent('body', 'mousemove', function (e) {
				if (self.$color.data('isDown')) {
					setMainColor(e);
				}

				if (self.$hue.data('isDown')) {
					setHueColor(e);
				}

				if (self.$opacity.data('isDown')) {
					setOpacity(e);
				}
			});
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