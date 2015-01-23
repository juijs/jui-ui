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
    }

    var Edge = function(start, end, xy) {
        var incoming = false;

        this.key = function() {
            return start + ":" + end;
        }

        this.reverseKey = function() {
            return end + ":" + start;
        }

        this.incoming = function(is) {
            if(arguments.length == 0) {
                return incoming;
            }

            incoming = is;
        }

        this.get = function(type) {
            if(type == "start") return start;
            else if(type == "end") return end;
            else if(type == "xy") return xy;
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

        function addIncomingKey(data, key) {
            if(!_.typeCheck("array", data.incoming)) {
                data.incoming = [];
            }

            data.incoming.push(key);
        }

        function createNodes(data) {
            return chart.svg.group({}, function() {
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

        function createEdges(data, index) {
            var targetKey = data.outgoing[index],
                target = self.getData(getDataIndex(targetKey));

            // 아웃고잉 노드에 현재 노드의 키를 넘김
            addIncomingKey(target, targetKey);

            return chart.svg.group({}, function() {
                var o_xy = getDistanceXY(data.x, data.y, target.x, target.y, -(r + point)),
                    i_xy = getDistanceXY(target.x, target.y, data.x, data.y, -(r + point)),
                    edge = new Edge(data.key, targetKey, o_xy);

                // 인커밍 노드가 아웃고잉 노드일 경우, 이미 라인이 그려져있으므로 그리지 않음
                if(!edges.is(edge.reverseKey())) {
                    chart.svg.line({
                        x1: i_xy.x,
                        y1: i_xy.y,
                        x2: o_xy.x,
                        y2: o_xy.y,
                        stroke: self.color(1),
                        "stroke-width": 1
                    });
                } else {
                    edge.incoming(true);
                }

                // 아웃고잉 노드가 없을 경우에만 그림
                if(!edges.is(edge.key())) {
                    chart.svg.circle({
                        fill: "black",
                        r: point,
                        cx: o_xy.x,
                        cy: o_xy.y
                    });
                }

                edges.add(edge);
            });
        }

        function createTextEdges() {

            /*/
            if(edges[targetKey + "_" + data.key]) {
                chart.svg.text({
                    x: i_xy.x - i_xy.distance + 50,
                    y: i_xy.y - 15,
                    "font-size": "12px",
                    "text-anchor": "start"
                }, "<- 총 응답시간/건수 : 3,200ms/3")
                    .rotate(math.degree(i_xy.angle), i_xy.x, i_xy.y);
            } else {
                chart.svg.text({
                    x: o_xy.x - 15,
                    y: o_xy.y + 15,
                    "font-size": "12px",
                    "text-anchor": "end"
                }, "총 응답시간/건수 : 3,200ms/3 ->")
                    .rotate(math.degree(o_xy.angle), o_xy.x, o_xy.y);
            }
            /**/
        }

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var node = chart.svg.group();

                for(var j = 0; j < data.outgoing.length; j++) {
                    // 엣지 생성
                    node.append(createEdges(data, j));
                }

                // 노드 생성
                node.append(createNodes(data));

                g.append(node);
            });

            for(var i = 0; i < edges.list.length; i++) {
                var edge = edges.list[i];
                console.log(edge.key() + " = " + edge.incoming());
            }

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
                var data = axis.data[i];

                (function(key, data) {
                    node.get(node.childrens.length - 1).on("mousedown", function(e) {
                        if(_.typeCheck("string", targetKey)) return;

                        targetKey = key;
                        startX = data.x;
                        startY = data.y;

                        // 선택한 노드 맨 마지막으로 이동
                        var target = axis.data.splice(i, 1);
                        axis.data.push(target[0]);
                    });
                })(data.key, data);
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