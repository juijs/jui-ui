jui.define("chart.brush.fillgauge", [ "util.math" ], function(math) {

	/**
	 * 내가 원하는 모양의 gauge 를 만드는 클래스 
	 * 
	 * svg 로드 가능 
	 * 
	 * circle, rect 기본 지원 
	 * 
	 * use image 사용 가능 ? 
	 *  
 	 * @param {Object} brush
	 */
	var FillGaugeBrush = function(brush) {
		this.drawBefore = function(chart) {
			var width = chart.width(), height = chart.height();
			var min = width;

			if (height < min) {
				min = height;
			}

			this.w = min / 2;
			this.centerX = width / 2;
			this.centerY = height / 2;
			this.outerRadius = this.w;

			this.min = typeof brush.min == 'undefined' ? 0 : parseFloat(brush.min);
			this.max = typeof brush.max == 'undefined' ? 100 : parseFloat(brush.max);

			this.value = typeof brush.value == 'undefined' ? 0 : brush.value;
			this.shape = typeof brush.shape == 'undefined' ? 'circle' : brush.shape;
			
			this.clipId = chart.createId('fill-gauge');

			var clip = chart.svg.clipPath({
				id : this.clipId
			})

			this.rect = chart.svg.rect({
				x : 0,
				y : 0,
				width : 0,
				height : 0
			})

			clip.append(this.rect);

			chart.defs.append(clip)

		}

		this.drawPath = function(chart, group, path) {
			group.append(chart.svg.path({
				x : 0,
				y : 0,
				fill : "#ececec",
				d : path
			}))

			group.append(chart.svg.path({
				x : 0,
				y : 0,
				fill : chart.color(0),
				d : path,
				"clip-path" : "url(#" + this.clipId + ")"
			}))
		}
		
		this.direction = function(chart, direction) {
			
			direction = direction || 'vertical';

			var rate = (this.value - this.min) / (this.max - this.min);
						
			if (direction == 'vertical') {
				var height = chart.height() * rate;
				var width = chart.width();
				var x = 0; 
				var y = chart.height() - height;

				
			} else {		// horizontal 
				var height = chart.height();
				var width = chart.width() * rate;
				var x = 0; 
				var y = 0;
			}
			
			this.rect.attr({
				x : x,
				y : y,
				width : width,
				height : height
			})
			
		}

		this.draw = function(chart) {

			var self = this; 
			var group = chart.svg.group({
				'class' : 'brush fill gauge',
				opacity : 0.8
			})

			group.translate(chart.x(), chart.y())
			
			this.direction(chart, brush.direction);
			
			if (this.shape == 'circle') {
				group.append(chart.svg.circle({
					cx : this.centerX,
					cy : this.centerY,
					r : this.outerRadius,
					fill : "#ececec"
				}))

				group.append(chart.svg.circle({
					cx : this.centerX,
					cy : this.centerY,
					r : this.outerRadius,
					fill : chart.color(2, brush.colors),
					"clip-path" : "url(#" + this.clipId + ")"
				}))

			} else if (this.shape == 'rect') {
				group.append(chart.svg.rect({
					x : 0,
					y : 0,
					width : chart.width(),
					height : chart.height(),
					fill : "#ececec"
				}))

				group.append(chart.svg.rect({
					x : 0,
					y : 0,
					width : chart.width(),
					height : chart.height(),
					fill : chart.color(2, brush.colors),
					"clip-path" : "url(#" + this.clipId + ")"
				}))

			} else {

				if (brush.svg) {
					$.ajax({
						url : brush.svg,
						async : false,
						success : function(xml) {
							var path = $(xml).find("path").attr('d');
							self.drawPath(chart, group, path);
						}
					})
				} else {
					self.drawPath(chart, group, brush.path);					
				}

			}

		}
	}

	return FillGaugeBrush;
}, "chart.brush.core");
