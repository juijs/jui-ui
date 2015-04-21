jui.define("chart.map", [ "jquery", "util.base", "util.math", "util.svg" ], function($, _, math, SVG) {
    /**
     * @class chart.grid.core
     * Grid Core 객체
     * @extends chart.draw
     * @abstract
     */
    var CoreMap = function() {
        var self = this;
        var pathData = null,
            pathGroup = null,
            pathIndex = {},
            pathScale = 1,
            pathX = 0,
            pathY = 0;

        function loadArray(data) {
            var children = [];

            if(!_.typeCheck("array", data)) {
                data = [ data ];
            }

            for(var i = 0, len = data.length; i < len; i++) {
                if(_.typeCheck("object", data[i])) {
                    var style = {};

                    if(_.typeCheck("string", data[i].style)) {
                        style = getStyleObj(data[i].style);
                        delete data[i].style;
                    }

                    var elem = SVG.createObject({ type: "path", attr: data[i] });
                    elem.css(style);

                    children.push(elem);
                }
            }

            function getStyleObj(str) {
                var style = {},
                    list = str.split(";");

                for(var i = 0; i < list.length; i++) {
                    if(list[i].indexOf(":") != -1) {
                        var obj = list[i].split(":");

                        style[$.trim(obj[0])] = $.trim(obj[1]);
                    }
                }

                return style;
            }

            return children;
        }

        function loadPath(mapLink) {
            pathData = [];

            $.ajax({
                url: mapLink,
                async: false,
                success: function (xml) {
                    var $path = $(xml).find("path");

                    $path.each(function () {
                        var obj = {};

                        $.each(this.attributes, function () {
                            if(this.specified && isLoadAttribute(this.name)) {
                                obj[this.name] = this.value;
                            }
                        });

                        pathData.push(obj);
                    });
                }
            });

            function isLoadAttribute(name) {
                return (name == "id" || name == "title" || name == "position" || name == "d" || name == "class" || name == "style");
            }

            return loadArray(pathData);
        }

        function makeIndex(item) {
            if(item.attr("id")) {
                pathIndex[item.attr("id")] = item;
            }
        }

        function makePathGroup() {
            var group = self.chart.svg.group(),
                list = (_.typeCheck("array", self.map.path)) ? loadArray(self.map.path) : loadPath(self.map.path);

            for (var i = 0, len = list.length; i < len; i++) {
                group.append(list[i]);
                makeIndex(list[i]);
            }

            return group;
        }

        this.scale = function(i) {
            var path = null,
                x = null,
                y = null;

            if(_.typeCheck("integer", i)) {
                path = pathGroup.children[i];
            } else {
                path = pathIndex[i];
            }

            if(_.typeCheck("object", path)) {
                var pos = path.attr("position");

                if(_.typeCheck("string", pos) && pos.indexOf(",") != -1) {
                    var arr = pos.split(",");

                    x = parseFloat(arr[0]);
                    y = parseFloat(arr[1]);
                }
            }

            return {
                x: x,
                y: y,
                element: path
            }
        }

        this.scale.group = function(callback) {
            if(!_.typeCheck("function", callback)) return pathGroup;

            var self = this;
            pathGroup.each(function() {
                callback.apply(self, arguments);
            });
        }

        this.scale.data = function(callback) {
            if(!_.typeCheck("function", callback)) return pathData;

            var self = this;
            for(var i = 0, len = pathData.length; i < len; i++) {
                callback.apply(self, [ i, pathData[i] ]);
            }
        }

        this.scale.scale = function(scale) {
            if(!scale || scale < 0) return pathScale;

            pathScale = scale;
            pathGroup.scale(pathScale);

            return pathScale;
        }

        this.scale.view = function(x, y) {
            var xy = {
                x: pathX,
                y: pathY
            };

            if(!_.typeCheck("number", x) || !_.typeCheck("number", y)) return xy;

            pathX = x;
            pathY = y;
            pathGroup.translate(-pathX, -pathY);

            return {
                x: pathX,
                y: pathY
            }
        }

        /**
         * @method drawGrid
         * draw base grid structure
         * @protected
         * @param {chart.builder} chart
         * @param {String} orient
         * @param {String} cls
         * @param {Map} map
         */
        this.draw = function() {
            var root = this.chart.svg.group();

            pathScale = this.map.scale;
            pathX = this.map.viewX;
            pathY = this.map.viewY;
            pathGroup = makePathGroup();
            root.append(pathGroup);

            if(this.map.scale != 1) {
                this.scale.scale(pathScale);
            }

            if(this.map.viewX != 0 || this.map.viewY != 0) {
                this.scale.view(pathX, pathY);
            }

            if(this.map.hide) {
                root.attr({ visibility: "hidden" });
            }

            return {
                root: root,
                scale: this.scale
            };
        }

        /**
         * @method drawAfter
         *
         *
         *
         * @param {Object} obj
         * @protected
         */
        this.drawAfter = function(obj) {
            obj.root.attr({ "clip-path": "url(#" + this.axis.get("clipRectId") + ")" });
        }
    }

    CoreMap.setup = function() {
        /** @property {chart.builder} chart */
        /** @property {chart.axis} axis */
        /** @property {Object} map */

        return {
            scale: 1,
            viewX: 0,
            viewY: 0,

            /** @cfg {Boolean} [hide=false] Determines whether to display an applicable grid.  */
            hide: false,
            /** @cfg {String} [map=''] Set a map file's name */
            path: "",
            /** @cfg {Number} [width=-1] Set map's width */
            width: -1,
            /** @cfg {Number} [height=-1] Set map's height */
            height: -1
        };
    }

    return CoreMap;
}, "chart.draw"); 