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
        var connect = false, element = null;

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

        this.element = function(elem) {
            if(arguments.length == 0) {
                return element;
            }

            element = elem;
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
            g, r, tooltip,
            point = 3, // 엣지 포인트
            textY = 14, padding = 7, anchor = 7; // 엣지 툴팁

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

        function getEdgeData(key) {
            for(var i = 0; i < brush.edgeData.length; i++) {
                if(brush.edgeData[i].key == key) {
                    return brush.edgeData[i];
                }
            }

            return null;
        }

        function getTooltipData(edges) {
            var data = [];

            for(var i = 0; i < edges.length; i++) {
                for(var j = 0; j < brush.edgeData.length; j++) {
                    if(edges[i].key() == brush.edgeData[j].key) {
                        data.push(brush.edgeData[j]);
                    }
                }
            }

            return data;
        }

        function getTooltipTitle(key) {
            var title = [],
                keys = key.split(":");

            self.eachData(function(i, data) {
                if(data.key == keys[0]) {
                   title[0] = data.name;
                }

                if(data.key == keys[1]) {
                    title[1] = data.name;
                }
            });

            if(title.length > 0) return title;
            return key;
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

                var node = chart.svg.group();
                node.append(createEdgeLine(edge, in_xy, out_xy));
                node.append(createEdgeText(edge, in_xy, out_xy));

                g.append(node);
            });
        }

        function createEdgeLine(edge, in_xy, out_xy) {
            var g = chart.svg.group();

            if(!edge.connect()) {
                g.append(chart.svg.line({
                    cursor: "pointer",
                    x1: in_xy.x,
                    y1: in_xy.y,
                    x2: out_xy.x,
                    y2: out_xy.y,
                    stroke: chart.theme("topologyEdgeColor"),
                    "stroke-width": 1
                }));
            }

            g.append(chart.svg.circle({
                fill: chart.theme("topologyEdgeColor"),
                stroke: chart.theme("backgroundColor"),
                "stroke-width": 2,
                r: point,
                cx: out_xy.x,
                cy: out_xy.y
            }));

            g.on("click", function(e) {
                onEdgeActiveHanlder(edge, e);
            });

            edge.element(g);

            return g;
        }

        function createEdgeText(edge, in_xy, out_xy) {
            var text = null;
            var edgeAlign = (out_xy.x > in_xy.x) ? "end" : "start",
                edgeText = _.typeCheck("function", brush.edgeText) ?
                    brush.edgeText(getEdgeData(edge.key()), edgeAlign) : null;

            if(edgeText != null) {
                if (edgeAlign == "end") {
                    text = chart.svg.text({
                        x: out_xy.x - 15,
                        y: out_xy.y + 15,
                        cursor: "pointer",
                        fill: chart.theme("topologyEdgeTitleColor"),
                        "font-size": "10px",
                        "text-anchor": edgeAlign
                    }, edgeText)
                        .rotate(math.degree(out_xy.angle), out_xy.x, out_xy.y);
                } else {
                    text = chart.svg.text({
                        x: out_xy.x + 5,
                        y: out_xy.y - 10,
                        cursor: "pointer",
                        fill: chart.theme("topologyEdgeTitleColor"),
                        "font-size": "10px",
                        "text-anchor": edgeAlign
                    }, edgeText)
                        .rotate(math.degree(in_xy.angle), out_xy.x, out_xy.y);
                }

                text.on("click", function(e) {
                    onEdgeActiveHanlder(edge, e);
                })
            }

            return text;
        }

        function setDataEdges(data, index) {
            var targetKey = data[brush.outgoing][index],
                target = self.getData(getDataIndex(targetKey));

            var dist = r + point + 1,
                in_xy = getDistanceXY(target.x, target.y, data[brush.x], data[brush.y], -(dist)),
                out_xy = getDistanceXY(data[brush.x], data[brush.y], target.x, target.y, -(dist)),
                edge = new Edge(data.key, targetKey, in_xy, out_xy);

            if(edges.is(edge.reverseKey())) {
                edge.connect(true);
            }

            edges.add(edge);
        }

        function showTooltip(edge, edgeData) {
            if(!_.typeCheck("function", brush.tooltipTitle) ||
                !_.typeCheck("function", brush.tooltipText)) return;

            var rect = tooltip.get(0),
                text = tooltip.get(1);

            var in_xy = edge.get("in_xy"),
                out_xy = edge.get("out_xy"),
                align = (out_xy.x > in_xy.x) ? "bottom" : "top",
                w = brush.tooltipWidth,
                h = brush.tooltipHeight * edgeData.length;

            // 텍스트 초기화
            rect.attr({ points: "" });
            text.element.textContent = "";

            for(var i = 0; i < edgeData.length; i++) {
                var title = document.createElementNS("http://www.w3.org/2000/svg", "tspan"),
                    contents = document.createElementNS("http://www.w3.org/2000/svg", "tspan"),
                    y = (textY * i) + (padding * 2) + ((align == "bottom") ? anchor : 0);

                // 여백 주기
                if(i == 1) y += textY + padding;

                text.element.appendChild(title);
                text.element.appendChild(contents);

                title.setAttribute("x", padding);
                title.setAttribute("y", y);
                title.setAttribute("font-weight", "bold");
                title.textContent = brush.tooltipTitle(getTooltipTitle(edgeData[i].key));

                contents.setAttribute("x", padding);
                contents.setAttribute("y", y + textY);
                contents.textContent = brush.tooltipText(edgeData[i]);
            }

            text.attr({ x: w / 2 });
            rect.attr({ points: self.balloonPoints(align, w, h, anchor) });
            tooltip.attr({ visibility: "visible" });

            if(align == "bottom") {
                tooltip.rotate(math.degree(out_xy.angle), out_xy.x, out_xy.y);
                tooltip.translate(out_xy.x - w, out_xy.y + anchor);
            } else {
                tooltip.rotate(math.degree(in_xy.angle), out_xy.x, out_xy.y);
                tooltip.translate(out_xy.x, out_xy.y - anchor - h);
            }
        }

        function onEdgeActiveHanlder(edge, e) {
            var tmpEdges = [];

            edges.each(function(newEdge) {
                var elem = newEdge.element(),
                    circle = (elem.childrens.length == 2) ? elem.get(1) : elem.get(0),
                    line = (elem.childrens.length == 2) ? elem.get(0) : null,
                    color = chart.theme("topologyEdgeColor"),
                    activeColor = chart.theme("topologyActiveEdgeColor");

                if(edge.key() == newEdge.key() || edge.reverseKey() == newEdge.key()) {
                    if(line != null) {
                        line.attr({ stroke: activeColor });
                    }
                    circle.attr({ fill: activeColor });

                    // 툴팁에 보여지는 데이터 설정
                    if(edge.key() == newEdge.key()) {
                        if(edges.is(edge.reverseKey())) {
                            tmpEdges.push(edges.get(edge.reverseKey()));
                        }

                        tmpEdges.push(edge);
                    }
                } else {
                    if(line != null) {
                        line.attr({ stroke: color });
                    }
                    circle.attr({ fill: color });
                }
            });

            var edgeTooltipData = getTooltipData(tmpEdges);

            // 엣지 툴팁 보이기
            showTooltip(edge, edgeTooltipData);

            // 커스텀 이벤트 호출
            chart.emit("topology.edge", [ edgeTooltipData, e ]);
        }

        this.drawBefore = function() {
            g = chart.svg.group();
            r = chart.theme("topologyNodeRadius");

            tooltip = chart.svg.group({
                visibility: "hidden"
            }, function() {
                chart.svg.polygon({
                    fill: chart.theme("topologyTooltipBackgroundColor"),
                    stroke: chart.theme("topologyTooltipBorderColor"),
                    "stroke-width": 1
                });

                chart.text({
                    "font-size": chart.theme("topologyTooltipFontSize"),
                    "fill": chart.theme("topologyTooltipFontColor"),
                    y: textY
                });
            });
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
            // topology options
            nodeColor: null,
            nodeText: null,
            edgeData: [],
            edgeText: null,
            tooltipTitle: null,
            tooltipText: null,
            tooltipWidth: 150,
            tooltipHeight: 40,

            // key mapping options
            name: "name",
            x: "x",
            y: "y",
            outgoing: "outgoing"
        }
    }

    return TopologyNode;
}, "chart.brush.core");