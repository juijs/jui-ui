jui.define("chart.widget.legend", [ "util.base" ], function(_) {

    var LegendWidget = function(chart, axis, widget) {
        var columns = [];

        function setLegendStatus(brush) {
            if(!widget.filter) return;

            if(!columns[brush.index]) {
                columns[brush.index] = {};
            }

            for(var i = 0; i < brush.target.length; i++) {
                columns[brush.index][brush.target[i]] = true;
            }
        }

        function changeTargetOption(brushList) {
            var target = [],
                index = brushList[0].index;

            for(var key in columns[index]) {
                if(columns[index][key]) {
                    target.push(key);
                }
            }

            for(var i = 0; i < brushList.length; i++) {
                chart.updateBrush(brushList[i].index, { target: target });
            }

            // 차트 렌더링이 활성화되지 않았을 경우
            if(!chart.isRender()) {
                chart.render();
            }

            chart.emit("legend.filter", [ target ]);
        }

        /**
         * brush 에서 생성되는 legend 아이콘 리턴 
         * 
         * @param {object} chart
         * @param {object} brush
         */
		this.getLegendIcon = function(brush) {
            var self = this,
                arr = [],
                data = brush.target,
                count = data.length;
			
			for(var i = 0; i < count; i++) {
                var target = brush.target[i],
                    text = chart.get("series", target).text || target;

				var rect = chart.svg.getTextRect(text),
                    width = Math.min(rect.width, rect.height),
                    height = width;
								 
				var group = chart.svg.group({
					"class" : "legend icon"
				});
				
				group.append(chart.svg.rect({
					x: 0, 
					y : 0, 
					width: width, 
					height : height,
					fill : chart.color(i, brush)
				}));
				
 				group.append(chart.text({
					x : width + 4,
					y : 11,
                    "font-family" : chart.theme("fontFamily"),
                    "font-size" : chart.theme("legendFontSize"),
                    "fill" : chart.theme("legendFontColor"),
					"text-anchor" : "start"
				}, text));

				arr.push({
					icon : group,
					width : width + 4 + rect.width + 10,
					height : height + 4
				});

                if(widget.filter) {
                    (function(key, element) {
                        element.attr({
                            cursor: "pointer"
                        });

                        element.on("click", function(e) {
                            if(columns[brush.index][key]) {
                                element.attr({ opacity: 0.7 });
                                columns[brush.index][key] = false;
                            } else {
                                element.attr({ opacity: 1 });
                                columns[brush.index][key] = true;
                            }

                            changeTargetOption((widget.brushSync) ? self.listBrush() : [ brush ]);
                        });
                    })(target, group);
                }
			}
			
			return arr;
		}        
        
        this.draw = function() {
            var group = chart.svg.group({
                "class" : "widget legend"
            });
            
            var x = 0, y = 0,
                total_width = 0, total_height = 0,
                max_width = 0, max_height = 0;

            this.eachBrush(function(index, brush) {
                // brushSync가 true일 경우, 한번만 실행함
                if(widget.brushSync && index != 0) return;

                var arr = this.getLegendIcon(brush);

                for(var k = 0; k < arr.length; k++) {
                    group.append(arr[k].icon);
                    arr[k].icon.translate(x, y);

                    if (widget.orient == "bottom" || widget.orient == "top") {
                        x += arr[k].width;
                        total_width += arr[k].width;

                        if (max_height < arr[k].height) {
                            max_height = arr[k].height;
                        }
                    } else {
                        y += arr[k].height;
                        total_height += arr[k].height;

                        if (max_width < arr[k].width) {
                            max_width = arr[k].width;
                        }
                    }
                }

                setLegendStatus(brush);
            });
            
            // legend 위치  선정
            if (widget.orient == "bottom" || widget.orient == "top") {
                var y = (widget.orient == "bottom") ? chart.area('y2') + chart.padding("bottom") - max_height : chart.area('y') - chart.padding("top");
                
                if (widget.align == "start") {
                    x = chart.area('x');
                } else if (widget.align == "center") {
                    x = chart.area('x') + (chart.area('width') / 2- total_width / 2);
                } else if (widget.align == "end") {
                    x = chart.area('x2') - total_width;
                }
            } else {
                var x = (widget.orient == "left") ? chart.area('x') - chart.padding("left") : chart.area('x2') + chart.padding("right") - max_width;
                
                if (widget.align == "start") {
                    y = chart.area('y');
                } else if (widget.align == "center") {
                    y = chart.area('y') + (chart.area('height') / 2 - total_height / 2);
                } else if (widget.align == "end") {
                    y = chart.area('y2') - total_height;
                }
            } 
            
            group.translate(Math.floor(x), Math.floor(y));

            return group;
        }
    }

    LegendWidget.setup = function() {
        return {
            orient: "bottom",
            align: "center", // or start, end
            filter: false,
            brushSync: false
        };
    }

    return LegendWidget;
}, "chart.widget.core");