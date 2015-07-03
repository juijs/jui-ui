jui.define("chart.grid.fullblock", [ "util.scale", "util.base" ], function(UtilScale, _) {

    /**
     * @class chart.grid.block
     * Implements Block Grid
     *
     *  { type : "block", domain : [ 'week1', 'week2', 'week3' ] }
     *
     * @extends chart.grid.core
     */
    var FullBlockGrid = function() {

        /**
         * @method top
         *
         * @protected
         */

        this.top = function(g) {
            this.drawPattern("top", this.domain, this.points);
            this.drawTop(g, this.domain, this.points, null, 0);
            this.drawBaseLine("top", g);
        }

        /**
         * @method bottom
         *
         * @protected
         */
        this.bottom = function(g) {
            this.drawPattern("bottom", this.domain, this.points);
            this.drawBottom(g, this.domain, this.points, null, 0);
            this.drawBaseLine("bottom", g);
        }

        /**
         * @method left
         *
         * @protected
         */
        this.left = function(g) {
            this.drawPattern("left", this.domain, this.points);
            this.drawLeft(g, this.domain, this.points, null, 0);
            this.drawBaseLine("left", g);
        }

        /**
         * @method right
         *
         * @protected
         */
        this.right = function(g) {
            this.drawPattern("right", this.domain, this.points);
            this.drawRight(g, this.domain, this.points, null, 0);
            this.drawBaseLine("right", g);
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

            this.scale.rangeBands(range);

            this.start = obj.start;
            this.size = obj.size;
            this.end = obj.end;
            this.points = this.scale.range();
            this.domain = this.scale.domain();

            this.band = this.scale.rangeBand();
            this.half_band = 0 ;
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


    FullBlockGrid.setup = function() {
        return {
            /** @cfg {String/Array/Function} [domain=null] Sets the value displayed on an axis.*/
            domain: null,
            /** @cfg {Boolean} [reverse=false] Reverses the value on domain values*/
            reverse: false,
            /** @cfg {Number} [max=10] Sets the maximum value of a grid. */
            max: 10
        };
    }

    return FullBlockGrid;
}, "chart.grid.core");
