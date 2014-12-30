jui.define("chart.widget.core", [ "jquery", "util.base" ], function($, _) {

	var CoreWidget = function() {
        function getBrushIndex(brush) {
            var list = [ 0 ];

            if(_.typeCheck("array", brush)) {
                list = brush;
            } else if(_.typeCheck("integer", brush)) {
                list = [ brush ];
            }

            return list;
        }

        this.balloonPoints = function(type, w, h, anchor) {
            var points = [];

            if(type == "top") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ (w / 2) + (anchor / 2), h ].join(","));
                points.push([ (w / 2), h + anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), h ].join(","))
                points.push([ 0, h ].join(","));
            } else if(type == "bottom") {
                points.push([ 0, anchor ].join(","));
                points.push([ (w / 2) - (anchor / 2), anchor ].join(","));
                points.push([ (w / 2), 0 ].join(","));
                points.push([ (w / 2) + (anchor / 2), anchor ].join(","));
                points.push([ w, anchor ].join(","));
                points.push([ w, anchor + h ].join(","))
                points.push([ 0, anchor + h ].join(","));
            } else if(type == "left") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, (h / 2) - (anchor / 2) ].join(","));
                points.push([ w + anchor, (h / 2) ].join(","));
                points.push([ w, (h / 2) + (anchor / 2) ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
            } else if(type == "right") {
                points.push([ 0, 0 ].join(","));
                points.push([ w, 0 ].join(","));
                points.push([ w, h ].join(","));
                points.push([ 0, h ].join(","));
                points.push([ 0, (h / 2) + (anchor / 2) ].join(","));
                points.push([ 0 - anchor, (h / 2) ].join(","));
                points.push([ 0, (h / 2) - (anchor / 2) ].join(","));
            }

            // Firefox 처리 (시작점과 끝점 연결)
            points.push([ 0, 0 ].join(","));

            return points.join(" ");
        }

        this.eachBrush = function(callback) {
            if(!_.typeCheck("function", callback)) return;
            var list = getBrushIndex(this.widget.brush);

            for(var i = 0; i < list.length; i++) {
                callback.apply(this, [ i, this.chart.get("brush", list[i]) ]);
            }
        }

        this.listBrush = function() {
            var list = getBrushIndex(this.widget.brush),
                result = [];

            for(var i = 0; i < list.length; i++) {
                result[i] = this.chart.get("brush", list[i]);
            }

            return result;
        }

        this.getBrush = function(index) {
            return this.listBrush()[index];
        }

        this.existBrush = function(index) {
            var list = getBrushIndex(this.widget.brush);

            return ($.inArray(index, list) == -1) ? false : true;
        }

        this.isRender = function() {
            return (this.widget.render === true) ? true : false;
        }

        this.on = function(type, callback) {
            return this.chart.on(type, callback, this.isRender());
        }
	}

    CoreWidget.setup = function() {
        return {
            brush: 0,
            render: false,
            index: 0
        }
    }

	return CoreWidget;
}, "chart.draw"); 