jui.define("chart.brush.item.tooltip", [], function() {

	var TooltipBrushItem = function() {
        var self = this,
            tooltip = null;

        function createTooltip(fill, stroke, opacity) {
            return self.chart.svg.group({ "visibility" : "hidden" }, function() {
                self.chart.text({
                    "text-anchor" : "middle",
                    "font-weight" : self.chart.theme("tooltipPointFontWeight"),
                    opacity: opacity
                });

                self.chart.svg.circle({
                    r: self.chart.theme("tooltipPointRadius"),
                    fill: fill,
                    stroke: stroke,
                    opacity: opacity,
                    "stroke-width": self.chart.theme("tooltipPointBorderWidth")
                });
            });
        }

        function showTooltip(orient, x, y, value) {
            var text = tooltip.get(0);
            text.element.textContent = value;

            if(orient == "left") {
                text.attr({ x: -7, y: 4, "text-anchor": "end" });
            } else if(orient == "right") {
                text.attr({ x: 7, y: 4, "text-anchor": "start" });
            } else if(orient == "bottom") {
                text.attr({ y: 16 });
            } else {
                text.attr({ y: -7 });
            }

            tooltip.attr({ visibility: (value != 0) ? "visible" : "hidden" });
            tooltip.translate(x, y);
        }

        this.draw = function() {
            tooltip = createTooltip(this.item.fill, this.item.stroke, this.item.opacity);
            this.group.append(tooltip);

            return {
                control: showTooltip,
                style: function(fill, stroke, opacity) {
                    tooltip.get(0).attr({
                        opacity: opacity
                    });

                    tooltip.get(1).attr({
                        fill: fill,
                        stroke: stroke,
                        opacity: opacity
                    })
                }
            }
        }
	}

	return TooltipBrushItem;
}, "chart.brush.item.core");