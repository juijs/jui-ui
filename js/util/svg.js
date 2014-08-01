jui.define("util.svg.element", [ "util" ], function(_) { // rectangle, circle, text, line, ...
    var Element = function() {
        var attributes = {},
            styles = {};

        this.create = function(type, attr) {
            this.element = document.createElementNS("http://www.w3.org/2000/svg", type);
            this.childrens = [];
            this.parent = null;
            this.attr(attr);
            
            if(attr.text) { // 이 코드가 뭘까?
            	this.element.appendChild(document.createTextNode(attr.text));
            }
        }

        this.attr = function(attr) {
            for(var k in attr) {
                attributes[k] = attr[k];
            }

            for(var k in attributes) {
                if(k.indexOf("xlink:") != -1) {
                    this.element.setAttributeNS("http://www.w3.org/1999/xlink", k, attributes[k]);
                } else {
                    this.element.setAttributeNS(null, k, attributes[k]);
                }
            }

            return this;
        }

        this.css = function(css) {
            var list = [];

            for (var k in css) {
                styles[k] = css[k];
            }

            for (var k in styles) {
                list.push(k + ":" + styles[k]);
            }

            this.attr({ style: list.join(";") });

            return this;
        }

        this.html = function(html) {
            this.element.innerHTML = html;

            return this;
        }

        this.append = function(elem) {
            this.childrens.push(elem);
            elem.parent = this;

            return this;
        }
    }

    return Element;
});

