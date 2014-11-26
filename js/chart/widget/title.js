jui.define("chart.widget.title", [ "util.base", "util.math" ], function(_, math) {

    var TitleWidget = function(chart, widget) {
        var x = 0, y = 0, anchor = "middle";

        this.drawBefore = function() {
            if (widget.position == "bottom") {
                y = chart.y2() + chart.padding("bottom") - 20;
            } else if (widget.position == "top") {
                y = 20;
            } else {
                y = chart.y() + chart.height() / 2
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

            var obj = chart.svg.getTextRect(widget.text);

            var half_text_width = obj.width/2;
            var half_text_height = obj.height/2;

            var text =  chart.text({
                x : x + widget.dx,
                y : y + widget.dy,
                "text-anchor" : anchor,
                "font-family" : chart.theme("fontFamily"),
                "font-size" : chart.theme("titleFontSize"),
                "fill" : chart.theme("titleFontColor")
            }, widget.text);

            if (widget.position == "center") {
                if (widget.align == 'start') {
                    text.rotate(-90, x + widget.dx + half_text_width, y + widget.dy + half_text_height)
                } else if (widget.align == 'end') {
                    text.rotate(90, x + widget.dx - half_text_width, y + widget.dy + half_text_height)
                }

            }

            return text;
        }

        this.drawSetup = function() {
            return $.extend(this.parent.drawSetup(), {
                position: "top", // or bottom
                align: "center", // or start, end
                text: "",
                dx: 0,
                dy: 0
            });
        }
    }

    return TitleWidget;
}, "chart.widget.core");