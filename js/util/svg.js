jui.define("util.svg.element", [], function() {
    /**
     * @class util.svg.element
     * Create SVG Element
     * @constructor
     */
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
            this.styles = {};
            this.attributes = {};

            // 기본 속성 설정
            this.attr(attr);
        };
        
        this.each = function(callback) {
            if(typeof(callback) != "function") return;

            for(var i = 0, len = this.childrens.length; i < len; i++) {
                var self = this.childrens[i];
                callback.apply(self, [ i, self ]);
            }

            return this.childrens;
        };

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

            return -1;
        }

        /**
         * 엘리먼트 관계 메소드
         *
         */

        this.append = function(elem) {
            if(elem instanceof Element) {
                if (elem.parent) {
                    elem.remove();
                }

                this.childrens.push(elem);
                elem.parent = this;
            }

            return this;
        }

        this.prepend = function(elem) {
            return this.insert(0, elem);
        }

        this.insert = function(index, elem) {
        	if(elem.parent) {
        		elem.remove();	
        	}        	
        	
            this.childrens.splice(index, 0, elem);
            elem.parent = this;

            return this;
        }

        this.remove = function() {
            var index = 0,
                nChild = [],
                pChild = this.parent.childrens;

            for(var i = 0; i < pChild.length; i++) {
                if (pChild[i] == this) {
                    index = i;
                    break;
                }

                nChild.push(pChild[i]);
            }

            this.parent.childrens = nChild;

            return this;
        }

        /**
         * 엘리먼트 DOM 조작 메소드
         *
         */

        this.attr = function(attr) {
            
            if (typeof attr == 'undefined' || !attr) return;
            
            if(typeof attr == "string") {
                return this.attributes[attr] || this.element.getAttribute(attr);
            }

            for(var k in attr) {
                this.attributes[k] = attr[k];

                if(k.indexOf("xlink:") != -1) {
                    this.element.setAttributeNS("http://www.w3.org/1999/xlink", k, attr[k]);
                } else {
                    this.element.setAttribute(k, attr[k]);
                }
            }

            return this;
        }

        this.css = function(css) {
            var list = [];

            for(var k in css) {
                this.styles[k] = css[k];
            }

            for(var k in css) {
                list.push(k + ":" + css[k]);
            }

            this.attr({ style: list.join(";") });

            return this;
        }

        this.html = function(html) {
            this.element.innerHTML = html;

            return this;
        }
        
        this.text = function(text) {
            this.element.innerHTML = "";
        	this.element.appendChild(document.createTextNode(text));
        	
        	return this; 
        }
        
        /**
         * 엘리먼트 DOM 이벤트 메소드
         *
         */

        this.on = function(type, handler) {
            this.element.addEventListener(type, function(e) {
                if(typeof(handler) == "function") {
                    handler.call(this, e);
                }
            }, false);

            return this;
        }

        this.hover = function(overHandler, outHandler) {
            this.element.addEventListener("mouseover", function(e) {
                if(typeof(overHandler) == "function") {
                    overHandler.call(this, e);
                }
            }, false);

            this.element.addEventListener("mouseout", function(e) {
                if(typeof(outHandler) == "function") {
                    outHandler.call(this, e);
                }
            }, false);

            return this;
        }

        /**
         * 그 외 메소드
         *
         */
        this.size = function() {
            var size = { width: 0, height: 0 },
                rect = this.element.getBoundingClientRect();

            if(!rect || (rect.width == 0 && rect.height == 0)) {
                var height_list = [ "height", "paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth" ],
                    width_list = [ "width", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth" ];

                var computedStyle = window.getComputedStyle(this.element);

                for (var i = 0; i < height_list.length; i++) {
                    size.height += parseFloat(computedStyle[height_list[i]]);
                }

                for (var i = 0; i < width_list.length; i++) {
                    size.width += parseFloat(computedStyle[width_list[i]]);
                }

                size.width = size.width || this.element.getAttribute('width');
                size.height = size.height || this.element.getAttribute('height');
            } else {
                size.width = rect.width;
                size.height = rect.height;
            }

            if(isNaN(size.width)) size.width = 0;
            if(isNaN(size.height)) size.height = 0;

            return size;
        }

        this.is = function(moduleId) {
            return this instanceof jui.include(moduleId);
        }
    }

    return Element;
});

