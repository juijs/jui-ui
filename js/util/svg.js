jui.define("util.svg.element", [], function() { // rectangle, circle, text, line, ...
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
            console.log(this.element);

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

jui.define("util.svg.element.transform", [], function() { // polygon, polyline
    var TransElement = function() {
        var orders = {};

        function applyOrders(self) {
            var orderArr = [];

            for(var key in orders) {
                if(orders[key]) orderArr.push(orders[key]);
            }

            self.attr({ transform: orderArr.join(" ") });
        }

        function getStringArgs(args) {
            var result = [];

            for(var i = 0; i < args.length; i++) {
                result.push(args[i]);
            }

            return result.join(",");
        }

        this.translate = function() {
            orders["translate"] = "translate(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.rotate = function() {
            orders["rotate"] = "rotate(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.scale = function() {
            orders["scale"] = "scale(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.skew = function() {
            orders["skew"] = "skew(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }

        this.matrix = function() {
            orders["matrix"] = "matrix(" + getStringArgs(arguments) + ")";
            applyOrders(this);

            return this;
        }
    }

    return TransElement;
}, "util.svg.element");

jui.define("util.svg.element.path", [], function() { // path
    var PathElement = function() {
        var orders = [],
            isUpper = true;

        function applyOrders(self) {
            self.attr({ d: orders.join(" ") });
        }

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
            applyOrders(this);

            return this;
        }

        this.lineTo = function(x, y) {
            orders.push( ((isUpper) ? "L" : "l") + x + "," + y );
            applyOrders(this);

            return this;
        }

        this.hLineTo = function(x) {
            orders.push( ((isUpper) ? "H" : "h") + x );
            applyOrders(this);

            return this;
        }

        this.vLineTo = function(y) {
            orders.push( ((isUpper) ? "V" : "v") + y );
            applyOrders(this);

            return this;
        }

        this.curveTo = function(x1, y1, x2, y2, x, y) {
            orders.push( ((isUpper) ? "C" : "c") + x1 + "," + y1 + " " + x2 + "," + y2 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }

        this.sCurveTo = function(x2, y2, x, y) {
            orders.push( ((isUpper) ? "S" : "s") + x2 + "," + y2 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }

        this.qCurveTo = function(x1, y1, x, y) {
            orders.push( ((isUpper) ? "Q" : "q") + x1 + "," + y1 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }

        this.tCurveTo = function(x1, y1, x, y) {
            orders.push( ((isUpper) ? "T" : "t") + x1 + "," + y1 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }

        this.arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y) {
            large_arc_flag = (large_arc_flag) ? 1 : 0;
            sweep_flag = (sweep_flag) ? 1 : 0;

            orders.push( ((isUpper) ? "A" : "a") + rx + "," + ry + " " + x_axis_rotation + " " + large_arc_flag + "," + sweep_flag + " " + x + "," + y );
            applyOrders(this);

            return this;
        }

        this.closePath = function() {
            orders.push((isUpper) ? "Z" : "z");
            applyOrders(this);

            return this;
        }
    }

    return PathElement;
}, "util.svg.element.transform");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function() {
        var orders = [];

        function applyOrders(self) {
            self.attr({ d: orders.join(" ") });
        }

        this.point = function(x, y) {
            orders.push(x + "," + y);
            applyOrders(this);

            return this;
        }
    }

    return PolyElement;
}, "util.svg.element.transform");

jui.define("util.svg",
    [ "util", "util.svg.element", "util.svg.element.transform", "util.svg.element.path", "util.svg.element.poly" ],
    function(_, Element, TransElement, PathElement, PolyElement) {

    var SVG = function(root, attr) {
        var self = this,
            target = null;

        var parent = {},
            depth = 0;

        function init() {
            target = new Element();

            target.create("svg", {
                width: (_.typeCheck("integer", attr.width)) ? attr.width : 300,
                height: (_.typeCheck("integer", attr.height)) ? attr.width : 300
            });

            root.appendChild(target.element);
        }

        function create(elem, type, attr, callback) {
            elem.create(type, attr);

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

        function createChild(elem, type, attr, callback) {
            if(elem.parent == target) {
                throw new Error("JUI_CRITICAL_ERR: Parents are required elements of the '" + type + "'");
            }

            return create(elem, type, attr, callback);
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

        /**
         * 일반 메소드
         *
         */

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

        this.download = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".png" : "svg.png";
            a.href = _.svgToBase64(root.innerHTML);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }

        /**
         * 엘리먼트 관련 메소드
         *
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
            return create(new TransElement(), "g", attr, callback);
        }

        this.marker = function(attr, callback) {
            return create(new Element(), "marker", attr, callback);
        }

        this.a = function(attr, callback) {
            return create(new TransElement(), "a", attr, callback);
        }

        this.switch = function(attr, callback) {
            return create(new Element(), "switch", attr, callback);
        }

        this.use = function(attr) {
            return create(new Element(), "use", attr);
        }

        this.rect = function(attr, callback) {
            return create(new TransElement(), "rect", attr, callback);
        }

        this.line = function(attr, callback) {
            return create(new TransElement(), "line", attr, callback);
        }

        this.circle = function(attr, callback) {
            return create(new TransElement(), "circle", attr, callback);
        }

        this.text = function(attr, textOrCallback) {
            if(_.typeCheck("string", textOrCallback)) {
                return create(new TransElement(), "text", attr).html(textOrCallback);
            }

            return create(new TransElement(), "text", attr, textOrCallback);
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

        this.ellipse = function(attr, callback) {
            return create(new TransElement(), "ellipse", attr, callback);
        }

        this.image = function(attr, callback) {
            return create(new TransElement(), "image", attr, callback);
        }

        this.path = function(attr, callback) {
            return create(new PathElement(), "path", attr, callback);
        }

        this.polyline = function(attr, callback) {
            return create(new PolyElement(), "polyline", attr, callback);
        }

        this.polygon = function(attr, callback) {
            return create(new PolyElement(), "polygon", attr, callback);
        }

        this.pattern = function(attr, callback) {
            return create(new Element(), "pattern", attr, callback);
        }

        this.mask = function(attr, callback) {
            return create(new Element(), "mask", attr, callback);
        }

        this.clipPath = function(attr, callback) {
            return create(new Element(), "clipPath", attr, callback);
        }

        this.linearGradient = function(attr, callback) {
            return create(new Element(), "linearGradient", attr, callback);
        }

        this.radialGradient = function(attr, callback) {
            return create(new Element(), "radialGradient", attr, callback);
        }

        this.filter = function(attr, callback) {
            return create(new Element(), "filter", attr, callback);
        }

        /**
         * 엘리먼트 관련 메소드 (그라데이션)
         *
         */

        this.stop = function(attr) {
            return createChild(new Element(), "stop", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (애니메이션)
         *
         */

        this.set = function(attr) {
            return createChild(new Element(), "set", attr);
        }

        this.animate = function(attr) {
            return createChild(new Element(), "animate", attr);
        }

        this.animateColor = function(attr) {
            return createChild(new Element(), "animateColor", attr);
        }

        this.animateTransform = function(attr) {
            return createChild(new Element(), "animateTransform", attr);
        }

        this.animateMotion = function(attr) {
            return createChild(new Element(), "animateMotion", attr);
        }

        /**
         * 엘리먼트 관련 메소드 (필터)
         *
         */

        this.feBlend = function(attr) {
            return createChild(new Element(), "feBlend", attr);
        }

        this.feColorMatrix = function(attr) {
            return createChild(new Element(), "feColorMatrix", attr);
        }

        this.feComponentTransfer = function(attr) {
            return createChild(new Element(), "feComponentTransfer", attr);
        }

        this.feComposite = function(attr) {
            return createChild(new Element(), "feComposite", attr);
        }

        this.feConvolveMatrix = function(attr) {
            return createChild(new Element(), "feConvolveMatrix", attr);
        }

        this.feDiffuseLighting = function(attr) {
            return createChild(new Element(), "feDiffuseLighting", attr);
        }

        this.feDisplacementMap = function(attr) {
            return createChild(new Element(), "feDisplacementMap", attr);
        }

        this.feFlood = function(attr) {
            return createChild(new Element(), "feFlood", attr);
        }

        this.feGaussianBlur = function(attr) {
            return createChild(new Element(), "feGaussianBlur", attr);
        }

        this.feImage = function(attr) {
            return createChild(new Element(), "feImage", attr);
        }

        this.feMerge = function(attr, callback) {
            return createChild(new Element(), "feMerge", attr, callback);
        }

        this.feMergeNode = function(attr) {
            return createChild(new Element(), "feMergeNode", attr);
        }

        this.feMorphology = function(attr) {
            return createChild(new Element(), "feMorphology", attr);
        }

        this.feOffset = function(attr) {
            return createChild(new Element(), "feOffset", attr);
        }

        this.feSpecularLighting = function(attr) {
            return createChild(new Element(), "feSpecularLighting", attr);
        }

        this.feTile = function(attr) {
            return createChild(new Element(), "feTile", attr);
        }

        this.feTurbulence = function(attr) {
            return createChild(new Element(), "feTurbulence", attr);
        }

        init();
    }

    return SVG;
});