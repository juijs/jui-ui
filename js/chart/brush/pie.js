jui.define("chart.brush.pie", [ "util.base", "util.math" ], function(_, math) {

	/**
	 * @class chart.brush.pie
	 *
	 * implements pie brush
	 *
     * @extends chart.brush.core
	 */
	var PieBrush = function() {
        var self = this, textY = 3;
        var g;

		this.drawPie = function(centerX, centerY, outerRadius, startAngle, endAngle, color) {
			var pie = this.chart.svg.group(),
				path = this.chart.svg.path({
                    fill : color,
                    stroke : this.chart.theme("pieBorderColor") || color,
                    "stroke-width" : this.chart.theme("pieBorderWidth")
                });

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
                startY = obj.y;
			
			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			pie.translate(centerX, centerY);

			// arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y)
                .LineTo(0, 0)
                .ClosePath();

            pie.append(path);

			return pie;
		}

		this.drawUnit = function (index, data, g) {
			var obj = this.axis.c(index);

			var width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y,
                min = width;

			if (height < min) {
				min = height;
			}

			// center
			var centerX = width / 2 + x;
			var centerY = height / 2 + y;
			var outerRadius = min / 2;

			var target = this.brush.target,
				all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
				var value = data[target[i]],
					endAngle = all * (value / max),
                    pie = this.drawPie(centerX, centerY, outerRadius, startAngle, endAngle, this.color(i));

                if(this.brush.showText) {
                    var text = this.getFormatText(target[i], value, max),
                        elem = this.drawText(centerX, centerY, startAngle + (endAngle / 2) - 90, outerRadius, text);

                    this.addEvent(elem, index, i);
                    g.append(elem);
                }

                self.addEvent(pie, index, i);
				g.append(pie);

				startAngle += endAngle;
			}
		}

        this.getFormatText = function(target, value) {
            var series = this.chart.get("series", target),
                key = (series.text) ? series.text : target;

            if(typeof(this.brush.format) == "function") {
                return this.format(key, value);
            } else {
                if (!value) {
                    return key;
                }

                return key + ": " + this.format(value);
            }
        }

        this.drawText = function(centerX, centerY, centerAngle, outerRadius, text, rate) {
            var c = this.chart,
                dist = c.theme("pieOuterLineSize"),
                rate = rate || 1.2,
                r = outerRadius * rate,
                cx = centerX + (Math.cos(math.radian(centerAngle)) * outerRadius),
                cy = centerY + (Math.sin(math.radian(centerAngle)) * outerRadius),
                tx = centerX + (Math.cos(math.radian(centerAngle)) * r),
                ty = centerY + (Math.sin(math.radian(centerAngle)) * r),
                isLeft = (centerAngle + 90 > 180) ? true : false,
                ex = (isLeft) ? tx - dist : tx + dist;

            return c.svg.group({}, function() {
                var path = c.svg.path({
                    fill: "transparent",
                    stroke: c.theme("pieOuterLineColor"),
                    "stroke-width": 0.7
                });

                path.MoveTo(cx, cy)
                    .LineTo(tx, ty)
                    .LineTo(ex, ty);

                c.text({
                    "font-size": c.theme("pieOuterFontSize"),
                    "text-anchor": (isLeft) ? "end" : "start",
                    y: textY
                }, text).translate(ex + (isLeft ? -3 : 3), ty);
            });
        }

        this.drawBefore = function() {
            g = this.chart.svg.group();
        }

		this.draw = function() {
			this.eachData(function(i, data) {
				this.drawUnit(i, data, g);
			});

            return g;
		}
	}

    PieBrush.setup = function() {
        return {
            /** @cfg {Boolean} [clip=false] 그려지는 영역 클립핑 여부 */
            clip: false,
            /** @cfg {Boolean} [showText=false] 텍스트 표시 여부 */
            showText: false,
            /** @cfg {Function} [format=null] 텍스트 포맷 함수  */
            format: null
        }
    }

	return PieBrush;
}, "chart.brush.core");
