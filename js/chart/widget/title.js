jui.define("chart.widget.title", [ "util.base" ], function(_) {

        /**
         * title 그리기 
         * 
         * title 객체 옵션 
         * 
         * {
         *  text : "Title",     // 실제 표시될 title 문자열 
         *  align : "center"    // left, right, center 를 지정 , default center 
         *  top : true,         // chart 에서 title 위치 , 기본값 true
         *  bottom : true       // chart 에서 title 위치 , 기본값 false 
         *  dx : 0,             // 차트가 그려진 위치에서 dx 만금 x 좌표 이동 
         *  dy : 0              // 차트가 그려진 위치에서 dy 만금 y 좌표 이동 
         * }
         * 
         */     

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
            } else if (widget.align == "left") {
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
                align: "center", // or left, right
                text: "",
                dx: 0,
                dy: 0
            }
        }
    }

    return TitleWidget;
}, "chart.widget.core");