jui.define("util.svg.element.path", [], function() { // path
    var PathElement = function() {
        var orders = [],
            isUpper = true;

        this.uppercase = function() {
            isUpper = true;
            return this;
        }

        this.lowercase = function() {
            isUpper = false;
            return this;
        }

        this.moveTo = function(x, y) {
            orders.push( ((isUpper) ? "M" : "m") + x + "," + y );
            return this;
        }

        this.lineTo = function(x, y) {
            orders.push( ((isUpper) ? "L" : "l") + x + "," + y );
            return this;
        }

        this.hLineTo = function(x) {
            orders.push( ((isUpper) ? "H" : "h") + x );
            return this;
        }

        this.vLineTo = function(y) {
            orders.push( ((isUpper) ? "V" : "v") + y );
            return this;
        }

        this.curveTo = function(x1, y1, x2, y2, x, y) {
            orders.push( ((isUpper) ? "C" : "c") + x1 + "," + y1 + " " + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }

        this.sCurveTo = function(x2, y2, x, y) {
            orders.push( ((isUpper) ? "S" : "s") + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }

        this.qCurveTo = function(x1, y1, x, y) {
            orders.push( ((isUpper) ? "Q" : "q") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }

        this.tCurveTo = function(x1, y1, x, y) {
            orders.push( ((isUpper) ? "T" : "t") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }

        this.arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y) {
            large_arc_flag = (large_arc_flag) ? 1 : 0;
            sweep_flag = (sweep_flag) ? 1 : 0;

            orders.push( ((isUpper) ? "A" : "a") + rx + "," + ry + " " + x_axis_rotation + " " + large_arc_flag + "," + sweep_flag + " " + x + "," + y );
            return this;
        }

        this.close = function() {
            this.attr({
                d: orders.join(" ")
            });

            orders = [];
            return this;
        }

        this.closePath = function() {
            orders.push((isUpper) ? "Z" : "z");
            this.close();

            return this;
        }
    }

    return PathElement;
}, "util.svg.element");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function() {
        var orders = [];

        this.point = function(x, y) {
            orders.push(x + "," + y)
            return this;
        }

        this.close = function() {
            this.attr({
                points: orders.join(" ")
            });

            orders = [];
            return this;
        }
    }

    return PolyElement;
}, "util.svg.element");

jui.define("util.svg",
    [ "util", "util.svg.element", "util.svg.element.path", "util.svg.element.poly" ],
    function(_, Element, PathElement, PolyElement) {

    var SVG = function(root, width, height) {
        var self = this,
            target = null;

        var parent = {},
            depth = 0;

        var def_attr = {}; // 엘리먼트 공통 속성

        function init() {
            target = new Element();

            target.create("svg", {
                width: (_.typeCheck("integer", width)) ? width : 300,
                height: (_.typeCheck("integer", height)) ? width : 300
            });

            root.appendChild(target.element);
        }

        function create(elem, type, attr, callback) {
            elem.create(type, getAttributes(attr));

            if(depth == 0) {
                target.append(elem);
            } else {
                parent[depth].append(elem);
            }

            if(_.typeCheck("function", callback)) {
                depth++;
                parent[depth] = elem;

                callback.call(self, elem);
                depth--;
            }

            return elem;
        }

        function appendChild(target) {
            for(var i = 0; i < target.childrens.length; i++) {
                var child = target.childrens[i];

                if(child.parent == target) {
                    target.element.appendChild(child.element);
                }

                if(child.childrens.length > 0) {
                    appendChild(child);
                }
            }
        }

        function getAttributes(attr) {
            var tmp_attr = {};

            for(var k in def_attr) {
                if(_.typeCheck("function", def_attr[k])) {
                    if(attr[k]) {
                        attr[k] = def_attr[k](attr[k]);
                    }
                } else {
                    tmp_attr[k] = def_attr[k];
                }
            }

            return $.extend(tmp_attr, attr);
        }

        /**
         * 일반 메소드
         *
         */

        this.setting = function(attr) {
            def_attr = attr;
        }

        this.size = function() {
            var rect = target.element.getBoundingClientRect();

            return {
                width: rect.width,
                height: rect.height
            }
        }

        this.clear = function() {
            var newElement = target.element.cloneNode(false);

            target.element.parentNode.removeChild(target.element);
            target.element = newElement;

            root.appendChild(target.element);
        }

        this.render = function() {
            this.clear();
            appendChild(target);
        }

        /**
         * 엘리먼트 관련 메소드
         *
         * @param attr
         */

        this.custom = function(name, attr, callback) {
            return create(new Element(), name, attr, callback);
        }

        this.defs = function(callback) {
            return create(new Element(), "defs", null, callback);
        }

        this.symbol = function(attr, callback) {
            return create(new Element(), "symbol", attr, callback);
        }

        this.g = this.group = function(attr, callback) {
            return create(new Element(), "g", attr, callback);
        }

        this.marker = function(attr, callback) {
            return create(new Element(), "marker", attr, callback);
        }

        this.a = function(attr, callback) {
            return create(new Element(), "a", attr, callback);
        }

        this.use = function(attr) {
            return create(new Element(), "use", attr);
        }

        this.rect = function(attr) {
            return create(new Element(), "rect", attr);
        }

        this.line = function(attr) {
            return create(new Element(), "line", attr);
        }

        this.circle = function(attr) {
            return create(new Element(), "circle", attr);
        }

        this.text = function(attr, textOrCallback) {
            if(_.typeCheck("string", textOrCallback)) {
                return create(new Element(), "text", attr).html(textOrCallback);
            }

            return create(new Element(), "text", attr, textOrCallback);
        }

        this.textPath = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "textPath", attr).html(text);
            }

            return create(new Element(), "textPath", attr);
        }

        this.tref = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tref", attr).html(text);
            }

            return create(new Element(), "tref", attr);
        }

        this.tspan = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tspan", attr).html(text);
            }

            return create(new Element(), "tspan", attr);
        }

        this.ellipse = function(attr) {
            return create(new Element(), "ellipse", attr);
        }

        this.path = function(attr) {
            return create(new PathElement(), "path", attr);
        }

        this.polyline = function(attr) {
            return create(new PolyElement(), "polyline", attr);
        }

        this.polygon = function(attr) {
            return create(new PolyElement(), "polygon", attr);
        }

        init();
    }

    return SVG;
});