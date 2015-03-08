jui.define("util.svg3d", [ "util.base", "util.math", "util.color", "util.svg" ], function(_, math, color, SVGUtil) {
    var SVG3D = function(rootElem, rootAttr) {
        var svg = new SVGUtil(rootElem, rootAttr);

        // SVG 유틸 상속
        this.__proto__ = svg;

        // 3D 사각형 그리기
        this.rect3d = function(fill, width, height, degree, depth) {
            var radian = math.radian(degree),
                x1 = 0,
                y1 = 0,
                w1 = width,
                h1 = height;

            var x2 = (Math.cos(radian) * depth) + x1,
                y2 = (Math.sin(radian) * depth) + y1,
                w2 = width + x2,
                h2 = height + y2;

            var g = svg.group({}, function() {
                svg.path({
                    fill: color.lighten(fill, 0.15),
                    stroke: color.lighten(fill, 0.15)
                }).MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                svg.path({
                    fill: fill,
                    stroke: fill
                }).MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2);

                svg.path({
                    fill: color.darken(fill, 0.2),
                    stroke: color.darken(fill, 0.2)
                }).MoveTo(w1, h2)
                    .LineTo(w2, h1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2);
            });

            return g;
        }

        // 3D 타원 그리기
        this.cylinder3d = function(fill, width, height, depth) {
            var r = width / 2,
                d = depth / 2,
                key = _.createId("cylinder3d");

            var g = svg.group({}, function() {
                svg.ellipse({
                    fill: color.darken(fill, 0.05),
                    "fill-opacity": 0.85,
                    stroke: color.darken(fill, 0.05),
                    rx: r,
                    ry: d,
                    cx: r,
                    cy: height
                });

                svg.path({
                    fill: "url(#" + key + ")",
                    "fill-opacity": 0.85,
                    stroke: fill
                }).MoveTo(0, d)
                    .LineTo(0, height)
                    .Arc(r, d, 0, 0, 0, width, height)
                    .LineTo(width, d)
                    .Arc(r, d, 0, 0, 1, 0, d);

                svg.ellipse({
                    fill: color.lighten(fill, 0.2),
                    "fill-opacity": 0.85,
                    stroke: color.lighten(fill, 0.2),
                    rx: r,
                    ry: d,
                    cx: r,
                    cy: d
                });

                svg.linearGradient({
                    id: key,
                    x1: "100%",
                    x2: "0%",
                    y1: "0%",
                    y2: "0%"
                }, function() {
                    svg.stop({
                        offset: "0%",
                        "stop-color": color.lighten(fill, 0.15)
                    });
                    svg.stop({
                        offset: "33.333333333333336%",
                        "stop-color": color.darken(fill, 0.2)
                    });
                    svg.stop({
                        offset: "66.66666666666667%",
                        "stop-color": color.darken(fill, 0.2)
                    });
                    svg.stop({
                        offset: "100%",
                        "stop-color": color.lighten(fill, 0.15)
                    });
                });
            });

            return g;
        }
    }
  
    SVG3D.createElement = SVGUtil.createElement;

    return SVG3D;
});
