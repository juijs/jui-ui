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

            var g = svg.group({
                width: w2,
                height: h2
            }, function() {
                svg.path({
                    fill: color.lighten(fill, 0.15)
                }).MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                svg.path({
                    fill: fill
                }).MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2);

                svg.path({
                    fill: color.darken(fill, 0.2)
                }).MoveTo(w1, h2)
                    .LineTo(w2, h1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2);
            });

            return g;
        }
    }

    return SVG3D;
});
