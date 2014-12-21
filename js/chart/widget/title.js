jui.define("chart.widget.title", [], function() {

    var TitleWidget = function(chart, widget) {
        var x = 0, y = 0, anchor = "middle";

        this.drawBefore = function() {
            if (widget.position == "bottom") {
                y = chart.area('y2') + chart.padding("bottom") - 20;
            } else if (widget.position == "top") {
                y = 20;
            } else {
                y = chart.area('y') + chart.area('height') / 2
            }

            if (widget.align == "center") {
                x = chart.x() + chart.area('width')/2;
                anchor = "middle";
            } else if (widget.align == "start") {
                x = chart.x();
                anchor = "start";
            } else {
                x = chart.area('x2');
                anchor = "end";
            }
        }

        this.draw = function() {
            var obj = chart.svg.getTextRect(widget.text);

            var half_text_width = obj.width / 2,
                half_text_height = obj.height / 2;

            var text =  chart.text({
                x : x + widget.dx,
                y : y + widget.dy,
                "text-anchor" : anchor,
                "font-family" : chart.theme("fontFamily"),
                "font-size" : chart.theme("titleFontSize"),
                "font-weight" : chart.theme("titleFontWeight"),
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
            return this.getOptions({
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