jui.define("util.svg.element.transform", [ "util.base" ], function(_) { // polygon, polyline

    /**
     * @class util.svg.element.transform
     *
     * implement Transform Element
     *
     * @extends util.svg.element
     * @constructor
     */
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

        this.rotate = function(angle, x, y) {
            if(arguments.length == 1) {
                var str = angle;
            } else if(arguments.length == 3) {
                var str = angle + " " + x + "," + y;
            }

            orders["rotate"] = "rotate(" + str + ")";
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

        this.data = function(type) {
            var text = this.attr("transform"),
                regex = {
                    translate: /[^translate()]+/g,
                    rotate: /[^rotate()]+/g,
                    scale: /[^scale()]+/g,
                    skew: /[^skew()]+/g,
                    matrix: /[^matrix()]+/g
                };

            if(_.typeCheck("string", text)) {
                return text.match(regex[type])[0];
            }

            return null;
        }
    }

    return TransElement;
}, "util.svg.element");

jui.define("util.svg.element.path", [ "util.base" ], function(_) { // path
    var PathElement = function() {
        var orders = [];

        this.moveTo = function(x, y, type) {
            orders.push( (type || "m") + x + "," + y );
            return this;
        }
        this.MoveTo = function(x, y) {
            return this.moveTo(x, y, "M");
        }

        this.lineTo = function(x, y, type) {
            orders.push( (type || "l") + x + "," + y );
            return this;
        }
        this.LineTo = function(x, y) {
            return this.lineTo(x, y, "L");
        }

        this.hLineTo = function(x, type) {
            orders.push( (type || "h") + x );
            return this;
        }
        this.HLineTo = function(x) {
            return this.hLineTo(x, "H");
        }

        this.vLineTo = function(y, type) {
            orders.push( (type || "v") + y );
            return this;
        }
        this.VLineTo = function(y) {
            return this.vLineTo(y, "V");
        }

        this.curveTo = function(x1, y1, x2, y2, x, y, type) {
            orders.push( (type || "c") + x1 + "," + y1 + " " + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }
        this.CurveTo = function(x1, y1, x2, y2, x, y) {
            return this.curveTo(x1, y1, x2, y2, x, y, "C");
        }

        this.sCurveTo = function(x2, y2, x, y, type) {
            orders.push( (type || "s") + x2 + "," + y2 + " " + x + "," + y );
            return this;
        }
        this.SCurveTo = function(x2, y2, x, y) {
            return this.sCurveTo(x2, y2, x, y, "S");
        }

        this.qCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "q") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }
        this.QCurveTo = function(x1, y1, x, y) {
            return this.qCurveTo(x1, y1, x, y, "Q");
        }

        this.tCurveTo = function(x1, y1, x, y, type) {
            orders.push( (type || "t") + x1 + "," + y1 + " " + x + "," + y );
            return this;
        }
        this.TCurveTo = function(x1, y1, x, y) {
            return this.tCurveTo(x1, y1, x, y, "T");
        }

        this.arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, type) {
            large_arc_flag = (large_arc_flag) ? 1 : 0;
            sweep_flag = (sweep_flag) ? 1 : 0;

            orders.push( (type || "a") + rx + "," + ry + " " + x_axis_rotation + " " + large_arc_flag + "," + sweep_flag + " " + x + "," + y );
            return this;
        }
        this.Arc = function(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y) {
            return this.arc(rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y, "A");
        }

        this.closePath = function(type) {
            orders.push( (type || "z") );
            return this;
        }
        this.ClosePath = function() {
            return this.closePath("Z");
        }

        this.join = function() {
            if(orders.length > 0) {
                this.attr({ d: orders.join(" ") });
                orders = [];
            }
        }

        this.length = function() {
            var id = _.createId(),
                d = orders.join(" ");

            var svg = document.createElement("svg"),
                path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            path.setAttributeNS(null, "id", id);
            path.setAttributeNS(null, "d", d);
            svg.appendChild(path);

            document.body.appendChild(svg);
            var length = document.getElementById(id).getTotalLength();
            document.body.removeChild(svg);

            return length;
        }
    }

    return PathElement;
}, "util.svg.element.transform");

