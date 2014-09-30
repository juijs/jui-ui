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

    var TitleWidget = function(widget) {

        var title, x = 0, y = 0, anchor = 'middle';

        this.drawBefore = function(chart) {
             
            title = widget;

            title.top = typeof title.top == 'undefined' ? true : title.top;
            title.bottom = typeof title.bottom == 'undefined' ? false : title.bottom;
            title.align = typeof title.align == 'undefined' ? 'center' : title.align;


            if (title.bottom) {
                y = chart.y2() + chart.padding('bottom') - 20;
            } else if (title.top) {
                y = 20; 
            }
            
            if (title.align == 'center') {
                x = chart.x() + chart.width()/2;
                anchor = 'middle';
            } else if (title.align == 'left') {
                x = chart.x();
                anchor = 'start';
                
            } else {
                x = chart.x2();
                anchor = 'end';
            }

        }

        this.draw = function(chart) {
            
            if (title.text == "") {
                return; 
            }

            chart.text({
                x : x + (title.dx || 0),
                y : y + (title.dy || 0),
                'text-anchor' : anchor
            }, title.text).attr(title.attr);
            
        }
    }

    return TitleWidget;
}, "chart.draw");