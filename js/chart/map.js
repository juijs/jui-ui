jui.define("chart.map", [ "jquery", "util.base", "util.math", "util.svg" ], function($, _, math, SVG) {
    /**
     * @class chart.grid.core
     * @extends chart.draw
     * @abstract
     */
    var Map = function() {
        var self = this;
        var pathData = {},
            pathGroup = null,
            pathIndex = {},
            pathScale = 1,
            pathX = 0,
            pathY = 0;

        function loadArray(data) {
            var children = [];

            for(var i = 0, len = data.length; i < len; i++) {
                if(_.typeCheck("object", data[i])) {
                    var style = {};

                    if(_.typeCheck("string", data[i].style)) {
                        style = getStyleObj(data[i].style);
                        delete data[i].style;
                    }

                    var elem = SVG.createObject({
                        type: (data[i].d != null) ? "path" : "polygon",
                        attr: data[i]
                    });

                    // Set styles
                    elem.attr(_.extend(style, {
                        fill: self.chart.theme("mapPathBackgroundColor"),
                        "fill-opacity": self.chart.theme("mapPathBackgroundOpacity"),
                        stroke: self.chart.theme("mapPathBorderColor"),
                        "stroke-width": self.chart.theme("mapPathBorderWidth"),
                        "stroke-opacity": self.chart.theme("mapPathBorderOpacity")
                    }));

                    children.push({
                        path: elem,
                        data: data[i]
                    });
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

        function getPathList(root) {
            if(!_.typeCheck("string", root.id)) return;

            var pathData = [];

            $(root).children().each(function(i) {
                var name = this.nodeName.toLowerCase();

                if(name == "g") {
                    pathData = pathData.concat(getPathList(this));
                } else if(name == "path" || name == "polygon") {
                    var obj = { group: root.id };

                    $.each(this.attributes, function() {
                        if(this.specified && isLoadAttribute(this.name)) {
                            obj[this.name] = this.value;
                        }
                    });

                    if(_.typeCheck("string", obj.id)) {
                        _.extend(obj, getDataById(obj.id));
                    }

                    pathData.push(obj);
                }
            });

            return pathData;
        }

        function loadPath(uri) {
            // 해당 URI의 데이터가 존재할 경우
            if(_.typeCheck("array", pathData[uri])) {
                return loadArray(pathData[uri]);
            }

            // 해당 URI의 데이터가 없을 경우
            pathData[uri] = [];

            $.ajax({
                url: uri,
                async: false,
                success: function(xml) {
                    var $path = $(xml).find("svg").children(),
                        $style = $(xml).find("style");

                    $path.each(function() {
                        var name = this.nodeName.toLowerCase();

                        if(name == "g") {
                            pathData[uri] = pathData[uri].concat(getPathList(this));
                        } else if(name == "path" || name == "polygon") {
                            var obj = {};

                            $.each(this.attributes, function() {
                                if(this.specified && isLoadAttribute(this.name)) {
                                    obj[this.name] = this.value;
                                }
                            });

                            if(_.typeCheck("string", obj.id)) {
                                _.extend(obj, getDataById(obj.id));
                            }

                            pathData[uri].push(obj);
                        }
                    });

                    $style.each(function () {
                        self.chart.svg.root.element.appendChild(this);
                    });
                }
            });

            return loadArray(pathData[uri]);
        }

        function isLoadAttribute(name) {
            return (
                name == "group" || name == "id" || name == "title" || name == "x" || name == "y" ||
                name == "d" || name == "points" || name == "class" || name == "style"
            );
        }

        function getDataById(id) {
            var list = self.axis.data;

            for(var i = 0; i < list.length; i++) {
                var dataId = self.axis.getValue(list[i], "id", null);

                if(dataId == id) {
                    return list[i];
                }
            }

            return null;
        }

        function makePathGroup() {
            var group = self.chart.svg.group(),
                list = loadPath(self.map.path);

            for(var i = 0, len = list.length; i < len; i++) {
                var path = list[i].path,
                    data = list[i].data;

                addEvent(path, list[i]);
                group.append(path);

                if(_.typeCheck("string", data.id)) {
                    pathIndex[data.id] = list[i];
                }
            }

            return group;
        }

        function getScaleXY() {
            // 현재 스케일에 따른 계산이 필요함
            var w = self.map.width,
                h = self.map.height,
                px = ((w * pathScale) - w) / 2,
                py = ((h * pathScale) - h) / 2;

            return {
                x: px + pathX,
                y: py + pathY
            }
        }

        function addEvent(elem, obj) {
            var chart = self.chart;

            elem.on("click", function(e) {
                setMouseEvent(e);
                chart.emit("map.click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(e);
                chart.emit("map.dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(e);
                chart.emit("map.rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(e);
                chart.emit("map.mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(e);
                chart.emit("map.mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(e);
                chart.emit("map.mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(e);
                chart.emit("map.mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(e);
                chart.emit("map.mouseup", [ obj, e ]);
            });

            function setMouseEvent(e) {
                var pos = $(chart.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - chart.padding("left");
                e.chartY = offsetY - chart.padding("top");
            }
        }

        this.scale = function(id) {
            if(!_.typeCheck("string", id)) return;

            var x = null,
                y = null,
                path = null,
                data = null,
                pxy = getScaleXY();

            if(_.typeCheck("object", pathIndex[id])) {
                path = pathIndex[id].path;
                data = pathIndex[id].data;

                if(data.x != null) {
                    var dx = self.axis.getValue(data, "dx", 0),
                        cx = parseFloat(data.x) + dx;
                    x = (cx * pathScale) - pxy.x;
                }

                if(data.y != null) {
                    var dy = self.axis.getValue(data, "dy", 0),
                        cy = parseFloat(data.y) + dy;
                    y = (cy * pathScale) - pxy.y;
                }
            }

            return {
                x: x,
                y: y,
                path: path,
                data: data
            }
        }

        this.scale.each = function(callback) {
            var self = this;

            for(var id in pathIndex) {
                callback.apply(self, [ id, pathIndex[id] ]);
            }
        }

        this.scale.size = function() {
            return {
                width: self.map.width,
                height: self.map.height
            }
        }

        this.scale.scale = function(scale) {
            if(!scale || scale < 0) return pathScale;

            pathScale = scale;
            pathGroup.scale(pathScale);
            this.view(pathX, pathY);

            return pathScale;
        }

        this.scale.view = function(x, y) {
            var xy = { x: pathX, y: pathY };

            if(!_.typeCheck("number", x) || !_.typeCheck("number", y))
                return xy;

            pathX = x;
            pathY = y;

            var pxy = getScaleXY();
            pathGroup.translate(-pxy.x, -pxy.y);

            return {
                x: pathX,
                y: pathY
            }
        }

        this.draw = function() {
            var root = this.chart.svg.group();

            pathScale = this.map.scale;
            pathX = this.map.viewX;
            pathY = this.map.viewY;
            pathGroup = makePathGroup();

            // pathGroup 루트에 추가
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

        this.drawAfter = function(obj) {
            obj.root.attr({ "clip-path": "url(#" + this.axis.get("clipRectId") + ")" });
        }
    }

    Map.setup = function() {
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

    /**
     * @event map_click
     * Event that occurs when clicking on the map area. (real name ``` map.click ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */
    /**
     * @event map_dblclick
     * Event that occurs when double clicking on the map area. (real name ``` map.dblclick ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */
    /**
     * @event map_rclick
     * Event that occurs when right clicking on the map area. (real name ``` map.rclick ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */
    /**
     * @event map_mouseover
     * Event that occurs when placing the mouse over the map area. (real name ``` map.mouseover ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */
    /**
     * @event map_mouseout
     * Event that occurs when moving the mouse out of the map area. (real name ``` map.mouseout ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */
    /**
     * @event map_mousemove
     * Event that occurs when moving the mouse over the map area. (real name ``` map.mousemove ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */
    /**
     * @event map_mousedown
     * Event that occurs when left clicking on the map area. (real name ``` map.mousedown ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */
    /**
     * @event map_mouseup
     * Event that occurs after left clicking on the map area. (real name ``` map.mouseup ```)
     * @param {jQueryEvent} e The event object.
     * @param {Number} index Axis index.
     */

    return Map;
}, "chart.draw"); 