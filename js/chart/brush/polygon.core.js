jui.define("chart.brush.polygon.core", [], function() {
    var PolygonCoreBrush = function() {
        this.load = function(id) {
            var Polygon = jui.include("chart.polygon." + id),
                obj = new Polygon();

            // 차트 전체 연산
            this.calculate3d(obj);

            return obj;
        }

        this.draw = function() {
            var polygon = this.load(this.brush.id),
                g = this.chart.svg.group(),
                path = this.chart.svg.path({
                    stroke: this.color(0),
                    "stroke-width": 0.5,
                    fill: this.color(0),
                    "fill-opacity": 0.5
                }),
                cache = [];

            for(var i = 0, len = polygon.vertices.length; i < len; i++) {
                var vertex = polygon.vertices[i];
                cache.push(new Float32Array([ this.axis.x(vertex[0]), this.axis.y(vertex[1]) ]));
            }

            for(var i = 0, len = polygon.faces.length; i < len; i++) {
                var face = polygon.faces[i]

                for (var j = 0, len2 = face.length; j < len2; j++) {
                    var targetPoint = cache[face[j]];

                    if (targetPoint) {
                        var x = targetPoint[0],
                            y = targetPoint[1];

                        if (j == 0) {
                            path.MoveTo(x, y);
                        } else {
                            if(j == face.length - 1) {
                                var firstPoint = cache[face[0]],
                                    x = firstPoint[0],
                                    y = firstPoint[1];

                                path.LineTo(x, y);
                            } else {
                                path.LineTo(x, y);
                            }
                        }
                    }
                }
            }

            g.append(path);

            return g;
        }

        this.drawPolygon = function(polygon, callback) {
            this.calculate3d(polygon);

            var element = callback.call(this, polygon);
            if(element) {
                element.order = this.axis.depth - polygon.max().z;
                return element;
            }
        }
    }

    PolygonCoreBrush.setup = function() {
        return {
            id: null,
            clip: false
        }
    }

    return PolygonCoreBrush;
}, "chart.brush.core");