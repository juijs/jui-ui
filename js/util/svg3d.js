jui.define("util.svg3d", [ "util.base", "util.math", "util.svg" ], function(_, math, SVGUtil) {
    var SVG = function(rootElem, rootAttr) {
        var svg = null;

        function init() {
            svg = new SVGUtil(rootElem, rootAttr);
        }

        /**
         * 일반 메소드
         *
         */

        this.size = function() {
            return svg.size();
        }

        this.clear = function(isAll) {
            return svg.clear(isAll);
        }

        this.reset = function(isAll) {
            return svg.reset(isAll);
        }

        this.render = function(isAll) {
            return svg.render(isAll);
        }

        /**
         * 엘리먼트 생성 메소드 (3D)
         *
         */

        this.rect3d = function(attr) {
            var radian = math.radian(attr.degree),
                x1 = 0, y1 = 0,
                w1 = attr.width, h1 = attr.height;

            var x2 = (Math.cos(radian) * attr.depth) + x1,
                y2 = (Math.sin(radian) * attr.depth) + y1;

            var w2 = attr.width + x2,
                h2 = attr.height + y2;

            var g = svg.group({
                width: w2,
                height: h2
            }, function() {
                delete attr.width, attr.height, attr.degree, attr.depth;

                svg.path(attr)
                    .MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                svg.path(attr)
                    .MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2)
                    .ClosePath();

                svg.path(attr)
                    .MoveTo(w1, h2)
                    .LineTo(w2, h1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .ClosePath();
            });

            return g;
        }

        init();
    }

    return SVG;
});