jui.define("chart.brush.clock", [ "util.math" ], function(math) {

    /**
     * @class chart.brush.clock 
     * 
     * implements clock brush 
     *  
     * @extends chart.brush.core  
     * 
     */
	var ClockBrush = function() {
        var w, centerX, centerY, startY, startX, outerRadius, innerRadius;

        /**
         * @method drawInnerCircle 
         *
         * 내부 원 그리기 
         *  
         * @param {Number} w
         * @param {Number} centerX
         * @param {Number} centerY
         * @returns {util.svg.element} circle element 
         */
        this.drawInnerCircle = function(w, centerX, centerY) {
            return this.chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : 10
            });
            
        }
        
        /**
         * @method drawInnerCircle2
         *
         * 내부 원 그리기 2
         *
         * @param {Number} w
         * @param {Number} centerX
         * @param {Number} centerY
         * @returns {util.svg.element} circle element
         */        
        this.drawInnerCircle2 = function(w, centerX, centerY) {
            return this.chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : 5,
                fill : 'white'
            });
            
        }

        /**
         * @method drawOuterCircle
         *
         * 바깥 원 그리기
         *
         * @param {Number} w
         * @param {Number} centerX
         * @param {Number} centerY
         * @returns {util.svg.element} circle element
         */        
        this.drawOuterCircle = function(w, centerX, centerY) {
            return this.chart.svg.circle({
                cx : centerX,
                cy : centerY,
                r : w-10,
                fill : 'transparent',
                stroke : 'black',
                "stroke-width" : 5
            });
        }
        
        
        this.drawSecond = function(w, centerX, centerY, hour, minute, second, millis) {

            var rate = 360 / 60; 
            var milliRate = rate / 1000;

            var radian = math.radian(rate * second + milliRate * millis);
            var obj = math.rotate(0, -(w-20), radian );
            
            return this.chart.svg.line({
                x1 : centerX,
                y1 : centerY,
                x2 : centerX + obj.x,
                y2 : centerY + obj.y,
                stroke : 'black'
                
            });
        }
        
        this.drawMinute = function(w, centerX, centerY, hour, minute, second, millis) {
            var g = this.chart.svg.group().translate(centerX, centerY);
            var rate = 360 / 60;
            var secondRate = rate / 60;
            var milliRate = secondRate / 1000;

            var radian = math.radian(rate * minute + secondRate * second + milliRate * millis);
            var obj = math.rotate(0, -(w-40), radian );

            return this.chart.svg.line({
                x1 : centerX,
                y1 : centerY,
                x2 : centerX + obj.x,
                y2 : centerY + obj.y,
                stroke : 'black',
                "stroke-width" : 5
            });

        }
        
        this.drawHour = function(w, centerX, centerY, hour, minute, second, millis) {
            var rate = 360 / 12;
            var minuteRate = rate / 60;
            var secondRate = minuteRate / 60;
            var milliRate = secondRate / 1000;

            var radian = math.radian(rate * hour + minuteRate * minute + secondRate * second + milliRate * millis);
            var obj = math.rotate(0, -(w-50), radian );

            return this.chart.svg.line({
                x1 : centerX,
                y1 : centerY,
                x2 : centerX + obj.x,
                y2 : centerY + obj.y,
                stroke : 'black',
                "stroke-width" : 7

            });
        }

        this.drawLine = function(w, centerX, centerY) {

            var g = this.chart.svg.group().translate(centerX, centerY);

            var hourRate = 360 / 12;
            var minuteRate = hourRate / 5;

            for (var i = 1; i <= 12; i++) {
                var radian = math.radian(hourRate * i);
                var outer = math.rotate(0, -(w-10), radian);
                var inner = math.rotate(0, -(w-20), radian);
                var text = math.rotate(0, -(w-30), radian);

                var line = this.chart.svg.line({
                    x1 : outer.x,
                    y1 : outer.y,
                    x2 : inner.x,
                    y2 : inner.y,
                    stroke : 'black',
                    "stroke-width" :  2
                });

                g.append(line);
                var minRadian = math.radian(hourRate * (i-1));
                for(var j = 1; j <= 4; j++) {
                    var radian = minRadian + math.radian(minuteRate * j);
                    var outer = math.rotate(0, -(w-10), radian);
                    var inner = math.rotate(0, -(w-15), radian);

                    var line = this.chart.svg.line({
                        x1 : outer.x,
                        y1 : outer.y,
                        x2 : inner.x,
                        y2 : inner.y,
                        stroke : 'black',
                        "stroke-width" :  2
                    });

                    g.append(line);

                }

                g.append(this.chart.text({
                    x : text.x,
                    y : text.y + 6,
                    'text-anchor' : 'middle',
                    stroke : 'black'
                }, i));

            }
            
            return g;
            
        }
        
		this.drawUnit = function(index, data, group) {
            var obj = this.axis.c(index),
                width = obj.width,
                height = obj.height,
                x = obj.x,
                y = obj.y;

            // center
            w = Math.min(width, height) / 2;
            centerX = width / 2 + x;
            centerY = height / 2 + y;
            
            var date = new Date(),
                hour = this.getValue(data, "hour", date.getHours()),
                minute = this.getValue(data, "minute", date.getMinutes()),
                second = this.getValue(data, "second", date.getSeconds()),
                millis = date.getMilliseconds();

            group.append(this.drawOuterCircle(w, centerX, centerY));
            group.append(this.drawInnerCircle(w, centerX, centerY));
            group.append(this.drawLine(w, centerX, centerY));
            group.append(this.drawSecond(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawMinute(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawHour(w, centerX, centerY, hour, minute, second, millis));
            group.append(this.drawInnerCircle2(w, centerX, centerY));
            
            return group; 
		}

        this.draw = function() {
            var group = this.chart.svg.group();

            this.eachData(function(i, data) {
                this.drawUnit(i, data, group);
            });

            return group;
        }
	}

	return ClockBrush;
}, "chart.brush.core");
