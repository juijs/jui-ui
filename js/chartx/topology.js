jui.define("chart.brush.topology.node", [ "util.math" ], function(math) {

    var TopologyNode = function(chart, axis, brush) {
        var self = this,
            g, r = 20, point = 3;

        function getDistanceXY(x1, y1, x2, y2, dist) {
            var a = x1 - x2,
                b = y1 - y2,
                c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
                dist = (!dist) ? 0 : dist,
                angle = math.angle(x1, y1, x2, y2);

            return {
                x: x1 + Math.cos(angle) * (c + dist),
                y: y1 + Math.sin(angle) * (c + dist)
            }
        }

        this.drawBefore = function() {
            g = chart.svg.group();
        }

        this.draw = function() {
            this.eachData(function(i, data) {
                var node = chart.svg.group();

                for(var j = 0; j < data.outgoing.length; j++) {
                    var target = self.getData(data.outgoing[j]),
                        xy = getDistanceXY(data.x, data.y, target.x, target.y, -(r + point));

                    node.append(chart.svg.line({
                        x1: data.x,
                        y1: data.y,
                        x2: target.x,
                        y2: target.y,
                        stroke: self.color(1),
                        "stroke-width": 1
                    }));

                    node.append(chart.svg.circle({
                        fill: "black",
                        r: point,
                        cx: xy.x,
                        cy: xy.y
                    }));
                }

                for(var j = 0; j < data.incoming.length; j++) {
                    var target = self.getData(data.incoming[j]),
                        xy = getDistanceXY(data.x, data.y, target.x, target.y, -(r + point));

                    node.append(chart.svg.circle({
                        fill: "red",
                        r: point,
                        cx: xy.x,
                        cy: xy.y
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
            });

            return g;
        }
    }

    return TopologyNode;
}, "chart.brush.core");

jui.define("chart.widget.topology.drag", [ "util.base" ], function(_) {

    var TopologyDrag = function(chart, axis, widget) {
        var targetIndex, startX, startY;

        function initDragEvent() {
            chart.on("chart.mousemove", function (e) {
                if(!_.typeCheck("integer", targetIndex)) return;

                var data = axis.data[targetIndex];
                data.x = startX + (e.chartX - startX);
                data.y = startY + (e.chartY - startY);

                chart.render();
                setBrushEvent();
            });

            chart.on("chart.mouseup", endDragAction);
            chart.on("bg.mouseup", endDragAction);
            chart.on("bg.mouseout", endDragAction);

            function endDragAction(e) {
                if(!_.typeCheck("integer", targetIndex)) return;
                targetIndex = null;
            }
        }

        function setBrushEvent() {
            var root = chart.svg.root.childrens[0].childrens[2];

            root.each(function(i, node) {
                var data = axis.data[i];
                (function(index, data) {
                    node.on("mousedown", function(e) {
                        if(_.typeCheck("integer", targetIndex)) return;

                        targetIndex = index;
                        startX = data.x;
                        startY = data.y;
                    });
                })(i, data);
            });

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