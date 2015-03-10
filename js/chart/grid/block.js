jui.define("chart.grid.block", [ "util.scale", "util.base" ], function(UtilScale, _) {

    /**
     * @class chart.grid.block
     * Implements Block Grid
     * 
     *  { type : "block", domain : [ 'week1', 'week2', 'week3' ] } 
     * 
     * @extends chart.grid.core
     */
	var BlockGrid = function() {
        /**
         * @method top
         *
         * @protected
         */
		this.top = function(g) {
			var full_height = this.axis.area('height');
			
			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

                if (!domain && domain !== 0) {
                    continue;
                }

				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});

				axis.append(this.line({
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (this.grid.line) ? full_height : this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : -20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				});

				axis.append(this.line({
					y2 : (this.grid.line) ? full_height : this.bar
				}));

				g.append(axis);
			}
		}
        /**
         * @method bottom
         *
         * @protected
         */
		this.bottom = function(g) {
			var full_height = this.axis.area('height');

			if (!this.grid.line) {
				g.append(this.axisLine({
					x1 : this.start,
					x2 : this.end
				}));
			}

			for (var i = 0, len = this.points.length; i < len; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
                    continue;
                }
                
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});
				
				axis.append(this.line({
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (this.grid.line) ? -full_height : this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : 0,
					y : 20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				})

				axis.append(this.line({
					y2 : (this.grid.line) ? -full_height : this.bar
				}));

				g.append(axis);
			}
		}
        /**
         * @method left
         *
         * @protected
         */
		this.left = function(g) {
			var full_width = this.axis.area('width');

			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band ) + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? full_width : -this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : -this.bar - 4,
					y : this.half_band,
					"text-anchor" : "end"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				})

				axis.append(this.line({
					x2 : (this.grid.line) ? this.axis.area('width') : -this.bar
				}));

				g.append(axis);
			}
		}
        
        /**
         * @method right
         *
         * @protected
         */
		this.right = function(g) {
			if (!this.grid.line) {
				g.append(this.axisLine({
					y1 : this.start,
					y2 : this.end
				}));
			}

			for (var i = 0, len = this.points.length; i < len; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band) + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? -this.axis.area('width') : this.bar
				}));

				axis.append(this.getTextRotate(this.chart.text({
					x : this.bar + 4,
					y : this.half_band,
					"text-anchor" : "start"
				}, domain)));

				g.append(axis);
			}

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				});

				axis.append(this.line({
					x2 : (this.grid.line) ? -this.axis.area('width') : this.bar
				}));

				g.append(axis);
			}
		}

		/**
		 * @method initDomain
         * block grid 에 대한 domain 설정
		 * @private 
		 */
		this.initDomain = function() {

			var domain = [];

			if (_.typeCheck("string", this.grid.domain)) {
				var field = this.grid.domain;
				var data = this.data();

				if (this.grid.reverse) {
					var start = data.length - 1,
						end = 0,
						step = -1;
				} else {
					var start = 0,
						end = data.length - 1,
						step = 1;
				}

				for (var i = start; ((this.grid.reverse) ? i >= end : i <=end); i += step) {
					domain.push(data[i][field]);
				}

				//grid.domain = domain;
			} else if (_.typeCheck("function", this.grid.domain)) {	// block 은 배열을 통째로 리턴함
				domain = this.grid.domain.call(this.chart);
			} else {
				domain = this.grid.domain;
			}

			if (this.grid.reverse) {
				domain.reverse();
			}

			return domain;

		}

        /**
         * @method drawBefore
         *
         * @protected
         */
		this.drawBefore = function() {
			var domain = this.initDomain();

			var obj = this.getGridSize();

			// scale 설정
			this.scale = UtilScale.ordinal().domain(domain);
			var range = [obj.start, obj.end];

			if (this.grid.full) {
				this.scale.rangeBands(range);
			} else {
				this.scale.rangePoints(range);
			}

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.points = this.scale.range();
			this.domain = this.scale.domain();

			this.band = this.scale.rangeBand();
			this.half_band = (this.grid.full) ? 0 : this.band / 2;
			this.bar = 6;
			this.reverse = this.grid.reverse;
		}

        /**
         * @method draw 
         * 
         * @protected 
         * @return {Mixed}
         */
		this.draw = function() {
			return this.drawGrid("block");
		}
	}


	BlockGrid.setup = function() {
		return {
            /** @cfg {String/Array/Function} [domain=null] Sets the value displayed on an axis.*/
			domain: null,
            /** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
			reverse: false,
            /** @cfg {Number} [max=10] Sets the maximum value of a grid. */
			max: 10,
            /** @cfg {Boolean} [full=false] Determines whether to expand the reference coordinates to the entire range.*/
			full: false
		};
	}

	return BlockGrid;
}, "chart.grid.core");
