jui.define("util.svg.element", [], function() {
    var Element = function() {

        /**
         * 엘리먼트 생성 및 조회 메소드
         *
         */

        this.create = function(type, attr) {
            // 퍼블릭 프로퍼티
            this.element = document.createElementNS("http://www.w3.org/2000/svg", type);
            this.childrens = [];
            this.parent = null;
            this.attributes = {};
            this.styles = {};

            // 기본 속성 설정
            this.attr(attr);
        }
        
        this.each = function(callback) {
            if(typeof(callback) != "function") {
                for(var i = 0; i < this.childrens.length; i++) {
                    callback.call(this.childrens[i], i);
                }
            }

            return this.childrens;
        }

        this.get = function(index) {
            if(this.childrens[index]) {
                return this.childrens[index];
            }

            return null;
        }

        this.index = function(obj) {
            for(var i = 0; i < this.childrens.length; i++) {
                if(obj == this.childrens[i]) {
                    return i;
                }
            }

            return null;
        }

        /**
         * 엘리먼트 조작 메소드
         *
         */

        this.attr = function(attr) {
            for(var k in attr) {
                this.attributes[k] = attr[k];
            }

            for(var k in this.attributes) {
                if(k.indexOf("xlink:") != -1) {
                    this.element.setAttributeNS("http://www.w3.org/1999/xlink", k, this.attributes[k]);
                } else {
                    this.element.setAttributeNS(null, k, this.attributes[k]);
                }
            }

            return this;
        }

        this.css = function(css) {
            var list = [];

            for(var k in css) {
                this.styles[k] = css[k];
            }

            for(var k in this.styles) {
                list.push(k + ":" + this.styles[k]);
            }

            this.attr({ style: list.join(";") });

            return this;
        }

        this.html = function(html) {
            this.element.innerHTML = html;

            return this;
        }
        
        this.text = function(text) {
        	this.element.appendChild(document.createTextNode(text));
        	
        	return this; 
        }

        this.append = function(elem) {
            this.childrens.push(elem);
            elem.parent = this;

            return this;
        }

        this.prepend = function(elem) {
            return this.insert(0, elem);
        }

        this.insert = function(index, elem) {
            this.childrens.splice(index, 0, elem);
            elem.parent = this;

            return this;
        }

        this.remove = function() {

            this.parent.element.removeChild(this.element);

            return this;
        }

        this.on = function(type, handler) {
            this.element.addEventListener(type, function(e) {
                if(typeof(handler) == "function") {
                    handler.call(this, e);
                }
            }, false);

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
        var orders = [];

        function applyOrders(self) {
            self.attr({ d: orders.join(" ") });
        }

        this.moveTo = function(x, y, type) {
            orders.push( (type || "m") + x + "," + y );
            applyOrders(this);

            return this;
        }
        this.MoveTo = function(x, y) {
            return this.moveTo(x, y, "M");
        }

        this.lineTo = function(x, y, type) {
            orders.push( (type || "l") + x + "," + y );
            applyOrders(this);

            return this;
        }
        this.LineTo = function(x, y) {
            return this.lineTo(x, y, "L");
        }

        this.hLineTo = function(x, type) {
            orders.push( (type || "h") + x );
            applyOrders(this);

            return this;
        }
        this.HLineTo = function(x) {
            return this.hLineTo(x, "H");
        }

        this.vLineTo = function(y, type) {
            orders.push( (type || "v") + y );
            applyOrders(this);

            return this;
        }
        this.VLineTo = function(y) {
            return this.vLineTo(y, "V");
        }

        this.curveTo = function(x1, y1, x2, y2, x, y, type) {
            orders.push( (type || "c") + x1 + "," + y1 + " " + x2 + "," + y2 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }
        this.CurveTo = function(x1, y1, x2, y2, x, y) {
            return this.curveTo(x1, y1, x2, y2, x, y, "C");
        }

        this.sCurveTo = function(x2, y2, x, y, type) {
            orders.push( (type || "s") + x2 + "," + y2 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }
        this.SCurveTo = function(x2, y2, x, y) {
            return this.sCurveTo(x2, y2, x, y, "S");
        }

        this.qCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "q") + x1 + "," + y1 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }
        this.QCurveTo = function(x1, y1, x, y) {
            return this.qCurveTo(x1, y1, x, y, "Q");
        }

        this.tCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "t") + x1 + "," + y1 + " " + x + "," + y );
            applyOrders(this);

            return this;
        }
        this.TCurveTo = function(x1, y1, x, y) {
            return this.tCurveTo(x1, y1, x, y, "T");
        }

        this.arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, type) {
            large_arc_flag = (large_arc_flag) ? 1 : 0;
            sweep_flag = (sweep_flag) ? 1 : 0;

            orders.push( (type || "a") + rx + "," + ry + " " + x_axis_rotation + " " + large_arc_flag + "," + sweep_flag + " " + x + "," + y );
            applyOrders(this);

            return this;
        }
        this.Arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y) {
            return this.arc(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, "A");
        }

        this.closePath = function(type) {
            orders.push( (type || "z") );
            applyOrders(this);

            return this;
        }
        this.ClosePath = function() {
            return this.closePath("Z");
        }
    }

    return PathElement;
}, "util.svg.element.transform");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function() {
        var orders = [];

        function applyOrders(self) {
            self.attr({ points: orders.join(" ") });
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
    [ "util.base", "util.math", "util.svg.element", "util.svg.element.transform",
        "util.svg.element.path", "util.svg.element.poly" ],
    function(_, math, Element, TransElement, PathElement, PolyElement) {

    var SVG = function(rootElem, rootAttr) {
        var root = null,
            parent = {},
            depth = 0;

        function init() {
            root = new Element();
            root.create("svg", rootAttr);

            rootElem.appendChild(root.element);
        }
        
        function create(obj, type, attr, callback) {
            obj.create(type, attr);

            if(depth == 0) {
                root.append(obj);
            } else {
                parent[depth].append(obj);
            }

            if(_.typeCheck("function", callback)) {
                depth++;
                parent[depth] = obj;

                callback.call(obj);
                depth--;
            }

            return obj;
        }

        function createChild(obj, type, attr, callback) {
            if(obj.parent == root) {
                throw new Error("JUI_CRITICAL_ERR: Parents are required elements of the '" + type + "'");
            }

            return create(obj, type, attr, callback);
        }

        function appendAll(target) {
            for(var i = 0; i < target.childrens.length; i++) {
                var child = target.childrens[i];

                if(child.parent == target) {
                    target.element.appendChild(child.element);
                }

                if(child.childrens.length > 0) {
                    appendAll(child);
                }
            }
        }

        /**
         * getBoundingClientRect() 로 크기를 구할 수 없을 때 사용
         *
         * ex) 파폭 버그로   width, height 모두 0이 되므로 아래 함수를 사용해야함
         */
        function caculateSize() {
            var height_list = [ 'height', 'paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth' ],
                width_list = [ 'width', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth' ];

            var computedStyle = window.getComputedStyle(root.element),
                size = { width : 0, height : 0 };

            for(var i = 0; i < height_list.length;i++) {
                size.height += parseFloat(computedStyle[height_list[i]]);
            }

            for(var i = 0; i < width_list.length;i++) {
                size.width += parseFloat(computedStyle[width_list[i]]);
            }

            return size;
        }

        /**
         * 일반 메소드
         *
         */

        this.size = function() {
            if(arguments.length == 2) {
                var w = arguments[0],
                    h = arguments[1];

                if(_.typeCheck("integer", w) && _.typeCheck("integer", h)) {
                    root.attr({ width: w, height: h });
                }
            } else {
                var rect = root.element.getBoundingClientRect();

                // if firefox 
                if (rect.width == 0 && rect.height == 0) {
                    rect = caculateSize();
                }

                return {
                    width: rect.width,
                    height: rect.height
                }
            }
        }

        this.clear = function() {
            var newElement = root.element.cloneNode(false);

            if(root.element.parentNode) {
                root.element.parentNode.removeChild(root.element);
            }

            root.element = newElement;
            rootElem.appendChild(root.element);
        }

        this.reset = function() {
            this.clear();
            root.childrens = [];
        }

        this.render = function() {
            this.clear();
            appendAll(root);
        }

        this.download = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement('a');
            a.download = (name) ? name + ".png" : "svg.png";
            a.href = _.svgToBase64(rootElem.innerHTML);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }

        /**
         * 루트 엘리먼트 조작 메소드
         *
         */

        this.each = function(callback) {
            return root.each(callback);
        }

        this.get = function(index) {
            return root.get(index);
        }

        this.index = function(obj) {
            return root.index(obj);
        }

        this.css = function(css) {
            return root.css(css);
        }

        /**
         * 엘리먼트 생성 메소드
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
                return create(new TransElement(), "text", attr).text(textOrCallback);
            }

            return create(new TransElement(), "text", attr, textOrCallback);
        }

        this.textPath = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "textPath", attr).text(text);
            }

            return create(new Element(), "textPath", attr);
        }

        this.tref = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tref", attr).text(text);
            }

            return create(new Element(), "tref", attr);
        }

        this.tspan = function(attr, text) {
            if(_.typeCheck("string", text)) {
                return create(new Element(), "tspan", attr).text(text);
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

        this.animate = function(attr) {
            return createChild(new Element(), "animate", attr);
        }

        this.animateColor = function(attr) {
            return createChild(new Element(), "animateColor", attr);
        }

        this.animateMotion = function(attr) {
            return createChild(new Element(), "animateMotion", attr);
        }

        this.animateTransform = function(attr) {
            return createChild(new Element(), "animateTransform", attr);
        }

        this.mpath = function(attr) {
            return createChild(new Element(), "mpath", attr);
        }

        this.set = function(attr) {
            return createChild(new Element(), "set", attr);
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

        /**
         * 엘리먼트 생성 메소드 (3D)
         *
         */

        this.rect3d = function(attr) {
            var self = this;

            var radian = math.radian(attr.degree),
                x1 = 0, y1 = 0,
                w1 = attr.width, h1 = attr.height;

            var x2 = (Math.cos(radian) * attr.depth) + x1,
                y2 = (Math.sin(radian) * attr.depth) + y1;

            var w2 = attr.width + x2,
                h2 = attr.height + y2;

            var g = this.group({
                width: w2,
                height: h2
            }, function() {
                delete attr.width, attr.height, attr.degree, attr.depth;

                self.path(attr)
                    .MoveTo(x2, x1)
                    .LineTo(w2, y1)
                    .LineTo(w1, y2)
                    .LineTo(x1, y2);

                self.path(attr)
                    .MoveTo(x1, y2)
                    .LineTo(x1, h2)
                    .LineTo(w1, h2)
                    .LineTo(w1, y2)
                    .ClosePath();

                self.path(attr)
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