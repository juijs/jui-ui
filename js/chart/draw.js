jui.define("chart.draw", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.draw
     *
     * Base Draw Class
     *
     * @alias Draw
     * @requires util.base
     * @requires jquery
     *
     */
	var Draw = function() {

        /**
         * @method drawBefore
         *
         * run before draw object
         *
         */

        /**
         * @method draw
         *
         * draw object
         *
         * @return {Object}
         *
         */

        /**
         * @method drawAfter
         *
         * run after draw object
         */

        /**
         * @method drawAnimate
         *
         * implements animate code after draw object
         */

		/**
		 * @method render
         *
         * 모든 Draw 객체는  render 함수를 통해서 그려진다.
		 * 
		 */
		this.render = function() {
            if(!_.typeCheck("function", this.draw) || !_.typeCheck("function", this.drawAfter)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw & drawAfter' method must be implemented");
            }

            // Call drawBefore method (All)
            if(_.typeCheck("function", this.drawBefore)) {
                this.drawBefore();
            }

            // Call draw method (All)
			var obj = this.draw();

            // Call drawAnimate method (All)
            if(_.typeCheck("function", this.drawAnimate)) {
                var draw = this.grid || this.brush || this.widget || this.map;

                if(draw.animate !== false) {
                    this.drawAnimate(obj);
                }
            }

            if(!_.typeCheck("object", obj)) {
                throw new Error("JUI_CRITICAL_ERR: 'draw' method should return the object");
            } else {
                this.drawAfter(obj);
            }

            return obj;
		}

        /**
         * @method format
         * Get a default format callback of draw object.
         *
         * @return {Function}
         */
        this.format = function() {
            var draw = this.grid || this.brush || this.widget,
                callback = draw.format || this.chart.format;

            return callback.apply(this.chart, arguments);
        }

        /**
         * @method balloonPoints
         *
         * 말풍선 그리그 메소드
         *
         * @param {String} type
         * @param {Number} w
         * @param {Number} h
         * @param {Number} anchor
         * @return {String}
         */
        this.balloonPoints = function(type, w, h, anchor) {
            var points = [];

            if(type == "top") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ (w / 2) + (anchor / 2), h ].join(","));
                points.push([ (w / 2), h + anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), h ].join(","))
                points.push([ 0, h ].join(","));
                points.push([ 0, 0 ].join(","));
            } else if(type == "bottom") {
                points.push([ 0, anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), anchor ].join(","));
                points.push([ (w / 2), 0 ].join(","));
                points.push([ (w / 2) + (anchor / 2), anchor ].join(","));
                points.push([ w, anchor ].join(","));
                points.push([ w, anchor + h ].join(","))
                points.push([ 0, anchor + h ].join(","));
                points.push([ 0, anchor ].join(","));
            } else if(type == "left") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, (h / 2) - (anchor / 2) ].join(","));
                points.push([ w + anchor, (h / 2) ].join(","));
                points.push([ w, (h / 2) + (anchor / 2) ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
                points.push([ 0, 0 ].join(","));
            } else if(type == "right") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
                points.push([ 0, (h / 2) + (anchor / 2) ].join(","));
                points.push([ 0 - anchor, (h / 2) ].join(","));
                points.push([ 0, (h / 2) - (anchor / 2) ].join(","));
                points.push([ 0, 0 ].join(","));
            }

            return points.join(" ");
        }

        /**
         * @method on
         *
         * chart.on() 을 쉽게 사용 할 수 있게 해주는 유틸리티 함수
         *
         * @param {String} type event name
         * @param {Function} callback
         * @return {*}
         */
        this.on = function(type, callback) {
            var self = this;

            return this.chart.on(type, function() {
                if(_.startsWith(type, "axis.") && _.typeCheck("integer", self.axis.index)) {
                    var axis = self.chart.axis(self.axis.index),
                        e = arguments[0];

                    if (_.typeCheck("object", axis)) {
                        if (arguments[1] == self.axis.index) {
                            callback.apply(self, [ e ]);
                        }
                    }
                } else {
                    callback.apply(self, arguments);
                }
            }, "render");
        }
	}

    Draw.setup = function() {
        return {
            /** @cfg {String} [type=null] Specifies the type of a widget/brush/grid to be added.*/
            type: null,
            /** @cfg {Boolean} [animate=false] Run the animation effect.*/
            animate: false
        }
    }

	return Draw;
});
