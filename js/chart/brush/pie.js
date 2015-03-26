jui.define("chart.brush.pie", [ "util.base", "util.math", "util.color" ], function(_, math, ColorUtil) {

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
        var cache_active = {};

        this.setActiveEvent = function(pie, centerX, centerY, centerAngle) {
            var dist = this.chart.theme("pieActiveDistance"),
                tx = Math.cos(math.radian(centerAngle)) * dist,
                ty = Math.sin(math.radian(centerAngle)) * dist;

            pie.translate(centerX + tx, centerY + ty);
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

		this.drawPie = function(centerX, centerY, outerRadius, startAngle, endAngle, color) {
			var pie = this.chart.svg.group();

            if (endAngle == 360) { // if pie is full size, draw a circle as pie brush
                var circle = this.chart.svg.circle({
                    cx : centerX,
                    cy : centerY,
                    r : outerRadius,
                    fill : color,
                    stroke : this.chart.theme("pieBorderColor") || color,
                    "stroke-width" : this.chart.theme("pieBorderWidth")
                });

                pie.append(circle);

                return pie;
            }
            
            var path = this.chart.svg.path({
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

		this.drawPie3d = function(centerX, centerY, outerRadius, startAngle, endAngle, color) {
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

            var y = obj.y + 10,
                x = obj.x + 5,
                targetX = startX + 5,
                targetY = startY + 10;

            path.LineTo(x, y);
            path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 0, targetX, targetY)
            path.ClosePath();
            pie.append(path);

			return pie;
		}

        this.drawText = function(centerX, centerY, centerAngle, outerRadius, text) {
            var c = this.chart,
                dist = c.theme("pieOuterLineSize"),
                r = outerRadius * c.theme("pieOuterLineRate"),
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
			var centerX = width / 2 + x,
                centerY = height / 2 + y,
                outerRadius = min / 2;

			var target = this.brush.target,
                active = this.brush.active,
				all = 360,
				startAngle = 0,
				max = 0;

			for (var i = 0; i < target.length; i++) {
				max += data[target[i]];
			}

			for (var i = 0; i < target.length; i++) {
                var value = data[target[i]],
                    endAngle = all * (value / max);

                if (this.brush['3d']) {
                    var pie3d = this.drawPie3d(centerX, centerY, outerRadius, startAngle, endAngle, ColorUtil.darken(this.color(i), 0.5));
                    g.append(pie3d);
                }

				startAngle += endAngle;
			}

            startAngle = 0;

			for (var i = 0; i < target.length; i++) {
                var value = data[target[i]],
                    endAngle = all * (value / max),
                    centerAngle = startAngle + (endAngle / 2) - 90,
                    pie = this.drawPie(centerX, centerY, outerRadius, startAngle, endAngle, this.color(i));

                // 설정된 키 활성화
                if (active == target[i] || $.inArray(target[i], active) != -1) {
                    this.setActiveEvent(pie, centerX, centerY, centerAngle);
                    cache_active[centerAngle] = true;
                }

                // 활성화 이벤트 설정
                if (this.brush.activeEvent != null) {
                    (function(p, cx, cy, ca) {
                        p.on(self.brush.activeEvent, function(e) {
                            if(!cache_active[ca]) {
                                self.setActiveEvent(p, cx, cy, ca);
                                cache_active[ca] = true;
                            } else {
                                p.translate(cx, cy);
                                cache_active[ca] = false;
                            }
                        });

                        p.attr({ cursor: "pointer" });
                    })(pie, centerX, centerY, centerAngle);
                }

                if (this.brush.showText) {
                    var text = this.getFormatText(target[i], value, max),
                        elem = this.drawText(centerX, centerY, centerAngle, outerRadius, text);

                    this.addEvent(elem, index, i);
                    g.append(elem);
                }

                self.addEvent(pie, index, i);
                g.append(pie);

				startAngle += endAngle;
			}
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
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false,
            /** @cfg {Boolean} [showText=false] Set the text appear.  */
            showText: false,
            /** @cfg {Function} [format=null] Returns a value from the format callback function of a defined option. */
            format: null,
            /** @cfg {Boolean} [3d=false] check 3d support */
            "3d": false,
            /** @cfg {String|Array} [active=null] Activates the pie of an applicable property's name. */
            active: null,
            /** @cfg {String} [activeEvent=null]  Activates the pie in question when a configured event occurs (click, mouseover, etc). */
            activeEvent: null
        }
    }

	return PieBrush;
}, "chart.brush.core");
