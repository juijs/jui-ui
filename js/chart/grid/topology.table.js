jui.define("chart.grid.topology.table", [ "util.base" ], function(_) {

    /**
     * @class chart.grid.topology.table
     *
     * implements default panel grid
     *
     * @extends chart.grid.core
     */
    var TopologyTableGrid = function() {
        var self = this;

        function getDataIndex(key) {
            var index = null,
                data = self.axis.data;

            for(var i = 0, len = data.length; i < len; i++) {
                if(data[i].key == key) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        function initPositionXY() {
            var area = self.chart.area();

            for(var i = 0, len = self.axis.data.length; i < len; i++) {
                self.axis.cacheXY[i] = {
                    x: Math.floor(Math.random() * area.width),
                    y: Math.floor(Math.random() * area.height)
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
            // 최초 한번만 데이터 생성
            if(!this.axis.cacheXY) {
                this.axis.cacheXY = [];
                initPositionXY();
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
         * @returns {util.scale} scale  return scale be used in grid
         * @returns {SVGElement} root grid root element
         * @protected
         */
        this.draw = function() {
            this.grid.hide = true;
            return this.drawGrid();
        }
    }
    
    return TopologyTableGrid;
}, "chart.grid.core");
