jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    var TooltipWidget = function(widget) {
        var g, text, rect;
        var padding = 7, border = 1;

        this.drawBefore = function(chart) {
            g = chart.svg.group({}, function() {
                rect = chart.svg.rect({
                    fill: chart.theme("tooltipBackgroundColor"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": border
                });

                text = chart.svg.text({
                    "font-family" : chart.theme("fontFamily"),
                    "font-size" : chart.theme("tooltipFontSize"),
                    "font-weight" : "bold",
                    "fill" : chart.theme("tooltipFontColor")
                });
            });
        }

        this.draw = function(chart) {
            var isActive = false;

            chart.bind("mouseover", function(obj, e) {
                if(($.inArray(obj.key, widget.brush) == -1 && widget.brush != obj.key)
                    || !obj.target) return;

                // 툴팁 텍스트 출력
                var t = chart.series(obj.target);
                text.html(((t.text) ? t.text : obj.target) + ": " + obj.data[obj.target]);

                var bbox = text.element.getBBox();
                rect.attr({
                    width: bbox.width + (padding * 2),
                    height: bbox.height + padding,
                    x: -padding,
                    y: -bbox.height
                });

                isActive = true;
            });

            chart.bind("mousemove", function(obj, e) {
                if(!isActive) return;

                var bbox = text.element.getBBox();
                g.translate(e.offsetX - (bbox.width / 2), e.offsetY - bbox.height);
            });

            chart.bind("mouseout", function(obj, e) {
                if(!isActive) return;

                g.translate(-100, -100);
                isActive = false;
            });
        }
    }

    return TooltipWidget;
}, "chart.draw");