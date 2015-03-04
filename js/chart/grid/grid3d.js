jui.define("chart.grid.grid3d", [ "util.base", "util.math" ], function(_, math) {

    /**
     * @class chart.grid.grid3d
     *
     * 토폴로지 배치를 위한 grid
     *
     * @extends chart.grid.core
     */
    var Grid3D = function() {
        var self = this,
            depth = 0,
            angle = 0;

        /**
         * @method drawBefore
         *
         * initialize grid option before draw grid
         *
         */
        this.drawBefore = function() {
            depth = this.axis.get("depth");
            angle = this.axis.get("angle");

            /**
             * @method scale
             *
             * get scale function
             *
             */
            this.scale = (function() {
                var radian = math.radian(360 - angle),
                    y2 = Math.sin(radian) * depth;

                return function(index, value) {
                    return {
                        x: self.axis.x(index),
                        y: self.axis.y(value)
                    }
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
            var radian = math.radian(360 - angle),
                y2 = Math.sin(radian) * depth,
                x2 = Math.cos(radian) * depth;

            this.axis.y.root.each(function(i, elem) {
                if(i == 0) {
                    self.axis.y.root.append(self.line({
                        x1 : x2,
                        y1 : 0,
                        x2 : x2,
                        y2 : y2 + elem.attributes.y2
                    }));
                } else {
                    // X축 라인 속성 가져오기
                    var xAttr = self.axis.x.root.get(0).attributes;

                    elem.append(self.line({
                        x1 : 0,
                        y1 : 0,
                        x2 : x2,
                        y2 : y2
                    }));

                    elem.append(self.line({
                        x1 : x2,
                        y1 : y2,
                        x2 : x2 + xAttr.x2,
                        y2 : y2
                    }));
                }
            });

            this.axis.x.root.each(function(i, elem) {
                var attr = (i == 0) ? elem.attributes : elem.get(0).attributes,
                    y2 = attr.y1 + Math.sin(radian) * depth,
                    x2 = attr.x1 + Math.cos(radian) * depth;

                if(i == 0) {
                    self.axis.x.root.append(self.line({
                        x1 : x2,
                        y1 : y2,
                        x2 : x2 + attr.x2,
                        y2 : y2
                    }));
                } else if(i > 1) {
                    // Y축 라인 속성 가져오기
                    var yAttr = self.axis.y.root.get(0).attributes;

                    elem.append(self.line({
                        x1 : attr.x1,
                        y1 : attr.y1,
                        x2 : x2,
                        y2 : y2
                    }));

                    elem.append(self.line({
                        x1 : x2,
                        y1 : -yAttr.y1,
                        x2 : x2,
                        y2 : -yAttr.y2
                    }));
                }
            });

            return this.drawGrid();
        }
    }

    Grid3D.setup = function() {
        return {
            /** @cfg {Number} [step=1] */
            step: 1
        }
    }
    
    return Grid3D;
}, "chart.grid.core");
