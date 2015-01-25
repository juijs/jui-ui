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
            g, r, point = 3;

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
                var color =_.typeCheck("function", brush.nodeColor) ?
                        brush.nodeColor(data) : (brush.nodeColor || self.color(0));
                var text =_.typeCheck("function", brush.nodeText) ? brush.nodeText(data) : "";

                chart.svg.circle({
                    r: r,
                    fill: color,
                    cursor: "pointer"
                });

                chart.text({
                    x: 0,
                    y: 6,
                    fill: chart.theme("topologyNodeFontColor"),
                    "font-size": chart.theme("topologyNodeFontSize"),
                    "font-weight": "bold",
                    "text-anchor": "middle",
                    cursor: "pointer"
                }, text);

                chart.text({
                    x: 0,
                    y: r + 13,
                    fill: chart.theme("topologyNodeTitleColor"),
                    "font-size": chart.theme("topologyNodeTitleSize"),
                    "text-anchor": "middle",
                    cursor: "pointer"
                }, data[brush.name]);
            }).translate(data[brush.x], data[brush.y]);
        }

        function createEdges() {
            edges.each(function(edge) {
                var in_xy = edge.get("in_xy"),
                    out_xy = edge.get("out_xy");

                var node = chart.svg.group({}, function() {
                    var line = chart.svg.group();

                    if(!edge.connect()) {
                        line.append(chart.svg.line({
                            x1: in_xy.x,
                            y1: in_xy.y,
                            x2: out_xy.x,
                            y2: out_xy.y,
                            stroke: chart.theme("topologyEdgeColor"),
                            "stroke-width": 1
                        }));
                    }

                    line.append(chart.svg.circle({
                        fill: chart.theme("topologyEdgeColor"),
                        stroke: chart.theme("backgroundColor"),
                        "stroke-width": 2,
                        r: point,
                        cx: out_xy.x,
                        cy: out_xy.y
                    }));

                    if(out_xy.x > in_xy.x) {
                        chart.svg.text({
                            x: out_xy.x - 15,
                            y: out_xy.y + 15,
                            fill: chart.theme("topologyEdgeTitleColor"),
                            "font-size": "10px",
                            "text-anchor": "end"
                        }, "총 응답시간/건수 : 3,200ms/3 ->")
                            .rotate(math.degree(out_xy.angle), out_xy.x, out_xy.y);
                    } else {
                        chart.svg.text({
                            x: out_xy.x + 5,
                            y: out_xy.y - 10,
                            fill: chart.theme("topologyEdgeTitleColor"),
                            "font-size": "10px"
                        }, "<- 총 응답시간/건수 : 3,200ms/3")
                            .rotate(math.degree(in_xy.angle), out_xy.x, out_xy.y);
                    }
                });

                g.append(node);
            });
        }

        function setDataEdges(data, index) {
            var targetKey = data[brush.outgoing][index],
                target = self.getData(getDataIndex(targetKey));

            var dist = r + point + 1,
                in_xy = getDistanceXY(target.x, target.y, data[brush.x], data[brush.y], -(dist)),
                out_xy = getDistanceXY(data[brush.x], data[brush.y], target.x, target.y, -(dist)),
                edge = new Edge(data[brush.key], targetKey, in_xy, out_xy);

            if(edges.is(edge.reverseKey())) {
                edge.connect(true);
            }

            edges.add(edge);
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            r = chart.theme("topologyNodeRadius");
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                for(var j = 0; j < data[brush.outgoing].length; j++) {
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

    TopologyNode.setup = function() {
        return {
            // options
            edges: [],
            nodeColor: null,
            nodeText: null,

            // key mapping options
            key: "key",
            name: "name",
            x: "x",
            y: "y",
            outgoing: "outgoing"
        }
    }

    return TopologyNode;
}, "chart.brush.core");