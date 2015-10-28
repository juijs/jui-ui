jui.define("chart.grid.grid3d", [ "util.base", "util.math" ], function(_, math) {

    /**
     * @class chart.grid.grid3d
     * @extends chart.grid.core
     */
    var Grid3D = function() {
        var self = this,
            depth = 0,
            degree = 0,
            radian = 0;

        function getElementAttr(root) {
            var attr = null;

            root.each(function(i, elem) {
                if(elem.element.nodeName == "line") {
                    attr = elem.attributes;
                }
            });

            return attr;
        }

        this.drawBefore = function() {
            depth = this.axis.get("depth");
            degree = this.axis.get("degree");
            radian = math.radian(360 - degree);

            this.scale = (function() {
                return function(x, y, z, count) {
                    var step = _.typeCheck("integer", count) ? count : 1,
                        split = depth / step;

                    if(z == undefined || step == 1) {
                        return {
                            x: self.axis.x(x),
                            y: self.axis.y(y),
                            depth: split
                        }
                    } else {
                        var z = (z == undefined) ? 0 : z,
                            c = split * z,
                            top = Math.sin(radian) * split;

                        return {
                            x: self.axis.x(x) + Math.cos(radian) * c,
                            y: (self.axis.y(y) + Math.sin(radian) * c) + top,
                            depth: split
                        }
                    }
                }
            })(this.axis);

            this.scale.depth = depth;
            this.scale.degree = degree;
            this.scale.radian = radian;
        }

        this.draw = function() {
            var xRoot = this.axis.x.root,
                yRoot = this.axis.y.root;

            var y2 = Math.sin(radian) * depth,
                x2 = Math.cos(radian) * depth;

            yRoot.each(function(i, elem) {
                if(elem.element.nodeName == "line") {
                    yRoot.append(self.line({
                        x1 : x2,
                        y1 : 0,
                        x2 : x2,
                        y2 : y2 + elem.attributes.y2
                    }));
                } else {
                    // X축 라인 속성 가져오기
                    var xAttr = getElementAttr(xRoot);

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

            xRoot.each(function(i, elem) {
                var attr = (elem.element.nodeName == "line") ? elem.attributes : elem.get(0).attributes,
                    y2 = attr.y1 + Math.sin(radian) * depth,
                    x2 = attr.x1 + Math.cos(radian) * depth;

                if(i > 0) {
                    // Y축 라인 속성 가져오기
                    var yAttr = getElementAttr(yRoot);

                    elem.append(self.line({
                        x1 : attr.x1,
                        y1 : attr.y1,
                        x2 : x2,
                        y2 : y2
                    }));

                    elem.append(self.line({
                        x1 : x2,
                        y1 : y2,
                        x2 : x2,
                        y2 : -(yAttr.y2 - y2)
                    }));
                }
            });

            return this.drawGrid();
        }
    }

    Grid3D.setup = function() {
        return {
            /** @cfg {Array} [domain=null] */
            domain: null
        }
    }
    
    return Grid3D;
}, "chart.grid.core");
