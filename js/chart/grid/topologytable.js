jui.define("chart.grid.topologytable", [ "util.base" ], function(_) {

    /**
     * @class chart.grid.topologytable
     *
     * 토폴로지 배치를 위한 grid
     *
     * @extends chart.grid.core
     */
    var TopologyTableGrid = function() {
        var self = this,
            area, size, data_cnt,
            cache = {};

        function getDataIndex(key) {
            var index = null,
                data = self.axis.data;

            for(var i = 0, len = data.length; i < len; i++) {
                if(self.axis.getValue(data[i], "key") == key) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        function initDefaultXY() {
            var row_cnt = Math.floor(area.height / size),
                col_cnt = Math.floor(area.width / size),
                col_step = Math.floor(col_cnt / data_cnt),
                col_index = 0;

            var left = -1,
                right = data_cnt;

            for(var i = 0; i < data_cnt; i++) {
                var x = 0, y = 0, index = 0;

                if(i % 2 == 0) {
                    x = col_index * size;
                    y = getRandomRowIndex(row_cnt) * size;
                    col_index += col_step;

                    left += 1;
                    index = left;
                } else {
                    x = (col_cnt - col_index) * size + size;
                    y = getRandomRowIndex(row_cnt) * size;

                    right -=1;
                    index = right;
                }

                self.axis.cacheXY[index] = {
                    x: x + size,
                    y: y + (size / 2)
                };
            }

            function getRandomRowIndex() {
                var row_index = Math.floor(Math.random() * row_cnt);

                if(cache[row_index]) {
                    var cnt = 0;
                    for(var k in cache) { cnt++; }

                    if(cnt < row_cnt) {
                        return getRandomRowIndex(row_cnt);
                    } else {
                        cache = {};
                    }
                } else {
                    cache[row_index] = true;
                }

                return row_index;
            }
        }

        function initRandomXY() {
            for(var i = 0; i < data_cnt; i++) {
                var x = Math.floor(Math.random() * (area.width - size)),
                    y = Math.floor(Math.random() * (area.height - size));

                self.axis.cacheXY[i] = {
                    x: x,
                    y: y
                };
            }
        }

        /**
         * @method drawBefore
         *
         * initialize grid option before draw grid
         *
         */
        this.drawBefore = function() {
            area = this.chart.area();
            size = this.grid.space;
            data_cnt = this.axis.data.length;

            // 최초 한번만 데이터 생성
            if(!this.axis.cacheXY) {
                this.axis.cacheXY = [];

                if(this.grid.sort == "random") {
                    initRandomXY();
                } else {
                    initDefaultXY();
                }
            }

            /**
             * @method scale
             *
             * get scale function
             *
             */
            this.scale = (function() {
                return function(index) {
                    var index = (_.typeCheck("string", index)) ? getDataIndex(index) : index;

                    var func = {
                        setX: function(value) {
                            self.axis.cacheXY[index].x = value;
                        },
                        setY: function(value) {
                            self.axis.cacheXY[index].y = value;
                        },
                        moveLast: function() {
                            var target1 = self.axis.cacheXY.splice(index, 1);
                            self.axis.cacheXY.push(target1[0]);

                            var target2 = self.axis.data.splice(index, 1);
                            self.axis.data.push(target2[0]);
                        }
                    }

                    return _.extend(func, self.axis.cacheXY[index]);
                }
            })(this.axis);
        }

        /**
         * @method draw
         *
         *
         * @returns {Object}
         * @returns {util.scale} return.scale  return scale be used in grid
         * @returns {SVGElement} return.root grid root element
         * @protected
         */
        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid();
        }
    }

    TopologyTableGrid.setup = function() {
        return {
            /** @cfg {String} [sort=null]  */
            sort: null, // or random
            /** @cfg {Number} [space=50]  */
            space: 50
        }
    }
    
    return TopologyTableGrid;
}, "chart.grid.core");
