jui.defineUI("chart.test", [
    "chart.grid.basic",
    "chart.brush.line",
    "chart.brush.point",
    "chart.brush.bar"
], function(BasicGrid, LineBrush, PointBrush, BarBrush) {

    var UI = function() {
        var grid = null;
        var brush = {};

        this.renderChart = function() {
            var brushes = this.options.brush;

            grid = new BasicGrid(this);
            brush["point"] = new PointBrush(this, grid);
            brush["line"] = new LineBrush(this, grid);
            brush["bar"] = new BarBrush(this, grid);

            grid.init();

            for(var i = 0; i < brushes.length; i++) {
                brush[brushes[i]].init();
            }
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
                    left: offset.left - (w / 2) + brush["point"].getRadius(),
                    top: offset.top - h + brush["point"].getRadius()
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
                "brush": [ "bar" ],
                "data": []
            }
        }
    }

    return UI;
}, "chart.core");