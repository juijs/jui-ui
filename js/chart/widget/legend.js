jui.define("chart.widget.legend", ["util.base" ], function( _) {
    
        /**
         * legend 그리기 
         * 
         * {
         *  top : true,         // chart 에서 title 위치 , 기본값 true
         *  bottom : false,     // chart 에서 title 위치 , 기본값 false, 
         *  left : false,       // chart 에서 title 위치 , 기본값 false, 
         *  right : false,      // chart 에서 title 위치 , 기본값 false,
         * 
         *  align : 'middle',   // start, end, middle,  기본값은 middle 
         *  dx : 0,             // 차트가 그려진 위치에서 dx 만금 x 좌표 이동 
         *  dy : 0              // 차트가 그려진 위치에서 dy 만금 y 좌표 이동 
         * } 
         * 
         * brush 객체에 있는 getLegendIcon() 을 통해서 영역에 맞게 legend 를 그림 
         * 
         */
    
    var LegendWidget = function(widget) {
        
        var legend, align, isTop, isBottom, isLeft, isRight;

        this.drawBefore = function(chart) {
            legend = widget;

            legend.brush = legend.brush || [0];         
            align = legend.align || "middle";
            isTop = legend.top || false;
            isBottom = legend.bottom || false;
            isLeft = legend.left || false;
            isRight = legend.right || false;

            if (!(isTop || isBottom || isLeft || isRight)) {
                isBottom = true; 
            }      

        }

        this.draw = function(chart) {
            if (!legend) return;

            
            var group = chart.svg.group({ "class" : 'widget legend'});
            
            var x = 0;
            var y = 0; 

            var total_width = 0;
            var total_height = 0;
            
            var max_width = 0;
            var max_height = 0; 
            
            for(var i = 0; i < legend.brush.length; i++) {
                var index = legend.brush[i];
                var brush = chart.brush(index);
                var arr = brush.obj.getLegendIcon(chart, brush);
            

                for(var k = 0; k < arr.length; k++) {
                    group.append(arr[k].icon);
                    
                    arr[k].icon.translate(x, y);
                    if (isBottom || isTop) {                        
                        x += arr[k].width;
                        total_width += arr[k].width;
                        
                        if (max_height < arr[k].height) {
                            max_height = arr[k].height;
                        }
                    } else if (isLeft || isRight) {
                        y += arr[k].height;
                        total_height += arr[k].height;
                        
                        if (max_width < arr[k].width) {
                            max_width = arr[k].width;
                        }
                    }
                }                   

            }
            
            // legend 위치  선정
            if (isBottom || isTop) {
                var y = (isBottom) ? chart.y2() + chart.padding('bottom') - max_height : chart.y()-chart.padding('top');
                
                if (align == 'start') {
                    x = chart.x();
                } else if (align == 'middle') {
                    x = chart.x() + (chart.width()/2- total_width/2);
                } else if (align == 'end') {
                    x = chart.x2() - total_width;
                }
            } else if (isLeft || isRight) {
                var x = (isLeft) ? chart.x() - chart.padding('left') : chart.x2() + chart.padding('right') - max_width;
                
                if (align == 'start') {
                    y = chart.y();
                } else if (align == 'middle') {
                    y = chart.y() + (chart.height()/2 - total_height/2);
                } else if (align == 'end') {
                    y = chart.y2() - total_height;
                }
            } 
            
            group.translate(x, y);
            
        }
    }

    return LegendWidget;
}, "chart.draw");