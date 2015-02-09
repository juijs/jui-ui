jui.define("chart.brush.donut", [ "util.base", "util.math" ], function(_, math) {

    /**
     * @class chart.brush.donut 
     * 
     * implements donut brush 
     *  
     * @extends chart.brush.pie
     * 
     */
	var DonutBrush = function() {
        
        /**
         * @method drawDonut 
         * 
         * donut 을 그린다.
         *   
         * @param {Number} centerX 중앙 위치 x
         * @param {Number} centerY 중앙 위치 y
         * @param {Number} innerRadius 안쪽 반지름
         * @param {Number} outerRadius 바깥쪽 반지름
         * @param {Number} startAngle 시작 지점 각도
         * @param {Number} endAngle 시작지점에서 끝지점까지의 각도
         * @param {Object} attr donut 설정될 svg 속성 리스트
         * @param {Boolean} hasCircle
         * @return {util.svg.element}
         */
		this.drawDonut = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, attr, hasCircle) {
		    hasCircle = hasCircle || false;

			attr['stroke-width']= outerRadius - innerRadius;

			var g = this.chart.svg.group(),
				path = this.chart.svg.path(attr),
				dist = Math.abs(outerRadius - innerRadius);

			// 바깥 지름 부터 그림
			var obj = math.rotate(0, -outerRadius, math.radian(startAngle)),
				startX = obj.x,
				startY = obj.y;


			// 시작 하는 위치로 옮김
			path.MoveTo(startX, startY);

			// outer arc 에 대한 지점 설정
			obj = math.rotate(startX, startY, math.radian(endAngle));

			// 중심점 이동
			g.translate(centerX, centerY);

			// outer arc 그림
			path.Arc(outerRadius, outerRadius, 0, (endAngle > 180) ? 1 : 0, 1, obj.x, obj.y);

			g.append(path);

            if(hasCircle) {
                var centerCircle = math.rotate(0, -innerRadius - dist/2, math.radian(startAngle)),
					cX = centerCircle.x,
					cY = centerCircle.y,
					centerCircleLine = math.rotate(cX, cY, math.radian(endAngle));
    
                var circle = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : dist/2,
                    fill  : attr.fill
                });
                
                g.append(circle);
    
                var circle2 = this.chart.svg.circle({
                    cx : centerCircleLine.x,
                    cy : centerCircleLine.y,
                    r : 3,
                    fill  : "white"
                });
                
                g.append(circle2);
            }

			return g;
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
            var outerRadius = min / 2 - this.brush.size/2;
            var innerRadius = outerRadius - this.brush.size;

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
                    donut = this.drawDonut(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, {
                        stroke : this.color(i),
                        fill : 'transparent'
                    });

                if(this.brush.showText) {
                    var text = this.getFormatText(target[i], value),
                        elem = this.drawText(centerX, centerY, startAngle + (endAngle / 2) - 90, outerRadius, text, 1.25);

                    this.addEvent(elem, index, i);
                    g.append(elem);
                }

                this.addEvent(donut, index, i);
                g.append(donut);

                startAngle += endAngle;
            }
        }        

	}

	DonutBrush.setup = function() {
		return {
            /** @cfg {Number} [size=50] donut stroke width  */
			size: 50
		};
	}

	return DonutBrush;
}, "chart.brush.pie");
