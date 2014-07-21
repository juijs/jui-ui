jui.defineUI("chart.linepoint", [
    "chart.grid.basic",
    "chart.brush.line",
    "chart.brush.point"
], function(BasicGrid, LineBrush, PointBrush) {

    var UI = function() {
        var grid = null,
            line = null,
            point = null;

        this.renderChart = function() {
            grid = new BasicGrid(this);
            point = new PointBrush(this, grid);
            line = new LineBrush(this, grid);

            grid.draw();
            point.draw();
            line.draw();
        }

        this.setTooltip = function() {
            var self = this,
                func = this.tpl.tooltip;

            this.addEvent($(this.root).find("circle"), "mouseover", function(e) {
                $(self.root).find(".tooltip").remove();

                var $tooltip = $(func({ title: $(this).attr("title") }));
                $(self.root).append($tooltip);

                var offset = $(this).offset(),
                    w = $tooltip.outerWidth(),
                    h = $tooltip.outerHeight();

                $tooltip.css({
                    left: offset.left - (w / 2) + point.getRadius(),
                    top: offset.top - h + point.getRadius()
                });
            });
        }
    }

    UI.setting = function() {
        return {
            options: {
                "type": "svg",
                "width": "100%",
                "height": "100%",
                "padding": 10,
                "barPadding": 10,
                "seriesPadding": 1,
                "maxTicks": 5,
                "title": "",
                "titleY": "",
                "titleX": "",
                "theme": {},
                "titleHeight": 50,
                "titleYWidth": 50,
                "titleXHeight": 50,
                "labels": "",
                "series": {},
                "data": []
            }
        }
    }

    return UI;
}, "chart.core");