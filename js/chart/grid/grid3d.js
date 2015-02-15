jui.define("chart.grid.grid3d", [ "util.base", "util.math" ], function(_, math) {

    /**
     * @class chart.grid.grid3d
     *
     * 토폴로지 배치를 위한 grid
     *
     * @extends chart.grid.core
     */
    var Grid3D = function() {
        var depth = 0,
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
                return function(index) {

                }
            })(this.axis);
        }

        this.drawGridXY = function(x, y) {
            var g = this.chart.svg.group(),
                radian = math.radian(360 - angle),
                x2 = Math.cos(radian) * depth;

            // Y축 그리기
            for(var i = 0; i < y.values.length; i++) {
                var y2 = y.values[i] + Math.sin(radian) * depth;

                g.append(this.line({
                    x1 : 0,
                    y1 : y.values[i],
                    x2 : x2,
                    y2 : y2
                }));

                g.append(this.line({
                    x1 : x2,
                    y1 : y2,
                    x2 : this.axis.area("width"),
                    y2 : y2
                }));

                // X축 그리기
                if(i == 0) {
                    var gg = this.chart.svg.group(),
                        yy2 = y.values[y.values.length - 1] + Math.sin(radian) * depth;

                    for(var j = 0; j < x.points.length; j++) {
                        var now = this.axis.x(0) + x.points[j],
                            xx2 = now + Math.cos(radian) * depth;

                        gg.append(this.line({
                            x1: now,
                            y1: y.values[i],
                            x2: xx2,
                            y2 : y2
                        }));

                        gg.append(this.line({
                            x1: xx2,
                            y1: y2,
                            x2: xx2,
                            y2: yy2
                        }));
                    }

                    // 첫번째 라인 그리기
                    gg.append(this.line({
                        x1: x2,
                        y1: y2,
                        x2: x2,
                        y2: yy2
                    }));

                    g.append(gg);
                }
            }

            return g;
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
            var x = this.axis.get("x"),
                y = this.axis.get("y"),
                xyObj = this.axis.get("grid");

            var grid = this.drawGrid();
            if(x.orient == "bottom" && y.orient == "left") {
                grid.root.append(this.drawGridXY(xyObj.x, xyObj.y));
            }

            return grid;
        }
    }

    Grid3D.setup = function() {
        return {
        }
    }
    
    return Grid3D;
}, "chart.grid.core");