jui.define("util.svg.element.path.symbol", [ "util.base" ], function(_) { // symbol
    var PathSymbolElement = function() {
        var ordersString = "";

        /**
         * 심볼 템플릿
         *
         */
        this.template = function(width, height) {
            var r = width,
                half_width = half_r =  width / 2,
                half_height = height / 2;

            var start = "a" + half_r + "," + half_r + " 0 1,1 " + r + ",0",
                end = "a" + half_r + "," + half_r + " 0 1,1 " + -r + ",0";

            var obj = {
                triangle : ["m0," + -half_height, "l" + (half_width) + "," + height, "l" + (-width) + ",0", "l" + (half_width) + "," + (-height)].join(" "),
                rect : ["m" + (-half_width) + "," + (-half_height), "l" + (width) + ",0", "l0," + (height) , "l" + (-width) + ',0', "l0," + (-height)].join(" "),
                cross : ["m" + (-half_width) + ',' + (-half_height), "l" + (width) + "," + (height), "m0," + (-height), "l" + (-width) + "," + (height)].join(" "),
                circle : ["m" + (-r) + ",0", start, end  ].join(" ")
            }

            obj.rectangle = obj.rect;

            return obj;
        }

        this.join = function() {
            if(ordersString.length > 0) {
                this.attr({ d: ordersString });
                ordersString = "";
            }
        }

        /**
         * 심볼 추가 하기 (튜닝)
         */
        this.add = function(cx, cy, tpl) {
            ordersString += " M" + (cx) + "," + (cy) + tpl;
        }

        /**
         * path 내 심볼 생성
         *
         */
        this.triangle = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(0, -height/2).lineTo(width/2,height).lineTo(-width, 0).lineTo(width/2, -height);
        }

        this.rect = this.rectangle = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(-width/2, -height/2).lineTo(width,0).lineTo(0, height).lineTo(-width, 0).lineTo(0, -height);
        }

        this.cross = function(cx, cy, width, height) {
            return this.MoveTo(cx, cy).moveTo(-width/2, -height/2).lineTo(width, height).moveTo(0, -height).lineTo(-width, height);
        }

        this.circle = function(cx, cy, r) {
            return this.MoveTo(cx, cy).moveTo(-r, 0).arc(r/2, r/2, 0, 1, 1, r, 0).arc(r/2, r/2, 0, 1, 1, -r, 0);
        }
    }

    return PathSymbolElement;
}, "util.svg.element.path");

jui.define("util.svg.element.path.rect", [ "util.math" ], function(math) {
    var PathRectElement = function() {
        this.round = function(width, height, tl, tr, br, bl) {
            tl = (!tl) ? 0 : tl;
            tr = (!tr) ? 0 : tr;
            br = (!br) ? 0 : br;
            bl = (!bl) ? 0 : bl;

            this.MoveTo(0, tl)
                .Arc(tl, tl, 0, 0, 1, tl, 0)
                .HLineTo(width - tr)
                .Arc(tr, tr, 0, 0, 1, width, tr)
                .VLineTo(height - br)
                .Arc(br, br, 0, 0, 1, width - br, height)
                .HLineTo(bl)
                .Arc(bl, bl, 0, 0, 1, 0, height - bl)
                .ClosePath()
                .join();
        }
    }

    return PathRectElement;
}, "util.svg.element.path");

jui.define("util.svg.element.poly", [], function() { // polygon, polyline
    var PolyElement = function() {
        var orders = [];

        this.point = function(x, y) {
            orders.push(x + "," + y);
            return this;
        }

        this.join = function() {
            if(orders.length > 0) {
                // Firefox 처리
                var start = orders[0];
                orders.push(start);

                // 폴리곤 그리기
                this.attr({ points: orders.join(" ") });
                orders = [];
            }
        }
    }

    return PolyElement;
}, "util.svg.element.transform");

