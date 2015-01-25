jui.define("chart.brush.topology.node", [ "util.base", "util.math" ], function(_, math) {
    var EdgeManager = function() {
        var list = [],
            cache = {};

        this.add = function(edge) {
            cache[edge.key()] = edge;
            list.push(edge);
        }

        this.get = function(key) {
            return cache[key];
        }

        this.is = function(key) {
            return (cache[key]) ? true : false;
        }

        this.list = function() {
            return list;
        }

        this.each = function(callback) {
            if(!_.typeCheck("function", callback)) return;

            for(var i = 0; i < list.length; i++) {
                callback.call(this, list[i]);
            }
        }
    }

    var Edge = function(start, end, in_xy, out_xy) {
        var connect = false;

        this.key = function() {
            return start + ":" + end;
        }

        this.reverseKey = function() {
            return end + ":" + start;
        }

        this.connect = function(is) {
            if(arguments.length == 0) {
                return connect;
            }

            connect = is;
        }

        this.get = function(type) {
            if(type == "start") return start;
            else if(type == "end") return end;
            else if(type == "in_xy") return in_xy;
            else if(type == "out_xy") return out_xy;
        }
    }

    var TopologyNode = function(chart, axis, brush) {
        var self = this,
            edges = new EdgeManager(),
            g, r = 20, point = 3;

        function getDistanceXY(x1, y1, x2, y2, dist) {
            var a = x1 - x2,
                b = y1 - y2,
                c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
                dist = (!dist) ? 0 : dist,
                angle = math.angle(x1, y1, x2, y2);

            return {
                x: x1 + Math.cos(angle) * (c + dist),
                y: y1 + Math.sin(angle) * (c + dist),
                angle: angle,
                distance: c
            }
        }

        function getDataIndex(key) {
            var index = null;

            for(var i = 0; i < axis.data.length; i++) {
                if(axis.data[i].key == key) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        function createNodes(index, data) {
            return chart.svg.group({
                index: index
            }, function() {
                chart.svg.circle({
                    r: r,
                    fill: self.color(0),
                    cursor: "pointer"
                });

                chart.text({
                    x: 0,
                    y: 6,
                    fill: "white",
                    "font-weight": "bold",
                    "font-size": "16px",
                    "text-anchor": "middle",
                    cursor: "pointer"
                }, "{jennifer.gear}");

                chart.text({
                    x: 0,
                    y: r + 13,
                    "text-anchor": "middle",
                    "font-weight": "bold",
                    cursor: "pointer"
                }, data.name);
            }).translate(data.x, data.y);
        }

        function createEdges() {
            edges.each(function(edge) {
                var in_xy = edge.get("in_xy"),
                    out_xy = edge.get("out_xy");

                var node = chart.svg.group({}, function() {
                    var line = chart.svg.group();

                    line.append(chart.svg.circle({
                        fill: "#a9a9a9",
                        stroke: "white",
                        "stroke-width": 2,
                        r: point,
                        cx: out_xy.x,
                        cy: out_xy.y
                    }));

                    if(!edge.connect()) {
                        line.append(chart.svg.line({
                            x1: in_xy.x,
                            y1: in_xy.y,
                            x2: out_xy.x,
                            y2: out_xy.y,
                            stroke: self.color(1),
                            "stroke-width": 1
                        }));
                    }

                    if(out_xy.x > in_xy.x) {
                        chart.svg.text({
                            x: out_xy.x - 15,
                            y: out_xy.y + 15,
                            "font-size": "10px",
                            "text-anchor": "end"
                        }, "총 응답시간/건수 : 3,200ms/3 ->")
                            .rotate(math.degree(out_xy.angle), out_xy.x, out_xy.y);
                    } else {
                        chart.svg.text({
                            x: out_xy.x + 5,
                            y: out_xy.y - 10,
                            "font-size": "10px"
                        }, "<- 총 응답시간/건수 : 3,200ms/3")
                            .rotate(math.degree(in_xy.angle), out_xy.x, out_xy.y);
                    }
                });

                g.append(node);
            });
        }

        function setDataEdges(data, index) {
            var targetKey = data.outgoing[index],
                target = self.getData(getDataIndex(targetKey));

            var dist = r + point + 1,
                in_xy = getDistanceXY(target.x, target.y, data.x, data.y, -(dist)),
                out_xy = getDistanceXY(data.x, data.y, target.x, target.y, -(dist)),
                edge = new Edge(data.key, targetKey, in_xy, out_xy);

            if(edges.is(edge.reverseKey())) {
                edge.connect(true);
            }

            edges.add(edge);
        }

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                for(var j = 0; j < data.outgoing.length; j++) {
                    // 엣지 데이터 생성
                    setDataEdges(data, j);
                }
            });

            // 엣지 그리기
            createEdges();

            // 노드 그리기
            this.eachData(function(i, data) {
                g.append(createNodes(i, data));
            });

            return g;
        }
    }

    return TopologyNode;
}, "chart.brush.core");

jui.define("chart.widget.topology.drag", [ "util.base" ], function(_) {

    var TopologyDrag = function(chart, axis, widget) {
        var targetKey, startX, startY;
        var renderWait = false;

        function initDragEvent() {
            chart.on("chart.mousemove", function (e) {
                if(!_.typeCheck("string", targetKey)) return;

                var data = axis.data[getDataIndex(targetKey)];
                data.x = startX + (e.chartX - startX);
                data.y = startY + (e.chartY - startY);

                if(renderWait === false) {
                    setTimeout(function () {
                        chart.render();
                        setBrushEvent();

                        renderWait = false;
                    }, 70);

                    renderWait = true;
                }
            });

            chart.on("chart.mouseup", endDragAction);
            chart.on("bg.mouseup", endDragAction);
            chart.on("bg.mouseout", endDragAction);

            function endDragAction(e) {
                if(!_.typeCheck("string", targetKey)) return;
                targetKey = null;
            }
        }

        function setBrushEvent() {
            var root = chart.svg.root.childrens[0].childrens[2];

            root.each(function(i, node) {
                var index = parseInt(node.attr("index"));

                if(!isNaN(index)) {
                    var data = axis.data[index];

                    (function (key, data) {
                        node.on("mousedown", function (e) {
                            if (_.typeCheck("string", targetKey)) return;

                            targetKey = key;
                            startX = data.x;
                            startY = data.y;

                            // 선택한 노드 맨 마지막으로 이동
                            var target = axis.data.splice(index, 1);
                            axis.data.push(target[0]);
                        });
                    })(data.key, data);
                }
            });
        }

        function getDataIndex(key) {
            var index = null;

            for(var i = 0; i < axis.data.length; i++) {
                if(axis.data[i].key == key) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        this.draw = function() {
            initDragEvent();
            setBrushEvent();

            return chart.svg.group();
        }
    }

    return TopologyDrag;
}, "chart.widget.core");

jui.defineUI("chartx.topology", [ "jquery", "util.base", "chart.builder" ], function($, _, builder) {

    var UI = function() {
        this.init = function() {
            var opts = this.options;

            this.chart = builder(this.selector, {
                axis: {
                    c: {
                        type: "panel"
                    },
                    data: opts.data
                },
                brush: {
                    type: "topology.node"
                },
                widget: {
                    type: "topology.drag"
                },
                padding: opts.padding
            });
        }
    }

    UI.setup = function() {
        return {
            data: [],
            padding: 10
        }
    }

    return UI;
});