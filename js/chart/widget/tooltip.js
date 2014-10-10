jui.define("chart.widget.tooltip", [ "jquery" ], function($) {
    var TooltipWidget = function(widget) {
        var g, text, rect;
        var padding = 7;

        this.drawBefore = function(chart) {
            g = chart.svg.group({
                visibility: "hidden"
            }, function() {
                rect = chart.svg.polygon({
                    fill: chart.theme("tooltipBackgroundColor"),
                    "fill-opacity": chart.theme("tooltipOpacity"),
                    stroke: chart.theme("tooltipBorderColor"),
                    "stroke-width": 1
                });

                text = chart.svg.text({
                    "font-family": chart.theme("fontFamily"),
                    "font-size": chart.theme("tooltipFontSize"),
                    "fill": chart.theme("tooltipFontColor"),
                    "text-anchor": "middle",
                    y: 14
                });
            });
        }

        this.draw = function(chart) {
            var self = this,
                isActive = false,
                w, h, a;

            chart.on("mouseover", function(obj, e) {
                if(($.inArray(obj.key, widget.brush) == -1 && widget.brush != obj.key)
                    || !obj.target) return;

                if(isActive) return;

                // 툴팁 텍스트 출력
                var t = chart.series(obj.target);
                text.html(((t.text) ? t.text : obj.target) + ": " + obj.data[obj.target]);

                var bbox = text.element.getBBox();
                w = bbox.width + (padding * 2),
                h = bbox.height + padding;
                a = w / 10;

                text.attr({ x: w / 2 });
                rect.attr({ points: self.balloonPoints("top", w, h, a) });
                g.attr({ visibility: "visible" });

                isActive = true;
            });

            chart.on("mousemove", function(obj, e) {
                if(!isActive) return;

                var x = e.offsetX - (w / 2),
                    y = e.offsetY - h - a - (padding / 2);

                g.translate(x, y);
            });

            chart.on("mouseout", function(obj, e) {
                if(!isActive) return;

                g.attr({ visibility: "hidden" });
                isActive = false;
            });

            return g;
        }
    }

    return TooltipWidget;
}, "chart.widget.core");