jui.define("util.svg",
    [ "util.base", "util.math", "util.color", "util.svg.element", "util.svg.element.transform",
        "util.svg.element.path", "util.svg.element.path.symbol", "util.svg.element.path.rect", "util.svg.element.poly" ],
    function(_, math, color, Element, TransElement, PathElement, PathSymbolElement, PathRectElement, PolyElement) {

    /**
     * @class util.svg
     *
     * SVG Util
     *
     * @param {jQuery/Element} rootElem
     * @param {Object} rootAttr
     * @constructor
     * @alias SVG
     */
    var SVG = function(rootElem, rootAttr) {
        var self = this,
            root = null,
            main = null,
            sub = null,
            parent = {},
            depth = 0;
        var isFirst = false; // 첫번째 렌더링 체크

        function init() {
            self.root = root = new Element();
            main = new TransElement();
            sub = new TransElement();

            root.create("svg", rootAttr);
            main.create("g");
            sub.create("g");

            main.translate(0.5, 0.5);
            sub.translate(0.5, 0.5);

            rootElem.appendChild(root.element);
            root.append(main);
            root.append(sub);
        }
        
        function create(obj, type, attr, callback) {
            obj.create(type, attr);

            if(depth == 0) {
                main.append(obj);
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
            if(obj.parent == main) {
                throw new Error("JUI_CRITICAL_ERR: Parents are required elements of the '" + type + "'");
            }

            return create(obj, type, attr, callback);
        }

        function appendAll(target) {
            var len = target.childrens.length;
            for(var i = 0; i < len; i++) {
                var child = target.childrens[i];

                if(child) {
                    if(child.childrens.length > 0) {
                        appendAll(child);
                    }
                    
                    // PathElement & PathSymbolElement & PathRectElement & PolyElement auto join
                    if(child instanceof PathElement || child instanceof PolyElement) {
                        child.join();
                    }

                    if(child.parent == target) {
                        target.element.appendChild(child.element);
                    }
                }
            }
        }

        /**
         * 일반 메소드
         *
         */

        /**
         * @method size
         *
         * if arguments.length is 2, set attribute width, height to root element
         * if arguments.length is zero, return svg size
         *
         * @return {Object}
         * @return {Integer} width
         * @return {Integer} height
         */
        this.size = function() {
            if(arguments.length == 2) {
                var w = arguments[0],
                    h = arguments[1];

                root.attr({ width: w, height: h });
            } else {
                return root.size();
            }
        }

        /**
         * @method clear
         * @param isAll
         */
        this.clear = function(isAll) {
            main.each(function() {
                if(this.element.parentNode) {
                    main.element.removeChild(this.element);
                }
            });

            if(isAll === true) {
                sub.each(function() {
                    if(this.element.parentNode) {
                        sub.element.removeChild(this.element);
                    }
                });
            }
        }

        /**
         * @method reset
         * @param isAll
         */
        this.reset = function(isAll) {
            this.clear(isAll);
            main.childrens = [];

            if(isAll === true) {
                sub.childrens = [];
            }
        }

        /**
         * @method render
         * @param isAll
         */
        this.render = function(isAll) {
            this.clear();

            if(isFirst === false || isAll === true) {
                appendAll(root);
            } else {
                appendAll(main);
            }

            isFirst = true;
        }

        /**
         * @method
         * implements svg image file download used by canvas
         * @param name
         */
        this.download = function(name) {
            if(_.typeCheck("string", name)) {
                name = name.split(".")[0];
            }

            var a = document.createElement("a");
            a.download = (name) ? name + ".svg" : "svg.svg";
            a.href = this.toDataURI()//;_.svgToBase64(rootElem.innerHTML);

            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
        
        this.downloadImage = function(name, type) {
            type = type || "image/png";

            var img = new Image();
            var size = this.size();
            var uri = this.toDataURI()
                            .replace('width="100%"', 'width="' + size.width + '"')
                            .replace('height="100%"', 'height="' + size.height + '"');
            img.onload = function(){
              var canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              
              var context = canvas.getContext('2d');
              context.drawImage(img, 0, 0);
              
              var png = canvas.toDataURI(type);
              
              if(_.typeCheck("string", name)) {
                  name = name.split(".")[0];
              }              
              
              var a = document.createElement('a');
              a.download = (name) ? name + ".png" : "svg.png";
              a.href = png;
  
              document.body.appendChild(a);
              a.click();
              a.parentNode.removeChild(a);
            }

            img.src = uri;   
      
        }

        /**
         * @method exportCanvas
         *
         * convert svg image to canvas
         *
         * @param {Canvas} canvas
         */
        this.exportCanvas = function(canvas) {
            var img = new Image(),
                size = this.size();

            var uri = this.toDataURI()
                .replace('width="100%"', 'width="' + size.width + '"')
                .replace('height="100%"', 'height="' + size.height + '"');

            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;

                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);
            }

            img.src = uri;
        }

        /**
         * @method toXML
         *
         * convert xml string
         *
         * @return {String} xml
         */
        this.toXML = function() {
            var text = rootElem.innerHTML;

            text = text.replace('xmlns="http://www.w3.org/2000/svg"', '');

            return [
                '<?xml version="1.0" encoding="utf-8"?>',
                text.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
            ].join("\n");
        }

        /**
         * @method toDataURI
         *
         * convert svg to datauri format
         *
         * @return {String}
         */
        this.toDataURI = function() {
            var xml = this.toXML();

            if (_.browser.mozilla || _.browser.msie) {
                xml = encodeURIComponent(xml);
            }

            if (_.browser.msie) {
                return "data:image/svg+xml," + xml;
            } else {
                return "data:image/svg+xml;utf8," + xml;
            }
        }

        /**
         * @method autoRender
         *
         * @param {util.svg.element} elem
         * @param {Boolean} isAuto
         */
        this.autoRender = function(elem, isAuto) {
            if(depth > 0) return;

            if(!isAuto) {
                sub.append(elem);
            } else {
                main.append(elem);
            }
        }

        /**
         * @method getTextRect
         *
         * caculate real pixel size of text element
         *
         * @param {String} text target text
         * @return {Object}
         * @return {Integer} return.width  text element's width (px)
         * @return {Integer} return.height text element's height(px)
         */
        this.getTextRect = function(text) {

            if (text == "") {
                return { width : 0, height : 0 };
            }

            var el = document.createElementNS("http://www.w3.org/2000/svg", "text");
            el.setAttributeNS(null, "x", -200);
            el.setAttributeNS(null, "y", -200);
            el.appendChild(document.createTextNode(text));


        	root.element.appendChild(el);
        	var rect = el.getBoundingClientRect();

            root.element.removeChild(el);

        	return { width : rect.width, height : rect.height }; 
        }

        /**
         * 엘리먼트 생성 메소드
         *
         */

        /**
         * @method custom
         *
         * return custom element
         *
         * @param {String} name
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.custom = function(name, attr, callback) {
            return create(new Element(), name, attr, callback);
        }

        /**
         * @method defs
         *
         * return defs element
         *
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.defs = function(callback) {
            return create(new Element(), "defs", null, callback);
        }

        /**
         * @method symbol
         *
         * return symbol element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.symbol = function(attr, callback) {
            return create(new Element(), "symbol", attr, callback);
        }

        /**
         * @method g
         *
         * return defs element
         *
         * @alias group
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.g = this.group = function(attr, callback) {
            return create(new TransElement(), "g", attr, callback);
        }

        /**
         * @method marker
         *
         * return marker element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.marker = function(attr, callback) {
            return create(new Element(), "marker", attr, callback);
        }

        /**
         * @method a
         *
         * return a element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.a = function(attr, callback) {
            return create(new TransElement(), "a", attr, callback);
        }

        /**
         * @method switch
         *
         * return switch element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element}
         */
        this.switch = function(attr, callback) {
            return create(new Element(), "switch", attr, callback);
        }

        /**
         * @method use
         *
         * return use element
         *
         * @param {Object} attr
         * @return {util.svg.element}
         */
        this.use = function(attr) {
            return create(new Element(), "use", attr);
        }

        /**
         * @method rect
         *
         * return rect element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.rect = function(attr, callback) {
            return create(new TransElement(), "rect", attr, callback);
        }

        /**
         * @method line
         *
         * return line element
         *
         * @param {Object} attr
         * @param {Function} callback
         * @return {util.svg.element.transform}
         */
        this.line = function(attr, callback) {
            return create(new TransElement(), "line", attr, callback);
        }

        this.circle = function(attr, callback) {
            return create(new TransElement(), "circle", attr, callback);
        }

        this.text = function(attr, textOrCallback) {
            if(arguments.length == 2) {
                if (_.typeCheck("function", textOrCallback)) {
                    return create(new TransElement(), "text", attr, textOrCallback);
                }

                return create(new TransElement(), "text", attr).text(textOrCallback);
            }

            return create(new TransElement(), "text", attr);
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

        this.pathSymbol = function(attr, callback) {
            return create(new PathSymbolElement(), "path", attr, callback);
        }

        this.pathRect = function(attr, callback) {
            return create(new PathRectElement(), "path", attr, callback);
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

        init();
    }

    /**
     * @method createElement
     *
     * create nested elements by json
     *
     *      @example
     *      SVG.createElement({
     *          tag : "pattern",
     *          attr : { x : 0, y : 0, width : 20, height : 20  },
     *          children : [
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 } ,
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 } ,
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 } ,
     *              { tag : 'rect', attr : {width : 20, height : 20, fill : 'black', stroke : 'blue', 'stroke-width' : 2 }
     *          ]
     *      });
     *
     * is equals to
     *
     *      @example
     *      <pattern x="0" y="0" width="20" height="20">
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *          <rect width="20" height="20" fill="black" stroke="blue" stroke-width="2" />
     *      </pattern>
     *
     * @param {Object} obj json literal
     * @param {String} obj.type  svg element name
     * @param {Object} obj.attr  svg element's attributes
     * @param {Array} [obj.children=null] svg element's children
     * @static
     * @return {util.svg.element}
     *
     */
    SVG.createElement = function(obj) {
        var el = new Element();

        el.create(obj.type, obj.attr);

        if (obj.children instanceof Array) {
            for(var i = 0, len = obj.children.length ; i < obj.children.length; i++) {
                el.append(SVG.createElement(obj.children[i]));
            }
        }

        return el;
    }

    return SVG;
});
