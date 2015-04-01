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
			this.drawTop(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("top", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				});

				axis.append(this.line({
					y2 : -this.chart.theme("gridTickSize")
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
			this.drawBottom(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("bottom", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				})

				axis.append(this.line({
					y2 : this.chart.theme("gridTickSize")
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
			this.drawLeft(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("left", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				})

				axis.append(this.line({
					x2 : -this.chart.theme("gridTickSize")
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
			this.drawRight(g, this.domain, this.points, null, -this.half_band);
			this.drawBaseLine("right", g);

			if (!this.grid.full) {
				var axis = this.chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				});

				axis.append(this.line({
					x2 : this.chart.theme("gridTickSize")
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
