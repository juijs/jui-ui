jui.define("util.svg.element", [], function() { // rectangle, circle, text, line, ...
    var Element = function(type) {
        this.attr = function(attr) {

        }

        this.css = function(css) {

        }
    }

    return Element;
});

jui.define("util.svg.element.path", [], function() { // path
    var PathElement = function(type) {

    }

    return PathElement;
}, "util.svg.element");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function(type) {

    }

    return PolyElement;
}, "util.svg.element");

jui.define("util.svg",
    [ "util", "util.svg.element", "util.svg.element.path", "util.svg.element.poly" ],
    function(_, Element, Path, Poly) {

    var SVG = function(selector, attr) {
        var root = null,
            childrens = [];

        function init() {
            root = createElement("svg", {
                width: attr.width || 300,
                height: attr.height || 300,
                x: attr.x || 0,
                y: attr.y || 0
            });

            $(selector)[0].appendChild(root);
        }

        function createElement(type, attr) {
            var elem = document.createElementNS("http://www.w3.org/2000/svg", type);

            if (_.typeCheck("object", attr)) {
                setAttributes(elem, attr);
            }

            return elem;
        }

        function setAttributes(elem, attr) {
            for(var k in attr) {
                elem.setAttributeNS(null, k, attr[k]);
            }
        }

        this.clear = function() {
            var newRoot = root.cloneNode(false);

            root.parentNode.removeChild(root);
            $(selector)[0].appendChild(newRoot);
        }


        /**
         * 일반 메소드
         *
         */

        this.render = function() {
            this.clear();

            for(var i = 0, len = childrens.length; i < len; i++) {
                root.appendChild(childrens[i]);
            }
        }

        this.size = function() {
            var rect = root.getBoundingClientRect();

            return {
                width: rect.width,
                height: rect.height
            }
        }


        /**
         * 엘리먼트 관련 메소드
         *
         * @param attr
         */

        this.rect = function(attr) {
            var elem = createElement("rect", attr);

            setAttributes(elem, attr);
            childrens.push(elem);
        }

        this.line = function(attr) {

        }

        this.circle = function(attr) {

        }

        this.text = function(attr) {

        }

        this.ellipse = function(attr) {

        }

        this.polyline = function(attr) {

        }

        this.polygon = function(attr) {

        }

        this.path = function(attr) {

        }

        init();
    }

    return SVG;
});