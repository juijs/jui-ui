jui.define("chart.brush.topology.node", [ "util.math" ], function(math) {

    var TopologyNode = function(chart, axis, brush) {
        var self = this,
            g, r = 20;

        function setDragEvent(node, data) {
            var isDrag = false,
                startX, startY;

            node.on("mousedown", function(e) {
                if(isDrag) return;

                isDrag = true;
                startX = data.x;
                startY = data.y;
            });

            chart.on("chart.mousemove", function(e) {
                if(!isDrag) return;

                var x = data.x + e.chartX - startX,
                    y = data.y + e.chartY - startY;

                // Outgoing 노드 처리
                node.each(function(i, obj) {
                    if(obj.element.nodeName == "g") {
                        obj.translate(x, y);
                    } else if(obj.element.nodeName == "line") {
                        obj.attr({ x1: x, y1: y });
                    }
                });

                // Incoming 노드 처리
                for(var i = 0; i < data.incoming.length; i++) {
                    var pNode = g.get(data.incoming[i]);

                    pNode.each(function(i, obj) {
                        if(obj.element.nodeName == "line") {
                            obj.attr({ x2: x, y2: y });
                        }
                    });
                }
            });

            chart.on("chart.mouseup", endDragAction);
            chart.on("bg.mouseup", endDragAction);
            chart.on("bg.mouseout", endDragAction);

            function endDragAction(e) {
                if(!isDrag) return;

                isDrag = false;
            }
        }

        function getLineCoef(x1, y1, x2, y2) { // 직선의 식 y = ax + b 에서 두점을 주고 a와 b를 구함
            var a = 0.0;

            if(x2 != x1) {
                a = (y2 - y1) / (x2 - x1);
            }

            return {
                a: a,
                b: y1 - (a * x1)
            }
        }

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var node = chart.svg.group();

                for(var j = 0; j < data.outgoing.length; j++) {
                    var target = self.getData(data.outgoing[j]);

                    node.append(chart.svg.line({
                        x1: data.x,
                        y1: data.y,
                        x2: target.x,
                        y2: target.y,
                        stroke: self.color(1),
                        "stroke-width": 1
                    }));
                }

                g.append(node);
            });

            this.eachData(function(i, data) {
                var node = g.get(i);

                var group = chart.svg.group({}, function() {
                    chart.svg.circle({
                        r: r,
                        fill: self.color(0)
                    });

                    chart.text({
                        x: 0,
                        y: r + 13,
                        "text-anchor": "middle",
                        "font-weight": "bold"
                    }, data.name);
                }).translate(data.x, data.y);

                node.append(group);

                for(var j = 0; j < data.outgoing.length; j++) {
                    var group = g.get(data.outgoing[j]),
                        target = self.getData(data.outgoing[j])

                    var a = data.x - target.x,
                        b = data.y - target.y,
                        c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) - r,
                        angle = math.angle(data.x, data.y, target.x, target.y);

                    group.append(chart.svg.circle({
                        fill: "black",
                        r: 5,
                        cx: data.x,
                        cy: data.y
                    }));

                    group.append(chart.svg.circle({
                        fill: "red",
                        r: 5,
                        cx: data.x + Math.cos(angle) * c,
                        cy: data.y + Math.sin(angle) * c
                    }));


                    /*/
                    var val = getLineCoef(data.x, data.y, target.x, target.y);

                    for(var i = 0; i < 100; i++) {
                        group.append(chart.svg.circle({
                            fill: "red",
                            r: 1,
                            cx: data.x + i,
                            cy: (val.a * (data.x + i)) + val.b
                        }));
                    }
                    /**/
                }

                setDragEvent(node, data);
            });

            return g;
        }
    }

    return TopologyNode;
}, "chart.brush.core");

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