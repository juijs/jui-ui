jui.define("chart.widget.title", [ "util.base" ], function(_) {

    var TitleWidget = function(chart, widget) {
        var x = 0, y = 0, anchor = "middle";

        this.drawBefore = function() {
            if (widget.position == "bottom") {
                y = chart.y2() + chart.padding("bottom") - 20;
            } else if (widget.position == "top") {
                y = 20;
            }

            if (widget.align == "center") {
                x = chart.x() + chart.width()/2;
                anchor = "middle";
            } else if (widget.align == "start") {
                x = chart.x();
                anchor = "start";
            } else {
                x = chart.x2();
                anchor = "end";
            }
        }

        this.draw = function() {
            if (widget.text == "") {
                return; 
            }

            return chart.text({
                x : x + widget.dx,
                y : y + widget.dy,
                "text-anchor" : anchor,
                "font-family" : chart.theme("fontFamily"),
                "font-size" : chart.theme("titleFontSize"),
                "fill" : chart.theme("titleFontColor")
            }, widget.text);
        }

        this.drawSetup = function() {
            return {
                position: "top", // or bottom
                align: "center", // or start, end
                text: "",
                dx: 0,
                dy: 0
            }
        }
    }

    return TitleWidget;
}, "chart.widget.core");