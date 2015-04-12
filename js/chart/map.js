jui.define("chart.map", [ "jquery", "util.base", "util.math", "util.svg" ], function($, _, math, SVG) {
    /**
     * @class chart.grid.core
     * Grid Core 객체
     * @extends chart.draw
     * @abstract
     */
    var CoreMap = function() {
        var self = this,
            pathGroup = null,
            pathIndex = {},
            pathScale = 1,
            pathX = 0,
            pathY = 0;

        function setZoomEvent() {
            $(pathGroup.element).on("mousewheel DOMMouseScroll", function(e){
                if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                    if(pathScale < 2) {
                        pathScale += 0.1;
                    }
                } else {
                    if(pathScale > 0.5) {
                        pathScale -= 0.1;
                    }
                }

                self.scale.scale(pathScale);
                return false;
            });
        }

        function setMoveEvent() {
            var startX = null, startY = null;

            self.on("axis.mousedown", function(e) {
                if(startX != null || startY != null) return;

                startX = pathX + e.axisX;
                startY = pathY + e.axisY;
            });

            self.on("axis.mousemove", function(e) {
                if(startX == null || startY == null) return;

                var xy = self.scale.view(startX - e.axisX, startY - e.axisY);
                pathX = xy.x;
                pathY = xy.y;
            });

            self.on("axis.mouseup", endMoveAction);
            self.on("axis.mouseout", endMoveAction);

            function endMoveAction(e) {
                if(startX == null || startY == null) return;

                startX = null;
                startY = null;
            }
        }

        function loadArray(data) {
            if(!_.typeCheck("array", data)) {
                data = [data];
            }

            var children = [];
            for(var i = 0, len = data.length; i < len; i++) {
                if(data[i]) {
                    children.push(SVG.createObject({ type: "path", attr: data[i] }));
                }
            }

            return children;
        }

        function loadPath(mapLink) {
            var children = [];

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

                        children.push(obj);
                    });
                }
            });

            function isLoadAttribute(name) {
                return (name == "id" || name == "title" || name == "position" || name == "d" || name == "class");
            }

            return loadArray(children);
        }

        function makeIndex(item) {
            if(item.attr("id")) {
                pathIndex[item.attr("id")] = item;
            }
        }

        function makePathGroup() {
            // create path element
            var group = self.chart.svg.group(),
                list = _.typeCheck("array", self.map.path) ? loadArray(self.map.path) : loadPath(self.map.path);

            for (var i = 0, len = list.length; i < len; i++) {
                group.append(list[i]);
                makeIndex(list[i]);
            }

            return group;
        }

        this.scale = function(i) {
            var path = null;

            if (typeof i == "number") {
                path = pathGroup.children[i];
            } else {
                path = pathIndex[i];
            }

            var arr = path.attr("position").split(","),
                x = parseFloat(arr[0]) * pathScale,
                y = parseFloat(arr[1]) * pathScale;

            return {
                x: self.axis.area("x") + x,
                y: self.axis.area("y") + y,
                element: path
            }
        }

        this.scale.each = function(callback) {
            if(!_.typeCheck("function", callback)) return;

            var self = this;
            pathGroup.each(function() {
                callback.apply(self, arguments);
            });
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
            pathX = this.map.view.x;
            pathY = this.map.view.y;
            pathGroup = makePathGroup();
            root.append(pathGroup);

            if(this.map.scale != 1) {
                this.scale.scale(pathScale);
            }

            if(this.map.view.x != 0 || this.map.view.y != 0) {
                this.scale.view(pathX, pathY);
            }

            if(this.map.move) {
                setMoveEvent();
            }

            if(this.map.zoom) {
                setZoomEvent();
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
            view: { x: 0, y: 0 },
            move: false,
            zoom: false,

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