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
        
        function appendAll(target) {
            var childs = target.children;

            // 엘리먼트 렌더링 순서 정하기
            if(isOrderingChild(childs)) {
                childs.sort(function (a, b) {
                    return a.order - b.order;
                });
            }

            for(var i = 0, len = childs.length; i < len; i++) {
                var child = childs[i];

                if(child) {
                    if(child.children.length > 0) {
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

        function isOrderingChild(childs) { // order가 0 이상인 엘리먼트가 하나라도 있을 경우
            for(var i = 0, len = childs.length; i < len; i++) {
                if(childs[i].order > 0) {
                    return true;
                }
            }

            return false;
        }

        this.create = function(obj, type, attr, callback) {
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

        this.createChild = function(obj, type, attr, callback) {
            if(obj.parent == main) {
                throw new Error("JUI_CRITICAL_ERR: Parents are required elements of the '" + type + "'");
            }

            return this.create(obj, type, attr, callback);
        }

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
            main.children = [];

            if(isAll === true) {
                sub.children = [];
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
              
              var png = canvas.toDataURL(type);
              
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
         * @method getTextSize
         *
         * caculate real pixel size of text element
         *
         * @param {String} text target text
         * @return {Object}
         * @return {Integer} return.width  text element's width (px)
         * @return {Integer} return.height text element's height(px)
         */
        this.getTextSize = function(text) {
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

        init();
    }

    /**
     * @method create
     *
     * create nested elements by json
     *
     *      @example
     *      SVG.create({
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
    SVG.createObject = function(obj) {
        var el = new Element();

        el.create(obj.type, obj.attr);

        if (obj.children instanceof Array) {
            for(var i = 0, len = obj.children.length; i < len; i++) {
                el.append(SVG.createObject(obj.children[i]));
            }
        }

        return el;
    }

    return SVG;
}, "util.svg.3d");
