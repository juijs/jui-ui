jui.define("chart.widget.topology.ctrl", [ "util.base" ], function(_) {

    var TopologyController = function(chart, axis, widget) {
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
            chart.svg.root.get(0).each(function(i, brush) {
                var cls = brush.attr("class");

                if(cls && cls.indexOf("topology.node") != -1) {
                    brush.each(function(i, node) {
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

    return TopologyController;
}, "chart.widget.core");