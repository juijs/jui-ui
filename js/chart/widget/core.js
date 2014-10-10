jui.define("chart.widget.core", [ "util.base" ], function(_) {
	var CoreWidget = function() {

        this.balloonPoints = function(type, w, h, anchor) {
            var d = [];

            if(type == "top") {
                d.push([ 0, 0 ].join(","));
                d.push([ w, 0 ].join(","));
                d.push([ w, h ].join(","));
                d.push([ (w / 2) + (anchor / 2), h ].join(","));
                d.push([ (w / 2), h + anchor ].join(","));
                d.push([ (w / 2) - (anchor / 2), h ].join(","))
                d.push([ 0, h ].join(","));
            } else if(type == "bottom") {
                d.push([ 0, anchor ].join(","));
                d.push([ (w / 2) - (anchor / 2), anchor ].join(","));
                d.push([ (w / 2), 0 ].join(","));
                d.push([ (w / 2) + (anchor / 2), anchor ].join(","));
                d.push([ w, anchor ].join(","));
                d.push([ w, anchor + h ].join(","))
                d.push([ 0, anchor + h ].join(","));
            } else if(type == "left") {
                d.push([ 0, 0 ].join(","));
                d.push([ w, 0 ].join(","));
                d.push([ w, (h / 2) - (anchor / 2) ].join(","));
                d.push([ w + anchor, (h / 2) ].join(","));
                d.push([ w, (h / 2) + (anchor / 2) ].join(","));
                d.push([ w, h ].join(","));
                d.push([ 0, h ].join(","));
            } else if(type == "right") {
                d.push([ 0, 0 ].join(","));
                d.push([ w, 0 ].join(","));
                d.push([ w, h ].join(","));
                d.push([ 0, h ].join(","));
                d.push([ 0, (h / 2) + (anchor / 2) ].join(","));
                d.push([ 0 - anchor, (h / 2) ].join(","));
                d.push([ 0, (h / 2) - (anchor / 2) ].join(","));
            }

            return d.join(" ");
        }
	}

	return CoreWidget;
}, "chart.draw"); 