jui.define("chart.brush.map.core", [ "jquery", "util.base" ], function($, _) {
    /**
     * @class chart.brush.map.core
     *
     * implements core method for brush
     *
     * @abstract
     * @extends chart.brush.core
     * @requires jquery
     * @requires util.base
     */
	var MapCoreBrush = function() {

        /**
         * @method addEvent
         * 브러쉬 엘리먼트에 대한 공통 이벤트 정의
         *
         * @param {Element} element
         * @param {Integer} dataIndex
         * @param {Integer} targetIndex
         */
        this.addEvent = function(elem, obj) {
            var chart = this.chart;

            elem.on("click", function(e) {
                setMouseEvent(e);
                chart.emit("click", [ obj, e ]);
            });

            elem.on("dblclick", function(e) {
                setMouseEvent(e);
                chart.emit("dblclick", [ obj, e ]);
            });

            elem.on("contextmenu", function(e) {
                setMouseEvent(e);
                chart.emit("rclick", [ obj, e ]);
                e.preventDefault();
            });

            elem.on("mouseover", function(e) {
                setMouseEvent(e);
                chart.emit("mouseover", [ obj, e ]);
            });

            elem.on("mouseout", function(e) {
                setMouseEvent(e);
                chart.emit("mouseout", [ obj, e ]);
            });

            elem.on("mousemove", function(e) {
                setMouseEvent(e);
                chart.emit("mousemove", [ obj, e ]);
            });

            elem.on("mousedown", function(e) {
                setMouseEvent(e);
                chart.emit("mousedown", [ obj, e ]);
            });

            elem.on("mouseup", function(e) {
                setMouseEvent(e);
                chart.emit("mouseup", [ obj, e ]);
            });

            function setMouseEvent(e) {
                var pos = $(chart.root).offset(),
                    offsetX = e.pageX - pos.left,
                    offsetY = e.pageY - pos.top;

                e.bgX = offsetX;
                e.bgY = offsetY;
                e.chartX = offsetX - chart.padding("left");
                e.chartY = offsetY - chart.padding("top");
            }
        }
	}

	return MapCoreBrush;
}, "chart.brush.core");