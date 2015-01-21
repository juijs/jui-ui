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