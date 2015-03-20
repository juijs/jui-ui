jui.define("chart.widget.legend", [ "util.base" ], function(_) {

    /**
     * @class chart.widget.legend
     * implements legend widget
     * @extends chart.widget.core
     * @alias LegendWidget
     * @requires util.base
     *
     */
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
                count = data.length,
                r = chart.theme("legendIconRadius");
			
			for(var i = 0; i < count; i++) {
                var group = chart.svg.group(),
                    target = brush.target[i],
                    text = chart.get("series", target).text || target,
                    color = chart.color(i, brush),
                    rect = chart.svg.getTextRect(text);

                if(widget.icon != null) {
                    var icon = _.typeCheck("function", widget.icon) ? widget.icon(brush.index) : widget.icon;

                    group.append(chart.text({
                        x: 0,
                        y: 11,
                        "font-size": chart.theme("legendFontSize"),
                        "fill": color
                    }, icon));
                } else {
                    group.append(chart.svg.circle({
                        cx : r,
                        cy : r,
                        r : r,
                        fill : color
                    }));
                }

 				group.append(chart.text({
					x : (r * 2) + 2,
					y : 10,
                    "font-size" : chart.theme("legendFontSize"),
                    "fill" : chart.theme("legendFontColor"),
					"text-anchor" : "start"
				}, text));

				arr.push({
					icon : group,
					width : (r * 2) + rect.width + 14,
					height : (r * 2) + 4
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
            var group = chart.svg.group();
            
            var x = 0,
                y = 0,
                total_width = 0,
                total_height = 0,
                max_width = 0,
                max_height = 0,
                brushes = this.getIndexArray(widget.brush);

            for(var i = 0; i < brushes.length; i++) {
                var index = brushes[i];

                // brushSync가 true일 경우, 한번만 실행함
                if(widget.brushSync && index != 0) return;

                var brush = chart.get("brush", brushes[index]),
                    arr = this.getLegendIcon(brush);

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
            }
            
            // legend 위치  선정
            if (widget.orient == "bottom" || widget.orient == "top") {
                var y = (widget.orient == "bottom") ? chart.area("y2") + chart.padding("bottom") - max_height : chart.area("y") - chart.padding("top");
                
                if (widget.align == "start") {
                    x = chart.area("x");
                } else if (widget.align == "center") {
                    x = chart.area("x") + (chart.area("width") / 2- total_width / 2);
                } else if (widget.align == "end") {
                    x = chart.area("x2") - total_width;
                }
            } else {
                var x = (widget.orient == "left") ? chart.area("x") - chart.padding("left") : chart.area("x2") + chart.padding("right") - max_width;
                
                if (widget.align == "start") {
                    y = chart.area("y");
                } else if (widget.align == "center") {
                    y = chart.area("y") + (chart.area("height") / 2 - total_height / 2);
                } else if (widget.align == "end") {
                    y = chart.area("y2") - total_height;
                }
            } 
            
            group.translate(Math.floor(x), Math.floor(y));

            return group;
        }
    }

    LegendWidget.setup = function() {
        return {
            /** @cfg {"bottom"/"top"/"left"/"right" } Sets the location where the label is displayed (top, bottom). */
            orient: "bottom",
            /** @cfg {"start"/"center"/"end" } Aligns the label (center, start, end). */
            align: "center", // or start, end
            /** @cfg {Boolean} [filter=false] Performs filtering so that only label(s) selected by the brush can be shown. */
            filter: false,
            /** @cfg {Function/String} [icon=null]   */
            icon: null,
            /** @cfg {Boolean} [brushSync=false] Applies all brushes equally when using a filter function. */
            brushSync: false,
            /** @cfg {Number} [brush=0] Specifies a brush index for which a widget is used. */
            brush: 0
        };
    }

    return LegendWidget;
}, "chart.widget.core");