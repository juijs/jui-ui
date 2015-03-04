jui.define("chart.widget.title", [], function() {

    /**
     * @class chart.widget.title
     * implements title widget
     * @extends chart.widget.core
     * @alias TitleWidget
     *
     */
    var TitleWidget = function(chart, axis, widget) {
        var x = 0, y = 0, anchor = "middle";

        this.drawBefore = function() {
            if (widget.orient == "bottom") {
                y = chart.area("y2") + chart.padding("bottom") - 20;
            } else if (widget.orient == "top") {
                y = 20;
            } else {
                y = chart.area("y") + chart.area("height") / 2
            }

            if (widget.align == "center") {
                x = chart.area("x") + chart.area("width") / 2;
                anchor = "middle";
            } else if (widget.align == "start") {
                x = chart.area("x");
                anchor = "start";
            } else {
                x = chart.area("x2");
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
                "font-size" : widget.size || chart.theme("titleFontSize"),
                "font-weight" : chart.theme("titleFontWeight"),
                "fill" : chart.theme("titleFontColor")
            }, widget.text);

            if (widget.orient == "center") {
                if (widget.align == "start") {
                    text.rotate(-90, x + widget.dx + half_text_width, y + widget.dy + half_text_height)
                } else if (widget.align == "end") {
                    text.rotate(90, x + widget.dx - half_text_width, y + widget.dy + half_text_height)
                }
            }

            return text;
        }
    }

    TitleWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right" } [orient="top"]  Determines the side on which the tool tip is displayed (top, bottom, left, right). */
            orient: "top", // or bottom
            /** @cfg {"start"/"center"/"end" } [align="center"] Aligns the title message (center, start, end).*/
            align: "center",
            /** @cfg {String} [text=""] Sets the title message. */
            text: "",
            /** @cfg {Number} [dx=0] Moves the x coordinate by a set value from the location where the chart is drawn.  */
            dx: 0,
            /** @cfg {Number} [dy=0] Moves the y coordinate by a set value from the location where the chart is drawn. */
            dy: 0,
            /** @cfg {Number} [size=null] Sets the title message size. */
            size: null
        }
    }

    return TitleWidget;
}, "chart.widget.core");